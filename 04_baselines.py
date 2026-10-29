"""STEP 4 - Baseline comparison: SepsisSense vs qSOFA-lite / NEWS2-lite / SIRS-lite.
Same test patients, same alert logic (consecutive hours + cooldown), same lead-time definition (common.py).
Usage:
    python 04_baselines.py --tag v2_nobeh_core
    python 04_baselines.py --tag v2_core
Needs (from step 3): work/<tag>_test_preds.parquet, work/metrics_v2*.json, and work/features_v2.parquet.
"LITE" = mentation (GCS/ACVPU) and O2-therapy are not in PhysioNet, so those items score 0.
"""
import json, argparse, os
import numpy as np, pandas as pd
from sklearn.metrics import roc_auc_score
from common import *

ap = argparse.ArgumentParser()
ap.add_argument('--tag', default='v2_nobeh_core')
ap.add_argument('--features', default='features_v2.parquet')
args = ap.parse_args()

NEWS2 = {
 "Resp":  [(-np.inf, 9, 3), (9, 12, 1), (12, 21, 0), (21, 25, 2), (25, np.inf, 3)],
 "O2Sat": [(-np.inf, 92, 3), (92, 94, 2), (94, 96, 1), (96, np.inf, 0)],
 "SBP":   [(-np.inf, 91, 3), (91, 101, 2), (101, 111, 1), (111, 220, 0), (220, np.inf, 3)],
 "HR":    [(-np.inf, 41, 3), (41, 51, 1), (51, 91, 0), (91, 111, 1), (111, 131, 2), (131, np.inf, 3)],
 "Temp":  [(-np.inf, 35.05, 3), (35.05, 36.05, 1), (36.05, 38.05, 0), (38.05, 39.05, 1), (39.05, np.inf, 2)],
}

def points(x, bands):
    x = x.to_numpy(dtype=float); out = np.zeros(len(x))
    for lo, hi, p in bands:
        out = np.where((x >= lo) & (x < hi), p, out)
    return out

def add_scores(d):
    cols = ['HR', 'O2Sat', 'Temp', 'SBP', 'Resp', 'WBC']
    d[cols] = d.groupby('patient', sort=False)[cols].ffill(limit=6)     # fair: bedside values carried 6h
    d['qsofa_lite'] = (d.Resp >= 22).astype(int) + (d.SBP <= 100).astype(int)
    d['news2_lite'] = sum(points(d[c], b) for c, b in NEWS2.items())
    d['sirs_lite'] = ((d.HR > 90).astype(int) + (d.Resp > 20).astype(int)
                      + ((d.Temp > 38) | (d.Temp < 36)).astype(int) + ((d.WBC > 12) | (d.WBC < 4)).astype(int))
    return d

def sim(d, col, thr, consec):
    alert = np.zeros(len(d), bool); sc = d[col].fillna(0).values; z = np.zeros(len(d)); s = 0
    for L in d.groupby('patient', sort=False).size().values:
        alert[s:s+L] = alerts_for_patient(sc[s:s+L], z[s:s+L], z[s:s+L] + 100, z[s:s+L] + 200,
                                          high=thr, consec=consec, cooldown=6, immediate=False)
        s += L
    return alert

def fmt(name, r, auroc=None):
    return {"method": name, "AUROC_row": auroc,
            "septic_alerted_1to12h_%": r["pct_septic_alerted_1to12h_before_onset"],
            "nonseptic_alerted_%": r["pct_nonseptic_patients_with_any_alert"],
            "alerts_per_100_pt_days": r["alerts_per_100_patient_days"],
            "median_lead_h": r["median_lead_time_hours"]}

def baseline_rows(d, target_fa):
    assert d.groupby('patient', sort=False).ngroups == d.patient.nunique(), "rows must be contiguous per patient"
    auc = {c: round(roc_auc_score(d.label, d[c].fillna(0)), 4) for c in ['qsofa_lite', 'news2_lite', 'sirs_lite']}
    rows = []
    for name, col, thr in [("qSOFA-lite >= 2", "qsofa_lite", 2), ("NEWS2-lite >= 5", "news2_lite", 5),
                           ("NEWS2-lite >= 7", "news2_lite", 7), ("SIRS-lite >= 2", "sirs_lite", 2)]:
        rows.append(fmt(name + " [standard, single reading]", alert_report(d, sim(d, col, thr, 1)), auc[col]))
    for name, col in [("qSOFA-lite", "qsofa_lite"), ("NEWS2-lite", "news2_lite"), ("SIRS-lite", "sirs_lite")]:
        best = None                                        # threshold whose false-alert rate is closest to the model's
        for thr in range(1, int(d[col].max()) + 1):
            r = alert_report(d, sim(d, col, thr, 2)); gap = abs(r["pct_nonseptic_patients_with_any_alert"] - target_fa)
            if best is None or gap < best[0]: best = (gap, thr, r)
        rows.append(fmt(f"{name} >= {best[1]} [2 consecutive, matched false-alert rate]", best[2], auc[col]))
    return rows

metrics_file = ("metrics_v2_nobeh.json" if "nobeh" in args.tag else "metrics_v2.json" if args.tag.startswith("v2") else "metrics.json")
M = json.load(open(f"{WORK}/{metrics_file}")) if os.path.exists(f"{WORK}/{metrics_file}") else {}

# ---------- 1) Same-hospital test set ----------
pred = pd.read_parquet(f"{WORK}/{args.tag}_test_preds.parquet")
extra = pd.read_parquet(f"{WORK}/{args.features}", columns=['patient', 'ICULOS', 'HR', 'O2Sat', 'Temp', 'Resp', 'WBC'])
d = add_scores(pred.merge(extra, on=['patient', 'ICULOS'], how='left'))
m_only = alert_report(d, simulate_alerts(d, immediate=False))
m_imm = alert_report(d, simulate_alerts(d, immediate=True))
auc_model = round(roc_auc_score(d.label, d.prob), 4)
t1 = pd.DataFrame([fmt("SepsisSense (score only)", m_only, auc_model),
                   fmt("SepsisSense (+ immediate rules)", m_imm, auc_model)]
                  + baseline_rows(d, m_only["pct_nonseptic_patients_with_any_alert"]))
print(f"\n=== SAME-HOSPITAL TEST ({d.patient.nunique():,} patients) | model tag: {args.tag} ===")
print(t1.to_string(index=False)); t1.to_csv(f"{WORK}/baseline_same_hospital_{args.tag}.csv", index=False)

# ---------- 2) Unseen hospital (train A -> test B) ----------
cols = ['patient', 'ICULOS', 'label', 'hosp', 'HR', 'O2Sat', 'Temp', 'SBP', 'Resp', 'WBC']
f = pd.read_parquet(f"{WORK}/{args.features}", columns=cols)
B = add_scores(f[f.hosp == 'B'].reset_index(drop=True))
cross = M.get('train_A_test_B')
if cross:
    ms = cross['alerts_score_only']
    t2 = pd.DataFrame([fmt("SepsisSense (score only, trained on A)", ms, cross['AUROC']),
                       fmt("SepsisSense (+ immediate rules)", cross['alerts_with_immediate_rules'], cross['AUROC'])]
                      + baseline_rows(B, ms["pct_nonseptic_patients_with_any_alert"]))
    print(f"\n=== UNSEEN HOSPITAL B ({B.patient.nunique():,} patients) ===")
    print(t2.to_string(index=False)); t2.to_csv(f"{WORK}/baseline_cross_hospital_{args.tag}.csv", index=False)
else:
    print(f"\n(no 'train_A_test_B' in {metrics_file}; cross-hospital table skipped)")
print("\nNOTE: *-lite scores exclude mentation / O2 therapy (not in PhysioNet). Compare at matched false-alert rate.")
