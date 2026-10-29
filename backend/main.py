import logging, time
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, field_validator
import model as M
from source_hint import identify_source
from llm_extractor import extract_with_llm

log = logging.getLogger("sepsissense"); logging.basicConfig(level=logging.INFO)
app = FastAPI(title="SepsisSense Lite API", version="2.0")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

LIMITS = {"HR": (20, 300), "Resp": (2, 80), "MAP": (20, 200), "SBP": (40, 300), "DBP": (20, 200), "O2Sat": (30, 100),
          "SpO2": (30, 100), "Temp": (25, 45), "Lactate": (0, 30), "Creatinine": (0, 30), "Platelets": (0, 1500),
          "WBC": (0, 200), "Bilirubin_total": (0, 60)}
KEY_INPUTS = {"HR": ["HR"], "Resp": ["Resp"], "BP": ["MAP", "SBP"], "Temp": ["Temp"], "SpO2": ["SpO2", "O2Sat"], "Lactate": ["Lactate"]}
MAX_ROWS = 72

class PatientRequest(BaseModel):
    patient_id: str
    history: list[dict]
    notes: str = ""
    @field_validator("history")
    @classmethod
    def check(cls, rows):
        if not rows: raise ValueError("history is empty")
        for i, r in enumerate(rows, 1):
            for k, v in r.items():
                if v is None or k not in LIMITS: continue
                if isinstance(v, bool) or not isinstance(v, (int, float)): raise ValueError(f"hour {i}: {k} must be a number")
                lo, hi = LIMITS[k]
                if not lo <= v <= hi: raise ValueError(f"hour {i}: {k}={v} outside plausible range {lo}-{hi}")
        return rows

def quality(history):
    miss = [name for name, keys in KEY_INPUTS.items() if not any(h.get(k) is not None for h in history for k in keys)]
    warn = []
    if len(history) < 3: warn.append("Less than 3 hours of history: trend features are limited.")
    if miss: warn.append("Missing key inputs: " + ", ".join(miss))
    return {"hours_received": len(history), "missing_key_inputs": miss, "warnings": warn}

@app.get("/health")
def health():
    return {"status": "ok" if M.READY else "model_not_loaded", "model_version": M.B["version"] if M.READY else None, "error": M.ERROR}

@app.get("/model-info")
def model_info():
    if not M.READY: raise HTTPException(503, M.ERROR)
    return {"version": M.B["version"], "trained_on": M.B["trained_on"], "synthetic_data": M.B["synthetic"],
            "n_features": len(M.FEATURES), "thresholds": M.TH, "metrics": M.B["metrics"]}

@app.post("/predict")
def predict_risk(req: PatientRequest):
    if not M.READY: raise HTTPException(503, M.ERROR)
    t0 = time.time(); history = req.history[-MAX_ROWS:]
    r = M.predict(history); r["patient_id"] = req.patient_id
    latest = dict(history[-1])
    if "SpO2" not in latest and latest.get("O2Sat") is not None: latest["SpO2"] = latest["O2Sat"]
    r["source"] = identify_source(req.notes, latest, r["risk_score"], extract_with_llm(req.notes))
    r["data_quality"] = quality(history); r["model_version"] = M.B["version"]; r["synthetic_model"] = M.B["synthetic"]
    log.info("predict score=%s level=%s extractor=%s %.0fms", r["risk_score"], r["level"], r["source"]["extractor"], (time.time()-t0)*1000)
    return r
