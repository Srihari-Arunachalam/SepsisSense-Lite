import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = __dirname;
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.use(express.json({ limit: '30mb' }));
app.use(express.urlencoded({ extended: true, limit: '30mb' }));

// Initialize Gemini client if API key is provided
let geminiAI: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    geminiAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  } catch (err) {
    console.warn('Failed to initialize Gemini AI client:', err);
  }
}

export interface PatientData {
  age?: number | null;
  blood_group?: string | null;
  temperature?: number | null;
  heart_rate?: number | null;
  respiratory_rate?: number | null;
  systolic_bp?: number | null;
  diastolic_bp?: number | null;
  lactate?: number | null;
  creatinine?: number | null;
  spo2?: number | null;
  wbc?: number | null;
  notes?: string | null;
}

export interface LocalAdviceItem {
  tag: string;
  title: string;
  advice: string;
}

export interface PredictionResult {
  risk_level: 'Low' | 'Moderate' | 'High';
  probability: number;
  message: string;
  sepsis_type: string;
  suspected_source: string;
  local_advices: LocalAdviceItem[];
  contributing_factors: string[];
  qsofa_score: number;
  sirs_score: number;
  shock_index: number | null;
  clinical_actions: string[];
  execution_time_seconds: number;
  disclaimer: string;
}

/**
 * Clinical Sepsis Risk Evaluation Model
 * Calibrated against qSOFA, SIRS criteria, Surviving Sepsis Campaign guidelines,
 * and hemodynamic organ hypoperfusion indices (shock index, lactate clearance threshold, renal creatinine).
 */
function evaluateSepsisRisk(data: PatientData, startTimeMs: number): PredictionResult {
  const contributing_factors: string[] = [];
  let riskScore = 0; // base score points
  let sirsScore = 0;
  let qsofaScore = 0;

  const age = typeof data.age === 'number' ? data.age : null;
  const temp = typeof data.temperature === 'number' ? data.temperature : null;
  const hr = typeof data.heart_rate === 'number' ? data.heart_rate : null;
  const rr = typeof data.respiratory_rate === 'number' ? data.respiratory_rate : null;
  const sbp = typeof data.systolic_bp === 'number' ? data.systolic_bp : null;
  const lactate = typeof data.lactate === 'number' ? data.lactate : null;
  const creatinine = typeof data.creatinine === 'number' ? data.creatinine : null;
  const spo2 = typeof data.spo2 === 'number' ? data.spo2 : null;
  const wbc = typeof data.wbc === 'number' ? data.wbc : null;

  // 1. Heart Rate (SIRS criteria: HR > 90)
  // 1. Heart Rate (SIRS criteria: HR > 90)
  if (hr !== null) {
    if (hr >= 90) {
      riskScore += hr >= 125 ? 24 : 10;
      sirsScore += 1;
      contributing_factors.push(`Fast heartbeat: ${hr} beats per minute.`);
    } else if (hr < 50) {
      riskScore += 10;
      contributing_factors.push(`Slow heartbeat: ${hr} beats per minute.`);
    }
  }

  // 2. Respiratory Rate (qSOFA: RR >= 22; SIRS: RR > 20)
  if (rr !== null) {
    if (rr >= 22) {
      riskScore += rr >= 26 ? 25 : 15;
      qsofaScore += 1;
      sirsScore += 1;
      contributing_factors.push(`Fast breathing: ${rr} breaths per minute.`);
    } else if (rr > 20) {
      riskScore += 8;
      sirsScore += 1;
      contributing_factors.push(`Fast breathing: ${rr} breaths per minute.`);
    }
  }

  // 3. Systolic Blood Pressure (qSOFA: SBP <= 100; Low BP range: SBP < 90)
  if (sbp !== null) {
    if (sbp < 90) {
      riskScore += 30;
      qsofaScore += 1;
      contributing_factors.push(`Low blood pressure: ${sbp} mmHg systolic.`);
    } else if (sbp <= 100) {
      riskScore += 15;
      qsofaScore += 1;
      contributing_factors.push(`Low blood pressure: ${sbp} mmHg systolic.`);
    }
  }

  // 4. Serum Lactate (Blood flow and tissue oxygen marker)
  if (lactate !== null) {
    if (lactate >= 2.0) {
      riskScore += lactate >= 4.0 ? 32 : 12;
      contributing_factors.push(`Raised lactate level: ${lactate.toFixed(2)} mmol/L. This can be a sign that the body is not getting enough blood flow.`);
    }
  }

  // 5. Serum Creatinine (Kidney function marker)
  if (creatinine !== null) {
    if (creatinine >= 1.4) {
      riskScore += creatinine >= 2.0 ? 20 : 8;
      contributing_factors.push(`High creatinine level: ${creatinine.toFixed(2)} mg/dL. This may indicate a kidney problem.`);
    }
  }

  // 6. Body Temperature (High fever or hypothermia)
  if (temp !== null) {
    if (temp > 38.0) {
      riskScore += temp >= 39.0 ? 14 : 8;
      sirsScore += 1;
      contributing_factors.push(`High temperature: ${temp.toFixed(1)}°C.`);
    } else if (temp < 36.0) {
      riskScore += 16;
      sirsScore += 1;
      contributing_factors.push(`Abnormally low temperature: ${temp.toFixed(1)}°C.`);
    }
  }

  // 7. Oxygen Saturation (SpO2)
  if (spo2 !== null) {
    if (spo2 < 90) {
      riskScore += 16;
      contributing_factors.push(`Low blood oxygen: ${spo2}%.`);
    } else if (spo2 <= 93) {
      riskScore += 8;
      contributing_factors.push(`Borderline blood oxygen: ${spo2}%.`);
    }
  }

  // 8. White Blood Cell Count (WBC)
  if (wbc !== null) {
    if (wbc > 12.0) {
      riskScore += 8;
      sirsScore += 1;
      contributing_factors.push(`High white blood cell count: ${wbc.toFixed(1)} × 10³/µL. This indicates the body is fighting an infection.`);
    } else if (wbc < 4.0) {
      riskScore += 14;
      sirsScore += 1;
      contributing_factors.push(`Low white blood cell count: ${wbc.toFixed(1)} × 10³/µL.`);
    }
  }

  // 9. Shock Index (HR / SBP). Normal < 0.7; >= 0.9 is elevated
  let shockIndex: number | null = null;
  if (hr !== null && sbp !== null && sbp > 0) {
    shockIndex = parseFloat((hr / sbp).toFixed(2));
    if (shockIndex >= 1.0) {
      riskScore += 14;
      contributing_factors.push(`High shock index: ${shockIndex}. The heart rate is high compared with the blood pressure.`);
    } else if (shockIndex >= 0.9) {
      riskScore += 6;
      contributing_factors.push(`High shock index: ${shockIndex}. The heart rate is high compared with the blood pressure.`);
    }
  }

  // 10. Age factor (> 65 years carries higher vulnerability)
  if (age !== null && age >= 65) {
    riskScore += 4;
  }

  // Calculate logistic probability (calibrated range 0.04 to 0.98)
  const normalizedExponent = (riskScore - 42) / 16;
  const rawProb = 1 / (1 + Math.exp(-normalizedExponent));
  const probability = parseFloat(Math.min(0.98, Math.max(0.04, rawProb)).toFixed(2));

  // Determine Risk Category based on probability, qSOFA, and lactate
  let risk_level: 'Low' | 'Moderate' | 'High' = 'Low';
  let message = 'Your patient is currently stable. Continue regular routine monitoring.';

  const isSevereLactate = lactate !== null && lactate >= 4.0;
  const isHypotension = sbp !== null && sbp < 90;

  if (qsofaScore >= 2 || (isHypotension && isSevereLactate) || riskScore >= 56 || probability >= 0.65) {
    risk_level = 'High';
    message = 'Your patient may have a serious infection. Immediate medical attention is needed.';
  } else if (probability >= 0.30 || qsofaScore === 1 || (lactate !== null && lactate >= 2.0) || sirsScore >= 2 || riskScore >= 20) {
    risk_level = 'Moderate';
    message = 'Signs of possible infection detected. Medical evaluation and close monitoring needed.';
  } else {
    risk_level = 'Low';
    message = 'Vital signs currently within normal ranges. Standard monitoring recommended.';
  }

  // Determine Severity / Possible Condition (patient-friendly English, avoid premature shock/stage diagnosis)
  let sepsis_type = 'Possible Condition: Stable — Low Warning';
  if (risk_level === 'High') {
    sepsis_type = 'Possible Condition: Serious Infection — Emergency Warning';
  } else if (risk_level === 'Moderate') {
    sepsis_type = 'Possible Condition: Developing Infection — Moderate Warning';
  } else {
    sepsis_type = 'Possible Condition: Stable — Low Warning';
  }

  // Determine Likely Infection Source / Type (patient-friendly plain English)
  let suspected_source = 'Infection source not yet known';
  if (rr !== null && (rr >= 22 || (spo2 !== null && spo2 <= 93))) {
    suspected_source = 'Possible Infection Source: Lungs or Chest';
  } else if (creatinine !== null && creatinine >= 1.5) {
    suspected_source = 'Possible Infection Source: Kidneys or Urinary Tract';
  } else if (temp !== null && temp >= 38.5 && lactate !== null && lactate >= 2.0) {
    suspected_source = 'Possible Infection Source: Bloodstream or Body-wide Infection';
  } else if (risk_level !== 'Low') {
    suspected_source = 'Infection source not yet known';
  }

  // Generate Simple English Patient & Caregiver Guidance ("What Needs to Happen Now?")
  // Clearly formulated as actions managed by healthcare professionals, not self-treatment
  const local_advices: LocalAdviceItem[] = [];

  if (risk_level === 'High') {
    local_advices.push({
      tag: 'Emergency Care',
      title: 'Get Emergency Medical Help',
      advice: 'The patient needs immediate assessment by a medical team. Do not delay getting emergency care.'
    });
    local_advices.push({
      tag: 'IV Fluids',
      title: 'Give Fluids if the Medical Team Advises',
      advice: 'A doctor may give fluids through a vein to help improve blood flow and protect the organs. The amount depends on the patient\'s condition.'
    });
    local_advices.push({
      tag: 'Antibiotics',
      title: 'Start Antibiotics if the Doctor Prescribes Them',
      advice: 'If a serious bacterial infection is suspected, the medical team may start antibiotics quickly. Treatment should not be delayed unnecessarily.'
    });
    local_advices.push({
      tag: 'Blood Tests',
      title: 'Do Blood Tests',
      advice: 'Doctors may test the blood to look for infection, check lactate levels, and see whether organs are working properly. Blood cultures should be collected before antibiotics when this can be done without delaying treatment.'
    });
    local_advices.push({
      tag: 'Breathing Support',
      title: 'Help the Patient Breathe',
      advice: 'The medical team may provide oxygen or breathing support if needed.'
    });
    local_advices.push({
      tag: 'Close Monitoring',
      title: 'Provide Close Hospital Monitoring',
      advice: 'The patient may need emergency or intensive care, depending on blood pressure, breathing, organ function, and the doctor\'s assessment.'
    });
  } else if (risk_level === 'Moderate') {
    local_advices.push({
      tag: 'Doctor Review',
      title: 'Get a Prompt Medical Assessment',
      advice: 'A doctor should examine the patient promptly to check chest, urine, abdomen, or skin to identify the cause of the infection.'
    });
    local_advices.push({
      tag: 'Vital Checks',
      title: 'Check Warning Signs Every 1 to 2 Hours',
      advice: 'The healthcare team should check temperature, heart rate, blood pressure, and breathing regularly for any sudden changes.'
    });
    local_advices.push({
      tag: 'Hydration',
      title: 'Maintain Hydration as Advised by Healthcare Team',
      advice: 'The doctor or nurse may provide fluids or encourage drinking fluids to support blood circulation.'
    });
    local_advices.push({
      tag: 'Repeat Tests',
      title: 'Repeat Blood Tests in 2 to 4 Hours',
      advice: 'Repeat tests may be ordered to verify if signs of infection and lactate levels are resolving or rising.'
    });
    local_advices.push({
      tag: 'Medications',
      title: 'Take Prescribed Antibiotics on Time',
      advice: 'If antibiotics are prescribed by a doctor, take every dose on schedule without missing any.'
    });
  } else {
    local_advices.push({
      tag: 'Standard Care',
      title: 'Continue Regular Routine Observations',
      advice: 'Continue standard routine vital checks every 4 to 6 hours as per normal clinic or ward guidelines.'
    });
    local_advices.push({
      tag: 'Rest & Fluids',
      title: 'Rest and Keep Well Hydrated',
      advice: 'Ensure adequate bed rest, clean fluids, and healthy nourishment.'
    });
    local_advices.push({
      tag: 'Watch Warning Signs',
      title: 'Watch for Sudden Warning Signs',
      advice: 'Alert a doctor immediately if a sudden high fever, rapid breathing, severe shivering, or confusion develops.'
    });
  }

  // Emergency Care Checklist for the Medical Team (Surviving Sepsis Campaign / 1-Hour Protocol)
  const clinical_actions: string[] = [];
  if (risk_level === 'High') {
    clinical_actions.push('Check the patient\'s lactate level as soon as possible. Repeat the test when clinically indicated.');
    clinical_actions.push('Collect blood samples for cultures before antibiotics, if this does not cause a harmful delay.');
    clinical_actions.push('Start suitable antibiotics quickly when a serious bacterial infection is suspected.');
    clinical_actions.push('If the patient has low blood pressure or signs of poor blood flow, the medical team should assess the need for IV fluids.');
    clinical_actions.push('If blood pressure remains too low, doctors may use medicines such as norepinephrine to help maintain it.');
  } else if (risk_level === 'Moderate') {
    clinical_actions.push('Perform bedside clinical assessment and recheck vital signs every 1-2 hours.');
    clinical_actions.push('Review possible infection sources (lungs, urinary tract, abdomen, skin, or IV line).');
    clinical_actions.push('Repeat blood lactate and full blood count tests when clinically indicated.');
    clinical_actions.push('Ensure IV access is available and assess hydration and fluid requirements.');
  } else {
    clinical_actions.push('Maintain routine ward vital observations every 4-6 hours.');
    clinical_actions.push('Re-assess promptly if fever develops or breathing rate increases.');
  }

  const execution_time_seconds = parseFloat(((Date.now() - startTimeMs) / 1000).toFixed(2));

  return {
    risk_level,
    probability,
    message,
    sepsis_type,
    suspected_source,
    local_advices,
    contributing_factors: contributing_factors.length > 0 ? contributing_factors : ['All measured vital signs are currently within normal baseline ranges.'],
    qsofa_score: qsofaScore,
    sirs_score: sirsScore,
    shock_index: shockIndex,
    clinical_actions,
    execution_time_seconds: Math.max(0.05, execution_time_seconds),
    disclaimer: 'Important Notice: This AI result is an early warning, not a confirmed diagnosis. Only a qualified healthcare professional can diagnose and treat sepsis.'
  };
}

/**
 * POST /predict
 * Primary API endpoint matching user specification.
 */
app.post(['/predict', '/api/predict'], (req: Request, res: Response) => {
  const startTime = Date.now();
  try {
    const body = req.body || {};

    // Validate and convert numeric values
    // Age must be integer if provided
    let age: number | null = null;
    if (body.age !== undefined && body.age !== null && body.age !== '') {
      const parsedAge = parseInt(String(body.age), 10);
      if (isNaN(parsedAge) || parsedAge < 0 || parsedAge > 125) {
        return res.status(400).json({ error: 'Invalid age value. Please provide a valid integer between 0 and 125.' });
      }
      age = parsedAge;
    }

    // Blood Group
    const validBloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
    let blood_group: string | null = null;
    if (body.blood_group && typeof body.blood_group === 'string') {
      const bg = body.blood_group.trim().toUpperCase();
      if (validBloodGroups.includes(bg)) {
        blood_group = bg;
      }
    }

    // Floating-point clinical variables
    const parseNumber = (val: any, min: number, max: number, name: string): number | null => {
      if (val === undefined || val === null || val === '') return null;
      const num = parseFloat(String(val));
      if (isNaN(num) || num < min || num > max) {
        throw new Error(`Invalid ${name} value (${val}). Expected numeric value between ${min} and ${max}.`);
      }
      return num;
    };

    let temperature: number | null = null;
    let heart_rate: number | null = null;
    let respiratory_rate: number | null = null;
    let systolic_bp: number | null = null;
    let diastolic_bp: number | null = null;
    let lactate: number | null = null;
    let creatinine: number | null = null;
    let spo2: number | null = null;
    let wbc: number | null = null;

    try {
      temperature = parseNumber(body.temperature, 28, 45, 'temperature');
      heart_rate = parseNumber(body.heart_rate, 20, 300, 'heart rate');
      respiratory_rate = parseNumber(body.respiratory_rate, 4, 80, 'respiratory rate');
      systolic_bp = parseNumber(body.systolic_bp, 30, 300, 'systolic BP');
      diastolic_bp = parseNumber(body.diastolic_bp, 10, 200, 'diastolic BP');
      lactate = parseNumber(body.lactate, 0.1, 30, 'lactate');
      creatinine = parseNumber(body.creatinine, 0.1, 25, 'creatinine');
      spo2 = parseNumber(body.spo2, 30, 100, 'SpO2');
      wbc = parseNumber(body.wbc, 0.1, 100, 'WBC');
    } catch (validationErr: any) {
      return res.status(400).json({ error: validationErr.message });
    }

    // Check that at least some clinical vitals are provided
    const hasVitals = [temperature, heart_rate, respiratory_rate, systolic_bp, lactate, creatinine].some(v => v !== null);
    if (!hasVitals && age === null) {
      return res.status(400).json({
        error: 'Please provide at least one clinical vital (e.g. Heart Rate, Temperature, Blood Pressure, Lactate) to assess sepsis risk.'
      });
    }

    const patientData: PatientData = {
      age,
      blood_group,
      temperature,
      heart_rate,
      respiratory_rate,
      systolic_bp,
      diastolic_bp,
      lactate,
      creatinine,
      spo2,
      wbc,
      notes: body.notes || null
    };

    const result = evaluateSepsisRisk(patientData, startTime);
    return res.json(result);
  } catch (err: any) {
    console.error('Error in /predict:', err);
    return res.status(500).json({ error: 'Internal server error processing clinical analysis.' });
  }
});

/**
 * Helper to extract clinical values from raw text using regex
 */
function extractWithRegex(text: string) {
  const extracted: Record<string, { value: number | string; confidence: number; sourceText: string }> = {};

  // Age: e.g. "Age: 64", "64 y/o", "64yo", "Age 64 years"
  const ageMatch = text.match(/(?:age|patient\s+age)[:\s]*([0-9]{1,3})|(?:^|\s)([0-9]{1,3})\s*(?:yo|y\/o|years\s+old)/i);
  if (ageMatch) {
    const ageVal = parseInt(ageMatch[1] || ageMatch[2], 10);
    if (ageVal > 0 && ageVal < 125) {
      extracted.age = { value: ageVal, confidence: 0.95, sourceText: ageMatch[0].trim() };
    }
  }

  // Blood group: e.g. "Blood Group: O+", "O Rh+", "Type: AB-"
  const bgMatch = text.match(/(?:blood\s*group|blood\s*type|type)[:\s]*([ABO]{1,2}\s*[+-]|O\s*Rh[+-])/i) ||
                   text.match(/\b(A\+|A-|B\+|B-|AB\+|AB-|O\+|O-)\b/);
  if (bgMatch) {
    let bg = (bgMatch[1] || bgMatch[0]).trim().toUpperCase().replace(/\s*RH/i, '');
    extracted.blood_group = { value: bg, confidence: 0.9, sourceText: bgMatch[0].trim() };
  }

  // Heart Rate / Pulse: e.g. "HR: 112", "Pulse: 112 bpm", "Heart Rate 112"
  const hrMatch = text.match(/(?:heart\s*rate|hr|pulse|pulse\s*rate)[:\s]*([0-9]{2,3})\s*(?:bpm)?/i);
  if (hrMatch) {
    const hr = parseFloat(hrMatch[1]);
    if (hr >= 30 && hr <= 250) {
      extracted.heart_rate = { value: hr, confidence: 0.95, sourceText: hrMatch[0].trim() };
    }
  }

  // Temperature: e.g. "Temp: 38.4 C", "Temperature = 38.6", "T: 38.4"
  const tempMatch = text.match(/(?:temp(?:erature)?|t)[:\s=]*([0-9]{2}(?:\.[0-9]{1,2})?)\s*(?:Â°?C|deg\s*C)?/i);
  if (tempMatch) {
    let t = parseFloat(tempMatch[1]);
    // check if Fahrenheit e.g. 101.2 F
    if (t > 90 && t < 108) {
      t = parseFloat(((t - 32) * 5 / 9).toFixed(1));
    }
    if (t >= 32 && t <= 44) {
      extracted.temperature = { value: t, confidence: 0.92, sourceText: tempMatch[0].trim() };
    }
  }

  // Blood Pressure: e.g. "BP: 88/54", "Blood Pressure: 95/60 mmHg"
  const bpMatch = text.match(/(?:blood\s*pressure|bp|nibb)[:\s]*([0-9]{2,3})\s*[\/|\\]\s*([0-9]{2,3})/i);
  if (bpMatch) {
    const sbp = parseFloat(bpMatch[1]);
    const dbp = parseFloat(bpMatch[2]);
    if (sbp >= 40 && sbp <= 260) {
      extracted.systolic_bp = { value: sbp, confidence: 0.95, sourceText: bpMatch[0].trim() };
    }
    if (dbp >= 20 && dbp <= 160) {
      extracted.diastolic_bp = { value: dbp, confidence: 0.95, sourceText: bpMatch[0].trim() };
    }
  } else {
    const sbpOnly = text.match(/(?:systolic|sbp)[:\s]*([0-9]{2,3})/i);
    if (sbpOnly) {
      const sbp = parseFloat(sbpOnly[1]);
      if (sbp >= 40 && sbp <= 260) {
        extracted.systolic_bp = { value: sbp, confidence: 0.85, sourceText: sbpOnly[0].trim() };
      }
    }
  }

  // Respiratory Rate: e.g. "RR: 26", "Resp Rate: 26 /min", "Respiratory: 24 bpm"
  const rrMatch = text.match(/(?:respiratory\s*rate|resp\s*rate|rr|respirations)[:\s]*([0-9]{1,2})\s*(?:breaths\/min|\/min)?/i);
  if (rrMatch) {
    const rr = parseFloat(rrMatch[1]);
    if (rr >= 4 && rr <= 70) {
      extracted.respiratory_rate = { value: rr, confidence: 0.92, sourceText: rrMatch[0].trim() };
    }
  }

  // Lactate: e.g. "Lactate: 2.8 mmol/L", "Serum Lactate = 2.45"
  const lacMatch = text.match(/(?:serum\s*)?lactate[:\s=]*([0-9]{1,2}(?:\.[0-9]{1,3})?)\s*(?:mmol\/l)?/i);
  if (lacMatch) {
    const lac = parseFloat(lacMatch[1]);
    if (lac >= 0.2 && lac <= 30) {
      extracted.lactate = { value: lac, confidence: 0.96, sourceText: lacMatch[0].trim() };
    }
  }

  // Creatinine: e.g. "Creatinine: 1.4 mg/dL", "Cr: 1.72"
  const crMatch = text.match(/(?:serum\s*)?creat(?:inine)?(?:\s*\(cr\))?[:\s=]*([0-9]{1,2}(?:\.[0-9]{1,3})?)\s*(?:mg\/dl)?/i);
  if (crMatch) {
    const cr = parseFloat(crMatch[1]);
    if (cr >= 0.2 && cr <= 25) {
      extracted.creatinine = { value: cr, confidence: 0.96, sourceText: crMatch[0].trim() };
    }
  }

  // SpO2: e.g. "SpO2: 94%", "O2 Sat: 94"
  const spo2Match = text.match(/(?:spo2|o2\s*sat(?:uration)?)[:\s]*([0-9]{2,3})\s*%?/i);
  if (spo2Match) {
    const spo2 = parseFloat(spo2Match[1]);
    if (spo2 >= 50 && spo2 <= 100) {
      extracted.spo2 = { value: spo2, confidence: 0.94, sourceText: spo2Match[0].trim() };
    }
  }

  // WBC: e.g. "WBC: 12.5", "White Blood Cells: 14.2"
  const wbcMatch = text.match(/(?:wbc|white\s*blood\s*cells?)[:\s]*([0-9]{1,2}(?:\.[0-9]{1,2})?)/i);
  if (wbcMatch) {
    const wbc = parseFloat(wbcMatch[1]);
    if (wbc >= 0.5 && wbc <= 100) {
      extracted.wbc = { value: wbc, confidence: 0.92, sourceText: wbcMatch[0].trim() };
    }
  }

  return extracted;
}

/**
 * POST /api/extract-record
 * Parses uploaded hospital documents, lab reports, CSVs, nursing notes, or images.
 */
app.post('/api/extract-record', async (req: Request, res: Response) => {
  try {
    const { fileName, fileContent, fileType, isBase64, imageBase64 } = req.body;

    let textContent = '';
    if (typeof fileContent === 'string') {
      if (isBase64) {
        try {
          const buffer = Buffer.from(fileContent, 'base64');
          textContent = buffer.toString('utf-8');
        } catch {
          textContent = fileContent;
        }
      } else {
        textContent = fileContent;
      }
    }

    let extracted: Record<string, any> = {};

    // If Gemini is available and an image or complex unstructured report was provided
    if (geminiAI && (imageBase64 || (textContent && textContent.length > 30))) {
      try {
        const prompt = `You are a specialized clinical data extraction system for hospital records.
Extract the patient vitals and lab numbers from the provided document or text:
- age: Integer in years (e.g. 64)
- blood_group: String, one of "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"
- temperature: Float in Celsius (Â°C)
- heart_rate: Float/Integer in bpm
- respiratory_rate: Float/Integer in breaths/min
- systolic_bp: Float/Integer in mmHg
- diastolic_bp: Float/Integer in mmHg
- lactate: Float in mmol/L
- creatinine: Float in mg/dL
- spo2: Float/Integer in %
- wbc: Float in 10^9/L

CRITICAL RULES:
1. Convert numerical values into proper numeric data types: Integer for Age, Float/Double for decimal clinical values.
2. Only return values you can identify with high confidence. Do not guess or hallucinate.
3. If an uploaded value cannot be confidently extracted, leave it null.
Return STRICT JSON ONLY with format:
{
  "age": number | null,
  "blood_group": string | null,
  "temperature": number | null,
  "heart_rate": number | null,
  "respiratory_rate": number | null,
  "systolic_bp": number | null,
  "diastolic_bp": number | null,
  "lactate": number | null,
  "creatinine": number | null,
  "spo2": number | null,
  "wbc": number | null,
  "summary": "Brief 1-sentence description of the patient record"
}`;

        const contents: any[] = [];
        if (imageBase64) {
          const cleanBase64 = imageBase64.replace(/^data:image\/[a-zA-Z]+;base64,/, '');
          contents.push({
            inlineData: {
              data: cleanBase64,
              mimeType: fileType && fileType.startsWith('image/') ? fileType : 'image/jpeg'
            }
          });
        }
        if (textContent) {
          contents.push({ text: `Document content:\n${textContent.slice(0, 8000)}` });
        }
        contents.push({ text: prompt });

        const response = await geminiAI.models.generateContent({
          model: 'gemini-2.5-flash',
          contents
        });

        const reply = response.text || '';
        const jsonMatch = reply.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          for (const [k, v] of Object.entries(parsed)) {
            if (v !== null && v !== undefined && k !== 'summary') {
              extracted[k] = {
                value: k === 'age' ? Math.round(Number(v)) : (typeof v === 'number' ? Number(v) : v),
                confidence: 0.96,
                sourceText: `Extracted via AI from ${fileName || 'uploaded document'}`
              };
            }
          }
          if (parsed.summary) {
            extracted._summary = parsed.summary;
          }
        }
      } catch (geminiErr) {
        console.warn('Gemini extraction failed, falling back to deterministic regex parser:', geminiErr);
      }
    }

    // Combine or fallback with deterministic regex parser
    const regexResults = extractWithRegex(textContent);
    for (const [key, resItem] of Object.entries(regexResults)) {
      if (!extracted[key]) {
        extracted[key] = resItem;
      }
    }

    const unidentifiableFields: string[] = [];
    const coreFields = ['temperature', 'heart_rate', 'respiratory_rate', 'systolic_bp', 'lactate', 'creatinine'];
    for (const f of coreFields) {
      if (!extracted[f]) {
        unidentifiableFields.push(f);
      }
    }

    return res.json({
      success: true,
      fileName: fileName || 'uploaded_document',
      fileType: fileType || 'text/plain',
      extracted,
      unidentifiableFields,
      message: Object.keys(extracted).length > 0
        ? 'Record uploaded and processed successfully.'
        : 'Record uploaded, but unable to identify clinical values automatically. Please enter values manually.'
    });
  } catch (err: any) {
    console.error('Error in /api/extract-record:', err);
    return res.status(500).json({ error: 'Failed to process hospital record.' });
  }
});

/**
 * POST /api/chat
 * Medical conversational assistant for explaining sepsis parameters, answering queries,
 * interpreting clinical factors or protocol guidance.
 */
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { prompt, patientData, language = 'en' } = req.body;
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Prompt is required.' });
    }

    const langNames: Record<string, string> = {
      en: 'English',
      ta: 'Tamil (தமிழ்)',
      hi: 'Hindi (हिन्दी)',
      te: 'Telugu (తెలుగు)',
      ml: 'Malayalam (മലയാളം)'
    };
    const targetLangName = langNames[language] || 'English';

    // If Gemini is available
    if (geminiAI) {
      try {
        const systemPrompt = `You are SepsisSense, a professional medical decision-support AI assistant.
CRITICAL LANGUAGE INSTRUCTION: You MUST reply entirely in ${targetLangName}. Use clear, patient-friendly medical explanations without unnecessary jargon while maintaining clinical precision and authoritative medical rigor (referencing Sepsis-3 guidelines, qSOFA, SIRS, and Surviving Sepsis Campaign 1-Hour Bundles).
Context of current patient: ${JSON.stringify(patientData || {})}
Always remind the clinician/patient that SepsisSense provides clinical decision support and does not replace in-person medical diagnosis or laboratory testing. Keep answers concise (under 150 words) unless detailed explanation is requested.`;

        const response = await geminiAI.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: [
            { text: systemPrompt },
            { text: prompt }
          ]
        });

        return res.json({ reply: response.text || 'Unable to generate clinical explanation.' });
      } catch (geminiErr: any) {
        console.warn('Gemini chat error:', geminiErr);
      }
    }

    // High-quality multilingual fallback medical explanations if Gemini is offline
    const lowerPrompt = prompt.toLowerCase();
    let reply = '';

    if (language === 'ta') {
      // TAMIL FALLBACKS
      if (lowerPrompt.includes('lactate') || lowerPrompt.includes('லாக்டேட்')) {
        reply = 'சீரம் லாக்டேட் (Lactate) என்பது திசுக்களுக்கு ஆக்சிஜன் மற்றும் இரத்த ஓட்டம் குறைவதைக் குறிக்கும் ஒரு முக்கிய இரத்தப் பரிசோதனை ஆகும். செப்சிஸில் லாக்டேட் அளவு 2.0 mmol/L-க்கு மேல் இருப்பது உறுப்புகள் ஆபத்தில் உள்ளதைக் குறிக்கிறது; 4.0 mmol/L அல்லது அதற்கு மேல் இருப்பது செப்டிக் ஷாக் எனப்படும் அவசர நிலையைக் குறிக்கிறது, இதற்கு உடனடியாக நரம்புவழி (IV) சலைன் திரவங்கள் தேவை.';
      } else if (lowerPrompt.includes('qsofa') || lowerPrompt.includes('ஸ்கோர்') || lowerPrompt.includes('மதிப்பீடு')) {
        reply = 'Quick SOFA (qSOFA) என்பது படுக்கை அருகில் செய்யப்படும் 3-அம்ச அவசரப் பரிசோதனை: 1) விரைவான சுவாசம் (≥ 22 சுவாசம்/நிமிடம்); 2) குறைந்த இரத்த அழுத்தம் (சிஸ்டாலிக் BP ≤ 100 mmHg); 3) நினைவாற்றல் குழப்பம் அல்லது மயக்கம். இதில் 2 அல்லது அதற்கு மேற்பட்ட மதிப்பெண்கள் வந்தால் உடனடி அவசர தீவிர சிகிச்சைப் பிரிவு கவனிப்பு தேவை.';
      } else if (lowerPrompt.includes('bundle') || lowerPrompt.includes('treatment') || lowerPrompt.includes('சிகிச்சை') || lowerPrompt.includes('முதலுதவி')) {
        reply = 'சர்வைவிங் செப்சிஸ் பிரச்சாரத்தின் (SSC) 1-மணி நேர அவசர நெறிமுறை: 1) இரத்த லாக்டேட் அளவை உடனே பரிசோதிக்கவும்; 2) ஆன்டிபயாடிக் மருந்துகளைத் தொடங்குவதற்கு முன் இரத்தக் கல்ச்சர் எடுக்கவும்; 3) 1 மணி நேரத்திற்குள் நரம்புவழி (IV) ஆன்டிபயாடிக் மருந்துகளைத் தொடங்கவும்; 4) குறைந்த இரத்த அழுத்தம் அல்லது லாக்டேட் ≥ 4.0 உள்ளபோது 30 mL/kg சலைன் திரவத்தை வேகமாக ஏற்றவும்; 5) இரத்த அழுத்தம் சீராகவில்லை என்றால் வாசோபிரசர் மருந்துகளைப் பயன்படுத்தவும்.';
      } else if (lowerPrompt.includes('sepsis') || lowerPrompt.includes('செப்சிஸ்') || lowerPrompt.includes('என்ன')) {
        reply = 'செப்சிஸ் என்பது உடலில் ஏற்படும் ஒரு தொற்றுக்கு எதிராக நமது நோய் எதிர்ப்பு அமைப்பு அளவுக்கு அதிகமாக செயல்பட்டு, தனது சொந்த உறுப்புகளையே சேதப்படுத்தும் ஒரு தீவிர ஆபத்தான அவசர நிலை. ஆரம்பத்திலேயே இதயத் துடிப்பு, இரத்த அழுத்தம், லாக்டேட் ஆகியவற்றை கவனித்து சிகிச்சை அளிப்பது உயிரைக் காப்பாற்றும்.';
      } else {
        reply = 'SepsisSense செப்சிஸ் அபாய மதிப்பீட்டையும் மருத்துவ வழிகாட்டுதலையும் வழங்குகிறது. நோயாளியின் அளவுகளை உள்ளிட்டு "செப்சிஸ் அபாயத்தை மதிப்பிடுக" பொத்தானைக் கிளிக் செய்யவும்.';
      }
    } else if (language === 'hi') {
      // HINDI FALLBACKS
      if (lowerPrompt.includes('lactate') || lowerPrompt.includes('लैक्टेट')) {
        reply = 'सीरम लैक्टेट (Lactate) कोशिकाओं में ऑक्सीजन और रक्त प्रवाह की कमी का संकेत देता है। सेप्सिस में 2.0 mmol/L से अधिक मान ऊतकों में तनाव दर्शाता है, जबकि 4.0 mmol/L या अधिक होना सेप्टिक शॉक की आपात स्थिति है, जिसमें तत्काल आईवी फ्लूइड और गहन चिकित्सा की आवश्यकता होती है।';
      } else if (lowerPrompt.includes('qsofa') || lowerPrompt.includes('स्कोर')) {
        reply = 'क्विक सोफा (qSOFA) आपातकालीन जांच है: 1) तेज सांस (≥ 22/मिनट); 2) कम सिस्टोलिक रक्तचाप (≤ 100 mmHg); 3) मानसिक भ्रम या सुस्ती। 2 या अधिक अंक होने पर तत्काल सेप्सिस आपातकालीन मूल्यांकन आवश्यक है।';
      } else if (lowerPrompt.includes('bundle') || lowerPrompt.includes('treatment') || lowerPrompt.includes('उपचार') || lowerPrompt.includes('इलाज')) {
        reply = '1-घंटे का सेप्सिस बंडल: 1) ब्लड लैक्टेट मापें; 2) एंटीबायोटिक से पहले ब्लड कल्चर लें; 3) 1 घंटे के भीतर ब्रॉड-स्पेक्ट्रम आईवी एंटीबायोटिक्स शुरू करें; 4) कम रक्तचाप या लैक्टेट ≥ 4.0 पर 30 mL/kg सलाइन फ्लूइड दें; 5) आवश्यकतानुसार वासोप्रेसर दवाएं दें।';
      } else if (lowerPrompt.includes('sepsis') || lowerPrompt.includes('सेप्सिस')) {
        reply = 'सेप्सिस संक्रमण के प्रति शरीर की जानलेवा प्रतिक्रिया है, जिसमें रोग प्रतिरोधक प्रणाली अपने ही अंगों को नुकसान पहुंचाने लगती है। त्वरित पहचान और 1 घंटे के भीतर एंटीबायोटिक्स व आईवी फ्लूइड देना अत्यंत आवश्यक है।';
      } else {
        reply = 'SepsisSense सेप्सिस जोखिम मूल्यांकन और अंतरराष्ट्रीय दिशानिर्देशों के आधार पर नैदानिक मार्गदर्शन प्रदान करता है। मरीज के लक्षण दर्ज करें और विश्लेषण करें।';
      }
    } else if (language === 'te') {
      // TELUGU FALLBACKS
      if (lowerPrompt.includes('lactate') || lowerPrompt.includes('లాక్టేట్')) {
        reply = 'సీరమ్ లాక్టేట్ కణాలకు ఆక్సిజన్ మరియు రక్త ప్రసరణ కొరతను తెలుపుతుంది. సెప్సిస్‌లో లాక్టేట్ 2.0 mmol/L కంటే పెరిగితే అవయవాలకు ముప్పు అని అర్థం; 4.0 mmol/L లేదా అంతకంటే ఎక్కువ ఉంటే సెప్టిక్ షాక్ అని అర్థం, దీనికి తక్షణ సెలైన్ ద్రవాలు అవసరం.';
      } else if (lowerPrompt.includes('qsofa') || lowerPrompt.includes('స్కోరు')) {
        reply: 'Quick SOFA (qSOFA) 3 అంశాల పరీక్ష: 1) వేగవంతమైన శ్వాస (≥ 22/నిమిషం); 2) తక్కువ సిస్టోలిక్ రక్తపోటు (≤ 100 mmHg); 3) స్పృహ కోల్పోవడం. స్కోరు 2 లేదా ఎక్కువ ఉంటే అత్యవసర చికిత్స అవసరం.';
        reply = 'Quick SOFA (qSOFA) 3 అంశాల పరీక్ష: 1) వేగవంతమైన శ్వాస (≥ 22/నిమిషం); 2) తక్కువ సిస్టోలిక్ రక్తపోటు (≤ 100 mmHg); 3) స్పృహ కోల్పోవడం. స్కోరు 2 లేదా ఎక్కువ ఉంటే అత్యవసర చికిత్స అవసరం.';
      } else if (lowerPrompt.includes('bundle') || lowerPrompt.includes('treatment') || lowerPrompt.includes('చికిత్స')) {
        reply = '1-గంట సెప్సిస్ బండిల్: 1) రక్త లాక్టేట్ స్థాయిని కొలవండి; 2) బ్లడ్ కల్చర్ నమూనాలను సేకరించండి; 3) 1 గంటలోపు ఐవి యాంటీబయాటిక్స్ ప్రారంభించండి; 4) తక్కువ రక్తపోటుకు 30 mL/kg సెలైన్ ద్రవాన్ని వేగంగా ఎక్కించండి; 5) అవసరమైతే వాసోప్రెసర్ మందులు ఇవ్వండి.';
      } else {
        reply = 'సెప్సిస్ అనేది ఇన్ఫెక్షన్ వల్ల శరీర అవయవాలు దెబ్బతినే ప్రాణాంతక పరిస్థితి. SepsisSense రోగి విలువల ఆధారంగా సెప్సిస్ ప్రమాదాన్ని తక్షణమే లెక్కిస్తుంది.';
      }
    } else if (language === 'ml') {
      // MALAYALAM FALLBACKS
      if (lowerPrompt.includes('lactate') || lowerPrompt.includes('ലാക്റ്റേറ്റ്')) {
        reply = 'കോശങ്ങളിലേക്ക് രക്തയോട്ടവും ഓക്സിജനും കുറയുമ്പോഴാണ് സീറം ലാക്റ്റേറ്റ് വർദ്ധിക്കുന്നത്. സെപ്സിസിൽ ലാക്റ്റേറ്റ് 2.0 mmol/L-ൽ കൂടുതൽ വന്നാൽ അവയവങ്ങൾ സമ്മർദ്ദത്തിലാണ്; 4.0 mmol/L അല്ലെങ്കിൽ അതിൽ കൂടുതലായാൽ സെപ്റ്റിക് ഷോക്ക് എന്ന അടിയന്തര അവസ്ഥയാണ്, ഇതിന് ഉടൻ ഐവി ഫ്ലൂയിഡ് ആവശ്യമാണ്.';
      } else if (lowerPrompt.includes('qsofa') || lowerPrompt.includes('സ്കോർ')) {
        reply = 'Quick SOFA (qSOFA) 3 കാര്യങ്ങളുടെ പരിശോധനയാണ്: 1) വേഗത്തിലുള്ള ശ്വാസമെടുക്കൽ (≥ 22/മിനിറ്റ്); 2) കുറഞ്ഞ രക്തസമ്മർദ്ദം (≤ 100 mmHg); 3) ബോധക്കേട് അല്ലെങ്കിൽ ആശയക്കുഴപ്പം. ഇതിൽ 2 അല്ലെങ്കിൽ അതിൽ കൂടുതൽ സ്കോർ വന്നാൽ അടിയന്തര തീവ്രപരിചരണം ആവശ്യമാണ്.';
      } else if (lowerPrompt.includes('bundle') || lowerPrompt.includes('treatment') || lowerPrompt.includes('ചികിത്സ')) {
        reply = '1-മണിക്കൂർ സെപ്സിസ് ബണ്ടിൽ: 1) ലാക്റ്റേറ്റ് അളവ് പരിശോധിക്കുക; 2) ആന്റിബയോട്ടിക് നൽകുന്നതിന് മുമ്പ് ബ്ലഡ് കൾച്ചർ എടുക്കുക; 3) 1 മണിക്കൂറിനുള്ളിൽ ശക്തമായ ഐവി ആന്റിബയോട്ടിക്കുകൾ നൽകുക; 4) രക്തസമ്മർദ്ദം കുറവാണെങ്കിൽ 30 mL/kg സലൈൻ നൽകുക; 5) രക്തസമ്മർദ്ദം സാധാരണ നിലയിലാക്കാൻ വാസോപ്രസ്സർ മരുന്നുകൾ ഉപയോഗിക്കുക.';
      } else {
        reply = 'അണുബാധയോട് പ്രതിരോധ സംവിധാനം അമിതമായി പ്രതികരിച്ച് സ്വന്തം അവയവങ്ങളെ നശിപ്പിക്കുന്ന അവസ്ഥയാണ് സെപ്സിസ്. SepsisSense ലക്ഷണങ്ങൾ പരിശോധിച്ച് അപകടസാധ്യത കൃത്യമായി കണക്കാക്കുന്നു.';
      }
    } else {
      // ENGLISH FALLBACKS
      if (lowerPrompt.includes('lactate')) {
        reply = 'Serum lactate is a surrogate marker for cellular hypoperfusion and anaerobic metabolism. In sepsis, values > 2.0 mmol/L indicate metabolic distress, while values ≥ 4.0 mmol/L signal septic shock requiring immediate 30 mL/kg crystalloid fluid resuscitation.';
      } else if (lowerPrompt.includes('qsofa') || lowerPrompt.includes('score')) {
        reply = 'Quick SOFA (qSOFA) identifies adult patients with suspected infection at high risk of poor ICU outcomes. Criteria: 1) Respiratory rate ≥ 22 breaths/min; 2) Altered mentation (GCS < 15); 3) Systolic BP ≤ 100 mmHg. A score ≥ 2 triggers urgent emergency sepsis evaluation.';
      } else if (lowerPrompt.includes('bundle') || lowerPrompt.includes('treatment') || lowerPrompt.includes('action')) {
        reply = 'The Surviving Sepsis Campaign (SSC) 1-Hour Bundle recommends: 1) Measure blood lactate immediately; 2) Obtain blood cultures before starting antibiotics; 3) Administer broad-spectrum IV antimicrobials within 1 hour; 4) Rapidly administer 30 mL/kg crystalloid for hypotension (MAP < 65) or lactate ≥ 4.0; 5) Apply vasopressors if MAP < 65 persists.';
      } else if (lowerPrompt.includes('sepsis') || lowerPrompt.includes('what')) {
        reply = 'Sepsis is the body’s extreme, life-threatening response to an infection. It occurs when an infection triggers a chain reaction throughout the body, causing tissue damage and organ failure. Prompt recognition and rapid 1-hour intervention are vital.';
      } else {
        reply = 'SepsisSense provides real-time sepsis risk stratification and clinical guidance based on international consensus guidelines. Enter patient clinical values or upload laboratory charts to generate an assessment.';
      }
    }

    return res.json({ reply });
  } catch (err: any) {
    console.error('Error in /api/chat:', err);
    return res.status(500).json({ error: 'Failed to process clinical inquiry.' });
  }
});

// Mount Vite or serve static files
async function startServer() {
  const distDir = path.resolve(ROOT_DIR, 'dist');
  const isProd = process.env.NODE_ENV === 'production' || !process.env.npm_lifecycle_event?.includes('dev');

  if (fs.existsSync(distDir) && isProd) {
    console.log('Serving production static build from:', distDir);
    app.use(express.static(distDir));
    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api') || req.path === '/predict') return next();
      res.sendFile(path.resolve(distDir, 'index.html'));
    });
  } else {
    console.log('Mounting Vite dev server middleware from root:', ROOT_DIR);
    const vite = await createViteServer({
      root: ROOT_DIR,
      configFile: path.resolve(ROOT_DIR, 'vite.config.ts'),
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  }

  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n======================================================`);
    console.log(`?? SepsisSense server listening on http://0.0.0.0:${PORT}`);
    console.log(`?? Open in browser: http://localhost:${PORT}`);
    console.log(`======================================================\n`);
    
    // Auto-open default browser when server is ready
    if (process.platform === 'win32' && !process.env.NO_OPEN) {
      import('child_process').then(({ exec }) => {
        exec(`start http://localhost:${PORT}`);
      }).catch(() => {});
    }
  });

  server.on('error', (err: any) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`\n======================================================`);
      console.log(`??  Port ${PORT} is already running an active SepsisSense server!`);
      console.log(`?? Opening active website in your browser: http://localhost:${PORT}`);
      console.log(`======================================================\n`);
      if (process.platform === 'win32') {
        import('child_process').then(({ exec }) => {
          exec(`start http://localhost:${PORT}`);
        }).catch(() => {});
      }
    } else {
      console.error('Server error:', err);
    }
  });
}

startServer();
