import { SupportedLanguage } from '../types';

export interface ExplainableFactorItem {
  name: string;
  doctorTerm: string;
  simpleNormal: string;
  simpleAbnormalHigh: string;
  simpleAbnormalLow?: string;
  tooltip: string;
}

export interface ExplainableTranslations {
  viewMode: {
    simple: string;
    doctor: string;
    simpleSubtitle: string;
    doctorSubtitle: string;
  };
  trafficLight: {
    highBadge: string;
    highTitle: string;
    highSentence: string;
    moderateBadge: string;
    moderateTitle: string;
    moderateSentence: string;
    lowBadge: string;
    lowTitle: string;
    lowSentence: string;
  };
  readAloud: {
    readButton: string;
    playing: string;
    paused: string;
    pause: string;
    resume: string;
    stop: string;
    voiceUnavailable: string;
    speakTextPrompt: string;
  };
  topReasons: {
    title: string;
    subtitle: string;
    viewAll: string;
    hideAll: string;
    normalStatus: string;
    warningStatus: string;
    dangerStatus: string;
    normalReference: string;
    patientValue: string;
    keyFactorsCount: string;
    visualMeterLabel: string;
    lowZone: string;
    normalZone: string;
    highZone: string;
    pointerPatient: string;
  };
  actionBox: {
    title: string;
    subtitle: string;
    highRiskBadge: string;
    moderateRiskBadge: string;
    lowRiskBadge: string;
    highRiskSteps: string[];
    moderateRiskSteps: string[];
    lowRiskSteps: string[];
    importantNotice: string;
  };
  doctorView: {
    title: string;
    subtitle: string;
    shapTitle: string;
    shapDesc: string;
    riskIncreases: string;
    riskDecreases: string;
    tableTitle: string;
    colParameter: string;
    colDoctorTerm: string;
    colPatientValue: string;
    colNormalRange: string;
    colStatus: string;
    colShapImpact: string;
    clinicalCriteriaTitle: string;
    qsofaTitle: string;
    sirsTitle: string;
    shockIndexTitle: string;
    bundleTitle: string;
  };
  factors: {
    lactate: ExplainableFactorItem;
    heart_rate: ExplainableFactorItem;
    respiratory_rate: ExplainableFactorItem;
    systolic_bp: ExplainableFactorItem;
    temperature: ExplainableFactorItem;
    age: ExplainableFactorItem;
    creatinine: ExplainableFactorItem;
    spo2: ExplainableFactorItem;
    wbc: ExplainableFactorItem;
  };
}

export const EXPLAINABLE_TRANSLATIONS: Record<SupportedLanguage, ExplainableTranslations> = {
  // ================= ENGLISH =================
  en: {
    viewMode: {
      simple: 'Simple View (Patient & Family)',
      doctor: 'Doctor View (Clinical & SHAP)',
      simpleSubtitle: 'Easy-to-understand explanations with visual meters',
      doctorSubtitle: 'Detailed clinical metrics, SHAP contributions & protocol'
    },
    trafficLight: {
      highBadge: 'HIGH RISK',
      highTitle: 'High Risk Alert (Immediate Medical Attention Required)',
      highSentence: 'This patient has a high chance of sepsis (serious blood infection). Immediate medical assessment by a doctor is urgently required.',
      moderateBadge: 'MODERATE RISK',
      moderateTitle: 'Moderate Risk Warning (Medical Evaluation Recommended)',
      moderateSentence: 'Warning signs of developing infection are present. A healthcare professional should evaluate the patient promptly.',
      lowBadge: 'LOW RISK',
      lowTitle: 'Low Risk (Patient Currently Stable)',
      lowSentence: 'The patient’s vital signs are currently within safe baseline limits. Continue routine care and seek medical help if symptoms worsen.'
    },
    readAloud: {
      readButton: 'Read Aloud (Voice Explanation)',
      playing: 'Speaking...',
      paused: 'Paused',
      pause: 'Pause',
      resume: 'Resume',
      stop: 'Stop Audio',
      voiceUnavailable: 'Speech synthesis voice is not available in your browser for this language.',
      speakTextPrompt: 'Sepsis risk assessment summary'
    },
    topReasons: {
      title: 'Top 3 Key Contributing Factors',
      subtitle: 'The primary parameters driving this risk evaluation',
      viewAll: 'View All Factors',
      hideAll: 'Show Top 3 Only',
      normalStatus: 'Normal (Within Safe Range)',
      warningStatus: 'Warning (Outside Normal Limits)',
      dangerStatus: 'Critical (Needs Attention)',
      normalReference: 'Normal Safe Range',
      patientValue: 'Patient Reading',
      keyFactorsCount: 'Showing key factors',
      visualMeterLabel: 'Normal vs Patient Visual Meter',
      lowZone: 'Low',
      normalZone: 'Normal Safe Zone',
      highZone: 'High Risk Zone',
      pointerPatient: 'Patient'
    },
    actionBox: {
      title: 'What Should I Do Next? (Action Steps)',
      subtitle: 'Clear emergency medical guidance based on current risk level',
      highRiskBadge: 'Immediate Emergency Action',
      moderateRiskBadge: 'Prompt Medical Attention',
      lowRiskBadge: 'Safe Monitoring Guidance',
      highRiskSteps: [
        'Seek immediate medical care at the nearest hospital or emergency room.',
        'Inform the healthcare professional: "I am concerned about possible sepsis."',
        'Ensure the patient remains hydrated if conscious; do not allow them to sleep off severe worsening symptoms.',
        'Follow instructions from trained medical professionals without delay.'
      ],
      moderateRiskSteps: [
        'Arrange a prompt medical checkup with a doctor or health clinic.',
        'Recheck temperature, breathing rate, and heart rate every 1 to 2 hours.',
        'Take prescribed antibiotics or medications exactly as directed by the doctor.',
        'Seek emergency medical care immediately if sudden high fever, rapid breathing, or confusion develops.'
      ],
      lowRiskSteps: [
        'Continue regular rest, routine recovery, and adequate hydration.',
        'Monitor for any emerging infection symptoms (fever, chills, persistent cough, or pain).',
        'Contact a doctor if new symptoms appear or the patient’s condition deteriorates.'
      ],
      importantNotice: 'Important: AI results provide early risk stratification, not a diagnosis. Sepsis treatments must always be administered by healthcare professionals in a clinic or hospital.'
    },
    doctorView: {
      title: 'Clinical & Explainable AI (Doctor View)',
      subtitle: 'Comprehensive mathematical feature attribution, qSOFA, SIRS & hemodynamic metrics',
      shapTitle: 'SHAP-Style Feature Contribution to Risk',
      shapDesc: 'Red bars indicate features elevating sepsis risk; green bars indicate protective or normalized physiological parameters.',
      riskIncreases: 'Increases Risk (+)',
      riskDecreases: 'Protective / Normal (-)',
      tableTitle: 'Physiological Parameters & Diagnostic Terminology',
      colParameter: 'Parameter',
      colDoctorTerm: 'Clinical Term',
      colPatientValue: 'Patient Value',
      colNormalRange: 'Reference Range',
      colStatus: 'Status',
      colShapImpact: 'Feature Impact',
      clinicalCriteriaTitle: 'Diagnostic Scores & Protocols',
      qsofaTitle: 'qSOFA Score (Quick Sepsis Organ Failure Assessment)',
      sirsTitle: 'SIRS Criteria (Systemic Inflammatory Response Syndrome)',
      shockIndexTitle: 'Shock Index (HR / Systolic BP)',
      bundleTitle: 'Surviving Sepsis 1-Hour Care Bundle Checklist'
    },
    factors: {
      lactate: {
        name: 'Blood Lactate Level',
        doctorTerm: 'Elevated Serum Lactate (Hyperlactatemia)',
        simpleNormal: 'Normal lactic acid level. Tissues are receiving adequate oxygen circulation.',
        simpleAbnormalHigh: 'High lactic acid in the blood. Cells and vital organs may not be receiving enough oxygen.',
        tooltip: 'Lactate is produced when cells lack oxygen due to poor blood circulation. High lactate (>2.0 mmol/L) is a critical warning sign in sepsis.'
      },
      heart_rate: {
        name: 'Heart Rate',
        doctorTerm: 'Tachycardia (Rapid Heartbeat)',
        simpleNormal: 'Normal resting heart rate (60–100 beats per minute).',
        simpleAbnormalHigh: 'Heart is beating significantly faster than normal to pump blood through compromised circulation.',
        simpleAbnormalLow: 'Heart rate is abnormally slow (Bradycardia), which can also indicate severe physiological stress.',
        tooltip: 'The heart beats faster (>90 bpm) when fighting severe infection to maintain blood pressure and oxygen delivery.'
      },
      respiratory_rate: {
        name: 'Breathing Rate',
        doctorTerm: 'Tachypnea (Rapid Respiratory Rate)',
        simpleNormal: 'Normal breathing rate (12–20 breaths per minute).',
        simpleAbnormalHigh: 'Patient is breathing rapidly, indicating the lungs and body are struggling for oxygen.',
        simpleAbnormalLow: 'Breathing rate is dangerously shallow or slow.',
        tooltip: 'Rapid breathing (≥22/min) is a key qSOFA bedside warning sign that the body is attempting to clear acid and draw oxygen.'
      },
      systolic_bp: {
        name: 'Systolic Blood Pressure',
        doctorTerm: 'Hypotension (Low Systolic Blood Pressure)',
        simpleNormal: 'Blood pressure is within a healthy range (100–140 mmHg).',
        simpleAbnormalLow: 'Blood pressure is low, meaning vital organs may not receive enough blood flow.',
        simpleAbnormalHigh: 'Blood pressure is elevated above standard baseline.',
        tooltip: 'In sepsis, blood vessels dilate and leak fluid, leading to hypotension (SBP ≤100 mmHg). This starves vital organs of blood flow.'
      },
      temperature: {
        name: 'Body Temperature',
        doctorTerm: 'Pyrexia (Fever) / Hypothermia',
        simpleNormal: 'Body temperature is in the healthy normal range (36.5–37.5°C).',
        simpleAbnormalHigh: 'High fever (>38.0°C), showing the immune system is actively fighting infection.',
        simpleAbnormalLow: 'Abnormally low body temperature (<36.0°C), which is a serious red flag in severe sepsis.',
        tooltip: 'Both high fever (>38°C) and low temperature (<36°C) are SIRS criteria. Very low temperature often signals severe decompensation.'
      },
      age: {
        name: 'Patient Age',
        doctorTerm: 'Advanced Age Vulnerability Factor',
        simpleNormal: 'Patient age carries standard baseline vulnerability.',
        simpleAbnormalHigh: 'Age over 65 carries higher vulnerability to organ failure during systemic infections.',
        tooltip: 'Adults aged 65 and older have a higher statistical risk of rapid sepsis progression and decreased physiological reserve.'
      },
      creatinine: {
        name: 'Serum Creatinine',
        doctorTerm: 'Acute Kidney Injury (AKI) / Impaired Clearance',
        simpleNormal: 'Normal kidney filtration function (0.6–1.2 mg/dL).',
        simpleAbnormalHigh: 'High creatinine indicates kidneys are under severe strain or struggling to filter waste.',
        tooltip: 'Creatinine measures renal function. A sudden rise reflects acute kidney injury caused by low kidney perfusion during sepsis.'
      },
      spo2: {
        name: 'Oxygen Saturation (SpO2)',
        doctorTerm: 'Hypoxemia (Low Blood Oxygen)',
        simpleNormal: 'Healthy blood oxygen level (95–100%).',
        simpleAbnormalLow: 'Blood oxygen is dangerously low, indicating lungs or circulation need urgent support.',
        tooltip: 'SpO2 measures the percentage of hemoglobin carrying oxygen. Levels below 92% require supplemental oxygen.'
      },
      wbc: {
        name: 'White Blood Cell Count',
        doctorTerm: 'Leukocytosis / Leukopenia',
        simpleNormal: 'Normal immune cell count (4.0–11.0 × 10³/µL).',
        simpleAbnormalHigh: 'High white blood cell count indicates an active immune response fighting infection.',
        simpleAbnormalLow: 'Critically low white blood cell count (<4.0) means the immune defense is overwhelmed.',
        tooltip: 'White blood cells are infection fighters. Both elevated (>12k) and abnormally depressed (<4k) counts trigger SIRS criteria.'
      }
    }
  },

  // ================= TAMIL (தமிழ்) =================
  ta: {
    viewMode: {
      simple: 'எளிய பார்வை (நோயாளி & குடும்பத்தினர்)',
      doctor: 'மருத்துவர் பார்வை (Clinical & SHAP)',
      simpleSubtitle: 'எளிதில் புரியும் விளக்கங்கள் மற்றும் வண்ண மீட்டர்',
      doctorSubtitle: 'முழுமையான மருத்துவ அளவீடுகள், SHAP காரணிப் பகுப்பாய்வு'
    },
    trafficLight: {
      highBadge: '🔴 மிக அதிக ஆபத்து (High Risk)',
      highTitle: 'ரொம்ப ஆபத்து (High Risk) — உடனடி மருத்துவ கவனிப்பு தேவை',
      highSentence: 'இந்த நோயாளிக்கு செப்சிஸ் (இரத்த விஷத்தன்மை) வர வாய்ப்பு மிக அதிகம். உடனே மருத்துவரை அணுகவும்.',
      moderateBadge: '🟡 எச்சரிக்கை / நடுத்தரம் (Moderate Risk)',
      moderateTitle: 'எச்சரிக்கை (Moderate Risk) — மருத்துவ பரிசோதனை தேவை',
      moderateSentence: 'செப்சிஸ் ஆரம்ப அறிகுறிகள் இருக்கலாம். மருத்துவரிடம் காட்டி உடனடி பரிசோதனை செய்யுங்கள்.',
      lowBadge: '🟢 பயப்பட தேவை இல்லை (Low Risk)',
      lowTitle: 'குறைந்த ஆபத்து (Low Risk) — தற்போதைய நிலை சீராக உள்ளது',
      lowSentence: 'தற்போதைய உடல்நிலை சீராக உள்ளது. ஆனால் புதிய அறிகுறிகள் அல்லது உடல்நிலை மோசமடைந்தால் மருத்துவரை அணுகவும்.'
    },
    readAloud: {
      readButton: '🔊 படிச்சுக் காட்டு (Read Aloud)',
      playing: 'ஒலிக்கிறது...',
      paused: 'நிறுத்தப்பட்டுள்ளது',
      pause: 'இடைநிறுத்து',
      resume: 'தொடரவும்',
      stop: 'நிறுத்து',
      voiceUnavailable: 'உங்கள் உலாவியில் தமிழ் குரல் ஒலிப்பான் கிடைக்கவில்லை.',
      speakTextPrompt: 'செப்சிஸ் அபாய மதிப்பீட்டு விளக்கம்'
    },
    topReasons: {
      title: 'முக்கியமான 3 காரணங்கள் (Top 3 Factors)',
      subtitle: 'இந்த நோயாளிக்கு செப்சிஸ் ஆபத்தை காட்டும் முதன்மை மருத்துவ காரணிகள்',
      viewAll: 'எல்லாம் பார்க்க (View All Factors)',
      hideAll: 'முக்கிய 3 மட்டும் பார்க்க',
      normalStatus: '✅ நார்மலாக இருக்கு (Normal)',
      warningStatus: '⚠️ எச்சரிக்கை நிலை (Warning)',
      dangerStatus: '🚨 ஆபத்தான நிலை (Critical)',
      normalReference: 'இயல்பான அளவு (Normal Range)',
      patientValue: 'நோயாளியின் அளவு',
      keyFactorsCount: 'முக்கிய காரணிகள்',
      visualMeterLabel: 'இயல்பான அளவு vs நோயாளியின் அளவு மீட்டர்',
      lowZone: 'குறைவு',
      normalZone: 'இயல்பான பகுதி (Normal)',
      highZone: 'ஆபத்தான பகுதி (High Risk)',
      pointerPatient: 'நோயாளி'
    },
    actionBox: {
      title: 'என்ன பண்ணனும்? (What Should I Do Next?)',
      subtitle: 'அபாய அளவைப் பொறுத்து நீங்கள் எடுக்க வேண்டிய உடனடி அவசர நடவடிக்கைகள்',
      highRiskBadge: '🚨 உடனடி அவசர சிகிச்சை தேவை',
      moderateRiskBadge: '⚠️ உடனடி மருத்துவ பரிசோதனை',
      lowRiskBadge: '✅ சீரான கண்காணிப்பு',
      highRiskSteps: [
        'உடனே மருத்துவமனைக்கு (Hospital) செல்லுங்கள்.',
        'மருத்துவரிடம் "செப்சிஸ் சந்தேகம் (Suspect Sepsis)" என்று உடனடியாகத் தெரிவியுங்கள்.',
        'நோயாளி விழிப்புடன் இருந்தால் தண்ணீர் குடிக்க வையுங்கள்; தூங்கிவிட அனுமதிக்காதீர்கள், உடனே மருத்துவரை அணுகுங்கள்.',
        'மருத்துவர்கள் மற்றும் செவிலியர்கள் கூறும் அவசர சிகிச்சை வழிமுறைகளைத் தாமதமின்றி பின்பற்றுங்கள்.'
      ],
      moderateRiskSteps: [
        'உடனடியாக அருகிலுள்ள மருத்துவரிடம் நோயாளியைக் காட்டி பரிசோதனை செய்யுங்கள்.',
        'ஒவ்வொரு 1 முதல் 2 மணி நேரத்திற்கும் வெப்பநிலை, இதயத் துடிப்பு மற்றும் சுவாசத்தை கவனியுங்கள்.',
        'மருத்துவர் பரிந்துரைத்த ஆன்டிபயாடிக் மருந்துகளை உரிய நேரத்தில் சரியாகக் கொடுங்கள்.',
        'திடீர் அதிக காய்ச்சல், மூச்சுத் திணறல் அல்லது நினைவுக் குழப்பம் ஏற்பட்டால் உடனடியாக அவசர சிகிச்சைப் பிரிவுக்குச் செல்லுங்கள்.'
      ],
      lowRiskSteps: [
        'போதுமான ஓய்வு, சத்தான உணவு மற்றும் நல்ல குடிநீர் கொடுத்து நோயாளியைப் பராமரியுங்கள்.',
        'காய்ச்சல், குளிர் நடுக்கம் அல்லது புதிய உடல் உபாதைகள் ஏற்படுகிறதா என கவனியுங்கள்.',
        'உடல்நிலையில் மாற்றம் அல்லது சோர்வு அதிகமானால் தாமதிக்காமல் மருத்துவரிடம் செல்லுங்கள்.'
      ],
      importantNotice: 'முக்கியக் குறிப்பு: AI கணிப்பு ஆரம்ப எச்சரிக்கையே தவிர இறுதியான நோயறிதல் அல்ல. சிகிச்சைகள் தகுதிவாய்ந்த மருத்துவரால் மட்டுமே மருத்துவமனையில் செய்யப்பட வேண்டும்.'
    },
    doctorView: {
      title: 'மருத்துவ & SHAP காரணிப் பகுப்பாய்வு (Doctor View)',
      subtitle: 'விரிவான மருத்துவ அளவீடுகள், SHAP காரணி தாக்கங்கள், qSOFA, SIRS மற்றும் சிகிச்சை நெறிமுறைகள்',
      shapTitle: 'SHAP காரணி தாக்க வரைபடம் (Feature Contribution)',
      shapDesc: 'சிவப்பு பட்டைகள் செப்சிஸ் அபாயத்தை அதிகரிக்கும் காரணிகளைக் காட்டுகின்றன; பச்சை பட்டைகள் இயல்பான அல்லது பாதுகாக்கும் காரணிகளைக் குறிக்கின்றன.',
      riskIncreases: 'அபாயத்தை அதிகரிக்கிறது (+)',
      riskDecreases: 'இயல்பான / பாதுகாப்பானது (-)',
      tableTitle: 'உடலியல் அளவீடுகள் & மருத்துவச் சொற்கள்',
      colParameter: 'அளவீடு',
      colDoctorTerm: 'மருத்துவச் சொல் (Clinical Term)',
      colPatientValue: 'நோயாளியின் மதிப்பு',
      colNormalRange: 'இயல்பான எல்லை',
      colStatus: 'நிலை',
      colShapImpact: 'தாக்கம் (SHAP)',
      clinicalCriteriaTitle: 'மருத்துவக் குறியீடுகள் மற்றும் நெறிமுறைகள்',
      qsofaTitle: 'qSOFA மதிப்பீடு (Quick Sepsis Organ Failure)',
      sirsTitle: 'SIRS அளவுகோல் (Systemic Inflammatory Response)',
      shockIndexTitle: 'ஷாக் இன்டெக்ஸ் (Heart Rate / Systolic BP)',
      bundleTitle: '1-மணி நேர செப்சிஸ் மருத்துவமனை அவசர நெறிமுறை'
    },
    factors: {
      lactate: {
        name: 'இரத்த லாக்டேட் (Serum Lactate)',
        doctorTerm: 'Elevated Serum Lactate (Hyperlactatemia)',
        simpleNormal: 'இரத்தத்தில் லாக்டேட் நார்மலாக இருக்கு. உடலின் செல்களுக்கு போதுமான இரத்த ஓட்டம் கிடைக்கிறது.',
        simpleAbnormalHigh: 'இரத்தத்தில் ஆசிட் (Lactate) அதிகம். உடம்பில் ஆக்ஸிஜன் சப்ளை அல்லது இரத்த ஓட்டம் குறைவாக இருக்கலாம்.',
        tooltip: 'செல்களுக்கு இரத்த ஓட்டமும் ஆக்சிஜனும் குறையும் போது லாக்டேட் உருவாகிறது. 2.0-க்கு மேல் இருந்தால் தீவிர எச்சரிக்கை.'
      },
      heart_rate: {
        name: 'இதயத் துடிப்பு (Heart Rate)',
        doctorTerm: 'Tachycardia (Rapid Heartbeat)',
        simpleNormal: 'இதயத் துடிப்பு நார்மலாக இருக்கு (60-100 bpm).',
        simpleAbnormalHigh: 'இதயம் ரொம்ப வேகமாக அடிக்குது (Tachycardia). உடலுக்கு இரத்தம் பாய்ச்ச இதயம் கடுமையாகப் போராடுகிறது.',
        simpleAbnormalLow: 'இதயத் துடிப்பு மிகக் குறைவாக உள்ளது (Bradycardia).',
        tooltip: 'தொற்றை எதிர்த்துப் போராடவும் இரத்த அழுத்தத்தை நிலைநிறுத்தவும் இதயம் நிமிடத்திற்கு 90-க்கு மேல் வேகமாகத் துடிக்கிறது.'
      },
      respiratory_rate: {
        name: 'சுவாச வேகம் (Respiratory Rate)',
        doctorTerm: 'Tachypnea (Rapid Breathing)',
        simpleNormal: 'சுவாச வேகம் நார்மலாக இருக்கு (12-20 breaths/min).',
        simpleAbnormalHigh: 'மூச்சு வேகமாக வாங்குது (Tachypnea). உடலுக்கு ஆக்சிஜன் பற்றாக்குறை ஏற்பட்டுள்ளது.',
        simpleAbnormalLow: 'சுவாச வேகம் ஆபத்தான அளவுக்கு குறைவாக உள்ளது.',
        tooltip: 'நிமிடத்திற்கு 22 அல்லது அதற்கு மேல் வேகமாக மூச்சு வாங்குவது qSOFA எச்சரிக்கை அறிகுறியாகும்.'
      },
      systolic_bp: {
        name: 'இரத்த அழுத்தம் (Systolic BP)',
        doctorTerm: 'Hypotension (Low Blood Pressure)',
        simpleNormal: 'இரத்த அழுத்தம் நார்மலாக இருக்கு (100-140 mmHg).',
        simpleAbnormalLow: 'இரத்த அழுத்தம் குறைவாக இருக்கு (Hypotension). முக்கிய உறுப்புகளுக்கு இரத்த ஓட்டம் குறைகிறது.',
        simpleAbnormalHigh: 'இரத்த அழுத்தம் இயல்பை விட அதிகமாக உள்ளது.',
        tooltip: 'செப்சிஸில் இரத்தக் குழாய்கள் விரிவடைந்து இரத்த அழுத்தம் 100-க்குக் கீழ் குறைகிறது. இதனால் உறுப்புகள் செயலிழக்கும் ஆபத்து ஏற்படுகிறது.'
      },
      temperature: {
        name: 'உடல் வெப்பநிலை (Temperature)',
        doctorTerm: 'Pyrexia (Fever) / Hypothermia',
        simpleNormal: 'உடல் வெப்பநிலை நார்மலாக இருக்கு (36.5–37.5°C).',
        simpleAbnormalHigh: 'காய்ச்சல் அதிகம் (Fever > 38.0°C). உடல் தீவிர தொற்றை எதிர்க்கிறது.',
        simpleAbnormalLow: 'உடல் வெப்பநிலை ஆபத்தான அளவு குளிர்ந்துவிட்டது (<36.0°C - Hypothermia). இது செப்சிஸின் தீவிர அறிகுறி.',
        tooltip: 'அதிகக் காய்ச்சல் (>38°C) அல்லது தீவிரக் குளிர்ச்சி (<36°C) இரண்டுமே SIRS அளவுகோலில் தீவிர தொற்று அறிகுறிகள்.'
      },
      age: {
        name: 'நோயாளியின் வயது (Age)',
        doctorTerm: 'Advanced Age Risk Factor',
        simpleNormal: 'வயது சார்ந்த ஆபத்து இயல்பான அளவிலேயே உள்ளது.',
        simpleAbnormalHigh: 'வயது அதிகம் (65-க்கு மேல்). முதியவர்களுக்கு தொற்று பரவும் போது உறுப்புப் பாதிப்பு விரைவாக ஏற்படலாம்.',
        tooltip: '65 வயதுக்கு மேற்பட்டவர்களுக்கு உடல் உறுப்புகளின் தாங்குதிறன் குறைவாக இருப்பதால் செப்சிஸ் தீவிரமாகும் ஆபத்து அதிகம்.'
      },
      creatinine: {
        name: 'கிரியேட்டினின் (Creatinine)',
        doctorTerm: 'Acute Kidney Injury (AKI)',
        simpleNormal: 'சிறுநீரகச் செயல்பாடு நார்மலாக இருக்கு (0.6–1.2 mg/dL).',
        simpleAbnormalHigh: 'சிறுநீரகம் (Kidney) வேலை செய்வதில் சிரமம். இரத்தத்தில் கழிவுகள் வெளியேறுவது குறைந்துள்ளது.',
        tooltip: 'கிரியேட்டினின் அதிகரிப்பது குறைந்த இரத்த ஓட்டத்தால் சிறுநீரகம் பாதிக்கப்படுவதைக் குறிக்கும்.'
      },
      spo2: {
        name: 'ஆக்சிஜன் அளவு (SpO2)',
        doctorTerm: 'Hypoxemia',
        simpleNormal: 'இரத்தத்தில் ஆக்சிஜன் அளவு நார்மலாக இருக்கு (95-100%).',
        simpleAbnormalLow: 'ஆக்சிஜன் அளவு குறைவாக உள்ளது (SpO2 ≤ 92%). உடனடியாக ஆக்சிஜன் உதவி தேவை.',
        tooltip: 'இரத்தத்தில் ஆக்சிஜன் அளவு 92%-க்கு கீழ் குறைவது நுரையீரல் அல்லது தீவிர சுவாசப் பாதிப்பைக் காட்டுகிறது.'
      },
      wbc: {
        name: 'வெள்ளை அணுக்கள் (WBC)',
        doctorTerm: 'Leukocytosis',
        simpleNormal: 'நோய் எதிர்ப்பு அணுக்கள் நார்மலாக இருக்கு (4.0-11.0).',
        simpleAbnormalHigh: 'வெள்ளை அணுக்கள் அதிகம். உடல் ஒரு தீவிர தொற்றுடன் போராடுகிறது.',
        simpleAbnormalLow: 'வெள்ளை அணுக்கள் ஆபத்தான அளவுக்கு குறைந்துவிட்டது.',
        tooltip: 'வெள்ளை அணுக்கள் அதிகரிப்பது அல்லது மிகக் குறைவது தொற்றின் தீவிர வெளிப்பாடாகும்.'
      }
    }
  },

  // ================= HINDI (हिन्दी) =================
  hi: {
    viewMode: {
      simple: 'सरल दृश्य (मरीज और परिवार)',
      doctor: 'डॉक्टर दृश्य (Clinical & SHAP)',
      simpleSubtitle: 'आसान भाषा में कारण और विज़ुअल मीटर',
      doctorSubtitle: 'विस्तृत नैदानिक मान, SHAP ग्राफ और प्रोटोकॉल'
    },
    trafficLight: {
      highBadge: '🔴 उच्च जोखिम (High Risk)',
      highTitle: 'अत्यधिक गंभीर जोखिम (High Risk) — तुरंत अस्पताल ले जाएं',
      highSentence: 'इस मरीज में सेप्सिस (रक्त में गंभीर संक्रमण) का अत्यधिक जोखिम है। बिना देर किए तुरंत डॉक्टर को दिखाएं।',
      moderateBadge: '🟡 मध्यम जोखिम (Moderate Risk)',
      moderateTitle: 'मध्यम जोखिम (Moderate Risk) — चिकित्सीय जांच आवश्यक',
      moderateSentence: 'संक्रमण के चेतावनी संकेत मौजूद हैं। जल्द से जल्द योग्य डॉक्टर से जांच कराएं।',
      lowBadge: '🟢 कम जोखिम (Low Risk)',
      lowTitle: 'कम जोखिम (Low Risk) — शारीरिक स्थिति स्थिर',
      lowSentence: 'वर्तमान में सभी महत्वपूर्ण शारीरिक संकेत सामान्य हैं। नियमित देखभाल जारी रखें और लक्षण बिगड़ने पर डॉक्टर से मिलें।'
    },
    readAloud: {
      readButton: '🔊 पढ़कर सुनाएं (Read Aloud)',
      playing: 'बोला जा रहा है...',
      paused: 'ठहरा हुआ',
      pause: 'रोकें',
      resume: 'जारी रखें',
      stop: 'बंद करें',
      voiceUnavailable: 'आपके ब्राउज़र में हिन्दी आवाज़ उपलब्ध नहीं है।',
      speakTextPrompt: 'सेप्सिस जोखिम मूल्यांकन विवरण'
    },
    topReasons: {
      title: 'शीर्ष 3 मुख्य कारण (Top 3 Reasons)',
      subtitle: 'इस मरीज के जोखिम को निर्धारित करने वाले प्रमुख शारीरिक कारक',
      viewAll: 'सभी कारक देखें (View All Factors)',
      hideAll: 'केवल शीर्ष 3 देखें',
      normalStatus: '✅ सामान्य है (Normal)',
      warningStatus: '⚠️ चेतावनी संकेत (Warning)',
      dangerStatus: '🚨 गंभीर असामान्यता (Critical)',
      normalReference: 'सामान्य सुरक्षित सीमा',
      patientValue: 'मरीज का मान',
      keyFactorsCount: 'प्रमुख कारक',
      visualMeterLabel: 'सामान्य सीमा बनाम मरीज का विज़ुअल मीटर',
      lowZone: 'कम',
      normalZone: 'सामान्य क्षेत्र (Safe)',
      highZone: 'जोखिम क्षेत्र (Danger)',
      pointerPatient: 'मरीज'
    },
    actionBox: {
      title: 'अब मुझे क्या करना चाहिए? (Action Steps)',
      subtitle: 'जोखिम स्तर के आधार पर तुरंत उठाए जाने वाले आपातकालीन कदम',
      highRiskBadge: '🚨 तत्काल आपातकालीन कार्रवाई',
      moderateRiskBadge: '⚠️ त्वरित चिकित्सीय जांच',
      lowRiskBadge: '✅ सुरक्षित निगरानी',
      highRiskSteps: [
        'बिना किसी देरी के तुरंत नजदीकी अस्पताल के आपातकालीन विभाग में जाएं।',
        'डॉक्टर को तुरंत बताएं: "मुझे मरीज में सेप्सिस (Sepsis) का संदेह है।"',
        'यदि मरीज होश में है तो पानी पिलाते रहें; गंभीर लक्षणों को नजरअंदाज करके सोने न दें।',
        'चिकित्सकों और नर्सिंग स्टाफ के निर्देशों का तुरंत पालन करें।'
      ],
      moderateRiskSteps: [
        'निकटतम क्लिनिक या डॉक्टर से तुरंत परामर्श लें।',
        'हर 1 से 2 घंटे में तापमान, नब्ज और सांस लेने की गति की जांच करें।',
        'डॉक्टर द्वारा दी गई एंटीबायोटिक दवाओं का समय पर पूरा कोर्स लें।',
        'अचानक तेज बुखार, सांस फूलना या भ्रम की स्थिति होने पर तुरंत इमरजेंसी में जाएं।'
      ],
      lowRiskSteps: [
        'मरीज को पर्याप्त आराम, पौष्टिक आहार और साफ पानी दें।',
        'नया बुखार, कंपकंपी या खांसी जैसे लक्षणों पर नजर रखें।',
        'यदि मरीज की तबीयत में कोई गिरावट आए तो तुरंत डॉक्टर से संपर्क करें।'
      ],
      importantNotice: 'महत्वपूर्ण सूचना: AI परिणाम केवल प्राथमिक संकेत हैं, कोई अंतिम नैदानिक पुष्टि नहीं। उपचार केवल प्रशिक्षित स्वास्थ्य पेशेवरों द्वारा ही किया जाना चाहिए।'
    },
    doctorView: {
      title: 'नैदानिक एवं SHAP कारक विश्लेषण (Doctor View)',
      subtitle: 'विस्तृत नैदानिक पैरामीटर, SHAP प्रभाव, qSOFA, SIRS और 1-घंटे का उपचार प्रोटोकॉल',
      shapTitle: 'SHAP फीचर योगदान ग्राफ (Feature Attribution)',
      shapDesc: 'लाल पट्टियां सेप्सिस जोखिम बढ़ाने वाले कारकों को दर्शाती हैं; हरी पट्टियां सामान्य या सुरक्षात्मक शारीरिक मापदंडों को इंगित करती हैं।',
      riskIncreases: 'जोखिम बढ़ाता है (+)',
      riskDecreases: 'सामान्य / सुरक्षात्मक (-)',
      tableTitle: 'शारीरिक मापदंड एवं नैदानिक शब्दावली',
      colParameter: 'मापदंड',
      colDoctorTerm: 'नैदानिक शब्द (Clinical Term)',
      colPatientValue: 'मरीज का मान',
      colNormalRange: 'संदर्भ सीमा',
      colStatus: 'स्थिति',
      colShapImpact: 'प्रभाव (SHAP)',
      clinicalCriteriaTitle: 'नैदानिक स्कोर और प्रोटोकॉल',
      qsofaTitle: 'qSOFA स्कोर (Quick Sepsis Organ Failure)',
      sirsTitle: 'SIRS मानदंड (Systemic Inflammatory Response)',
      shockIndexTitle: 'शॉक इंडेक्स (Heart Rate / Systolic BP)',
      bundleTitle: '1-घंटे का सर्वाइविंग सेप्सिस अस्पताल प्रोटोकॉल'
    },
    factors: {
      lactate: {
        name: 'रक्त लैक्टेट स्तर (Serum Lactate)',
        doctorTerm: 'Elevated Serum Lactate (Hyperlactatemia)',
        simpleNormal: 'लैक्टेट सामान्य है। शरीर की कोशिकाओं तक रक्त और ऑक्सीजन ठीक से पहुंच रहा है।',
        simpleAbnormalHigh: 'खून में एसिड (लैक्टेट) की मात्रा अधिक है। कोशिकाओं को पर्याप्त ऑक्सीजन नहीं मिल पा रही है।',
        tooltip: 'कोशिकाओं में ऑक्सीजन की कमी होने पर लैक्टेट बढ़ता है। 2.0 से अधिक स्तर सेप्सिस का मुख्य चेतावनी संकेत है।'
      },
      heart_rate: {
        name: 'हृदय गति (Heart Rate)',
        doctorTerm: 'Tachycardia (Rapid Heartbeat)',
        simpleNormal: 'हृदय गति सामान्य है (60–100 धड़कन/मिनट)।',
        simpleAbnormalHigh: 'दिल सामान्य से बहुत तेजी से धड़क रहा है (Tachycardia)। शरीर दबाव में है।',
        simpleAbnormalLow: 'हृदय गति असामान्य रूप से धीमी है (Bradycardia)।',
        tooltip: 'संक्रमण से लड़ते समय और गिरते रक्तचाप को बनाए रखने के लिए दिल 90 से अधिक गति से धड़कने लगता है।'
      },
      respiratory_rate: {
        name: 'सांस लेने की गति (Respiratory Rate)',
        doctorTerm: 'Tachypnea (Rapid Breathing)',
        simpleNormal: 'सांस की गति सामान्य है (12–20 सांसें/मिनट)।',
        simpleAbnormalHigh: 'मरीज तेजी से सांस ले रहा है (Tachypnea)। फेफड़ों को ऑक्सीजन खींचने में जोर पड़ रहा है।',
        simpleAbnormalLow: 'सांस की गति खतरनाक रूप से धीमी है।',
        tooltip: 'प्रति मिनट 22 या उससे अधिक सांसें qSOFA के अनुसार गंभीर सेप्सिस का संकेत हैं।'
      },
      systolic_bp: {
        name: 'रक्तचाप (Systolic Blood Pressure)',
        doctorTerm: 'Hypotension (Low Blood Pressure)',
        simpleNormal: 'रक्तचाप सामान्य सीमा में है (100–140 mmHg)।',
        simpleAbnormalLow: 'रक्तचाप कम है (Hypotension)। मुख्य अंगों तक रक्त संचार धीमा हो सकता है।',
        simpleAbnormalHigh: 'रक्तचाप सामान्य से अधिक है।',
        tooltip: 'सेप्सिस में नसें फैल जाती हैं और बीपी 100 से नीचे गिर जाता है, जिससे अंग विफलता का खतरा होता है।'
      },
      temperature: {
        name: 'शारीरिक तापमान (Temperature)',
        doctorTerm: 'Pyrexia (Fever) / Hypothermia',
        simpleNormal: 'शरीर का तापमान सामान्य है (36.5–37.5°C)।',
        simpleAbnormalHigh: 'तेज बुखार है (>38.0°C)। शरीर गंभीर संक्रमण से लड़ रहा है।',
        simpleAbnormalLow: 'शरीर असामान्य रूप से ठंडा पड़ गया है (<36.0°C)। यह सेप्सिस का खतरनाक लक्षण है।',
        tooltip: 'तेज बुखार (>38°C) और अत्यधिक ठंड (<36°C) दोनों ही SIRS में गंभीर संक्रमण के लक्षण हैं।'
      },
      age: {
        name: 'मरीज की आयु (Age)',
        doctorTerm: 'Advanced Age Risk Factor',
        simpleNormal: 'आयु सामान्य जोखिम सीमा में है।',
        simpleAbnormalHigh: 'उम्र 65 वर्ष से अधिक है। वृद्धजनों में संक्रमण फैलने पर अंगों पर असर तेजी से होता है।',
        tooltip: '65 वर्ष से अधिक आयु सेप्सिस के गंभीर होने का एक स्वतंत्र जोखिम कारक है।'
      },
      creatinine: {
        name: 'सीरम क्रिएटिनिन (Creatinine)',
        doctorTerm: 'Acute Kidney Injury (AKI)',
        simpleNormal: 'गुर्दे (किडनी) का कार्य सामान्य है (0.6–1.2 mg/dL)।',
        simpleAbnormalHigh: 'गुर्दों के काम करने में कठिनाई हो रही है। खून में अपशिष्ट तत्व बढ़ रहे हैं।',
        tooltip: 'क्रिएटिनिन का बढ़ना इस बात का संकेत है कि कम रक्त संचार के कारण किडनी प्रभावित हो रही है।'
      },
      spo2: {
        name: 'ऑक्सीजन संतृप्ति (SpO2)',
        doctorTerm: 'Hypoxemia',
        simpleNormal: 'रक्त में ऑक्सीजन सामान्य है (95–100%)।',
        simpleAbnormalLow: 'खून में ऑक्सीजन कम है (≤92%)। तुरंत ऑक्सीजन सहायता की आवश्यकता है।',
        tooltip: '92% से कम ऑक्सीजन स्तर फेफड़ों या रक्त संचार में गंभीर बाधा का संकेत देता है।'
      },
      wbc: {
        name: 'श्वेत रक्त कणिकाएं (WBC)',
        doctorTerm: 'Leukocytosis',
        simpleNormal: 'रोग प्रतिरोधक कोशिकाएं सामान्य हैं (4.0–11.0)।',
        simpleAbnormalHigh: 'सफेद रक्त कोशिकाएं बहुत अधिक हैं। शरीर संक्रमण से जूझ रहा है।',
        simpleAbnormalLow: 'सफेद रक्त कोशिकाएं खतरनाक रूप से कम हैं।',
        tooltip: 'WBC का 12 से ऊपर या 4 से नीचे होना SIRS संक्रमण प्रतिक्रिया को दर्शाता है।'
      }
    }
  },

  // ================= TELUGU (తెలుగు) =================
  te: {
    viewMode: {
      simple: 'సులభమైన వీక్షణ (రోగి & కుటుంబం)',
      doctor: 'వైద్యుల వీక్షణ (Clinical & SHAP)',
      simpleSubtitle: 'సులభంగా అర్థమయ్యే వివరణలు మరియు విజువల్ మీటర్',
      doctorSubtitle: 'పూర్తి క్లినికల్ గణాంకాలు, SHAP గ్రాఫ్ & ప్రోటోకాల్'
    },
    trafficLight: {
      highBadge: '🔴 అధిక ప్రమాదం (High Risk)',
      highTitle: 'తీవ్ర ప్రమాదం (High Risk) — తక్షణ వైద్య సహాయం అవసరం',
      highSentence: 'ఈ రోగికి సెప్సిస్ (రక్తంలో తీవ్ర ఇన్ఫెక్షన్) వచ్చే అవకాశం చాలా ఎక్కువ. ఆలస్యం చేయకుండా వెంటనే డాక్టర్‌ను సంప్రదించండి.',
      moderateBadge: '🟡 మధ్యస్థ ప్రమాదం (Moderate Risk)',
      moderateTitle: 'హెచ్చరిక (Moderate Risk) — వైద్య పరీక్ష అవసరం',
      moderateSentence: 'ఇన్ఫెక్షన్ హెచ్చరిక సంకేతాలు ఉన్నాయి. వెంటనే వైద్యుడి వద్దకు తీసుకెళ్లి పరీక్ష చేయించండి.',
      lowBadge: '🟢 తక్కువ ప్రమాదం (Low Risk)',
      lowTitle: 'తక్కువ ప్రమాదం (Low Risk) — ప్రస్తుత పరిస్థితి నిలకడగా ఉంది',
      lowSentence: 'ప్రస్తుతానికి శరీర కొలతలు సాధారణంగా ఉన్నాయి. సంరక్షణ కొనసాగించండి, లక్షణాలు పెరిగితే డాక్టర్‌ను కలవండి.'
    },
    readAloud: {
      readButton: '🔊 చదివి వినిపించు (Read Aloud)',
      playing: 'వినిపిస్తోంది...',
      paused: 'ఆపబడింది',
      pause: 'పాజ్',
      resume: 'కొనసాగించు',
      stop: 'ఆపు',
      voiceUnavailable: 'మీ బ్రౌజర్‌లో తెలుగు వాయిస్ అందుబాటులో లేదు.',
      speakTextPrompt: 'సెప్సిస్ రిస్క్ అసెస్‌మెంట్ వివరణ'
    },
    topReasons: {
      title: 'ముఖ్యమైన 3 కారణాలు (Top 3 Reasons)',
      subtitle: 'ఈ రోగి రిస్క్‌ను ప్రభావితం చేస్తున్న ప్రధాన శరీర సంకేతాలు',
      viewAll: 'అన్నీ చూడండి (View All Factors)',
      hideAll: 'ముఖ్యమైన 3 మాత్రమే చూడండి',
      normalStatus: '✅ సాధారణంగా ఉంది (Normal)',
      warningStatus: '⚠️ హెచ్చరిక (Warning)',
      dangerStatus: '🚨 ప్రమాదకరం (Critical)',
      normalReference: 'సాధారణ పరిమితి (Normal Range)',
      patientValue: 'రోగి కొలత',
      keyFactorsCount: 'ప్రధాన కారణాలు',
      visualMeterLabel: 'సాధారణం vs రోగి విజువల్ మీటర్',
      lowZone: 'తక్కువ',
      normalZone: 'సాధారణ ప్రాంతం (Safe)',
      highZone: 'ప్రమాద ప్రాంతం (Danger)',
      pointerPatient: 'రోగి'
    },
    actionBox: {
      title: 'ఇప్పుడు ఏం చేయాలి? (Action Steps)',
      subtitle: 'రిస్క్ స్థాయి ఆధారంగా వెంటనే తీసుకోవలసిన అత్యవసర చర్యలు',
      highRiskBadge: '🚨 తక్షణ అత్యవసర చర్య',
      moderateRiskBadge: '⚠️ త్వరిత వైద్య పరీక్ష',
      lowRiskBadge: '✅ సురక్షిత పర్యవేక్షణ',
      highRiskSteps: [
        'వెంటనే రోగిని సమీపంలోని ఆసుపత్రి ఎమర్జెన్సీ వార్డుకు తీసుకెళ్లండి.',
        'వైద్యుడికి స్పష్టంగా చెప్పండి: "నాకు సెప్సిస్ (Sepsis) అనుమానం ఉంది."',
        'రోగి స్పృహలో ఉంటే తగినంత నీరు తాగించండి; తీవ్రమైన నీరసాన్ని అలసటగా భావించి నిద్రపోనివ్వకండి.',
        'వైద్యులు మరియు సిబ్బంది సూచించే అత్యవసర చికిత్సలను వెంటనే ప్రారంభించండి.'
      ],
      moderateRiskSteps: [
        'వెంటనే అర్హత కలిగిన వైద్యుడి వద్దకు వెళ్లి పరీక్ష చేయించండి.',
        'ప్రతి 1 నుండి 2 గంటలకు శరీర ఉష్ణోగ్రత, పల్స్, శ్వాస వేగాన్ని గమనించండి.',
        'డాక్టర్ సూచించిన యాంటీబయాటిక్స్ మందులను సరైన సమయానికి వాడండి.',
        'అకస్మాత్తుగా తీవ్ర జ్వరం, శ్వాస ఆడకపోవడం లేదా గందరగోళం ఏర్పడితే వెంటనే ఎమర్జెన్సీకి వెళ్లండి.'
      ],
      lowRiskSteps: [
        'మంచి విశ్రాంతి, బలవర్థకమైన ఆహారం మరియు తగినంత మంచినీరు అందించండి.',
        'కొత్తగా జ్వరం, వణుకు లేదా శ్వాసలో ఇబ్బంది రాకుండా చూసుకోండి.',
        'ఆరోగ్యంలో ఏదైనా మార్పు కనిపిస్తే ఆలస్యం చేయకుండా వైద్యుడిని సంప్రదించండి.'
      ],
      importantNotice: 'ముఖ్య గమనిక: AI ఫలితాలు ముందస్తు అంచనాలు మాత్రమే, ఖచ్చితమైన నిర్ధారణ కాదు. చికిత్సలు ఎల్లప్పుడూ ఆసుపత్రిలోనే వైద్యుల సమక్షంలో జరగాలి.'
    },
    doctorView: {
      title: 'క్లినికల్ & SHAP విశ్లేషణ (Doctor View)',
      subtitle: 'పూర్తి క్లినికల్ పారామితులు, SHAP ఫీచర్ ప్రభావాలు, qSOFA, SIRS మరియు 1-గంట హాస్పిటల్ ప్రోటోకాల్',
      shapTitle: 'SHAP ఫీచర్ ప్రభావ గ్రాఫ్ (Feature Contribution)',
      shapDesc: 'ఎరుపు రంగు బార్‌లు సెప్సిస్ ప్రమాదాన్ని పెంచే కారకాలను చూపుతాయి; ఆకుపచ్చ రంగు బార్‌లు సాధారణ లేదా రక్షణాత్మక కారకాలను సూచిస్తాయి.',
      riskIncreases: 'ప్రమాదాన్ని పెంచుతుంది (+)',
      riskDecreases: 'సాధారణం / రక్షణాత్మకం (-)',
      tableTitle: 'శరీర కొలతలు & క్లినికల్ పదజాలం',
      colParameter: 'పారామితి',
      colDoctorTerm: 'క్లినికల్ పదం (Doctor Term)',
      colPatientValue: 'రోగి విలువ',
      colNormalRange: 'రిఫరెన్స్ పరిధి',
      colStatus: 'స్థితి',
      colShapImpact: 'ప్రభావం (SHAP)',
      clinicalCriteriaTitle: 'డయాగ్నస్టిక్ స్కోర్లు & ప్రోటోకాల్స్',
      qsofaTitle: 'qSOFA స్కోరు (Quick Sepsis Organ Failure)',
      sirsTitle: 'SIRS ప్రమాణాలు (Systemic Inflammatory Response)',
      shockIndexTitle: 'షాక్ ఇండెక్స్ (Heart Rate / Systolic BP)',
      bundleTitle: '1-గంట సర్వైవింగ్ సెప్సిస్ కేర్ బండిల్'
    },
    factors: {
      lactate: {
        name: 'బ్లడ్ లాక్టేట్ స్థాయి (Serum Lactate)',
        doctorTerm: 'Elevated Serum Lactate (Hyperlactatemia)',
        simpleNormal: 'లాక్టేట్ సాధారణంగా ఉంది. కణాలకు రక్త ప్రసరణ మరియు ఆక్సిజన్ సరిగ్గా అందుతోంది.',
        simpleAbnormalHigh: 'రక్తంలో యాసిడ్ (లాక్టేట్) ఎక్కువగా ఉంది. కణాలకు ఆక్సిజన్ అందడం లేదని సూచిస్తుంది.',
        tooltip: 'కణాలకు ఆక్సిజన్ అందనప్పుడు లాక్టేట్ పెరుగుతుంది. 2.0 దాటితే సెప్సిస్ తీవ్ర హెచ్చరిక.'
      },
      heart_rate: {
        name: 'గుండె వేగం (Heart Rate)',
        doctorTerm: 'Tachycardia (Rapid Heartbeat)',
        simpleNormal: 'గుండె వేగం సాధారణంగా ఉంది (60–100 bpm).',
        simpleAbnormalHigh: 'గుండె చాలా వేగంగా కొట్టుకుంటోంది (Tachycardia). శరీరం తీవ్ర ఒత్తిడిలో ఉంది.',
        simpleAbnormalLow: 'గుండె వేగం చాలా తక్కువగా ఉంది (Bradycardia).',
        tooltip: 'రక్తపోటును నిలబెట్టడానికి గుండె నిమిషానికి 90 కంటే ఎక్కువ వేగంతో కొట్టుకుంటుంది.'
      },
      respiratory_rate: {
        name: 'శ్వాస వేగం (Respiratory Rate)',
        doctorTerm: 'Tachypnea (Rapid Breathing)',
        simpleNormal: 'శ్వాస వేగం సాధారణంగా ఉంది (12–20 breaths/min).',
        simpleAbnormalHigh: 'శ్వాస చాలా వేగంగా తీసుకుంటున్నారు (Tachypnea). ఆక్సిజన్ కొరత ఏర్పడుతోంది.',
        simpleAbnormalLow: 'శ్వాస వేగం ప్రమాదకరంగా తక్కువగా ఉంది.',
        tooltip: 'నిమిషానికి 22 లేదా అంతకంటే ఎక్కువ శ్వాసలు qSOFA ప్రకారం తీవ్ర ప్రమాద సంకేతం.'
      },
      systolic_bp: {
        name: 'రక్తపోటు (Systolic BP)',
        doctorTerm: 'Hypotension (Low Blood Pressure)',
        simpleNormal: 'రక్తపోటు సాధారణ పరిధిలో ఉంది (100–140 mmHg).',
        simpleAbnormalLow: 'రక్తపోటు తక్కువగా ఉంది (Hypotension). ప్రధాన అవయవాలకు రక్త ప్రసరణ తగ్గుతోంది.',
        simpleAbnormalHigh: 'రక్తపోటు సాధారణం కంటే ఎక్కువగా ఉంది.',
        tooltip: 'సెప్సిస్‌లో రక్తనాళాలు వ్యాకోచించి బీపీ 100 కంటే తగ్గుతుంది. ఇది అవయవ వైఫల్యానికి దారితీయవచ్చు.'
      },
      temperature: {
        name: 'శరీర ఉష్ణోగ్రత (Temperature)',
        doctorTerm: 'Pyrexia (Fever) / Hypothermia',
        simpleNormal: 'శరీర ఉష్ణోగ్రత సాధారణంగా ఉంది (36.5–37.5°C).',
        simpleAbnormalHigh: 'తీవ్ర జ్వరం ఉంది (>38.0°C). శరీరం ఇన్ఫెక్షన్‌తో పోరాడుతోంది.',
        simpleAbnormalLow: 'శరీరం ప్రమాదకరంగా చల్లబడింది (<36.0°C - Hypothermia). ఇది సెప్సిస్ తీవ్ర లక్షణం.',
        tooltip: 'తీవ్ర జ్వరం (>38°C) లేదా విపరీతమైన చలి (<36°C) రెండూ SIRS ప్రమాణాల ప్రకారం తీవ్రమైనవి.'
      },
      age: {
        name: 'రోగి వయస్సు (Age)',
        doctorTerm: 'Advanced Age Risk Factor',
        simpleNormal: 'వయస్సు సాధారణ రిస్క్ పరిధిలో ఉంది.',
        simpleAbnormalHigh: 'వయస్సు 65 సంవత్సరాల పైబడింది. వృద్ధులలో ఇన్ఫెక్షన్ వేగంగా అవయవాలపై ప్రభావం చూపుతుంది.',
        tooltip: '65 ఏళ్లు పైబడిన వారిలో రోగనిరోధక శక్తి తక్కువగా ఉండటం వల్ల సెప్సిస్ త్వరగా తీవ్రమవుతుంది.'
      },
      creatinine: {
        name: 'సీరమ్ క్రియాటినిన్ (Creatinine)',
        doctorTerm: 'Acute Kidney Injury (AKI)',
        simpleNormal: 'మూత్రపిండాల పనితీరు సాధారణంగా ఉంది (0.6–1.2 mg/dL).',
        simpleAbnormalHigh: 'మూత్రపిండాలు (కిడ్నీలు) పని చేయడంలో ఇబ్బంది పడుతున్నాయి. వ్యర్థాలు రక్తం నుండి తొలగిపోవడం లేదు.',
        tooltip: 'రక్త ప్రసరణ తగ్గడం వల్ల మూత్రపిండాలు దెబ్బతింటున్నాయని క్రియాటినిన్ పెరుగుదల సూచిస్తుంది.'
      },
      spo2: {
        name: 'ఆక్సిజన్ శాతం (SpO2)',
        doctorTerm: 'Hypoxemia',
        simpleNormal: 'రక్తంలో ఆక్సిజన్ సాధారణంగా ఉంది (95–100%).',
        simpleAbnormalLow: 'రక్తంలో ఆక్సిజన్ తక్కువగా ఉంది (≤92%). వెంటనే ఆక్సిజన్ మద్దతు అవసరం.',
        tooltip: 'ఆక్సిజన్ శాతం 92% కంటే తగ్గడం ఊపిరితిత్తులు లేదా రక్తప్రసరణ తీవ్రంగా దెబ్బతిన్నట్లు సూచిస్తుంది.'
      },
      wbc: {
        name: 'తెల్ల రక్త కణాలు (WBC)',
        doctorTerm: 'Leukocytosis',
        simpleNormal: 'తెల్ల రక్త కణాలు సాధారణంగా ఉన్నాయి (4.0–11.0).',
        simpleAbnormalHigh: 'తెల్ల రక్త కణాలు చాలా ఎక్కువగా ఉన్నాయి. శరీరం తీవ్ర ఇన్ఫెక్షన్‌తో పోరాడుతోంది.',
        simpleAbnormalLow: 'తెల్ల రక్త కణాలు ప్రమాదకరంగా తగ్గిపోయాయి.',
        tooltip: 'WBC 12 వేల కంటే పెరగడం లేదా 4 వేల కంటే తగ్గడం ఇన్ఫెక్షన్ తీవ్రతను సూచిస్తుంది.'
      }
    }
  },

  // ================= MALAYALAM (മലയാളം) =================
  ml: {
    viewMode: {
      simple: 'ലളിതമായ കാഴ്ച (രോഗിക്കും കുടുംബത്തിനും)',
      doctor: 'ഡോക്ടറുടെ കാഴ്ച (Clinical & SHAP)',
      simpleSubtitle: 'എളുപ്പത്തിൽ മനസ്സിലാക്കാവുന്ന കാരണങ്ങളും വിഷ്വൽ മീറ്ററും',
      doctorSubtitle: 'വിശദമായ ക്ലിനിക്കൽ അളവുകൾ, SHAP ചാർട്ട് & പ്രോട്ടോക്കോൾ'
    },
    trafficLight: {
      highBadge: '🔴 ഉയർന്ന അപകടസാധ്യത (High Risk)',
      highTitle: 'ഗുരുതരമായ അപകടസാധ്യത (High Risk) — ഉടൻ ആശുപത്രിയിൽ എത്തിക്കുക',
      highSentence: 'ഈ രോഗിക്ക് സെപ്സിസ് (രക്തത്തിലെ ഗുരുതരമായ അണുബാധ) ഉണ്ടാകാനുള്ള സാധ്യത വളരെ കൂടുതലാണ്. ഉടൻ തന്നെ ഡോക്ടറുടെ സഹായം തേടുക.',
      moderateBadge: '🟡 മിതമായ അപകടസാധ്യത (Moderate Risk)',
      moderateTitle: 'മുന്നറിയിപ്പ് (Moderate Risk) — വൈദ്യപരിശോധന ആവശ്യമാണ്',
      moderateSentence: 'അണുബാധയുടെ മുന്നറിയിപ്പ് ലക്ഷണങ്ങൾ കാണപ്പെടുന്നുണ്ട്. ഉടൻ തന്നെ ഡോക്ടറെ കണ്ട് പരിശോധിക്കുക.',
      lowBadge: '🟢 കുറഞ്ഞ അപകടസാധ്യത (Low Risk)',
      lowTitle: 'കുറഞ്ഞ അപകടസാധ്യത (Low Risk) — നില സുരക്ഷിതമാണ്',
      lowSentence: 'നിലവിൽ രോഗിയുടെ പ്രധാന ശരീര ലക്ഷണങ്ങൾ സാധാരണ നിലയിലാണ്. പരിചരണം തുടരുക, ലക്ഷണങ്ങൾ മോശമായാൽ ഡോക്ടറെ കാണുക.'
    },
    readAloud: {
      readButton: '🔊 വായിച്ചു കേൾപ്പിക്കുക (Read Aloud)',
      playing: 'വായിക്കുന്നു...',
      paused: 'നിർത്തിവെച്ചു',
      pause: 'താൽക്കാലികമായി നിർത്തുക',
      resume: 'തുടരുക',
      stop: 'നിർത്തുക',
      voiceUnavailable: 'നിങ്ങളുടെ ബ്രൗസറിൽ മലയാളം ശബ്ദം ലഭ്യമല്ല.',
      speakTextPrompt: 'സെപ്സിസ് അപകടസാധ്യത വിശകലന വിവരണം'
    },
    topReasons: {
      title: 'പ്രധാനപ്പെട്ട 3 കാരണങ്ങൾ (Top 3 Reasons)',
      subtitle: 'ഈ രോഗിയുടെ അപകടസാധ്യത നിർണ്ണയിക്കുന്ന പ്രധാന കാരണങ്ങൾ',
      viewAll: 'എല്ലാം കാണുക (View All Factors)',
      hideAll: 'പ്രധാനപ്പെട്ട 3 എണ്ണം മാത്രം കാണുക',
      normalStatus: '✅ സാധാരണ നിലയിലാണ് (Normal)',
      warningStatus: '⚠️ മുന്നറിയിപ്പ് (Warning)',
      dangerStatus: '🚨 ഗുരുതരമായ മാറ്റം (Critical)',
      normalReference: 'സാധാരണ സുരക്ഷിത പരിധി',
      patientValue: 'രോഗിയുടെ അളവ്',
      keyFactorsCount: 'പ്രധാന ഘടകങ്ങൾ',
      visualMeterLabel: 'സാധാരണ പരിധി vs രോഗിയുടെ അളവ് മീറ്റർ',
      lowZone: 'കുറവ്',
      normalZone: 'സാധാരണ സുരക്ഷിത മേഖല (Safe)',
      highZone: 'അപകട മേഖല (Danger)',
      pointerPatient: 'രോഗി'
    },
    actionBox: {
      title: 'ഇനി എന്ത് ചെയ്യണം? (Action Steps)',
      subtitle: 'അപകടസാധ്യത അനുസരിച്ച് ഉടനടി സ്വീകരിക്കേണ്ട അടിയന്തര നടപടികൾ',
      highRiskBadge: '🚨 അടിയന്തര ചികിത്സ ആവശ്യമാണ്',
      moderateRiskBadge: '⚠️ വേഗത്തിലുള്ള വൈദ്യപരിശോധന',
      lowRiskBadge: '✅ സുരക്ഷിത നിരീക്ഷണം',
      highRiskSteps: [
        'കാലതാമസം വരുത്താതെ രോഗിയെ ഉടൻ തന്നെ അടുത്തുള്ള ആശുപത്രി എമർജൻസിയിൽ എത്തിക്കുക.',
        'ഡോക്ടറോട് നേരിട്ട് പറയുക: "സെപ്സിസ് (Sepsis) ഉണ്ടെന്ന് സംശയമുണ്ട്."',
        'രോഗി ബോധവാന്മാരാണെങ്കിൽ ആവശ്യത്തിന് വെള്ളം നൽകുക; അതീവ ക്ഷീണത്തെ ഉറക്കമായി കണ്ട് ഉറങ്ങാൻ വിടരുത്.',
        'ഡോക്ടർമാരുടെയും നഴ്സിംഗ് ജീവനക്കാരുടെയും നിർദ്ദേശങ്ങൾ ഉടനടി പാലിക്കുക.'
      ],
      moderateRiskSteps: [
        'ഉടൻ തന്നെ യോഗ്യതയുള്ള ഒരു ഡോക്ടറെ സമീപിച്ച് പരിശോധന നടത്തുക.',
        'ഓരോ 1-2 മണിക്കൂറിലും ശരീര താപനില, പൾസ്, ശ്വാസോച്ഛ്വാസം എന്നിവ പരിശോധിക്കുക.',
        'ഡോക്ടർ നിർദ്ദേശിച്ച ആന്റിബയോട്ടിക്കുകൾ കൃത്യസമയത്ത് കഴിക്കുക.',
        'പെട്ടെന്ന് കഠിനമായ പനിയോ, ശ്വാസതടസ്സമോ, ബോധക്കേടോ ഉണ്ടായാൽ ഉടൻ എമർജൻസിയിലേക്ക് കൊണ്ടുപോകുക.'
      ],
      lowRiskSteps: [
        'രോഗിക്ക് നല്ല വിശ്രമവും പോഷകാഹാരവും ശുദ്ധജലവും ഉറപ്പാക്കുക.',
        'പനി, വിറയൽ, ചുമ തുടങ്ങിയ പുതിയ അണുബാധ ലക്ഷണങ്ങൾ വരുന്നുണ്ടോ എന്ന് നിരീക്ഷിക്കുക.',
        'രോഗിയുടെ അവസ്ഥയിൽ എന്തെങ്കിലും വ്യത്യാസം കണ്ടാൽ ഉടൻ ഡോക്ടറെ സമീപിക്കുക.'
      ],
      importantNotice: 'പ്രധാന അറിയിപ്പ്: AI ഫലങ്ങൾ ഒരു പ്രാഥമിക സൂചന മാത്രമാണ്, അന്തിമ രോഗനിർണ്ണയമല്ല. ചികിത്സകൾ എപ്പോഴും ആശുപത്രിയിൽ യോഗ്യതയുള്ള ഡോക്ടർമാരുടെ മേൽനോട്ടത്തിൽ മാത്രമേ നടത്താവൂ.'
    },
    doctorView: {
      title: 'ക്ലിനിക്കൽ & SHAP ഘടക വിശകലനം (Doctor View)',
      subtitle: 'പൂർണ്ണമായ ക്ലിനിക്കൽ അളവുകൾ, SHAP ഘടക സ്വാധീനങ്ങൾ, qSOFA, SIRS, 1-മണിക്കൂർ കെയർ ബണ്ടിൽ',
      shapTitle: 'SHAP ഫീച്ചർ കോൺട്രിബ്യൂഷൻ ഗ്രാഫ് (Feature Attribution)',
      shapDesc: 'ചുവന്ന ബാറുകൾ സെപ്സിസ് സാധ്യത വർദ്ധിപ്പിക്കുന്ന ഘടകങ്ങളെ കാണിക്കുന്നു; പച്ച ബാറുകൾ സാധാരണ അല്ലെങ്കിൽ സംരക്ഷിത ഘടകങ്ങളെ സൂചിപ്പിക്കുന്നു.',
      riskIncreases: 'സാധ്യത കൂട്ടുന്നു (+)',
      riskDecreases: 'സാധാരണ / സംരക്ഷിതം (-)',
      tableTitle: 'ശരീര അളവുകളും ക്ലിനിക്കൽ പദാവലിയും',
      colParameter: 'പാരാമീറ്റർ',
      colDoctorTerm: 'ക്ലിനിക്കൽ പദം (Clinical Term)',
      colPatientValue: 'രോഗിയുടെ അളവ്',
      colNormalRange: 'റഫറൻസ് പരിധി',
      colStatus: 'നില',
      colShapImpact: 'സ്വാധീനം (SHAP)',
      clinicalCriteriaTitle: 'ഡയഗ്നോസ്റ്റിക് സ്കോറുകളും പ്രോട്ടോക്കോളും',
      qsofaTitle: 'qSOFA സ്കോർ (Quick Sepsis Organ Failure)',
      sirsTitle: 'SIRS മാനദണ്ഡങ്ങൾ (Systemic Inflammatory Response)',
      shockIndexTitle: 'ഷോക്ക് ഇൻഡക്സ് (Heart Rate / Systolic BP)',
      bundleTitle: '1-മണിക്കൂർ സർവൈവിംഗ് സെപ്സിസ് കെയർ ബണ്ടിൽ'
    },
    factors: {
      lactate: {
        name: 'ബ്ലഡ് ലാക്റ്റേറ്റ് നില (Serum Lactate)',
        doctorTerm: 'Elevated Serum Lactate (Hyperlactatemia)',
        simpleNormal: 'ലാക്റ്റേറ്റ് സാധാരണ നിലയിലാണ്. കോശങ്ങൾക്ക് ആവശ്യത്തിന് രക്തവും ഓക്സിജനും ലഭിക്കുന്നുണ്ട്.',
        simpleAbnormalHigh: 'രക്തത്തിൽ ലാക്റ്റേറ്റ് ആസിഡിന്റെ അളവ് കൂടുതലാണ്. കോശങ്ങളിലേക്ക് ഓക്സിജൻ എത്തുന്നില്ലെന്ന് സൂചിപ്പിക്കുന്നു.',
        tooltip: 'ഓക്സിജൻ കുറയുമ്പോഴാണ് ലാക്റ്റേറ്റ് ഉണ്ടാകുന്നത്. 2.0-ൽ കൂടുതൽ വരുന്നത് സെപ്സിസിന്റെ പ്രധാന ലക്ഷണമാണ്.'
      },
      heart_rate: {
        name: 'ഹൃദയമിടിപ്പ് നിരക്ക് (Heart Rate)',
        doctorTerm: 'Tachycardia (Rapid Heartbeat)',
        simpleNormal: 'ഹൃദയമിടിപ്പ് സാധാരണ നിലയിലാണ് (60–100 bpm).',
        simpleAbnormalHigh: 'ഹൃദയം വളരെ വേഗത്തിൽ മിടിക്കുന്നു (Tachycardia). ശരീരം കടുത്ത സമ്മർദ്ദത്തിലാണ്.',
        simpleAbnormalLow: 'ഹൃദയമിടിപ്പ് വളരെ കുറവാണ് (Bradycardia).',
        tooltip: 'രക്തസമ്മർദ്ദം നിലനിർത്താൻ ശരീരം പോരാടുമ്പോൾ ഹൃദയം മിനിറ്റിൽ 90-ൽ കൂടുതൽ വേഗത്തിൽ മിടിക്കുന്നു.'
      },
      respiratory_rate: {
        name: 'ശ്വാസോച്ഛ്വാസ നിരക്ക് (Respiratory Rate)',
        doctorTerm: 'Tachypnea (Rapid Breathing)',
        simpleNormal: 'ശ്വാസോച്ഛ്വാസം സാധാരണ നിലയിലാണ് (12–20 breaths/min).',
        simpleAbnormalHigh: 'ശ്വാസമെടുക്കാൻ പ്രയാസപ്പെടുകയും വേഗത്തിൽ ശ്വാസമെടുക്കുകയും ചെയ്യുന്നു (Tachypnea).',
        simpleAbnormalLow: 'ശ്വാസോച്ഛ്വാസ നിരക്ക് അപകടകരമായ വിധം കുറവാണ്.',
        tooltip: 'മിനിറ്റിൽ 22-ൽ കൂടുതൽ വേഗത്തിൽ ശ്വാസമെടുക്കുന്നത് qSOFA പ്രകാരം അതീവ ജാഗ്രതാ ലക്ഷണമാണ്.'
      },
      systolic_bp: {
        name: 'രക്തസമ്മർദ്ദം (Systolic Blood Pressure)',
        doctorTerm: 'Hypotension (Low Blood Pressure)',
        simpleNormal: 'രക്തസമ്മർദ്ദം സാധാരണ സുരക്ഷിത നിലയിലാണ് (100–140 mmHg).',
        simpleAbnormalLow: 'രക്തസമ്മർദ്ദം കുറവാണ് (Hypotension). ആന്തരിക അവയവങ്ങളിലേക്കുള്ള രക്തയോട്ടം കുറയാം.',
        simpleAbnormalHigh: 'രക്തസമ്മർദ്ദം സാധാരണയിലും കൂടുതലാണ്.',
        tooltip: 'സെപ്സിസിൽ രക്തക്കുഴലുകൾ വികസിക്കുകയും ബിപി 100-ൽ താഴെ പോവുകയും ചെയ്യുന്നു. ഇത് അവയവങ്ങളെ ബാധിക്കാം.'
      },
      temperature: {
        name: 'ശരീര താപനില (Temperature)',
        doctorTerm: 'Pyrexia (Fever) / Hypothermia',
        simpleNormal: 'ശരീര താപനില സാധാരണ നിലയിലാണ് (36.5–37.5°C).',
        simpleAbnormalHigh: 'കഠിനമായ പനിയുണ്ട് (>38.0°C). ശരീരം ശക്തമായ അണുബാധയോട് പൊരുതുന്നു.',
        simpleAbnormalLow: 'ശരീരം അപകടകരമായ വിധം തണുത്തുറഞ്ഞു (<36.0°C - Hypothermia). ഇത് സെപ്സിസിന്റെ ലക്ഷണമാണ്.',
        tooltip: 'കഠിനമായ പനിയോ (>38°C) ശരീരം അമിതമായി തണുക്കലോ (<36°C) SIRS മാനദണ്ഡത്തിൽ അണുബാധ ലക്ഷണമാണ്.'
      },
      age: {
        name: 'രോഗിയുടെ പ്രായം (Age)',
        doctorTerm: 'Advanced Age Risk Factor',
        simpleNormal: 'പ്രായം അടിസ്ഥാന അപകടസാധ്യത പരിധിയിലാണ്.',
        simpleAbnormalHigh: 'പ്രായം 65 വയസ്സിന് മുകളിലാണ്. മുതിർന്നവരിൽ അണുബാധ വേഗത്തിൽ അവയവങ്ങളെ ബാധിക്കാം.',
        tooltip: '65 വയസ്സിന് മുകളിലുള്ളവരിൽ രോഗപ്രതിരോധ ശേഷി കുറവായതിനാൽ സെപ്സിസ് വേഗത്തിൽ വഷളാകാം.'
      },
      creatinine: {
        name: 'സീറം ക്രിയാറ്റിനിൻ (Creatinine)',
        doctorTerm: 'Acute Kidney Injury (AKI)',
        simpleNormal: 'വൃക്കകളുടെ പ്രവർത്തനം സാധാരണ നിലയിലാണ് (0.6–1.2 mg/dL).',
        simpleAbnormalHigh: 'വൃക്കകളുടെ പ്രവർത്തനത്തിൽ ബുദ്ധിമുട്ടുണ്ട്. രക്തത്തിലെ മാലിന്യങ്ങൾ പുറന്തള്ളാൻ കഴിയുന്നില്ല.',
        tooltip: 'രക്തയോട്ടം കുറയുന്നത് മൂലം വൃക്കകൾക്ക് തകരാർ സംഭവിക്കുന്നതിനെയാണ് ക്രിയാറ്റിനിൻ വർദ്ധനവ് കാണിക്കുന്നത്.'
      },
      spo2: {
        name: 'ഓക്സിജൻ നില (SpO2)',
        doctorTerm: 'Hypoxemia',
        simpleNormal: 'രക്തത്തിലെ ഓക്സിജൻ സാധാരണ നിലയിലാണ് (95–100%).',
        simpleAbnormalLow: 'രക്തത്തിൽ ഓക്സിജൻ കുറവാണ് (≤92%). ഉടൻ ഓക്സിജൻ സഹായം ആവശ്യമാണ്.',
        tooltip: 'ഓക്സിജൻ 92%-ൽ താഴെ പോകുന്നത് ശ്വാസകോശ തകരാറിന്റെയും രക്തയോട്ടക്കുറവിന്റെയും സൂചനയാണ്.'
      },
      wbc: {
        name: 'ശ്വേതരക്താണുക്കൾ (WBC)',
        doctorTerm: 'Leukocytosis',
        simpleNormal: 'രോഗപ്രതിരോധ കോശങ്ങൾ സാധാരണ നിലയിലാണ് (4.0–11.0).',
        simpleAbnormalHigh: 'ശ്വേതരക്താണുക്കളുടെ എണ്ണം വളരെ കൂടുതലാണ്. ശരീരം അണുബാധയോട് പൊരുതുന്നു.',
        simpleAbnormalLow: 'ശ്വേതരക്താണുക്കൾ അപകടകരമായി കുറഞ്ഞുപോയിട്ടുണ്ട്.',
        tooltip: 'WBC 12-ൽ കൂടുതൽ കൂടുന്നതും 4-ൽ താഴെ പോകുന്നതും SIRS അണുബാധ പ്രതികരണത്തെ കാണിക്കുന്നു.'
      }
    }
  }
};

