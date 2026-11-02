import { SepsisPredictionResponse, LocalAdviceItem } from '../types';

export interface PatientEvaluationInput {
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
}

/**
 * Standard Clinical Sepsis Risk Evaluation Model
 * Reusable across frontend (instant offline / Vercel fallback) and backend API.
 */
export function evaluateSepsisRiskEngine(data: PatientEvaluationInput, startTimeMs: number = Date.now()): SepsisPredictionResponse {
  const contributing_factors: string[] = [];
  let riskScore = 0;
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

  // 4. Serum Lactate (Tissue hypoperfusion marker)
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

  // 6. Body Temperature
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

  // 7. SpO2
  if (spo2 !== null) {
    if (spo2 < 90) {
      riskScore += 16;
      contributing_factors.push(`Low blood oxygen: ${spo2}%.`);
    } else if (spo2 <= 93) {
      riskScore += 8;
      contributing_factors.push(`Borderline blood oxygen: ${spo2}%.`);
    }
  }

  // 8. WBC
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

  // 9. Shock Index
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

  // 10. Age factor
  if (age !== null && age >= 65) {
    riskScore += 4;
  }

  // Logistic probability
  const normalizedExponent = (riskScore - 42) / 16;
  const rawProb = 1 / (1 + Math.exp(-normalizedExponent));
  const probability = parseFloat(Math.min(0.98, Math.max(0.04, rawProb)).toFixed(2));

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

  let sepsis_type = 'Possible Condition: Stable — Low Warning';
  if (risk_level === 'High') {
    sepsis_type = 'Possible Condition: Serious Infection — Emergency Warning';
  } else if (risk_level === 'Moderate') {
    sepsis_type = 'Possible Condition: Developing Infection — Moderate Warning';
  } else {
    sepsis_type = 'Possible Condition: Stable — Low Warning';
  }

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

  const clinical_actions: string[] = [];
  if (risk_level === 'High') {
    clinical_actions.push("Check the patient's lactate level as soon as possible. Repeat the test when clinically indicated.");
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

