import { SupportedLanguage } from '../types';
import { ExplainableTranslations } from './explainableTranslations';

export interface Translations {
  explainable?: ExplainableTranslations;
  header: {
    brandSubtitle: string;
    sampleCases: string;
    highRisk: string;
    moderateRisk: string;
    lowRisk: string;
    uploadRecords: string;
    selectLanguage: string;
  };
  hero: {
    title: string;
    subtitle: string;
    tagEarly: string;
    tagExplainable: string;
    tagOutcomes: string;
  };
  form: {
    patientInfo: string;
    vitalSigns: string;
    labMarkers: string;
    age: string;
    agePlaceholder: string;
    bloodGroup: string;
    bloodGroupSelect: string;
    temp: string;
    tempPlaceholder: string;
    heartRate: string;
    heartRatePlaceholder: string;
    respRate: string;
    respRatePlaceholder: string;
    systolicBp: string;
    systolicBpPlaceholder: string;
    diastolicBp: string;
    diastolicBpPlaceholder: string;
    lactate: string;
    lactatePlaceholder: string;
    creatinine: string;
    creatininePlaceholder: string;
    spo2: string;
    spo2Placeholder: string;
    wbc: string;
    wbcPlaceholder: string;
    requiredComplete: string;
    analyzeBtn: string;
    analyzingBtn: string;
    resetBtn: string;
    tooltips: {
      age: string;
      temperature: string;
      heart_rate: string;
      respiratory_rate: string;
      systolic_bp: string;
      lactate: string;
      creatinine: string;
    };
  };
  results: {
    assessmentTitle: string;
    highRiskBadge: string;
    moderateRiskBadge: string;
    lowRiskBadge: string;
    highTitle: string;
    moderateTitle: string;
    lowTitle: string;
    modelRiskElevated: string;
    modelRiskModerate: string;
    modelRiskLow: string;
    disclaimer: string;
    sepsisStage: string;
    suspectedSource: string;
    modelProb: string;
    modelProbDesc: string;
    qsofaScore: string;
    qsofaHighDesc: string;
    qsofaLowDesc: string;
    sirsScore: string;
    sirsHighDesc: string;
    sirsLowDesc: string;
    shockIndex: string;
    shockElevatedDesc: string;
    shockNormalDesc: string;
    localAdviceTitle: string;
    localAdviceSubtitle: string;
    contributingFactorsTitle: string;
    hospitalBundleTitle: string;
    analysisTime: string;
    printReport: string;
  };
  medicalGuide: {
    title: string;
    subtitle: string;
    toggleOpen: string;
    toggleClose: string;
    topics: {
      sepsis: { title: string; desc: string };
      lactate: { title: string; desc: string };
      qsofa: { title: string; desc: string };
      shockIndex: { title: string; desc: string };
      vitals: { title: string; desc: string };
      bundle: { title: string; desc: string };
    };
  };
  chat: {
    placeholder: string;
    disclaimer: string;
    responseTitle: string;
    queryLabel: string;
    closeBtn: string;
    quickPromptsLabel: string;
    quickPrompts: string[];
  };
  upload: {
    title: string;
    subtitle: string;
    dragText: string;
    browseText: string;
    supportedFormats: string;
    quickSamples: string;
    cancelBtn: string;
    closeBtn: string;
    extracting: string;
  };
  report: {
    title: string;
    printBtn: string;
    closeBtn: string;
    patientDetails: string;
    clinicalAssessment: string;
    vitalValues: string;
    officialDisclaimer: string;
  };
  alerts: {
    noticeTitle: string;
    dismiss: string;
  };
}

export const TRANSLATIONS: Record<SupportedLanguage, Translations> = {
  // ================= ENGLISH =================
  en: {
    header: {
      brandSubtitle: 'Lite',
      sampleCases: 'Sample cases:',
      highRisk: 'High Risk',
      moderateRisk: 'Moderate',
      lowRisk: 'Low Risk',
      uploadRecords: 'Upload Hospital Records',
      selectLanguage: 'Language'
    },
    hero: {
      title: 'AI-Powered Sepsis Early Warning System',
      subtitle: 'Upload patient records or enter clinical vitals to predict sepsis risk',
      tagEarly: 'Early Detection',
      tagExplainable: 'Explainable AI',
      tagOutcomes: 'Better Outcomes'
    },
    form: {
      patientInfo: 'Patient Information',
      vitalSigns: 'Vital Signs',
      labMarkers: 'Laboratory Markers',
      age: 'Age (Years)',
      agePlaceholder: 'e.g., 65',
      bloodGroup: 'Blood Group',
      bloodGroupSelect: 'Select Blood Group',
      temp: 'Body Temperature (°C)',
      tempPlaceholder: 'e.g., 38.5',
      heartRate: 'Heart Rate (bpm)',
      heartRatePlaceholder: 'e.g., 112',
      respRate: 'Respiratory Rate (breaths/min)',
      respRatePlaceholder: 'e.g., 24',
      systolicBp: 'Systolic Blood Pressure (mmHg)',
      systolicBpPlaceholder: 'e.g., 90',
      diastolicBp: 'Diastolic Blood Pressure (mmHg)',
      diastolicBpPlaceholder: 'e.g., 60 (optional)',
      lactate: 'Serum Lactate (mmol/L)',
      lactatePlaceholder: 'e.g., 2.8',
      creatinine: 'Serum Creatinine (mg/dL)',
      creatininePlaceholder: 'e.g., 1.8',
      spo2: 'Oxygen Saturation SpO2 (%)',
      spo2Placeholder: 'e.g., 94 (optional)',
      wbc: 'White Blood Cell Count (×10³/µL)',
      wbcPlaceholder: 'e.g., 14.5 (optional)',
      requiredComplete: 'Required fields completed',
      analyzeBtn: 'Analyze Sepsis Risk',
      analyzingBtn: 'Evaluating Clinical Risk...',
      resetBtn: 'Reset / Clear All',
      tooltips: {
        age: 'Patient age in years. Age ≥ 65 is an independent risk factor for organ decompensation.',
        temperature: 'Core temperature in °C. Fever > 38.0°C or hypothermia < 36.0°C indicates systemic inflammation.',
        heart_rate: 'Heart rate in beats/min. Tachycardia > 90 bpm signifies systemic physiological stress.',
        respiratory_rate: 'Breathing rate in breaths/min. Tachypnea ≥ 22 breaths/min indicates respiratory distress (qSOFA).',
        systolic_bp: 'Systolic blood pressure in mmHg. SBP ≤ 100 mmHg indicates organ hypoperfusion (qSOFA).',
        lactate: 'Serum lactate in mmol/L. Values > 2.0 mmol/L indicate cellular hypoperfusion and anaerobic metabolism.',
        creatinine: 'Serum creatinine in mg/dL. Evaluates renal filtration and acute kidney impairment.'
      }
    },
    results: {
      assessmentTitle: 'Sepsis Risk Assessment',
      highRiskBadge: 'HIGH RISK',
      moderateRiskBadge: 'MODERATE RISK',
      lowRiskBadge: 'LOW RISK',
      highTitle: 'High Sepsis Risk — Immediate Clinical Evaluation Recommended',
      moderateTitle: 'Moderate Sepsis Risk — Close Monitoring Recommended',
      lowTitle: 'Low Sepsis Risk — Stable Baseline',
      modelRiskElevated: 'The model indicates an elevated risk of sepsis.',
      modelRiskModerate: 'The model indicates a moderate risk of sepsis requiring close observation.',
      modelRiskLow: 'The model indicates low risk of sepsis with stable clinical baseline.',
      disclaimer: 'Notice: This prediction is an AI-based clinical risk estimate, not a confirmed medical diagnosis. Consult a qualified medical practitioner immediately.',
      sepsisStage: 'Identified Sepsis Stage / Type',
      suspectedSource: 'Suspected Infection Clue / Source',
      modelProb: 'Model Probability',
      modelProbDesc: 'Calibrated ML Risk Index',
      qsofaScore: 'qSOFA Score',
      qsofaHighDesc: 'High risk (qSOFA ≥ 2)',
      qsofaLowDesc: 'Low to moderate score',
      sirsScore: 'SIRS Criteria',
      sirsHighDesc: 'Meets SIRS criteria (≥ 2)',
      sirsLowDesc: 'Sub-threshold criteria',
      shockIndex: 'Shock Index (HR/SBP)',
      shockElevatedDesc: 'Elevated (≥0.9 decompensation)',
      shockNormalDesc: 'Normal reference range (<0.7)',
      localAdviceTitle: 'Local Disease Advice & Immediate Steps (Simple Language)',
      localAdviceSubtitle: 'Patient & Caregiver Guidance',
      contributingFactorsTitle: 'Key Contributing Clinical Factors',
      hospitalBundleTitle: 'Recommended Hospital Protocol & 1-Hour Bundle',
      analysisTime: 'Analysis completed in',
      printReport: 'Print / Export Report'
    },
    medicalGuide: {
      title: 'Simple Medical Explanations & Sepsis Guide',
      subtitle: 'Clear, patient-friendly medical explanations without jargon',
      toggleOpen: 'Show Medical Guide',
      toggleClose: 'Hide Medical Guide',
      topics: {
        sepsis: {
          title: 'What is Sepsis?',
          desc: 'Sepsis is the body’s extreme, life-threatening response to an infection. Instead of just fighting the germs, the immune system accidentally attacks its own tissues and organs. Fast medical treatment is crucial.'
        },
        lactate: {
          title: 'What does Blood Lactate mean?',
          desc: 'Lactate is produced when cells are deprived of oxygen due to poor blood flow. A high lactate level (above 2.0 mmol/L) warns doctors that vital organs are not receiving enough oxygen-rich blood.'
        },
        qsofa: {
          title: 'What is the qSOFA Score?',
          desc: 'Quick SOFA is a fast 3-point bedside check: 1) Fast breathing (≥22/min), 2) Low systolic blood pressure (≤100 mmHg), 3) Altered alertness. A score of 2 or more signals emergency risk.'
        },
        shockIndex: {
          title: 'What is Shock Index?',
          desc: 'Shock Index is calculated by dividing heart rate by systolic blood pressure. A value of 0.9 or higher suggests the heart is pumping hard to compensate for dangerously falling blood pressure.'
        },
        vitals: {
          title: 'Why do Vitals Change in Sepsis?',
          desc: 'When an infection spreads, blood vessels widen and leak fluid. To compensate, the heart beats faster and breathing speeds up to deliver oxygen. Fever or abnormally cold body temperature can both occur.'
        },
        bundle: {
          title: 'What is the 1-Hour Sepsis Bundle?',
          desc: 'Emergency steps doctors take within 60 minutes: measure lactate, take blood cultures, start broad-spectrum IV antibiotics, and infuse IV saline fluids if blood pressure is low.'
        }
      }
    },
    chat: {
      placeholder: 'Ask SepsisSense about sepsis, vitals, scores, or treatment...',
      disclaimer: 'SepsisSense is an AI clinical decision-support tool and does not replace in-person medical judgment.',
      responseTitle: 'SepsisSense Clinical Response',
      queryLabel: 'Your Inquiry',
      closeBtn: 'Close',
      quickPromptsLabel: 'Common Medical Questions:',
      quickPrompts: [
        'What is Sepsis and why is it dangerous?',
        'What does high lactate mean in sepsis?',
        'What is the qSOFA score criteria?',
        'What are the first-hour treatment steps?'
      ]
    },
    upload: {
      title: 'Upload Hospital Records',
      subtitle: 'Upload CSV, PDF, or text lab charts for automated clinical extraction',
      dragText: 'Drag and drop your hospital chart or lab report here',
      browseText: 'Browse files',
      supportedFormats: 'Supports CSV, PDF, TXT, and clinical vital charts',
      quickSamples: 'Quick Test with Mock Clinical Records:',
      cancelBtn: 'Cancel',
      closeBtn: 'Close',
      extracting: 'Extracting clinical values...'
    },
    report: {
      title: 'Clinical Sepsis Risk Assessment Report',
      printBtn: 'Print / Save PDF',
      closeBtn: 'Close',
      patientDetails: 'Patient Information',
      clinicalAssessment: 'Clinical Stratification',
      vitalValues: 'Measured Clinical Values',
      officialDisclaimer: 'This clinical report is generated by SepsisSense Lite decision-support system and must be reviewed by a certified healthcare professional.'
    },
    alerts: {
      noticeTitle: 'Clinical Notice',
      dismiss: 'Dismiss'
    }
  },

  // ================= TAMIL (தமிழ்) =================
  ta: {
    header: {
      brandSubtitle: 'லைட்',
      sampleCases: 'மாதிரி வழக்குகள்:',
      highRisk: 'அதிக அபாயம்',
      moderateRisk: 'நடுத்தர அபாயம்',
      lowRisk: 'குறைந்த அபாயம்',
      uploadRecords: 'மருத்துவப் பதிவேடுகளைப் பதிவேற்றுக',
      selectLanguage: 'மொழி'
    },
    hero: {
      title: 'செப்சிஸ் ஆரம்பகால எச்சரிக்கை அமைப்பு',
      subtitle: 'செப்சிஸ் அபாயத்தைக் கணிக்க நோயாளியின் பதிவேடுகளைப் பதிவேற்றவும் அல்லது அளவுகளை உள்ளிடவும்',
      tagEarly: 'ஆரம்பகால கண்டறிதல்',
      tagExplainable: 'விளக்கக்கூடிய AI',
      tagOutcomes: 'சிறந்த சிகிச்சை'
    },
    form: {
      patientInfo: 'நோயாளி விவரங்கள்',
      vitalSigns: 'உடல் முக்கிய அறிகுறிகள் (Vitals)',
      labMarkers: 'ஆய்வகப் பரிசோதனை அளவுகள்',
      age: 'வயது (ஆண்டுகள்)',
      agePlaceholder: 'எ.கா., 65',
      bloodGroup: 'இரத்த வகை',
      bloodGroupSelect: 'இரத்த வகையைத் தேர்ந்தெடுக்கவும்',
      temp: 'உடல் வெப்பநிலை (°C)',
      tempPlaceholder: 'எ.கா., 38.5',
      heartRate: 'இதயத் துடிப்பு (bpm)',
      heartRatePlaceholder: 'எ.கா., 112',
      respRate: 'சுவாச விகிதம் (சுவாசம்/நிமிடம்)',
      respRatePlaceholder: 'எ.கா., 24',
      systolicBp: 'சிஸ்டாலிக் இரத்த அழுத்தம் (mmHg)',
      systolicBpPlaceholder: 'எ.கா., 90',
      diastolicBp: 'டயஸ்டாலிக் இரத்த அழுத்தம் (mmHg)',
      diastolicBpPlaceholder: 'எ.கா., 60 (விருப்பத்திற்குரியது)',
      lactate: 'சீரம் லாக்டேட் (mmol/L)',
      lactatePlaceholder: 'எ.கா., 2.8',
      creatinine: 'சீரம் கிரியேட்டினின் (mg/dL)',
      creatininePlaceholder: 'எ.கா., 1.8',
      spo2: 'ஆக்சிஜன் செறிவு SpO2 (%)',
      spo2Placeholder: 'எ.கா., 94',
      wbc: 'வெள்ளை இரத்த அணுக்கள் (WBC ×10³/µL)',
      wbcPlaceholder: 'எ.கா., 14.5',
      requiredComplete: 'பூர்த்தி செய்யப்பட்ட முக்கிய புலங்கள்',
      analyzeBtn: 'செப்சிஸ் அபாயத்தை மதிப்பிடுக',
      analyzingBtn: 'மதிப்பீடு செய்யப்படுகிறது...',
      resetBtn: 'மீட்டமைக்க / அழிக்க',
      tooltips: {
        age: 'நோயாளியின் வயது. 65 வயதுக்கு மேற்பட்டவர்களுக்கு செப்சிஸ் தீவிரமடையும் அபாயம் அதிகம்.',
        temperature: 'உடல் வெப்பநிலை. 38.0°C-க்கு மேல் காய்ச்சல் அல்லது 36.0°C-க்கு கீழ் குறைவது உடல் அழற்சியைக் குறிக்கும்.',
        heart_rate: 'இதயத் துடிப்பு. நிமிடத்திற்கு 90-க்கு மேல் துடிப்பது உடலின் அழுத்த நிலையை வெளிப்படுத்துகிறது.',
        respiratory_rate: 'சுவாச வேகம். நிமிடத்திற்கு 22-க்கு மேல் வேகமாக சுவாசிப்பது தீவிர சுவாசக் கோளாறைக் குறிக்கும் (qSOFA).',
        systolic_bp: 'இரத்த அழுத்தம் (சிஸ்டாலிக்). 100 mmHg-க்கு கீழ் குறைவது உறுப்புகளுக்கு இரத்த ஓட்டம் குறைவதைக் காட்டுகிறது.',
        lactate: 'இரத்த லாக்டேட் அளவு. 2.0 mmol/L-க்கு மேல் இருப்பது செல்களுக்கு ஆக்சிஜன் பற்றாக்குறையைக் குறிக்கும்.',
        creatinine: 'கிரியேட்டினின் அளவு. சிறுநீரகத்தின் செயல்பாட்டையும் பாதிப்பையும் கண்டறிய உதவுகிறது.'
      }
    },
    results: {
      assessmentTitle: 'செப்சிஸ் அபாய மதிப்பீடு',
      highRiskBadge: 'அதிக அபாயம்',
      moderateRiskBadge: 'நடுத்தர அபாயம்',
      lowRiskBadge: 'குறைந்த அபாயம்',
      highTitle: 'அதிக செப்சிஸ் அபாயம் — உடனடி மருத்துவ கவனிப்பு தேவை',
      moderateTitle: 'நடுத்தர செப்சிஸ் அபாயம் — தீவிர கண்காணிப்பு பரிந்துரைக்கப்படுகிறது',
      lowTitle: 'குறைந்த செப்சிஸ் அபாயம் — நிலையான உடல்நிலை',
      modelRiskElevated: 'மாதிரியின் கணிப்பின்படி, செப்சிஸ் ஏற்படும் அபாயம் அதிகமாக இருக்கலாம்.',
      modelRiskModerate: 'மாதிரியின் கணிப்பின்படி, நடுத்தர அபாயம் உள்ளது; நோயாளி தொடர்ந்து கண்காணிக்கப்பட வேண்டும்.',
      modelRiskLow: 'மாதிரியின் கணிப்பின்படி, செப்சிஸ் அபாயம் குறைவு; உடல் அளவுகள் சீராக உள்ளன.',
      disclaimer: 'குறிப்பு: இந்தக் கணிப்பு ஒரு AI அடிப்படையிலான மருத்துவ அபாய மதிப்பீடே தவிர, உறுதிப்படுத்தப்பட்ட மருத்துவக் கண்டறிதல் அல்ல. உடனடியாக தகுதிவாய்ந்த மருத்துவரை அணுகவும்.',
      sepsisStage: 'கண்டறியப்பட்ட செப்சிஸ் நிலை / வகை',
      suspectedSource: 'தொற்றுக்கான சாத்தியமான மூலக் காரணம்',
      modelProb: 'கணிப்பு நிகழ்தகவு (Probability)',
      modelProbDesc: 'சரிபார்க்கப்பட்ட ML அபாய குறியீடு',
      qsofaScore: 'qSOFA மதிப்பீடு',
      qsofaHighDesc: 'அதிக அபாயம் (qSOFA ≥ 2)',
      qsofaLowDesc: 'குறைந்த அல்லது நடுத்தர அளவு',
      sirsScore: 'SIRS அளவுகோல்',
      sirsHighDesc: 'SIRS அளவுகோல் பொருந்துகிறது (≥ 2)',
      sirsLowDesc: 'அளவுகோலுக்குக் கீழ் உள்ளது',
      shockIndex: 'ஷாக் இன்டெக்ஸ் (HR/SBP)',
      shockElevatedDesc: 'அதிகம் (≥0.9 இரத்த ஓட்டக் குறைபாடு)',
      shockNormalDesc: 'இயல்பான நிலை (<0.7)',
      localAdviceTitle: 'நோய்க்கான எளிய ஆலோசனைகள் மற்றும் உடனடி நடவடிக்கைகள்',
      localAdviceSubtitle: 'நோயாளி மற்றும் பராமரிப்பாளருக்கான எளிய வழிகாட்டுதல்',
      contributingFactorsTitle: 'முக்கிய காரணிகளாக அமைந்த மருத்துவ அளவுகள்',
      hospitalBundleTitle: 'பரிந்துரைக்கப்படும் 1-மணி நேர மருத்துவமனை நெறிமுறைகள்',
      analysisTime: 'மதிப்பீடு முடிக்கப்பட்ட நேரம்',
      printReport: 'அறிக்கையை அச்சிடுக / சேமிக்க'
    },
    medicalGuide: {
      title: 'எளிய மருத்துவ விளக்கங்கள் & செப்சிஸ் கையேடு',
      subtitle: 'கடினமான மருத்துவச் சொற்கள் இன்றி நோயாளிகளுக்கான எளிய விளக்கம்',
      toggleOpen: 'மருத்துவ விளக்கங்களைக் காட்டு',
      toggleClose: 'மருத்துவ விளக்கங்களை மறைக்க',
      topics: {
        sepsis: {
          title: 'செப்சிஸ் (Sepsis) என்றால் என்ன?',
          desc: 'செப்சிஸ் என்பது உடலில் ஏற்படும் ஒரு தொற்றுக்கு எதிராக நமது நோய் எதிர்ப்பு அமைப்பு அளவுக்கு அதிகமாக செயல்பட்டு, தனது சொந்த உறுப்புகளையே சேதப்படுத்தும் ஒரு தீவிர ஆபத்தான நிலை. இதற்கு உடனடி அவசர சிகிச்சை மிக அவசியம்.'
        },
        lactate: {
          title: 'இரத்த லாக்டேட் (Lactate) என்றால் என்ன?',
          desc: 'உடலின் செல்களுக்கு போதுமான இரத்த ஓட்டமும் ஆக்சிஜனும் கிடைக்காத போது லாக்டேட் உருவாகிறது. லாக்டேட் அளவு 2.0 mmol/L-க்கு மேல் உயர்ந்தால் உறுப்புகள் ஆபத்தில் உள்ளன என்று பொருள்.'
        },
        qsofa: {
          title: 'qSOFA மதிப்பீடு என்றால் என்ன?',
          desc: 'இது படுக்கை அருகில் செய்யப்படும் எளிய 3-அம்ச பரிசோதனை: 1) விரைவான சுவாசம் (≥22/நிமிடம்), 2) குறைந்த இரத்த அழுத்தம் (≤100 mmHg), 3) நினைவாற்றல் குழப்பம். இதில் 2 அல்லது அதற்கு மேல் வந்தால் அவசர சிகிச்சை தேவை.'
        },
        shockIndex: {
          title: 'ஷாக் இன்டெக்ஸ் (Shock Index) என்றால் என்ன?',
          desc: 'இதயத் துடிப்பை இரத்த அழுத்தத்தால் வகுத்து இது கணக்கிடப்படுகிறது. இதன் மதிப்பு 0.9 அல்லது அதற்கு மேல் இருந்தால், குறைந்த இரத்த அழுத்தத்தை சமாளிக்க இதயம் மிகக் கடினமாக துடிக்கிறது என்று பொருள்.'
        },
        vitals: {
          title: 'செப்சிஸில் உடல் அளவுகள் ஏன் மாறுகின்றன?',
          desc: 'தொற்று பரவும் போது இரத்தக் குழாய்கள் விரிவடைந்து இரத்த அழுத்தம் குறைகிறது. இதனால் உறுப்புகளைக் காப்பாற்ற இதயம் வேகமாகத் துடிக்கிறது, சுவாசமும் விரைவடைகிறது. அதிக காய்ச்சல் அல்லது உடலின் குளிர்ச்சி ஏற்படலாம்.'
        },
        bundle: {
          title: '1-மணி நேர செப்சிஸ் முதலுதவி (1-Hour Bundle) என்ன?',
          desc: 'டாக்டர்கள் முதல் 60 நிமிடங்களுக்குள் செய்யும் அவசர நடவடிக்கைகள்: லாக்டேட் பரிசோதனை, இரத்தக் கல்ச்சர் எடுத்தல், வலுவான நரம்புவழி ஆன்டிபயாடிக் மருந்துகள் வழங்குதல் மற்றும் குளுக்கோஸ்/சலைன் திரவங்கள் ஏற்றுதல்.'
        }
      }
    },
    chat: {
      placeholder: 'செப்சிஸ், முக்கிய அறிகுறிகள் அல்லது சிகிச்சை பற்றி SepsisSense-இடம் கேளுங்கள்...',
      disclaimer: 'SepsisSense என்பது ஒரு மருத்துவ முடிவெடுக்கும் AI கருவி; இது நேரடி மருத்துவப் பரிசோதனைக்கு மாற்றாகாது.',
      responseTitle: 'SepsisSense மருத்துவ AI பதில்',
      queryLabel: 'உங்கள் கேள்வி',
      closeBtn: 'மூடுக',
      quickPromptsLabel: 'பொதுவான மருத்துவக் கேள்விகள்:',
      quickPrompts: [
        'செப்சிஸ் என்றால் என்ன? அது ஏன் ஆபத்தானது?',
        'செப்சிஸில் லாக்டேட் அளவு அதிகரித்தால் என்ன பொருள்?',
        'qSOFA பரிசோதனை எதைக் காட்டுகிறது?',
        'முதல் ஒரு மணி நேர அவசர சிகிச்சைகள் என்னென்ன?'
      ]
    },
    upload: {
      title: 'மருத்துவமனை ஆவணங்களைப் பதிவேற்றுக',
      subtitle: 'ஆய்வக அறிக்கைகள் அல்லது இரத்தப் பரிசோதனை கோப்புகளை இங்கே பதிவேற்றவும்',
      dragText: 'கோப்பை இங்கே இழுத்து விடவும்',
      browseText: 'கோப்பைத் தேர்ந்தெடுங்கள்',
      supportedFormats: 'CSV, PDF, TXT மற்றும் மருத்துவக் குறிப்புகள் ஆதரிக்கப்படுகின்றன',
      quickSamples: 'மாதிரி மருத்துவ ஆவணங்கள் மூலம் பரிசோதிக்க:',
      cancelBtn: 'ரத்து செய்',
      closeBtn: 'மூடுக',
      extracting: 'மருத்துவ அளவுகள் பிரித்தெடுக்கப்படுகின்றன...'
    },
    report: {
      title: 'செப்சிஸ் மருத்துவ அபாய மதிப்பீட்டு அறிக்கை',
      printBtn: 'அச்சிடுக / PDF சேமிக்க',
      closeBtn: 'மூடுக',
      patientDetails: 'நோயாளி தகவல்கள்',
      clinicalAssessment: 'அபாய நிலை பகுப்பாய்வு',
      vitalValues: 'பரிசோதிக்கப்பட்ட மருத்துவ அளவுகள்',
      officialDisclaimer: 'இந்த அறிக்கை SepsisSense Lite AI அமைப்பால் உருவாக்கப்பட்டது. இதை தகுதிவாய்ந்த மருத்துவர் மதிப்பாய்வு செய்ய வேண்டும்.'
    },
    alerts: {
      noticeTitle: 'மருத்துவ அறிவிப்பு',
      dismiss: 'சரி'
    }
  },

  // ================= HINDI (हिन्दी) =================
  hi: {
    header: {
      brandSubtitle: 'लाइट',
      sampleCases: 'नमूना मामले:',
      highRisk: 'उच्च जोखिम',
      moderateRisk: 'मध्यम जोखिम',
      lowRisk: 'कम जोखिम',
      uploadRecords: 'अस्पताल रिकॉर्ड अपलोड करें',
      selectLanguage: 'भाषा'
    },
    hero: {
      title: 'एआई-संचालित सेप्सिस पूर्व चेतावनी प्रणाली',
      subtitle: 'सेप्सिस जोखिम का अनुमान लगाने के लिए मरीज के रिकॉर्ड अपलोड करें या नैदानिक मान दर्ज करें',
      tagEarly: 'प्रारंभिक पहचान',
      tagExplainable: 'स्पष्ट एआई',
      tagOutcomes: 'बेहतर परिणाम'
    },
    form: {
      patientInfo: 'मरीज की जानकारी',
      vitalSigns: 'शारीरिक महत्वपूर्ण संकेत (Vitals)',
      labMarkers: 'प्रयोगशाला परीक्षण पैरामीटर',
      age: 'आयु (वर्ष)',
      agePlaceholder: 'उदा. 65',
      bloodGroup: 'रक्त समूह',
      bloodGroupSelect: 'रक्त समूह चुनें',
      temp: 'शारीरिक तापमान (°C)',
      tempPlaceholder: 'उदा. 38.5',
      heartRate: 'हृदय गति (bpm)',
      heartRatePlaceholder: 'उदा. 112',
      respRate: 'श्वसन दर (सांस/मिनट)',
      respRatePlaceholder: 'उदा. 24',
      systolicBp: 'सिस्टोलिक रक्तचाप (mmHg)',
      systolicBpPlaceholder: 'उदा. 90',
      diastolicBp: 'डायस्टोलिक रक्तचाप (mmHg)',
      diastolicBpPlaceholder: 'उदा. 60 (वैकल्पिक)',
      lactate: 'सीरम लैक्टेट (mmol/L)',
      lactatePlaceholder: 'उदा. 2.8',
      creatinine: 'सीरम क्रिएटिनिन (mg/dL)',
      creatininePlaceholder: 'उदा. 1.8',
      spo2: 'ऑक्सीजन संतृप्ति SpO2 (%)',
      spo2Placeholder: 'उदा. 94',
      wbc: 'श्वेत रक्त कणिकाएं (WBC ×10³/µL)',
      wbcPlaceholder: 'उदा. 14.5',
      requiredComplete: 'पूर्ण आवश्यक फ़ील्ड्स',
      analyzeBtn: 'सेप्सिस जोखिम का विश्लेषण करें',
      analyzingBtn: 'विश्लेषण जारी है...',
      resetBtn: 'रीसेट / साफ़ करें',
      tooltips: {
        age: 'मरीज की आयु। 65 वर्ष से अधिक उम्र सेप्सिस के गंभीर होने का एक बड़ा जोखिम कारक है।',
        temperature: 'शरीर का तापमान। 38.0°C से अधिक बुखार या 36.0°C से कम तापमान गंभीर संक्रमण का संकेत है।',
        heart_rate: 'हृदय गति। 90 धड़कन प्रति मिनट से अधिक होना शरीर पर गंभीर तनाव दर्शाता है।',
        respiratory_rate: 'सांस लेने की गति। प्रति मिनट 22 से अधिक सांसें फेफड़ों और अंगों में परेशानी का संकेत हैं (qSOFA)।',
        systolic_bp: 'रक्तचाप (सिस्टोलिक)। 100 mmHg से कम होना अंगों में रक्त प्रवाह की कमी को दर्शाता है।',
        lactate: 'रक्त लैक्टेट स्तर। 2.0 mmol/L से ऊपर का स्तर कोशिकाओं में ऑक्सीजन की गंभीर कमी दिखाता है।',
        creatinine: 'क्रिएटिनिन स्तर। सेप्सिस के कारण गुर्दे (किडनी) की कार्यप्रणाली पर प्रभाव का मूल्यांकन करता है।'
      }
    },
    results: {
      assessmentTitle: 'सेप्सिस जोखिम मूल्यांकन',
      highRiskBadge: 'उच्च जोखिम',
      moderateRiskBadge: 'मध्यम जोखिम',
      lowRiskBadge: 'कम जोखिम',
      highTitle: 'उच्च सेप्सिस जोखिम — तत्काल नैदानिक मूल्यांकन की आवश्यकता है',
      moderateTitle: 'मध्यम सेप्सिस जोखिम — कड़ी निगरानी की सिफारिश की जाती है',
      lowTitle: 'कम सेप्सिस जोखिम — स्थिर शारीरिक स्थिति',
      modelRiskElevated: 'मॉडल के अनुसार, सेप्सिस का बढ़ा हुआ जोखिम हो सकता है।',
      modelRiskModerate: 'मॉडल के अनुसार, सेप्सिस का मध्यम जोखिम है; मरीज की लगातार निगरानी की जानी चाहिए।',
      modelRiskLow: 'मॉडल के अनुसार, सेप्सिस का जोखिम कम है और शारीरिक स्थिति सामान्य है।',
      disclaimer: 'कृपया ध्यान दें: यह भविष्यवाणी एक एआई-आधारित नैदानिक जोखिम अनुमान है, कोई पुष्ट चिकित्सा निदान नहीं। तुरंत योग्य चिकित्सक से परामर्श लें।',
      sepsisStage: 'पहचानी गई सेप्सिस अवस्था / प्रकार',
      suspectedSource: 'संभावित संक्रमण स्रोत',
      modelProb: 'मॉडल संभावना (Probability)',
      modelProbDesc: 'अंशांकित एमएल जोखिम सूचकांक',
      qsofaScore: 'qSOFA स्कोर',
      qsofaHighDesc: 'उच्च जोखिम (qSOFA ≥ 2)',
      qsofaLowDesc: 'कम से मध्यम स्कोर',
      sirsScore: 'SIRS मानदंड',
      sirsHighDesc: 'SIRS मानदंड पूरा करता है (≥ 2)',
      sirsLowDesc: 'सामान्य सीमा में',
      shockIndex: 'शॉक इंडेक्स (HR/SBP)',
      shockElevatedDesc: 'बढ़ा हुआ (≥0.9 रक्त प्रवाह विफलता)',
      shockNormalDesc: 'सामान्य संदर्भ सीमा (<0.7)',
      localAdviceTitle: 'रोग सलाह एवं तत्काल कदम (सरल भाषा)',
      localAdviceSubtitle: 'मरीज एवं देखभालकर्ता के लिए मार्गदर्शन',
      contributingFactorsTitle: 'प्रमुख योगदानकर्ता नैदानिक कारक',
      hospitalBundleTitle: 'अनुशंसित अस्पताल 1-घंटे का प्रोटोकॉल बंडल',
      analysisTime: 'विश्लेषण पूरा हुआ',
      printReport: 'रिपोर्ट प्रिंट / सहेजें'
    },
    medicalGuide: {
      title: 'सरल चिकित्सा व्याख्या एवं सेप्सिस गाइड',
      subtitle: 'जटिल शब्दों के बिना मरीजों और परिजनों के लिए आसान समझ',
      toggleOpen: 'मेडिकल गाइड देखें',
      toggleClose: 'मेडिकल गाइड छिपाएं',
      topics: {
        sepsis: {
          title: 'सेप्सिस क्या है?',
          desc: 'सेप्सिस संक्रमण के प्रति शरीर की जानलेवा प्रतिक्रिया है। संक्रमण से लड़ते समय शरीर की रोग प्रतिरोधक प्रणाली गलती से अपने ही अंगों को नुकसान पहुंचाने लगती है। इसमें तत्काल इलाज अत्यंत आवश्यक है।'
        },
        lactate: {
          title: 'रक्त लैक्टेट (Lactate) का क्या अर्थ है?',
          desc: 'जब रक्त का संचार कमजोर होता है और कोशिकाओं तक ऑक्सीजन नहीं पहुंचती, तब लैक्टेट बनता है। लैक्टेट 2.0 mmol/L से ऊपर होना अंगों में गंभीर ऑक्सीजन की कमी का संकेत है।'
        },
        qsofa: {
          title: 'qSOFA स्कोर क्या है?',
          desc: 'यह अस्पताल में तुरंत की जाने वाली 3 बिंदुओं की जांच है: 1) तेज सांस (≥22/मिनट), 2) कम सिस्टोलिक रक्तचाप (≤100 mmHg), 3) भ्रम या बेहोशी। 2 या अधिक अंक आपातकालीन स्थिति दर्शाते हैं।'
        },
        shockIndex: {
          title: 'शॉक इंडेक्स (Shock Index) क्या है?',
          desc: 'हृदय गति को सिस्टोलिक रक्तचाप से विभाजित करके यह निकाला जाता है। यदि यह 0.9 या अधिक है, तो इसका अर्थ है कि गिरते रक्तचाप को बनाए रखने के लिए दिल बहुत तेजी से धड़क रहा है।'
        },
        vitals: {
          title: 'सेप्सिस में शारीरिक संकेत क्यों बदलते हैं?',
          desc: 'संक्रमण फैलने पर रक्त वाहिकाएं चौड़ी हो जाती हैं और रक्तचाप गिर जाता है। अंगों को बचाने के लिए हृदय गति तेज हो जाती है और सांसें तेज चलने लगती हैं। तेज बुखार या शरीर का असामान्य रूप से ठंडा होना भी हो सकता है।'
        },
        bundle: {
          title: '1-घंटे का सेप्सिस बंडल क्या है?',
          desc: 'पहले 60 मिनट में डॉक्टरों द्वारा उठाए जाने वाले आपात कदम: लैक्टेट मापना, रक्त कल्चर लेना, व्यापक एंटीबायोटिक्स देना और रक्तचाप बढ़ाने के लिए नस द्वारा सलाइन फ्लूइड चढ़ाना।'
        }
      }
    },
    chat: {
      placeholder: 'सेप्सिस, लक्षणों, रिपोर्ट या उपचार के बारे में SepsisSense से पूछें...',
      disclaimer: 'SepsisSense एक निर्णय-सहायता उपकरण है और प्रत्यक्ष चिकित्सकीय निदान का विकल्प नहीं है।',
      responseTitle: 'SepsisSense नैदानिक उत्तर',
      queryLabel: 'आपका प्रश्न',
      closeBtn: 'बंद करें',
      quickPromptsLabel: 'सामान्य चिकित्सा प्रश्न:',
      quickPrompts: [
        'सेप्सिस क्या है और यह इतना खतरनाक क्यों है?',
        'सेप्सिस में लैक्टेट बढ़ने का क्या मतलब है?',
        'qSOFA स्कोर क्या दर्शाता है?',
        'सेप्सिस में पहले एक घंटे में क्या इलाज होना चाहिए?'
      ]
    },
    upload: {
      title: 'अस्पताल रिकॉर्ड अपलोड करें',
      subtitle: 'स्वचालित डेटा निष्कर्षण के लिए लैब रिपोर्ट या चार्ट अपलोड करें',
      dragText: 'अपनी फाइल यहां खींचें और छोड़ें',
      browseText: 'फाइल चुनें',
      supportedFormats: 'CSV, PDF, TXT और लैब रिपोर्ट समर्थित हैं',
      quickSamples: 'नमूना रिपोर्ट के साथ त्वरित परीक्षण:',
      cancelBtn: 'रद्द करें',
      closeBtn: 'बंद करें',
      extracting: 'मान निकाले जा रहे हैं...'
    },
    report: {
      title: 'नैदानिक सेप्सिस जोखिम मूल्यांकन रिपोर्ट',
      printBtn: 'प्रिंट / PDF सहेजें',
      closeBtn: 'बंद करें',
      patientDetails: 'मरीज का विवरण',
      clinicalAssessment: 'नैदानिक जोखिम वर्गीकरण',
      vitalValues: 'मापे गए नैदानिक मान',
      officialDisclaimer: 'यह रिपोर्ट SepsisSense Lite निर्णय-सहायता प्रणाली द्वारा तैयार की गई है और इसे प्रमाणित चिकित्सक द्वारा देखा जाना चाहिए।'
    },
    alerts: {
      noticeTitle: 'नैदानिक सूचना',
      dismiss: 'ठीक है'
    }
  },

  // ================= TELUGU (తెలుగు) =================
  te: {
    header: {
      brandSubtitle: 'లైట్',
      sampleCases: 'నమూనా కేసులు:',
      highRisk: 'అధిక ప్రమాదం',
      moderateRisk: 'మధ్యస్థ ప్రమాదం',
      lowRisk: 'తక్కువ ప్రమాదం',
      uploadRecords: 'హాస్పిటల్ రికార్డులను అప్‌లోడ్ చేయండి',
      selectLanguage: 'భాష'
    },
    hero: {
      title: 'సెప్సిస్ ముందస్తు హెచ్చరిక వ్యవస్థ',
      subtitle: 'సెప్సిస్ ప్రమాదాన్ని అంచనా వేయడానికి రోగి రికార్డులను అప్‌లోడ్ చేయండి లేదా కొలతలను నమోదు చేయండి',
      tagEarly: 'ముందస్తు గుర్తింపు',
      tagExplainable: 'వివరణాత్మక AI',
      tagOutcomes: 'మెరుగైన ఫలితాలు'
    },
    form: {
      patientInfo: 'రోగి వివరాలు',
      vitalSigns: 'శరీర ముఖ్యమైన సంకేతాలు (Vitals)',
      labMarkers: 'ప్రయోగశాల పరీక్షల కొలతలు',
      age: 'వయస్సు (సంవత్సరాలు)',
      agePlaceholder: 'ఉదా., 65',
      bloodGroup: 'రక్త వర్గం',
      bloodGroupSelect: 'రక్త వర్గాన్ని ఎంచుకోండి',
      temp: 'శరీర ఉష్ణోగ్రత (°C)',
      tempPlaceholder: 'ఉదా., 38.5',
      heartRate: 'గుండె చప్పుడు (bpm)',
      heartRatePlaceholder: 'ఉదా., 112',
      respRate: 'శ్వాసక్రియ రేటు (శ్వాసలు/నిమిషం)',
      respRatePlaceholder: 'ఉదా., 24',
      systolicBp: 'సిస్టోలిక్ రక్తపోటు (mmHg)',
      systolicBpPlaceholder: 'ఉదా., 90',
      diastolicBp: 'డయాస్టోలిక్ రక్తపోటు (mmHg)',
      diastolicBpPlaceholder: 'ఉదా., 60 (ఐచ్ఛికం)',
      lactate: 'సీరమ్ లాక్టేట్ (mmol/L)',
      lactatePlaceholder: 'ఉదా., 2.8',
      creatinine: 'సీరమ్ క్రియాటినిన్ (mg/dL)',
      creatininePlaceholder: 'ఉదా., 1.8',
      spo2: 'ఆక్సిజన్ శాతం SpO2 (%)',
      spo2Placeholder: 'ఉదా., 94',
      wbc: 'తెల్ల రక్త కణాలు (WBC ×10³/µL)',
      wbcPlaceholder: 'ఉదా., 14.5',
      requiredComplete: 'పూర్తయిన ముఖ్య వివరాలు',
      analyzeBtn: 'సెప్సిస్ ప్రమాదాన్ని విశ్లేషించండి',
      analyzingBtn: 'విశ్లేషిస్తోంది...',
      resetBtn: 'రీసెట్ / క్లియర్ చేయండి',
      tooltips: {
        age: 'రోగి వయస్సు. 65 ఏళ్లు పైబడిన వారికి సెప్సిస్ ప్రమాదం ఎక్కువ.',
        temperature: 'శరీర ఉష్ణోగ్రత. 38.0°C కంటే ఎక్కువ జ్వరం లేదా 36.0°C కంటే తక్కువ ఉంటే తీవ్ర ఇన్‌ఫెక్షన్‌ను సూచిస్తుంది.',
        heart_rate: 'గుండె కొట్టుకునే వేగం. నిమిషానికి 90 కంటే ఎక్కువ ఉంటే శరీరం తీవ్ర ఒత్తిడిలో ఉందని అర్థం.',
        respiratory_rate: 'శ్వాస వేగం. నిమిషానికి 22 కంటే ఎక్కువ వేగంగా శ్వాస తీసుకోవడం ప్రమాద సూచిక (qSOFA).',
        systolic_bp: 'రక్తపోటు (సిస్టోలిక్). 100 mmHg కంటే తగ్గడం శరీర అవయవాలకు రక్త ప్రసరణ తగ్గినట్లు సూచిస్తుంది.',
        lactate: 'రక్త లాక్టేట్ స్థాయి. 2.0 mmol/L కంటే ఎక్కువ ఉండటం కణాలకు ఆక్సిజన్ అందడం లేదని సూచిస్తుంది.',
        creatinine: 'క్రియాటినిన్ స్థాయి. సెప్సిస్ వల్ల మూత్రపిండాల పనితీరుపై ప్రభావం పడిందో లేదో తెలుపుతుంది.'
      }
    },
    results: {
      assessmentTitle: 'సెప్సిస్ ప్రమాద అంచనా',
      highRiskBadge: 'అధిక ప్రమాదం',
      moderateRiskBadge: 'మధ్యస్థ ప్రమాదం',
      lowRiskBadge: 'తక్కువ ప్రమాదం',
      highTitle: 'అధిక సెప్సిస్ ప్రమాదం — తక్షణ వైద్య చికిత్స అవసరం',
      moderateTitle: 'మధ్యస్థ సెప్సిస్ ప్రమాదం — నిరంతర పర్యవేక్షణ అవసరం',
      lowTitle: 'తక్కువ సెప్సిస్ ప్రమాదం — నిలకడైన పరిస్థితి',
      modelRiskElevated: 'మోడల్ అంచనా ప్రకారం, సెప్సిస్ వచ్చే ప్రమాదం ఎక్కువగా ఉండవచ్చు.',
      modelRiskModerate: 'మోడల్ అంచనా ప్రకారం, మధ్యస్థ ప్రమాదం ఉంది; రోగిని నిశితంగా గమనించాలి.',
      modelRiskLow: 'మోడల్ అంచనా ప్రకారం, సెప్సిస్ ప్రమాదం తక్కువగా ఉంది; శరీర విలువలు సాధారణంగా ఉన్నాయి.',
      disclaimer: 'గమనిక: ఈ అంచనా AI-ఆధారిత క్లినికల్ రిస్క్ అంచనా మాత్రమే, ధృవీకరించబడిన వైద్య నిర్ధారణ కాదు. వెంటనే అర్హత కలిగిన వైద్యుడిని సంప్రదించండి.',
      sepsisStage: 'గుర్తించబడిన సెప్సిస్ దశ / రకం',
      suspectedSource: 'అనుమానిత ఇన్ఫెక్షన్ మూలం',
      modelProb: 'మోడల్ సంభావ్యత (Probability)',
      modelProbDesc: 'ప్రామాణీకరించబడిన ML రిస్క్ ఇండెక్స్',
      qsofaScore: 'qSOFA స్కోరు',
      qsofaHighDesc: 'అధిక ప్రమాదం (qSOFA ≥ 2)',
      qsofaLowDesc: 'తక్కువ లేదా మధ్యస్థ స్కోరు',
      sirsScore: 'SIRS ప్రమాణాలు',
      sirsHighDesc: 'SIRS ప్రమాణాలు సరిపోతున్నాయి (≥ 2)',
      sirsLowDesc: 'పరిమితి లోపల ఉన్నాయి',
      shockIndex: 'షాక్ ఇండెక్స్ (HR/SBP)',
      shockElevatedDesc: 'ఎక్కువ (≥0.9 రక్తప్రసరణ లోపం)',
      shockNormalDesc: 'సాధారణం (<0.7)',
      localAdviceTitle: 'సులభమైన వ్యాధి సలహాలు మరియు తక్షణ చర్యలు',
      localAdviceSubtitle: 'రోగి మరియు సహాయకులకు మార్గదర్శకత్వం',
      contributingFactorsTitle: 'ప్రధాన కారణాలైన క్లినికల్ అంశాలు',
      hospitalBundleTitle: 'సిఫార్సు చేయబడిన ఆసుపత్రి 1-గంట ప్రోటోకాల్',
      analysisTime: 'విశ్లేషణ పూర్తయిన సమయం',
      printReport: 'రిపోర్ట్ ప్రింట్ / సేవ్ చేయండి'
    },
    medicalGuide: {
      title: 'సులభమైన వైద్య వివరణలు & సెప్సిస్ గైడ్',
      subtitle: 'కఠినమైన పదాలు లేకుండా రోగుల కోసం సాధారణ వివరణ',
      toggleOpen: 'వైద్య గైడ్ చూడండి',
      toggleClose: 'వైద్య గైడ్ దాచండి',
      topics: {
        sepsis: {
          title: 'సెప్సిస్ అంటే ఏమిటి?',
          desc: 'సెప్సిస్ అనేది శరీరంలో ఇన్ఫెక్షన్ వచ్చినప్పుడు రోగనిరోధక శక్తి విపరీతంగా స్పందించి, తన సొంత అవయవాలనే దెబ్బతీసే ప్రాణాంతక పరిస్థితి. దీనికి అత్యవసర తక్షణ చికిత్స చాలా ముఖ్యం.'
        },
        lactate: {
          title: 'బ్లడ్ లాక్టేట్ (Lactate) అంటే ఏమిటి?',
          desc: 'రక్త ప్రసరణ తగ్గి శరీర కణాలకు తగినంత ఆక్సిజన్ అందనప్పుడు లాక్టేట్ తయారవుతుంది. లాక్టేట్ 2.0 mmol/L కంటే పెరిగితే అవయవాలు ప్రమాదంలో ఉన్నాయని అర్థం.'
        },
        qsofa: {
          title: 'qSOFA స్కోరు అంటే ఏమిటి?',
          desc: 'ఇది ఆసుపత్రి పడక వద్ద త్వరగా చేసే 3-అంశాల తనిఖీ: 1) వేగంగా శ్వాసించడం (≥22/నిమిషం), 2) తక్కువ రక్తపోటు (≤100 mmHg), 3) స్పృహ కోల్పోవడం. స్కోరు 2 లేదా ఎక్కువ ఉంటే అత్యవసర పరిస్థితి.'
        },
        shockIndex: {
          title: 'షాక్ ఇండెక్స్ (Shock Index) అంటే ఏమిటి?',
          desc: 'గుండె వేగాన్ని సిస్టోలిక్ రక్తపోటుతో భాగించడం ద్వారా ఇది వస్తుంది. దీని విలువ 0.9 లేదా అంతకంటే ఎక్కువ ఉంటే, తగ్గిన రక్తపోటును భర్తీ చేయడానికి గుండె చాలా కష్టపడుతోందని అర్థం.'
        },
        vitals: {
          title: 'సెప్సిస్‌లో శరీర విలువలు ఎందుకు మారతాయి?',
          desc: 'ఇన్ఫెక్షన్ వ్యాపించినప్పుడు రక్తనాళాలు వ్యాకోచించి రక్తపోటు పడిపోతుంది. అవయవాలను రక్షించడానికి గుండె వేగంగా కొట్టుకుంటుంది మరియు శ్వాస వేగం పెరుగుతుంది. విపరీతమైన జ్వరం లేదా శరీరం చల్లబడటం జరగవచ్చు.'
        },
        bundle: {
          title: '1-గంట సెప్సిస్ బండిల్ అంటే ఏమిటి?',
          desc: 'మొదటి 60 నిమిషాల్లో వైద్యులు చేసే అత్యవసర చర్యలు: లాక్టేట్ పరీక్ష చేయడం, బ్లడ్ కల్చర్ తీయడం, యాంటీబయాటిక్స్ ఇవ్వడం మరియు రక్తపోటు పెంచడానికి సెలైన్ ద్రవాలు ఎక్కించడం.'
        }
      }
    },
    chat: {
      placeholder: 'సెప్సిస్, లక్షణాలు లేదా చికిత్స గురించి SepsisSense ను అడగండి...',
      disclaimer: 'SepsisSense అనేది క్లినికల్ సహాయక సాధనం; ఇది ప్రత్యక్ష వైద్య పరీక్షకు ప్రత్యామ్నాయం కాదు.',
      responseTitle: 'SepsisSense క్లినికల్ సమాధానం',
      queryLabel: 'మీ ప్రశ్న',
      closeBtn: 'మూసివేయి',
      quickPromptsLabel: 'సాధారణ వైద్య ప్రశ్నలు:',
      quickPrompts: [
        'సెప్సిస్ అంటే ఏమిటి మరియు అది ఎందుకు ప్రమాదకరం?',
        'సెప్సిస్‌లో లాక్టేట్ పెరిగితే ఏం జరుగుతుంది?',
        'qSOFA స్కోరు దేనిని తెలియజేస్తుంది?',
        'మొదటి గంటలో చేయాల్సిన అత్యవసర చికిత్సలు ఏమిటి?'
      ]
    },
    upload: {
      title: 'హాస్పిటల్ రికార్డులను అప్‌లోడ్ చేయండి',
      subtitle: 'ల్యాబ్ రిపోర్టులను లేదా చార్టులను ఇక్కడ అప్‌లోడ్ చేయండి',
      dragText: 'ఫైల్‌ను ఇక్కడ లాగి వదలండి',
      browseText: 'ఫైల్ ఎంచుకోండి',
      supportedFormats: 'CSV, PDF, TXT మరియు ల్యాబ్ రికార్డులకు మద్దతు ఉంది',
      quickSamples: 'నమూనా నివేదికలతో తనిఖీ చేయండి:',
      cancelBtn: 'రద్దు చేయి',
      closeBtn: 'మూసివేయి',
      extracting: 'వివరాలు సేకరించబడుతున్నాయి...'
    },
    report: {
      title: 'సెప్సిస్ క్లినికల్ రిస్క్ రిపోర్ట్',
      printBtn: 'ప్రింట్ / PDF సేవ్ చేయండి',
      closeBtn: 'మూసివేయి',
      patientDetails: 'రోగి వివరాలు',
      clinicalAssessment: 'రిస్క్ విశ్లేషణ',
      vitalValues: 'పరీక్షించిన క్లినికల్ విలువలు',
      officialDisclaimer: 'ఈ నివేదిక SepsisSense Lite AI వ్యవస్థ ద్వారా రూపొందించబడింది. దీనిని అర్హత కలిగిన వైద్యుడు సమీక్షించాలి.'
    },
    alerts: {
      noticeTitle: 'క్లినికల్ నోటీసు',
      dismiss: 'సరే'
    }
  },

  // ================= MALAYALAM (മലയാളം) =================
  ml: {
    header: {
      brandSubtitle: 'ലൈറ്റ്',
      sampleCases: 'മാതൃകാ കേസുകൾ:',
      highRisk: 'ഉയർന്ന അപകടസാധ്യത',
      moderateRisk: 'മിതമായ അപകടസാധ്യത',
      lowRisk: 'കുറഞ്ഞ അപകടസാധ്യത',
      uploadRecords: 'ആശുപത്രി രേഖകൾ അപ്‌ലോഡ് ചെയ്യുക',
      selectLanguage: 'ഭാഷ'
    },
    hero: {
      title: 'സെപ്സിസ് മുൻകൂർ മുന്നറിയിപ്പ് സംവിധാനം',
      subtitle: 'സെപ്സിസ് സാധ്യത നിർണ്ണയിക്കാൻ രോഗിയുടെ വിവരങ്ങൾ രേഖപ്പെടുത്തുക അല്ലെങ്കിൽ അപ്‌ലോഡ് ചെയ്യുക',
      tagEarly: 'നേരത്തെയുള്ള കണ്ടെത്തൽ',
      tagExplainable: 'വ്യക്തമായ AI',
      tagOutcomes: 'മികച്ച ചികിത്സ'
    },
    form: {
      patientInfo: 'രോഗിയുടെ വിവരങ്ങൾ',
      vitalSigns: 'ശരീര പ്രധാന ലക്ഷണങ്ങൾ (Vitals)',
      labMarkers: 'ലാബ് പരിശോധനാ ഫലങ്ങൾ',
      age: 'പ്രായം (വർഷം)',
      agePlaceholder: 'ഉദാ., 65',
      bloodGroup: 'രക്തഗ്രൂപ്പ്',
      bloodGroupSelect: 'രക്തഗ്രൂപ്പ് തിരഞ്ഞെടുക്കുക',
      temp: 'ശരീര താപനില (°C)',
      tempPlaceholder: 'ഉദാ., 38.5',
      heartRate: 'ഹൃദയമിടിപ്പ് (bpm)',
      heartRatePlaceholder: 'ഉദാ., 112',
      respRate: 'ശ്വാസോച്ഛ്വാസ നിരക്ക് (ശ്വാസം/മിനിറ്റ്)',
      respRatePlaceholder: 'ഉദാ., 24',
      systolicBp: 'സിസ്റ്റോളിക് രക്തസമ്മർദ്ദം (mmHg)',
      systolicBpPlaceholder: 'ഉദാ., 90',
      diastolicBp: 'ഡയസ്റ്റോളിക് രക്തസമ്മർദ്ദം (mmHg)',
      diastolicBpPlaceholder: 'ഉദാ., 60 (ഓപ്ഷണൽ)',
      lactate: 'സീറം ലാക്റ്റേറ്റ് (mmol/L)',
      lactatePlaceholder: 'ഉദാ., 2.8',
      creatinine: 'സീറം ക്രിയാറ്റിനിൻ (mg/dL)',
      creatininePlaceholder: 'ഉദാ., 1.8',
      spo2: 'ഓക്സിജൻ അളവ് SpO2 (%)',
      spo2Placeholder: 'ഉദാ., 94',
      wbc: 'ശ്വേതരക്താണുക്കൾ (WBC ×10³/µL)',
      wbcPlaceholder: 'ഉദാ., 14.5',
      requiredComplete: 'പൂർത്തിയാക്കിയ പ്രധാന വിവരങ്ങൾ',
      analyzeBtn: 'സെപ്സിസ് സാധ്യത പരിശോധിക്കുക',
      analyzingBtn: 'പരിശോധന പുരോഗമിക്കുന്നു...',
      resetBtn: 'പുനഃസജ്ജമാക്കുക / മായ്ക്കുക',
      tooltips: {
        age: 'രോഗിയുടെ പ്രായം. 65 വയസ്സിന് മുകളിലുള്ളവർക്ക് സെപ്സിസ് ഗുരുതരമാകാനുള്ള സാധ്യത കൂടുതലാണ്.',
        temperature: 'ശരീര താപനില. 38.0°C-ൽ കൂടുതൽ പനിയോ 36.0°C-ൽ താഴെയോ വരുന്നത് അണുബാധയുടെ ലക്ഷണമാണ്.',
        heart_rate: 'ഹൃദയമിടിപ്പ് നിരക്ക്. മിനിറ്റിൽ 90-ൽ കൂടുതൽ ഹൃദയമിടിപ്പ് ഉണ്ടാകുന്നത് ശരീരത്തിലെ സമ്മർദ്ദത്തെ കാണിക്കുന്നു.',
        respiratory_rate: 'ശ്വാസോച്ഛ്വാസ വേഗത. മിനിറ്റിൽ 22-ൽ കൂടുതൽ വേഗത്തിൽ ശ്വാസമെടുക്കുന്നത് അടിയന്തര ലക്ഷണമാണ് (qSOFA).',
        systolic_bp: 'രക്തസമ്മർദ്ദം (സിസ്റ്റോളിക്). 100 mmHg-ൽ താഴെയാകുന്നത് അവയവങ്ങളിലേക്കുള്ള രക്തയോട്ടം കുറഞ്ഞതിനെ സൂചിപ്പിക്കുന്നു.',
        lactate: 'രക്തത്തിലെ ലാക്റ്റേറ്റ് അളവ്. 2.0 mmol/L-ൽ കൂടുതൽ വരുന്നത് കോശങ്ങളിലേക്ക് ആവശ്യത്തിന് ഓക്സിജൻ എത്തുന്നില്ല എന്ന മുന്നറിയിപ്പാണ്.',
        creatinine: 'ക്രിയാറ്റിനിൻ അളവ്. വൃക്കകളുടെ പ്രവർത്തനത്തെയും തകരാറുകളെയും വിലയിരുത്താൻ സഹായിക്കുന്നു.'
      }
    },
    results: {
      assessmentTitle: 'സെപ്സിസ് അപകടസാധ്യത വിലയിരുത്തൽ',
      highRiskBadge: 'ഉയർന്ന അപകടസാധ്യത',
      moderateRiskBadge: 'മിതമായ അപകടസാധ്യത',
      lowRiskBadge: 'കുറഞ്ഞ അപകടസാധ്യത',
      highTitle: 'ഉയർന്ന സെപ്സിസ് സാധ്യത — അടിയന്തര വൈദ്യസഹായം ആവശ്യമാണ്',
      moderateTitle: 'മിതമായ സെപ്സിസ് സാധ്യത — സൂക്ഷ്മ നിരീക്ഷണം ശുപാർശ ചെയ്യുന്നു',
      lowTitle: 'കുറഞ്ഞ സെപ്സിസ് സാധ്യത — സുരക്ഷിതമായ അവസ്ഥ',
      modelRiskElevated: 'മോഡലിന്റെ കണക്കുകൂട്ടൽ പ്രകാരം, സെപ്സിസ് ഉണ്ടാകാനുള്ള സാധ്യത കൂടുതലായിരിക്കാം.',
      modelRiskModerate: 'മോഡലിന്റെ കണക്കുകൂട്ടൽ പ്രകാരം, മിതമായ സാധ്യതയുണ്ട്; രോഗിയെ നിരീക്ഷിക്കേണ്ടതുണ്ട്.',
      modelRiskLow: 'മോഡലിന്റെ കണക്കുകൂട്ടൽ പ്രകാരം, സെപ്സിസ് സാധ്യത കുറവാണ്; ശരീര ലക്ഷണങ്ങൾ സാധാരണ നിലയിലാണ്.',
      disclaimer: 'ശ്രദ്ധിക്കുക: ഈ പ്രവചനം AI അടിസ്ഥാനമാക്കിയുള്ള ക്ലിനിക്കൽ അപകടസാധ്യതയുടെ കണക്കുകൂട്ടൽ മാത്രമാണ്, സ്ഥിരീകരിച്ച രോഗനിർണയമല്ല. ഉടൻ തന്നെ യോഗ്യതയുള്ള ഒരു ഡോക്ടറെ സമീപിക്കുക.',
      sepsisStage: 'കണ്ടെത്തിയ സെപ്സിസ് ഘട്ടം / തരം',
      suspectedSource: 'അണുബാധ ഉണ്ടാകാൻ സാധ്യതയുള്ള ഉറവിടം',
      modelProb: 'സാധ്യത ശതമാനം (Probability)',
      modelProbDesc: 'കാലിബ്രേറ്റ് ചെയ്ത ML റിസ്ക് സൂചിക',
      qsofaScore: 'qSOFA സ്കോർ',
      qsofaHighDesc: 'ഉയർന്ന അപകടസാധ്യത (qSOFA ≥ 2)',
      qsofaLowDesc: 'കുറഞ്ഞ അല്ലെങ്കിൽ മിതമായ സ്കോർ',
      sirsScore: 'SIRS മാനദണ്ഡം',
      sirsHighDesc: 'SIRS മാനദണ്ഡം പാലിക്കുന്നു (≥ 2)',
      sirsLowDesc: 'സാധാരണ പരിധിയിൽ',
      shockIndex: 'ഷോക്ക് ഇൻഡക്സ് (HR/SBP)',
      shockElevatedDesc: 'കൂടിയ നിരക്ക് (≥0.9 രക്തചംക്രമണ തകരാറ്)',
      shockNormalDesc: 'സാധാരണ നിരക്ക് (<0.7)',
      localAdviceTitle: 'ലളിതമായ നിർദ്ദേശങ്ങളും അടിയന്തര നടപടികളും',
      localAdviceSubtitle: 'രോഗിക്കും സഹായികൾക്കും ഉള്ള ലളിതമായ മാർഗ്ഗനിർദ്ദേശം',
      contributingFactorsTitle: 'പ്രധാന പങ്കുവഹിച്ച ക്ലിനിക്കൽ ഘടകങ്ങൾ',
      hospitalBundleTitle: 'ശുപാർശ ചെയ്യുന്ന ആശുപത്രി 1-മണിക്കൂർ പ്രോട്ടോക്കോൾ',
      analysisTime: 'പരിശോധന പൂർത്തിയായ സമയം',
      printReport: 'റിപ്പോർട്ട് പ്രിന്റ് / സേവ് ചെയ്യുക'
    },
    medicalGuide: {
      title: 'ലളിതമായ മെഡിക്കൽ വിശദീകരണങ്ങളും സെപ്സിസ് ഗൈഡും',
      subtitle: 'സങ്കീർണ്ണമായ പദങ്ങളില്ലാതെ സാധാരണക്കാർക്കുള്ള വിശദീകരണം',
      toggleOpen: 'മെഡിക്കൽ ഗൈഡ് കാണിക്കുക',
      toggleClose: 'മെഡിക്കൽ ഗൈഡ് മറയ്ക്കുക',
      topics: {
        sepsis: {
          title: 'എന്താണ് സെപ്സിസ് (Sepsis)?',
          desc: 'ശരീരത്തിലുണ്ടാകുന്ന ഒരു അണുബാധയോട് പ്രതിരോധ സംവിധാനം അമിതമായി പ്രതികരിച്ച് സ്വന്തം അവയവങ്ങളെ നശിപ്പിക്കുന്ന ജീവന് തന്നെ ആപത്തായ അവസ്ഥയാണ് സെപ്സിസ്. ഇതിന് പെട്ടെന്നുള്ള ചികിത്സ അത്യന്താപേക്ഷിതമാണ്.'
        },
        lactate: {
          title: 'എന്താണ് ലാക്റ്റേറ്റ് (Lactate)?',
          desc: 'രക്തയോട്ടം കുറഞ്ഞ് ശരീര കോശങ്ങളിൽ ഓക്സിജൻ ലഭിക്കാതെ വരുമ്പോഴാണ് ലാക്റ്റേറ്റ് ഉണ്ടാകുന്നത്. ഇതിന്റെ അളവ് 2.0 mmol/L-ൽ കൂടുതൽ ഉയർന്നാൽ അവയവങ്ങൾ അപകടത്തിലാണ് എന്നതിന്റെ സൂചനയാണ്.'
        },
        qsofa: {
          title: 'എന്താണ് qSOFA സ്കോർ?',
          desc: 'രോഗിയുടെ അരികിൽ വച്ച് ഉടൻ ചെയ്യാവുന്ന 3 കാര്യങ്ങളുടെ പരിശോധന: 1) വേഗത്തിലുള്ള ശ്വാസമെടുക്കൽ (≥22/മിനിറ്റ്), 2) കുറഞ്ഞ രക്തസമ്മർദ്ദം (≤100 mmHg), 3) ബോധക്കേട് അല്ലെങ്കിൽ ആശയക്കുഴപ്പം. ഇതിൽ 2 അല്ലെങ്കിൽ അതിൽ കൂടുതൽ സ്കോർ വന്നാൽ അടിയന്തര അപകടസാധ്യതയാണ്.'
        },
        shockIndex: {
          title: 'എന്താണ് ഷോക്ക് ഇൻഡക്സ് (Shock Index)?',
          desc: 'ഹൃദയമിടിപ്പിനെ രക്തസമ്മർദ്ദം കൊണ്ട് ഹരിച്ചാണ് ഇത് കണക്കാക്കുന്നത്. ഇതിന്റെ മൂല്യം 0.9 അല്ലെങ്കിൽ അതിൽ കൂടുതലാണെങ്കിൽ, കുറഞ്ഞ രക്തസമ്മർദ്ദത്തെ മറികടക്കാൻ ഹൃദയം അമിതമായി പണിപ്പെടുന്നു എന്നാണ് അർത്ഥം.'
        },
        vitals: {
          title: 'സെപ്സിസിൽ ശരീര ലക്ഷണങ്ങൾ മാറുന്നത് എന്തുകൊണ്ട്?',
          desc: 'അണുബാധ പടരുമ്പോൾ രക്തക്കുഴലുകൾ വികസിക്കുകയും രക്തസമ്മർദ്ദം താഴുകയും ചെയ്യുന്നു. ഇത് പരിഹരിക്കാൻ ഹൃദയം വേഗത്തിൽ മിടിക്കുകയും ശ്വാസോച്ഛ്വാസം വേഗത്തിലാവുകയും ചെയ്യുന്നു. കഠിനമായ പനിയോ ശരീരം തണുത്തുറയലോ ഉണ്ടാകാം.'
        },
        bundle: {
          title: 'എന്താണ് 1-മണിക്കൂർ സെപ്സിസ് ബണ്ടിൽ?',
          desc: 'ആദ്യ 60 മിനിറ്റിനുള്ളിൽ ഡോക്ടർമാർ ചെയ്യുന്ന അടിയന്തര നടപടികൾ: ലാക്റ്റേറ്റ് അളവ് പരിശോധിക്കുക, ബ്ലഡ് കൾച്ചർ എടുക്കുക, ആന്റിബയോട്ടിക്കുകൾ നൽകുക, രക്തസമ്മർദ്ദം കൂട്ടാൻ സലൈൻ ഡ്രിപ്പ് നൽകുക.'
        }
      }
    },
    chat: {
      placeholder: 'സെപ്സിസ്, ലക്ഷണങ്ങൾ അല്ലെങ്കിൽ ചികിത്സയെക്കുറിച്ച് SepsisSense-നോട് ചോദിക്കുക...',
      disclaimer: 'SepsisSense ഒരു ക്ലിനിക്കൽ പിന്തുണാ സംവിധാനം മാത്രമാണ്; ഇത് ഡോക്ടറുടെ നേരിട്ടുള്ള പരിശോധനയ്ക്ക് പകരമാവില്ല.',
      responseTitle: 'SepsisSense ക്ലിനിക്കൽ മറുപടി',
      queryLabel: 'നിങ്ങളുടെ ചോദ്യം',
      closeBtn: 'അടയ്ക്കുക',
      quickPromptsLabel: 'സാധാരണ മെഡിക്കൽ സംശയങ്ങൾ:',
      quickPrompts: [
        'എന്താണ് സെപ്സിസ്? ഇത് അപകടകരമാകുന്നത് എന്തുകൊണ്ട്?',
        'സെപ്സിസിൽ ലാക്റ്റേറ്റ് അളവ് കൂടിയാൽ എന്താണ് അർത്ഥം?',
        'qSOFA പരിശോധന എന്തിനെയാണ് സൂചിപ്പിക്കുന്നത്?',
        'ആദ്യത്തെ ഒരു മണിക്കൂറിൽ ചെയ്യേണ്ട അടിയന്തര ചികിത്സകൾ എന്തൊക്കെയാണ്?'
      ]
    },
    upload: {
      title: 'ആശുപത്രി രേഖകൾ അപ്‌ലോഡ് ചെയ്യുക',
      subtitle: 'ലാബ് റിപ്പോർട്ടുകൾ ഇവിടെ അപ്‌ലോഡ് ചെയ്യുക',
      dragText: 'ഫയൽ ഇവിടെ കൊണ്ടുവന്ന് ഇടുക',
      browseText: 'ഫയൽ തിരഞ്ഞെടുക്കുക',
      supportedFormats: 'CSV, PDF, TXT എന്നിവയെ പിന്തുണയ്ക്കുന്നു',
      quickSamples: 'മാതൃകാ രേഖകൾ ഉപയോഗിച്ച് പരിശോധിക്കാൻ:',
      cancelBtn: 'റദ്ദാക്കുക',
      closeBtn: 'അടയ്ക്കുക',
      extracting: 'വിവരങ്ങൾ ശേഖരിക്കുന്നു...'
    },
    report: {
      title: 'സെപ്സിസ് ക്ലിനിക്കൽ റിസ്ക് റിപ്പോർട്ട്',
      printBtn: 'പ്രിന്റ് / PDF സേവ് ചെയ്യുക',
      closeBtn: 'അടയ്ക്കുക',
      patientDetails: 'രോഗിയുടെ വിവരങ്ങൾ',
      clinicalAssessment: 'അപകടസാധ്യത വിശകലനം',
      vitalValues: 'പരിശോധിച്ച ക്ലിനിക്കൽ അളവുകൾ',
      officialDisclaimer: 'ഈ റിപ്പോർട്ട് SepsisSense Lite AI സിസ്റ്റം തയ്യാറാക്കിയതാണ്. ഒരു യോഗ്യതയുള്ള ഡോക്ടർ ഇത് പരിശോധിക്കേണ്ടതുണ്ട്.'
    },
    alerts: {
      noticeTitle: 'ക്ലിനിക്കൽ അറിയിപ്പ്',
      dismiss: 'ശരി'
    }
  }
};
