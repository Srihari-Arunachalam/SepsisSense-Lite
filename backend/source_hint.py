"""Infection-source identifier: negation-aware NLP extraction from notes + lab/structured evidence."""
import re

SOURCES = {
 "Respiratory": {
  "notes": [
   (r"purulent sputum|(yellow|green|rusty|thick)\s+sputum", 3, "Purulent sputum"),
   (r"\bsputum\b", 1, "Sputum"),
   (r"\bcough(ing)?\b", 1, "Cough"),
   (r"crackles|crepitations|\brales\b|bronchial breath", 2, "Crackles / bronchial breathing"),
   (r"breathless|dyspn(o)?ea|shortness of breath|\bsob\b", 1, "Breathlessness"),
   (r"ventilator|intubated|\bvap\b", 1, "On ventilator"),
   (r"infiltrate|consolidation|pleural effusion|empyema", 3, "Imaging: infiltrate/consolidation"),
  ],
  "labs": [("SpO2", lambda v: v < 92, 2, "SpO2 < 92%"),
           ("Resp", lambda v: v >= 22, 1, "Resp rate >= 22"),
           ("PF_ratio", lambda v: v < 300, 2, "PaO2/FiO2 < 300")]},
 "Urinary tract": {
  "notes": [
   (r"flank pain|cva tenderness|loin pain", 3, "Flank pain / CVA tenderness"),
   (r"dysuria|burning (micturition|urination)", 2, "Dysuria"),
   (r"(foul|cloudy|smelly)[\s-]*(smelling\s+)?urine", 2, "Foul/cloudy urine"),
   (r"nitrite|pyuria|pus cells|leukocyte esterase|urine culture", 3, "Urinalysis/culture abnormal"),
   (r"\bcatheter\b|\bfoley\b|\bcauti\b", 1, "Urinary catheter"),
   (r"kidney stone|calculus|obstruct|retention|hydronephrosis", 2, "Urinary obstruction"),
   (r"haematuria|hematuria", 1, "Hematuria"),
  ],
  "labs": [("Creatinine", lambda v: v >= 2.0, 1, "Creatinine >= 2.0"),
           ("UrineOutput", lambda v: v < 0.5, 1, "Urine output low")]},
 "Abdominal": {
  "notes": [
   (r"rigid abdomen|board[\s-]*like|guarding|rebound", 3, "Rigid abdomen / guarding"),
   (r"abdominal pain|abdomen pain|\bruq\b|right upper (quadrant|abdomen)", 2, "Abdominal pain"),
   (r"jaundice|icterus|yellow(ish)? (eyes|skin)", 2, "Jaundice"),
   (r"free air|abscess|perforat|peritonitis", 3, "Finding: free air/abscess/perforation"),
   (r"vomiting|\bvomit", 1, "Vomiting"),
   (r"post[\s-]*(op|operative|surgery)|laparotomy|bowel surgery", 1, "Recent abdominal surgery"),
   (r"distension|distended", 1, "Abdominal distension"),
  ],
  "labs": [("Bilirubin_total", lambda v: v >= 2.0, 2, "Bilirubin >= 2.0"),
           ("Lipase", lambda v: v > 180, 2, "Lipase high"),
           ("AST", lambda v: v >= 100, 1, "AST >= 100"),
           ("Alkalinephos", lambda v: v >= 150, 1, "ALP high")]},
 "Bloodstream": {
  "notes": [
   (r"blood culture (positive|growth|\+)|bacter(a)?emia|gram[\s-]*(positive|negative) (cocci|bacilli|rods)", 4, "Positive blood culture"),
   (r"line site (redness|pus|swelling)|(iv|cannula|picc|port) site (redness|swelling|pus)|phlebitis|pus at (the )?line", 3, "Line-site infection signs"),
   (r"rigors?|shaking chills|\bchills\b", 2, "Rigors / chills"),
   (r"central line|\bpicc\b|central venous|\bcvc\b", 1, "Central line present"),
   (r"new (heart )?murmur|splinter|janeway|osler", 2, "Endocarditis signs"),
  ],
  "labs": [("Platelets", lambda v: v < 100, 1, "Platelets < 100"),
           ("CentralLineDays", lambda v: v >= 4, 1, "Central line >= 4 days")]},
 "Skin & Soft Tissue": {
  "notes": [
   (r"pain out of proportion|disproportionate pain", 4, "Pain out of proportion"),
   (r"crepitus|subcutaneous (air|emphysema)", 4, "Crepitus"),
   (r"blister|bullae|\bbulla\b", 2, "Blisters / bullae"),
   (r"dusky|black skin|necrosis|necrotic|gangrene", 3, "Dusky / necrotic skin"),
   (r"spreading (redness|erythema)|rapidly spreading", 2, "Rapidly spreading redness"),
   (r"redness|erythema|cellulitis|warm swollen", 1, "Redness / cellulitis"),
   (r"foul wound|wound (discharge|pus|infection)|pus from wound|surgical site infection|\bssi\b|diabetic foot", 2, "Infected wound"),
  ],
  "labs": [("Sodium", lambda v: v < 135, 1, "Sodium < 135"),
           ("CK", lambda v: v > 1000, 1, "CK very high"),
           ("Glucose", lambda v: v > 180, 1, "Glucose > 180")]},
}
CONFIRM = {
 "Respiratory": ["Chest X-ray", "Sputum culture", "ABG"],
 "Urinary tract": ["Urinalysis", "Urine culture", "Renal ultrasound/CT if obstruction"],
 "Abdominal": ["CT abdomen", "LFT + lipase", "Peritoneal/bile culture"],
 "Bloodstream": ["2 sets blood culture", "Line-tip culture", "Echo if murmur"],
 "Skin & Soft Tissue": ["Wound culture", "LRINEC score", "Surgical review (necrotizing fasciitis)"],
}
NEG = re.compile(r"\b(no|denies|denied|without|negative for|absent|nil|not|never|ruled out)\b")

def _sentences(text):
    return [s.strip().lower() for s in re.split(r"[.;\n]+", text or "") if s.strip()]

def _negated(sentence, start):
    before = re.split(r"\bbut\b|,", sentence[:start])[-1]   # negation scope stops at 'but' / comma
    return bool(NEG.search(before[-35:]))

def extract_findings(notes):
    found, negated, seen = [], [], set()
    for sent in _sentences(notes):
        for src, cfg in SOURCES.items():
            for pat, w, label in cfg["notes"]:
                for m in re.finditer(pat, sent):
                    if _negated(sent, m.start()):
                        negated.append(label); continue
                    if (src, label) not in seen:
                        seen.add((src, label)); found.append((src, label, w))
    return found, sorted(set(negated))

LABEL_INDEX = {(src, label): w for src, cfg in SOURCES.items() for _, w, label in cfg["notes"]}

def identify_source(notes, latest, risk_score, llm_result=None):
    findings, negated = extract_findings(notes)
    extractor = "regex (fallback)"
    if llm_result is not None:
        extractor = "LLM + regex"
        llm_neg = {(f["source"], f["label"]) for f in llm_result["findings"] if f["negated"]}
        findings = [f for f in findings if (f[0], f[1]) not in llm_neg]      # LLM overrides regex on negation
        have = {(s_, l_) for s_, l_, _ in findings}
        for f in llm_result["findings"]:
            key = (f["source"], f["label"])
            if f["negated"]:
                negated.append(f["label"])
            elif key not in have:
                findings.append((key[0], key[1], LABEL_INDEX[key])); have.add(key)
        negated = sorted(set(negated))
    sc = {s: {"raw": 0, "evidence": [], "n": 0} for s in SOURCES}
    for src, label, w in findings:
        sc[src]["raw"] += w; sc[src]["n"] += 1; sc[src]["evidence"].append(f"Notes: {label}")
    for src, cfg in SOURCES.items():
        for key, test, w, label in cfg["labs"]:
            v = latest.get(key)
            if v is not None and v == v and test(float(v)):
                sc[src]["raw"] += w; sc[src]["n"] += 1; sc[src]["evidence"].append(f"Lab/vital: {label}")
    out = sorted(({"source": s, "confidence": min(95, d["raw"] * 12), "signs": d["n"], "evidence": d["evidence"]}
                  for s, d in sc.items()), key=lambda x: -x["confidence"])
    top = out[0]
    clear = top["signs"] >= 2 and top["confidence"] >= 30 and (top["confidence"] - out[1]["confidence"] >= 12)
    if not clear:
        verdict = "undetermined"
        label = ("Source undetermined (not enough specific evidence)" if top["confidence"] < 30
                 else "Mixed / unclear source (multiple possible)")
    elif risk_score < 30:
        verdict, label = "local_infection", f"{top['source']} infection suspected, but sepsis risk is currently low"
    else:
        verdict, label = "sepsis_source", f"Possible {top['source']} sepsis source (hint only)"
    return {"verdict": verdict, "summary": label, "ranked": out, "extractor": extractor, "ignored_negated_findings": negated,
            "confirm_with": CONFIRM[top["source"]] if clear else ["Clinical exam", "Blood cultures", "Imaging as indicated"]}
