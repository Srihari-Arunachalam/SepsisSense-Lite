export interface FactorConfig {
  key: string;
  nameKey: string;
  doctorTermKey: string;
  unit: string;
  icon: string;
  normalRange: [number, number];
  displayRange: [number, number];
  direction: 'higher_bad' | 'lower_bad' | 'both_bad';
  greenZone: [number, number];
  yellowZones: [number, number][];
  redZones: [number, number][];
  maxRiskPoints: number;
}

export const FACTOR_CONFIGS: Record<string, FactorConfig> = {
  lactate: {
    key: 'lactate',
    nameKey: 'lactate',
    doctorTermKey: 'elevatedLactate',
    unit: 'mmol/L',
    icon: '🩸',
    normalRange: [0.5, 2.0],
    displayRange: [0, 8.0],
    direction: 'higher_bad',
    greenZone: [0, 2.0],
    yellowZones: [[2.0, 4.0]],
    redZones: [[4.0, 8.0]],
    maxRiskPoints: 32
  },
  heart_rate: {
    key: 'heart_rate',
    nameKey: 'heart_rate',
    doctorTermKey: 'tachycardia',
    unit: 'BPM',
    icon: '❤️',
    normalRange: [60, 100],
    displayRange: [40, 160],
    direction: 'both_bad',
    greenZone: [60, 90],
    yellowZones: [[90, 120], [50, 60]],
    redZones: [[120, 160], [40, 50]],
    maxRiskPoints: 24
  },
  respiratory_rate: {
    key: 'respiratory_rate',
    nameKey: 'respiratory_rate',
    doctorTermKey: 'tachypnea',
    unit: 'breaths/min',
    icon: '🫁',
    normalRange: [12, 20],
    displayRange: [8, 40],
    direction: 'both_bad',
    greenZone: [12, 20],
    yellowZones: [[20, 24]],
    redZones: [[24, 40], [8, 10]],
    maxRiskPoints: 25
  },
  systolic_bp: {
    key: 'systolic_bp',
    nameKey: 'systolic_bp',
    doctorTermKey: 'hypotension',
    unit: 'mmHg',
    icon: '📉',
    normalRange: [110, 125],
    displayRange: [60, 180],
    direction: 'lower_bad',
    greenZone: [100, 140],
    yellowZones: [[90, 100]],
    redZones: [[60, 90]],
    maxRiskPoints: 30
  },
  temperature: {
    key: 'temperature',
    nameKey: 'temperature',
    doctorTermKey: 'fever',
    unit: '°C',
    icon: '🌡️',
    normalRange: [36.5, 37.5],
    displayRange: [34.0, 41.5],
    direction: 'both_bad',
    greenZone: [36.5, 37.5],
    yellowZones: [[37.6, 38.3], [36.0, 36.4]],
    redZones: [[38.4, 41.5], [34.0, 35.9]],
    maxRiskPoints: 16
  },
  age: {
    key: 'age',
    nameKey: 'age',
    doctorTermKey: 'advancedAge',
    unit: 'yrs',
    icon: '👤',
    normalRange: [18, 64],
    displayRange: [0, 100],
    direction: 'higher_bad',
    greenZone: [0, 64],
    yellowZones: [[65, 74]],
    redZones: [[75, 100]],
    maxRiskPoints: 8
  },
  creatinine: {
    key: 'creatinine',
    nameKey: 'creatinine',
    doctorTermKey: 'elevatedCreatinine',
    unit: 'mg/dL',
    icon: '🧪',
    normalRange: [0.6, 1.2],
    displayRange: [0.4, 4.5],
    direction: 'higher_bad',
    greenZone: [0.6, 1.2],
    yellowZones: [[1.3, 1.9]],
    redZones: [[2.0, 4.5]],
    maxRiskPoints: 20
  },
  spo2: {
    key: 'spo2',
    nameKey: 'spo2',
    doctorTermKey: 'hypoxemia',
    unit: '%',
    icon: '💨',
    normalRange: [95, 100],
    displayRange: [75, 100],
    direction: 'lower_bad',
    greenZone: [95, 100],
    yellowZones: [[91, 94]],
    redZones: [[75, 90]],
    maxRiskPoints: 16
  },
  wbc: {
    key: 'wbc',
    nameKey: 'wbc',
    doctorTermKey: 'leukocytosis',
    unit: '×10³/µL',
    icon: '🔬',
    normalRange: [4.0, 11.0],
    displayRange: [1.0, 30.0],
    direction: 'both_bad',
    greenZone: [4.0, 11.0],
    yellowZones: [[11.1, 14.0]],
    redZones: [[14.1, 30.0], [1.0, 3.9]],
    maxRiskPoints: 14
  }
};

export interface EvaluatedFactor {
  key: string;
  config: FactorConfig;
  value: number;
  hasValue: boolean;
  status: 'normal' | 'abnormal' | 'critical';
  statusVariant: 'low' | 'high' | 'normal';
  riskPoints: number;
  shapDelta: number; // Positive = increases risk, Negative = decreases risk
  percentage: number; // 0 to 100 on slider
}

/**
 * Calculates risk status, risk points, SHAP-style delta, and range slider percentage
 */
export function evaluateFactor(key: string, rawVal: string | number | undefined | null): EvaluatedFactor | null {
  const config = FACTOR_CONFIGS[key];
  if (!config) return null;

  if (rawVal === undefined || rawVal === null || rawVal === '') {
    return null;
  }

  const val = typeof rawVal === 'number' ? rawVal : parseFloat(String(rawVal));
  if (isNaN(val)) return null;

  let status: 'normal' | 'abnormal' | 'critical' = 'normal';
  let statusVariant: 'low' | 'high' | 'normal' = 'normal';
  let riskPoints = 0;

  switch (key) {
    case 'lactate':
      if (val >= 4.0) {
        status = 'critical';
        statusVariant = 'high';
        riskPoints = 32;
      } else if (val >= 2.0) {
        status = 'abnormal';
        statusVariant = 'high';
        riskPoints = 14;
      } else {
        status = 'normal';
        statusVariant = 'normal';
        riskPoints = 0;
      }
      break;

    case 'heart_rate':
      if (val >= 125) {
        status = 'critical';
        statusVariant = 'high';
        riskPoints = 24;
      } else if (val >= 90) {
        status = 'abnormal';
        statusVariant = 'high';
        riskPoints = 10;
      } else if (val < 50) {
        status = 'critical';
        statusVariant = 'low';
        riskPoints = 12;
      } else if (val < 60) {
        status = 'abnormal';
        statusVariant = 'low';
        riskPoints = 5;
      } else {
        status = 'normal';
        statusVariant = 'normal';
        riskPoints = 0;
      }
      break;

    case 'respiratory_rate':
      if (val >= 26) {
        status = 'critical';
        statusVariant = 'high';
        riskPoints = 25;
      } else if (val >= 22) {
        status = 'abnormal';
        statusVariant = 'high';
        riskPoints = 15;
      } else if (val > 20) {
        status = 'abnormal';
        statusVariant = 'high';
        riskPoints = 8;
      } else if (val < 10) {
        status = 'critical';
        statusVariant = 'low';
        riskPoints = 18;
      } else {
        status = 'normal';
        statusVariant = 'normal';
        riskPoints = 0;
      }
      break;

    case 'systolic_bp':
      if (val < 90) {
        status = 'critical';
        statusVariant = 'low';
        riskPoints = 30;
      } else if (val <= 100) {
        status = 'abnormal';
        statusVariant = 'low';
        riskPoints = 15;
      } else if (val > 160) {
        status = 'abnormal';
        statusVariant = 'high';
        riskPoints = 6;
      } else {
        status = 'normal';
        statusVariant = 'normal';
        riskPoints = 0;
      }
      break;

    case 'temperature':
      if (val >= 39.0) {
        status = 'critical';
        statusVariant = 'high';
        riskPoints = 16;
      } else if (val > 38.0) {
        status = 'abnormal';
        statusVariant = 'high';
        riskPoints = 8;
      } else if (val < 36.0) {
        status = 'critical';
        statusVariant = 'low';
        riskPoints = 16;
      } else {
        status = 'normal';
        statusVariant = 'normal';
        riskPoints = 0;
      }
      break;

    case 'creatinine':
      if (val >= 2.0) {
        status = 'critical';
        statusVariant = 'high';
        riskPoints = 20;
      } else if (val >= 1.4) {
        status = 'abnormal';
        statusVariant = 'high';
        riskPoints = 10;
      } else {
        status = 'normal';
        statusVariant = 'normal';
        riskPoints = 0;
      }
      break;

    case 'age':
      if (val >= 75) {
        status = 'critical';
        statusVariant = 'high';
        riskPoints = 8;
      } else if (val >= 65) {
        status = 'abnormal';
        statusVariant = 'high';
        riskPoints = 5;
      } else {
        status = 'normal';
        statusVariant = 'normal';
        riskPoints = 0;
      }
      break;

    case 'spo2':
      if (val <= 90) {
        status = 'critical';
        statusVariant = 'low';
        riskPoints = 16;
      } else if (val <= 93) {
        status = 'abnormal';
        statusVariant = 'low';
        riskPoints = 8;
      } else {
        status = 'normal';
        statusVariant = 'normal';
        riskPoints = 0;
      }
      break;

    case 'wbc':
      if (val >= 15.0) {
        status = 'critical';
        statusVariant = 'high';
        riskPoints = 12;
      } else if (val > 12.0) {
        status = 'abnormal';
        statusVariant = 'high';
        riskPoints = 8;
      } else if (val < 4.0) {
        status = 'critical';
        statusVariant = 'low';
        riskPoints = 14;
      } else {
        status = 'normal';
        statusVariant = 'normal';
        riskPoints = 0;
      }
      break;
  }

  // Calculate percentage along display range [min, max]
  const [dMin, dMax] = config.displayRange;
  const clampedVal = Math.max(dMin, Math.min(dMax, val));
  const percentage = Math.round(((clampedVal - dMin) / (dMax - dMin)) * 100);

  // SHAP-style delta
  // If abnormal/critical: positive delta (increases risk)
  // If normal: negative delta (decreases risk / protective factor)
  let shapDelta = 0;
  if (status === 'critical') {
    shapDelta = Math.round((riskPoints / 32) * 28 + 8);
  } else if (status === 'abnormal') {
    shapDelta = Math.round((riskPoints / 32) * 18 + 4);
  } else {
    shapDelta = -Math.round(8 + (config.maxRiskPoints * 0.25));
  }

  return {
    key,
    config,
    value: val,
    hasValue: true,
    status,
    statusVariant,
    riskPoints,
    shapDelta,
    percentage
  };
}

