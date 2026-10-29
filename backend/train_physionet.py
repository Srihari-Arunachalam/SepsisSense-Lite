"""Train SepsisSense on PhysioNet 2019 (.psv). Patient-wise split, calibration, baselines (qSOFA/NEWS2), lead time.
Usage: python train_physionet.py --data path/training_setA path/training_setB --out .
"""
import argparse, glob, json, os, time
import numpy as np, pandas as pd, lightgbm as lgb, joblib
from sklearn.isotonic import IsotonicRegression
from sklearn.metrics import roc_auc_score, average_precision_score, brier_score_loss
from features import engineer

def load(dirs):
    parts = []
    for d in dirs:
        for f in sorted(glob.glob(os.path.join(d, "*.psv"))):
            x = pd.read_csv(f, sep="|"); x["pid"] = os.path.basename(d) + "/" + os.path.basename(f); parts.append(x)
    if not parts: raise SystemExit("No .psv files found in: " + ", ".join(dirs))
    return pd.concat(parts, ignore_index=True)

def patient_level(pid, y, s, thr):
    starts = np.r_[0, np.flatnonzero(pid[1:] != pid[:-1]) + 1, len(pid)]
    det = n_sep = fa = n_non = 0; leads = []
    for a, b in zip(starts[:-1], starts[1:]):
        yy, ss = y[a:b], s[a:b]; al = np.flatnonzero(ss >= thr)
        if yy.max() == 1:
            n_sep += 1; onset = int(np.argmax(yy == 1)) + 6          # label starts 6h before clinical onset
            if al.size and al[0] <= onset: det += 1; leads.append(onset - al[0])
        else:
            n_non += 1; fa += int(al.size > 0)
    return {"sensitivity": round(det / max(n_sep, 1), 3), "false_alert_rate_nonseptic": round(fa / max(n_non, 1), 3),
            "median_lead_hours": float(np.median(leads)) if leads else None, "septic_patients": n_sep, "nonseptic_patients": n_non}

def main():
    ap = argparse.ArgumentParser(); ap.add_argument("--data", nargs="+", required=True)
    ap.add_argument("--out", default="."); ap.add_argument("--seed", type=int, default=42)
    ap.add_argument("--source-label", default="PhysioNet 2019"); a = ap.parse_args()
    t0 = time.time(); raw = load(a.data); print(f"loaded {len(raw):,} rows, {raw.pid.nunique():,} patients")
    X = engineer(raw); y = raw["SepsisLabel"].to_numpy(); pid = raw["pid"].to_numpy(); feats = list(X.columns)
    print(f"features: {len(feats)} | sepsis-label rate: {y.mean():.3f}")

    rng = np.random.default_rng(a.seed); u = rng.permutation(raw.pid.unique()); n = len(u)
    grp = {p: 0 for p in u[:int(.70*n)]} | {p: 1 for p in u[int(.70*n):int(.85*n)]} | {p: 2 for p in u[int(.85*n):]}
    g = np.array([grp[p] for p in pid]); tr, va, te = (g == 0), (g == 1), (g == 2)   # patient-wise: no leakage

    spw = float(np.sqrt((y[tr] == 0).sum() / max((y[tr] == 1).sum(), 1)))
    clf = lgb.LGBMClassifier(n_estimators=2000, learning_rate=0.03, num_leaves=31, min_child_samples=100, subsample=0.8,
                             subsample_freq=1, colsample_bytree=0.7, reg_lambda=1.0, scale_pos_weight=spw, n_jobs=-1, verbose=-1,
                             random_state=a.seed)
    clf.fit(X[tr], y[tr], eval_set=[(X[va], y[va])], eval_metric="auc",
            callbacks=[lgb.early_stopping(50, verbose=False)])
    iso = IsotonicRegression(out_of_bounds="clip", y_min=0, y_max=1).fit(clf.predict_proba(X[va])[:, 1], y[va])
    cal = lambda m: iso.predict(clf.predict_proba(m)[:, 1])

    # alert thresholds from validation: High = ~15% / Watch = ~35% of NON-septic patients ever flagged
    pv, yv, sv = pid[va], y[va], cal(X[va])
    mx_non = [sv[pv == p].max() for p in np.unique(pv) if yv[pv == p].max() == 0]
    high, watch = float(np.quantile(mx_non, .85)), float(np.quantile(mx_non, .65))
    high = min(max(high, watch + 1e-4), 0.99)

    pt, yt, st = pid[te], y[te], cal(X[te]); Xt = X[te]
    m = {"rows_test": int(te.sum()), "patients_test": int(len(np.unique(pt))),
         "model": {"auroc": round(roc_auc_score(yt, st), 4), "auprc": round(average_precision_score(yt, st), 4),
                   "brier": round(brier_score_loss(yt, st), 4),
                   "at_high": patient_level(pt, yt, st, high), "at_watch": patient_level(pt, yt, st, watch)},
         "baseline_news2_lite": {"auroc": round(roc_auc_score(yt, Xt.news2_lite), 4),
                                 "at_5": patient_level(pt, yt, Xt.news2_lite.to_numpy(), 5),
                                 "at_7": patient_level(pt, yt, Xt.news2_lite.to_numpy(), 7)},
         "baseline_qsofa_lite": {"auroc": round(roc_auc_score(yt, Xt.qsofa_lite), 4),
                                 "at_2": patient_level(pt, yt, Xt.qsofa_lite.to_numpy(), 2)}}
    bundle = {"model": clf, "calibrator": iso, "features": feats, "thresholds": {"watch": watch, "high": high},
              "metrics": m, "version": time.strftime("%Y%m%d-%H%M"), "trained_on": a.source_label,
              "synthetic": "synthetic" in a.source_label.lower(), "best_iteration": int(clf.best_iteration_ or 0)}
    os.makedirs(a.out, exist_ok=True); joblib.dump(bundle, os.path.join(a.out, "sepsis_bundle.pkl"))
    json.dump(m, open(os.path.join(a.out, "metrics.json"), "w"), indent=2)
    print(json.dumps(m, indent=2)); print(f"thresholds watch={watch:.3f} high={high:.3f} | done in {time.time()-t0:.0f}s")
if __name__ == "__main__": main()
