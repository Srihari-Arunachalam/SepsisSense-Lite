"""Creates SYNTHETIC files in PhysioNet-2019 .psv format, only to test the pipeline. NOT real data."""
import sys, os, numpy as np, pandas as pd
COLS = ("HR O2Sat Temp SBP MAP DBP Resp EtCO2 BaseExcess HCO3 FiO2 pH PaCO2 SaO2 AST BUN Alkalinephos Calcium Chloride "
        "Creatinine Bilirubin_direct Glucose Lactate Magnesium Phosphate Potassium Bilirubin_total TroponinI Hct Hgb PTT "
        "WBC Fibrinogen Platelets Age Gender Unit1 Unit2 HospAdmTime ICULOS SepsisLabel").split()
def ar(rng, L, sd, phi=0.8):
    e = rng.normal(0, sd, L); x = np.zeros(L)
    for i in range(1, L): x[i] = phi * x[i - 1] + e[i]
    return x
def patient(rng, septic, confound):
    L = int(rng.integers(24, 72)); t = np.arange(L)
    onset = int(rng.integers(14, L)) if septic else None
    if septic: d = np.clip((t - (onset - 10)) / 10.0, 0, 1.5)
    elif confound: d = np.clip((t - int(rng.integers(5, L))) / 10.0, 0, 0.7)
    else: d = np.zeros(L)
    b = rng.normal(0, 1, 6)
    df = pd.DataFrame(np.nan, index=t, columns=COLS)
    df["HR"] = 82 + 6*b[0] + 24*d + ar(rng, L, 5);   df["Resp"] = 17 + b[1] + 6*d + ar(rng, L, 1.5)
    df["SBP"] = 122 + 6*b[2] - 25*d + ar(rng, L, 6); df["DBP"] = 70 + 4*b[3] - 10*d + ar(rng, L, 4)
    df["MAP"] = (df.SBP + 2*df.DBP) / 3;             df["Temp"] = 36.9 + .25*b[4] + .9*d + ar(rng, L, .25)
    df["O2Sat"] = np.minimum(100, 97 + .8*b[5] - 4*d + ar(rng, L, 1))
    for c in ["HR", "Resp", "SBP", "DBP", "MAP", "Temp", "O2Sat"]:
        df.loc[rng.random(L) < 0.12, c] = np.nan
    for h in range(int(rng.integers(0, 6)), L, int(rng.integers(6, 11))):
        df.loc[h, "Lactate"] = max(.4, 1.3 + 1.8*d[h] + rng.normal(0, .4))
        df.loc[h, "Creatinine"] = max(.3, 1.0 + 1.1*d[h] + rng.normal(0, .25))
        df.loc[h, "Platelets"] = max(20, 220 - 90*d[h] + rng.normal(0, 30))
        df.loc[h, "WBC"] = max(1, 8 + 6*d[h] + rng.normal(0, 2))
    df["Age"] = int(rng.integers(30, 90)); df["Gender"] = int(rng.integers(0, 2))
    df["HospAdmTime"] = -float(rng.integers(0, 50)); df["ICULOS"] = t + 1
    df["SepsisLabel"] = (t >= onset - 6).astype(int) if septic else 0     # PhysioNet: label starts 6h before onset
    return df
if __name__ == "__main__":
    out, n = sys.argv[1], int(sys.argv[2]); os.makedirs(out, exist_ok=True)
    rng = np.random.default_rng(7)
    for i in range(n):
        r = rng.random(); df = patient(rng, r < 0.18, 0.18 <= r < 0.45)
        df.to_csv(f"{out}/p{i:06d}.psv", sep="|", index=False)
    print(f"wrote {n} synthetic patients to {out}")
