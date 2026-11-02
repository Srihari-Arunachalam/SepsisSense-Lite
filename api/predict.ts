import type { VercelRequest, VercelResponse } from '@vercel/node';
import { evaluateSepsisRiskEngine } from '../src/services/clinicalRiskEngine';

export default function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const startTime = Date.now();
  try {
    const body = req.body || {};
    const age = body.age ? parseInt(String(body.age), 10) : null;
    const blood_group = body.blood_group ? String(body.blood_group).trim().toUpperCase() : null;
    const parseNum = (v: any) => (v !== undefined && v !== null && v !== '' ? parseFloat(String(v)) : null);

    const evaluation = evaluateSepsisRiskEngine({
      age,
      blood_group,
      temperature: parseNum(body.temperature),
      heart_rate: parseNum(body.heart_rate),
      respiratory_rate: parseNum(body.respiratory_rate),
      systolic_bp: parseNum(body.systolic_bp),
      diastolic_bp: parseNum(body.diastolic_bp),
      lactate: parseNum(body.lactate),
      creatinine: parseNum(body.creatinine),
      spo2: parseNum(body.spo2),
      wbc: parseNum(body.wbc)
    }, startTime);

    return res.status(200).json(evaluation);
  } catch (err: any) {
    return res.status(500).json({ error: err?.message || 'Internal evaluation error' });
  }
}

