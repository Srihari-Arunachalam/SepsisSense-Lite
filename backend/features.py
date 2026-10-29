"""Shared feature engineering. Used by BOTH training and the API (prevents train/serve mismatch)."""
import warnings
import numpy as np, pandas as pd

VITALS = ["HR", "O2Sat", "Temp", "SBP", "MAP", "DBP", "Resp"]
LABS = ["Lactate", "Creatinine", "Bilirubin_total", "Platelets", "WBC", "BUN", "Glucose",
        "pH", "PaCO2", "FiO2", "AST", "Alkalinephos", "Fibrinogen", "Potassium"]
TREND = ["HR", "Resp", "MAP", "SBP", "O2Sat", "Temp", "Lactate"]
RAW = VITALS + LABS + ["Age"]
ALIASES = {"SpO2": "O2Sat", "Bilirubin": "Bilirubin_total"}

NEWS2_BANDS = {
 "Resp": [(-np.inf, 9, 3), (9, 12, 1), (12, 21, 0), (21, 25, 2), (25, np.inf, 3)],
 "O2Sat": [(-np.inf, 92, 3), (92, 94, 2), (94, 96, 1), (96, np.inf, 0)],
 "SBP": [(-np.inf, 91, 3), (91, 101, 2), (101, 111, 1), (111, 220, 0), (220, np.inf, 3)],
 "HR": [(-np.inf, 41, 3), (41, 51, 1), (51, 91, 0), (91, 111, 1), (111, 131, 2), (131, np.inf, 3)],
 "Temp": [(-np.inf, 35.05, 3), (35.05, 36.05, 1), (36.05, 38.05, 0), (38.05, 39.05, 1), (39.05, np.inf, 2)],
}

def _points(x, bands):
    x = x.to_numpy(dtype=float); out = np.zeros(len(x))
    for lo, hi, p in bands:
        out = np.where((x >= lo) & (x < hi), p, out)
    return out

def prepare(raw):
    df = raw.copy()
    df = df.rename(columns={k: v for k, v in ALIASES.items() if k in df and v not in df})
    for c in RAW:
        df[c] = pd.to_numeric(df[c], errors="coerce") if c in df else np.nan
    return df

def _window_stats(g, c, w=6):
    arr = np.column_stack([g[c].shift(k).to_numpy(dtype=float) for k in range(w)])
    with warnings.catch_warnings():
        warnings.simplefilter("ignore")
        return np.nanmean(arr, 1), np.nanstd(arr, 1), np.nanmin(arr, 1), np.nanmax(arr, 1)

def engineer(raw, pid="pid"):
    """raw: hourly rows (PhysioNet column names; 'SpO2' alias ok). Returns one feature row per input row."""
    df = prepare(raw)
    if pid not in df: df[pid] = 0
    df = df.reset_index(drop=True)
    df[VITALS] = df.groupby(pid, sort=False)[VITALS].ffill(limit=6)      # carry vitals max 6h
    df[LABS] = df.groupby(pid, sort=False)[LABS].ffill(limit=24)         # labs are sparse: carry 24h
    df["MAP"] = df["MAP"].fillna((df["SBP"] + 2 * df["DBP"]) / 3)

    df["shock_index"] = df["HR"] / df["SBP"]
    df["pulse_pressure"] = df["SBP"] - df["DBP"]
    df["qsofa_lite"] = (df["Resp"] >= 22).astype(int) + (df["SBP"] <= 100).astype(int)   # no mentation data
    df["news2_lite"] = sum(_points(df[c], b) for c, b in NEWS2_BANDS.items())            # no ACVPU / O2 therapy
    df["organ_flags"] = ((df["Creatinine"] >= 2).astype(int) + (df["Bilirubin_total"] >= 2).astype(int)
                         + (df["Platelets"] < 100).astype(int) + (df["Lactate"] > 2).astype(int)
                         + (df["MAP"] < 65).astype(int) + (df["O2Sat"] < 92).astype(int))

    g = df.groupby(pid, sort=False)
    new = {}
    for c in TREND:
        mean, std, mn, mx = _window_stats(g, c, 6)
        new[f"{c}_mean6"], new[f"{c}_std6"], new[f"{c}_min6"], new[f"{c}_max6"] = mean, std, mn, mx
        first = g[c].transform("first")
        for w in (6, 12):
            new[f"{c}_d{w}"] = df[c] - g[c].shift(w - 1).fillna(first)     # change vs w-1 hours ago (or since first reading)
    out = pd.concat([df[RAW + ["shock_index", "pulse_pressure", "qsofa_lite", "news2_lite", "organ_flags"]],
                     pd.DataFrame(new, index=df.index)], axis=1)
    return out

NAMES = {"HR": "Heart rate", "O2Sat": "SpO2", "Temp": "Temperature", "SBP": "Systolic BP", "MAP": "MAP",
 "DBP": "Diastolic BP", "Resp": "Respiratory rate", "Lactate": "Lactate", "Creatinine": "Creatinine",
 "Bilirubin_total": "Bilirubin", "Platelets": "Platelets", "WBC": "WBC", "BUN": "BUN", "Glucose": "Glucose",
 "pH": "pH", "PaCO2": "PaCO2", "FiO2": "FiO2", "AST": "AST", "Alkalinephos": "ALP", "Fibrinogen": "Fibrinogen",
 "Potassium": "Potassium", "Age": "Age", "shock_index": "Shock index (HR/SBP)", "pulse_pressure": "Pulse pressure",
 "qsofa_lite": "qSOFA-lite score", "news2_lite": "NEWS2-lite score", "organ_flags": "Organ-dysfunction markers"}
SUFFIX = {"_mean6": " (6h avg)", "_std6": " (6h variability)", "_min6": " (6h min)", "_max6": " (6h max)",
          "_d6": " change over 6h", "_d12": " change over 12h"}

def readable(f):
    for suf, txt in SUFFIX.items():
        if f.endswith(suf):
            return NAMES.get(f[:-len(suf)], f[:-len(suf)]) + txt
    return NAMES.get(f, f)
