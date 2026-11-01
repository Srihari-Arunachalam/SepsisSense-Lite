import React, { useState, useMemo } from 'react';
import {
  Printer,
  ChevronDown,
  Info,
  Timer,
  HeartPulse,
  Stethoscope,
  Activity,
  Sparkles,
  Droplets,
  Pill,
  TestTube2,
  Wind,
  Building2,
  AlertCircle,
  HelpCircle,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';
import { SepsisPredictionResponse, PatientFormState } from '../types';
import { useLanguage } from '../i18n/LanguageContext';
import { ViewToggle, ViewMode } from './explainable/ViewToggle';
import { RiskCard } from './explainable/RiskCard';
import { TopReasons } from './explainable/TopReasons';
import { ActionBox } from './explainable/ActionBox';
import { ReadAloudButton } from './explainable/ReadAloudButton';
import { DoctorView } from './explainable/DoctorView';
import { evaluateFactor, EvaluatedFactor } from '../config/factorConfig';

interface ResultPanelProps {
  result: SepsisPredictionResponse;
  form?: PatientFormState;
  onPrintReport: () => void;
  onReset: () => void;
}

export const ResultPanel: React.FC<ResultPanelProps> = ({
  result,
  form,
  onPrintReport,
  onReset
}) => {
  const {
    language,
    translations,
    translateSepsisType,
    translateSuspectedSource,
    translateAdviceItem
  } = useLanguage();
  const r = translations.results;

  // View Mode: 'simple' (default for patient/family) or 'doctor' (for clinicians)
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    try {
      const saved = localStorage.getItem('sepsissense_view_mode') as ViewMode;
      if (saved === 'simple' || saved === 'doctor') return saved;
    } catch {
      // ignore
    }
    return 'simple';
  });

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    try {
      localStorage.setItem('sepsissense_view_mode', mode);
    } catch {
      // ignore
    }
  };

  const isHigh = result.risk_level === 'High';
  const isModerate = result.risk_level === 'Moderate';

  // Evaluate clinical factors from form values or extract from result
  const evaluatedFactors = useMemo(() => {
    const list: EvaluatedFactor[] = [];
    const keys = [
      'lactate',
      'heart_rate',
      'respiratory_rate',
      'systolic_bp',
      'temperature',
      'age',
      'creatinine',
      'spo2',
      'wbc'
    ];

    keys.forEach((key) => {
      let rawVal: any = form ? (form as any)[key] : undefined;

      // Fallback extraction from contributing_factors if form is blank
      if (rawVal === undefined || rawVal === '' || rawVal === null) {
        if (result.contributing_factors) {
          for (const factorText of result.contributing_factors) {
            const ft = factorText.toLowerCase();
            if (key === 'heart_rate' && ft.includes('heartbeat:')) {
              const m = factorText.match(/(\d+)/);
              if (m) rawVal = m[1];
            } else if (key === 'respiratory_rate' && ft.includes('breathing:')) {
              const m = factorText.match(/(\d+)/);
              if (m) rawVal = m[1];
            } else if (key === 'systolic_bp' && ft.includes('blood pressure:')) {
              const m = factorText.match(/(\d+)/);
              if (m) rawVal = m[1];
            } else if (key === 'lactate' && ft.includes('lactate level:')) {
              const m = factorText.match(/([\d.]+)/);
              if (m) rawVal = m[1];
            } else if (key === 'creatinine' && ft.includes('creatinine level:')) {
              const m = factorText.match(/([\d.]+)/);
              if (m) rawVal = m[1];
            } else if (key === 'temperature' && ft.includes('temperature:')) {
              const m = factorText.match(/([\d.]+)/);
              if (m) rawVal = m[1];
            }
          }
        }
      }

      // Default safe baseline fallback for display completeness
      if (rawVal === undefined || rawVal === '' || rawVal === null) {
        if (key === 'heart_rate') rawVal = 76;
        else if (key === 'respiratory_rate') rawVal = 16;
        else if (key === 'systolic_bp') rawVal = 120;
        else if (key === 'temperature') rawVal = 37.0;
        else if (key === 'lactate') rawVal = 1.0;
        else if (key === 'creatinine') rawVal = 0.9;
        else if (key === 'age') rawVal = 48;
      }

      const evaluated = evaluateFactor(key, rawVal);
      if (evaluated) {
        list.push(evaluated);
      }
    });

    return list;
  }, [form, result]);

  // Helper icon for local advice tags
  const getAdviceIcon = (tag: string) => {
    const tLower = tag.toLowerCase();
    if (tLower.includes('urgent') || tLower.includes('emergency') || tLower.includes('fluids') || tLower.includes('அவசர') || tLower.includes('ദ്രവം')) {
      return <Droplets className="w-4 h-4 text-sky-600 shrink-0" />;
    }
    if (tLower.includes('antibiotic') || tLower.includes('medication') || tLower.includes('மருந்து')) {
      return <Pill className="w-4 h-4 text-emerald-600 shrink-0" />;
    }
    if (tLower.includes('blood') || tLower.includes('lab') || tLower.includes('test') || tLower.includes('பரிசோதனை')) {
      return <TestTube2 className="w-4 h-4 text-indigo-600 shrink-0" />;
    }
    if (tLower.includes('breath') || tLower.includes('oxygen') || tLower.includes('சுவாசம்')) {
      return <Wind className="w-4 h-4 text-cyan-600 shrink-0" />;
    }
    if (tLower.includes('unit') || tLower.includes('icu') || tLower.includes('hospital') || tLower.includes('monitoring') || tLower.includes('பிரிவு')) {
      return <Building2 className="w-4 h-4 text-purple-600 shrink-0" />;
    }
    return <Activity className="w-4 h-4 text-teal-600 shrink-0" />;
  };

  const translatedSepsisType = translateSepsisType(result.sepsis_type, result.risk_level);
  const translatedSuspectedSource = translateSuspectedSource(result.suspected_source);

  // Condition description
  const conditionDescription = isHigh
    ? language === 'en'
      ? "The patient's results show signs that may indicate a serious infection and problems with blood flow or organ function. A doctor must assess the patient's condition urgently."
      : translatedSepsisType
    : isModerate
    ? language === 'en'
      ? "The patient's results show signs of possible infection that need medical evaluation."
      : translatedSepsisType
    : language === 'en'
    ? "The patient's current results show stable vital signs without clear signs of serious infection."
    : translatedSepsisType;

  // Source description
  const sourceLower = (result.suspected_source || '').toLowerCase();
  const sourceDescription =
    sourceLower.includes('lung') || sourceLower.includes('chest') || sourceLower.includes('respir')
      ? language === 'en'
        ? 'The results may suggest a lung or chest infection. More medical tests are needed to find the actual cause.'
        : 'நுரையீரல் அல்லது மார்பு தொற்றுக்கான அறிகுறிகள் உள்ளன.'
      : sourceLower.includes('kidney') || sourceLower.includes('urin')
      ? language === 'en'
        ? 'The results may suggest a kidney or urinary tract infection. More medical tests are needed to find the actual cause.'
        : 'சிறுநீரகப் பாதை தொற்றுக்கான அறிகுறிகள் உள்ளன.'
      : sourceLower.includes('blood') || sourceLower.includes('bacter')
      ? language === 'en'
        ? 'The results may suggest a bloodstream infection. Laboratory blood cultures are needed to verify.'
        : 'இரத்த ஓட்டத் தொற்றுக்கான அறிகுறிகள் உள்ளன.'
      : language === 'en'
      ? 'Infection source not yet known. Further medical tests are needed to find the actual cause.'
      : 'தொற்றுக்கான மூலம் இன்னும் உறுதியாகத் தெரியவில்லை.';

  return (
    <div className="w-full max-w-4xl mx-auto my-8 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xl p-5 sm:p-8 transition-all space-y-6">
        
        {/* ================= 1. VIEW MODE TOGGLE & REPORT BUTTONS ================= */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex-1 min-w-[280px]">
            <ViewToggle mode={viewMode} onChange={handleViewModeChange} />
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={onPrintReport}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition-colors shadow-2xs cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{r.printReport}</span>
            </button>
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              title="Reset analysis"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* ================= VIEW CONTAINER ================= */}
        {viewMode === 'simple' ? (
          /* ========================================================================= */
          /* ======================= SIMPLE VIEW (PATIENT FRIENDLY) =================== */
          /* ========================================================================= */
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* 1. Traffic Light Risk Card */}
            <RiskCard riskLevel={result.risk_level} probability={result.probability} />

            {/* 2. Read Aloud Text-to-Speech Button */}
            <ReadAloudButton
              riskLevel={result.risk_level}
              probability={result.probability}
              factors={evaluatedFactors}
            />

            {/* 3. Possible Condition & Suspected Infection Source Overview */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-50 to-teal-50/40 border border-slate-200/80 grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Possible Condition */}
              <div className="flex items-start gap-3">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                    isHigh
                      ? 'bg-rose-100 text-rose-700'
                      : isModerate
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  <HeartPulse className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] uppercase font-extrabold tracking-wider text-slate-400">
                    {language === 'en' ? 'Possible Condition' : r.sepsisStage}
                  </p>
                  <p
                    className={`text-sm sm:text-base font-extrabold mt-0.5 ${
                      isHigh ? 'text-rose-900' : isModerate ? 'text-amber-950' : 'text-emerald-950'
                    }`}
                  >
                    {translatedSepsisType}
                  </p>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {conditionDescription}
                  </p>
                </div>
              </div>

              {/* Infection Source */}
              <div className="flex items-start gap-3 md:border-l md:border-slate-200/80 md:pl-4">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 mt-0.5">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[11px] uppercase font-extrabold tracking-wider text-slate-400">
                    {language === 'en' ? 'Possible Infection Source' : r.suspectedSource}
                  </p>
                  <p className="text-sm sm:text-base font-extrabold text-slate-800 mt-0.5">
                    {translatedSuspectedSource}
                  </p>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {sourceDescription}
                  </p>
                </div>
              </div>
            </div>

            {/* 4. Top 3 Key Factors with Range Meters ("Why?" section) */}
            <TopReasons factors={evaluatedFactors} showDoctorTerms={false} />

            {/* 5. What Should I Do Next? (Action Box) */}
            <ActionBox riskLevel={result.risk_level} />

            {/* 6. Hospital Guidance Cards ("What Needs to Happen Now?") */}
            <div className="p-5 sm:p-6 rounded-2xl bg-teal-50/60 border border-teal-200/90 shadow-2xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <h3 className="text-sm sm:text-base font-extrabold uppercase tracking-wider text-[#007A78] flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#007A78]" />
                  <span>{language === 'en' ? 'What Needs to Happen Now?' : r.localAdviceTitle}</span>
                </h3>
                <span className="text-[11px] font-bold text-teal-800 bg-teal-100 px-3 py-1 rounded-full border border-teal-200 self-start sm:self-center">
                  {language === 'en' ? 'Patient & Caregiver Guidance' : r.localAdviceSubtitle}
                </span>
              </div>

              {/* Disclaimer */}
              <div className="mb-4 p-3 rounded-xl bg-white/90 border border-teal-200 text-xs text-teal-950 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-[#007A78] shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <strong>Please Note: </strong>
                  {language === 'en'
                    ? 'These treatments (such as IV fluids, antibiotics, oxygen, and blood tests) must be performed and managed by trained healthcare professionals in a hospital, not attempted by patients or caregivers at home.'
                    : 'முக்கியக் குறிப்பு: இந்த சிகிச்சைகளும் வழிமுறைகளும் மருத்துவமனையில் பயிற்சி பெற்ற மருத்துவர்கள் மற்றும் செவிலியர்களால் மட்டுமே செய்யப்பட வேண்டும்; நோயாளிகளோ குடும்பத்தினரோ சுயமாகச் செய்யக்கூடாது.'}
                </p>
              </div>

              {/* Guidance items */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {(result.local_advices && result.local_advices.length > 0
                  ? result.local_advices
                  : [
                      {
                        tag: 'Emergency Care',
                        title: 'Get Emergency Medical Help',
                        advice: 'The patient needs immediate assessment by a medical team. Do not delay getting emergency care.'
                      },
                      {
                        tag: 'IV Fluids',
                        title: 'Give Fluids if Advised',
                        advice: 'A doctor may administer intravenous fluids to restore circulating volume and maintain organ perfusion.'
                      },
                      {
                        tag: 'Antibiotics',
                        title: 'Start Early Antibiotics',
                        advice: 'Broad-spectrum antibiotics are initiated promptly by the medical team if a bacterial infection is suspected.'
                      }
                    ]
                ).map((rawItem, idx) => {
                  const item = translateAdviceItem(rawItem);
                  return (
                    <div
                      key={idx}
                      className="bg-white rounded-xl p-4 border border-teal-100 shadow-2xs hover:border-teal-300 transition-colors flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <div className="flex items-center gap-1.5">
                            {getAdviceIcon(item.tag)}
                            <h4 className="text-xs sm:text-sm font-bold text-slate-900">{item.title}</h4>
                          </div>
                          <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md border border-slate-200 shrink-0">
                            {item.tag}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">{item.advice}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          /* ========================================================================= */
          /* ========================= DOCTOR VIEW (CLINICAL & SHAP) ================== */
          /* ========================================================================= */
          <DoctorView result={result} factors={evaluatedFactors} />
        )}

        {/* Footer with Response Time & Medical Notice */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2 font-mono">
            <Timer className="w-3.5 h-3.5 text-blue-600" />
            <span>
              {r.analysisTime}: {result.execution_time_seconds.toFixed(2)}s
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 italic max-w-xl text-right">
            <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>
              Important Notice: This AI result is an early clinical risk estimate, not a confirmed diagnosis. Only a qualified healthcare professional can diagnose and treat sepsis.
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
