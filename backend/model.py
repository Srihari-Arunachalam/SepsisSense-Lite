import os, warnings, joblib, numpy as np, pandas as pd, shap
from features import engineer, readable
warnings.filterwarnings("ignore")
PATH = os.getenv("SEPSIS_BUNDLE", os.path.join(os.path.dirname(__file__), "sepsis_bundle.pkl"))
READY, ERROR, B = False, None, None
try:
    B = joblib.load(PATH)
    MODEL, CAL, FEATURES, TH = B["model"], B["calibrator"], B["features"], B["thresholds"]
    EXPLAINER = shap.TreeExplainer(MODEL); READY = True
except Exception as e:                       # API still starts; /health explains what is wrong
    ERROR = f"Could not load model bundle at {PATH}: {e}. Run train_physionet.py first."

def to_score(p):
    """Map calibrated probability to 0-100 so Low<30<=Watch<60<=High (thresholds learned from data)."""
    return np.interp(p, [0, TH["watch"], TH["high"], 1.0], [0, 30, 60, 100])

def level(score): return "Low" if score < 30 else "Watch" if score < 60 else "High"

def predict(history):
    X = engineer(pd.DataFrame(history)).reindex(columns=FEATURES).astype(float)
    prob = CAL.predict(MODEL.predict_proba(X)[:, 1]); score = to_score(prob)
    trend = [{"hour": i + 1, "risk_score": int(round(s))} for i, s in enumerate(score)]
    last = X.iloc[[-1]]
    sv = EXPLAINER.shap_values(last); sv = np.array(sv[1] if isinstance(sv, list) else sv)[0]
    top = np.argsort(-np.abs(sv))[:3]
    reasons = [{"feature": readable(FEATURES[i]), "raw_feature": FEATURES[i], "impact": float(sv[i]),
                "direction": "increases risk" if sv[i] > 0 else "decreases risk"} for i in top]
    s = int(round(float(score[-1])))
    return {"risk_score": s, "level": level(s), "probability_6h": round(float(prob[-1]), 4),
            "reasons": reasons, "risk_trend": trend}
