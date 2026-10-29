"""LLM-based clinical note extraction. Maps free text onto SepsisSense's canonical sign vocabulary.
Falls back (returns None) if no API key / error / bad output, so regex extractor keeps working."""
import os, json, re
from source_hint import SOURCES

VOCAB = {src: [label for _, _, label in cfg["notes"]] for src, cfg in SOURCES.items()}

SYSTEM = f"""You extract infection-related clinical signs from ICU nursing notes.
Map each sign mentioned in the note to EXACTLY one (source, label) pair from this vocabulary:
{json.dumps(VOCAB, indent=1)}
Rules:
- Handle paraphrases and misspellings (e.g. "coughing up greenish stuff" -> Respiratory / Purulent sputum).
- Set "negated": true if the note says the sign is absent (no / denies / ruled out / negative).
- "quote" must be an exact short substring copied from the note supporting the finding.
- Do NOT infer signs that are not written. Do NOT diagnose. If nothing relevant, return an empty list.
Return ONLY JSON: {{"findings":[{{"source":"...","label":"...","negated":false,"quote":"..."}}]}}"""

def _call_llm(notes):
    key = os.getenv("ANTHROPIC_API_KEY")
    if not key:
        return None
    import anthropic
    client = anthropic.Anthropic(api_key=key, timeout=8)
    msg = client.messages.create(model=os.getenv("SEPSIS_LLM_MODEL", "claude-sonnet-5-5"),
                                 max_tokens=800, system=SYSTEM,
                                 messages=[{"role": "user", "content": notes}])
    return msg.content[0].text

def _norm(s): return re.sub(r"\s+", " ", s.lower()).strip()

def extract_with_llm(notes):
    """Return {'findings':[...validated...], 'dropped': n} or None on any failure."""
    if not notes or not notes.strip():
        return None
    try:
        raw = _call_llm(notes)
        if not raw:
            return None
        data = json.loads(re.search(r"\{.*\}", raw, re.S).group(0))
        good, dropped = [], 0
        for f in data.get("findings", []):
            ok = (f.get("source") in VOCAB and f.get("label") in VOCAB[f["source"]]
                  and isinstance(f.get("negated"), bool)
                  and _norm(f.get("quote", "")) and _norm(f["quote"]) in _norm(notes))  # anti-hallucination
            if ok: good.append({k: f[k] for k in ("source", "label", "negated", "quote")})
            else: dropped += 1
        return {"findings": good, "dropped": dropped}
    except Exception:
        return None
