import requests
RISING = [{"HR":88,"Resp":18,"MAP":85,"Lactate":1.5},{"HR":98,"Resp":21,"MAP":80,"Lactate":1.8},{"HR":112,"Resp":25,"MAP":72,"Lactate":2.4}]
STABLE = [{"HR":82,"Resp":17,"MAP":88,"Lactate":1.2}]*3
def last(**kw): h=[dict(x) for x in RISING]; h[-1].update(kw); return h
CASES = {
 "1 Respiratory": (last(SpO2=89), "Productive cough with yellow sputum. Crackles right base. On ventilator day 3."),
 "2 Urinary": (last(Creatinine=2.6), "Flank pain on left, burning micturition. Foul smelling urine. Foley catheter in situ."),
 "3 Abdominal": (last(Bilirubin_total=3.1, Lactate=3.0), "Post-op day 2 bowel surgery. Rigid abdomen with guarding. Vomiting."),
 "4 Bloodstream": (last(Platelets=85, CentralLineDays=6), "Shaking chills after flush. Redness and pus at line site. Central line in situ."),
 "5 Skin": (last(Sodium=131, Glucose=260), "Left leg pain out of proportion, blisters and dusky skin. Crepitus felt."),
 "6 Pneumonia, NOT sepsis (stable vitals)": (STABLE, "Cough with yellow sputum. Crackles right base."),
 "7 Negation test": (last(), "No cough. Denies dysuria. No flank pain. Abdomen soft, no guarding."),
 "8 Vague notes": (last(), "Patient restless, feeling unwell."),
}
for name,(h,n) in CASES.items():
    r = requests.post("http://localhost:8000/predict", json={"patient_id":"T","history":h,"notes":n}).json()
    s = r["source"]; top = s["ranked"][0]
    print(f"\n### {name}\n  Risk {r['risk_score']} ({r['level']})\n  -> {s['summary']}")
    print("  Top:", top["source"], f"{top['confidence']}%", "|", "; ".join(top["evidence"]))
    if s["ignored_negated_findings"]: print("  Ignored (negated):", s["ignored_negated_findings"])
    print("  Confirm with:", s["confirm_with"])
