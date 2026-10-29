# SepsisSense Lite v2 (backend + model upgrade, UI unchanged)

## Setup (once)
    python -m venv venv && venv\Scripts\activate      (Mac/Linux: source venv/bin/activate)
    pip install -r requirements.txt

## A) Quick test with SYNTHETIC data (pipeline check only, metrics are meaningless)
    cd backend
    python make_synthetic_physionet.py ../synth/training_setA 1500
    python train_physionet.py --data ../synth/training_setA --out . --source-label "SYNTHETIC demo data"

## B) REAL training on PhysioNet 2019
Download training_setA.zip + training_setB.zip from
https://physionet.org/content/challenge-2019/1.0.0/  and unzip, then:
    python train_physionet.py --data C:\data\training_setA C:\data\training_setB --out .
Creates sepsis_bundle.pkl (model + calibrator + thresholds + metrics) and metrics.json
(AUROC, sensitivity, false-alert rate, lead time vs qSOFA-lite / NEWS2-lite).

## Run
    Terminal 1 (backend/):   python -m uvicorn main:app --port 8000
    Terminal 2 (frontend/):  streamlit run app.py
    Checks: localhost:8000/health   localhost:8000/model-info
Optional AI note extraction:  set ANTHROPIC_API_KEY=your_key  (regex fallback if absent)
