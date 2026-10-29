import React, { useState } from 'react';
import {
  AlertOctagon,
  AlertTriangle,
  CheckCircle,
  ShieldAlert,
  ClipboardList,
  Printer,
  ChevronRight,
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
  ShieldCheck
} from 'lucide-react';
import { SepsisPredictionResponse } from '../types';
import { useLanguage } from '../i18n/LanguageContext';

interface ResultPanelProps {
  result: SepsisPredictionResponse;
  onPrintReport: () => void;
  onReset: () => void;
}

export const ResultPanel: React.FC<ResultPanelProps> = ({
  result,
  onPrintReport
}) => {
  const {
    language,
    translations,
    translateSepsisType,
    translateSuspectedSource,
    translateAdviceItem,
    translateContributingFactor,
    translateClinicalAction
  } = useLanguage();
  const r = translations.results;

  const [showDetailedScores, setShowDetailedScores] = useState(false);

  const isHigh = result.risk_level === 'High';
  const isModerate = result.risk_level === 'Moderate';
  const percentage = (result.probability * 100).toFixed(0);

  const riskBadgeStyles = isHigh
    ? 'bg-rose-600 text-white border-rose-700 shadow-xs'
    : isModerate
    ? 'bg-amber-500 text-white border-amber-600 shadow-xs'
    : 'bg-emerald-600 text-white border-emerald-700 shadow-xs';

  const riskCardGlow = isHigh
    ? 'border-rose-300 ring-4 ring-rose-500/15'
    : isModerate
    ? 'border-amber-300 ring-4 ring-amber-500/15'
    : 'border-emerald-300 ring-4 ring-emerald-500/15';

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
      <div className={`bg-white rounded-3xl border ${riskCardGlow} shadow-xl p-6 sm:p-8 transition-all`}>
        
        {/* ================= 1. SEPSIS RISK RESULT ================= */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="flex items-start gap-4">
            <div
              className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${
                isHigh
                  ? 'bg-rose-100 text-rose-600 shadow-md shadow-rose-200 ring-2 ring-rose-400'
                  : isModerate
                  ? 'bg-amber-100 text-amber-600 shadow-sm shadow-amber-200 ring-2 ring-amber-300'
                  : 'bg-emerald-100 text-emerald-600 shadow-sm shadow-emerald-200 ring-2 ring-emerald-300'
              }`}
            >
              {isHigh ? (
                <AlertOctagon className="w-8 h-8 stroke-[2.2] animate-pulse" />
              ) : isModerate ? (
                <AlertTriangle className="w-8 h-8 stroke-[2.2]" />
              ) : (
                <CheckCircle className="w-8 h-8 stroke-[2.2]" />
              )}
            </div>

            <div>
              {/* Dynamic Sepsis Risk Header: Sepsis Risk: HIGH — 94% */}
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="text-xs uppercase tracking-wider font-extrabold text-slate-500">
                  {language === 'en' ? 'Sepsis Risk' : r.assessmentTitle}:
                </span>
                <span className={`text-xs font-black tracking-wide px-3 py-1 rounded-full border ${riskBadgeStyles}`}>
                  {isHigh
                    ? language === 'en' ? `HIGH — ${percentage}%` : `${r.highRiskBadge} — ${percentage}%`
                    : isModerate
                    ? language === 'en' ? `MODERATE — ${percentage}%` : `${r.moderateRiskBadge} — ${percentage}%`
                    : language === 'en' ? `LOW — ${percentage}%` : `${r.lowRiskBadge} — ${percentage}%`}
                </span>
              </div>

              {/* Patient-Friendly Primary Message */}
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-2 leading-snug">
                {isHigh
                  ? language === 'en'
                    ? 'Your patient may have a serious infection. Immediate medical attention is needed.'
                    : r.highTitle
                  : isModerate
                  ? language === 'en'
                    ? 'Your patient shows signs that could indicate an infection. Close medical monitoring is needed.'
                    : r.moderateTitle
                  : language === 'en'
                  ? 'Your patient is currently stable. Continue regular routine monitoring.'
                  : r.lowTitle}
              </h2>

              {/* Clear Plain English Subtitle */}
              <p className="text-xs sm:text-sm font-medium text-slate-700 mt-1.5 leading-relaxed">
                {isHigh
                  ? language === 'en'
                    ? 'The AI model has detected signs that may be linked to sepsis. A doctor must check the patient immediately.'
                    : 'AI மாதிரி செப்சிஸ் தொடர்பான எச்சரிக்கை அறிகுறிகளைக் கண்டறிந்துள்ளது. உடனடியாக மருத்துவரை அணுகவும்.'
                  : isModerate
                  ? language === 'en'
                    ? 'The AI model has detected warning signs. A medical professional should assess the patient and check if the condition is changing.'
                    : 'மருத்துவக் குழுவினர் நோயாளியை நேரில் பரிசோதித்து நிலையை கண்காணிக்க வேண்டும்.'
                  : language === 'en'
                  ? 'The AI model has not detected immediate signs of sepsis. Standard routine care should continue.'
                  : 'செப்சிஸிற்கான உடனடி ஆபத்து அறிகுறிகள் ஏதுமில்லை. வழக்கமான பராமரிப்பு போதுமானது.'}
              </p>

              {/* Patient-Friendly Important Notice */}
              <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-200/90 flex items-start gap-2 text-[11px] sm:text-xs text-slate-600">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-800 font-bold">Important Notice: </strong>
                  <span>
                    {language === 'en'
                      ? 'This AI result is an early warning, not a confirmed diagnosis. Only a qualified healthcare professional can diagnose and treat sepsis.'
                      : r.disclaimer}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
            <button
              type="button"
              onClick={onPrintReport}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition-colors shadow-2xs cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{r.printReport}</span>
            </button>
          </div>
        </div>

        {/* ================= 2. POSSIBLE CONDITION & 3. POSSIBLE INFECTION SOURCE ================= */}
        <div className="my-5 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-50 to-teal-50/40 border border-slate-200/80 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Possible Severity / Condition */}
          <div className="flex items-start gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
              isHigh ? 'bg-rose-100 text-rose-700' : isModerate ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
            }`}>
              <HeartPulse className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] uppercase font-extrabold tracking-wider text-slate-400">
                {language === 'en' ? 'Possible Condition' : r.sepsisStage}
              </p>
              <p className={`text-sm sm:text-base font-extrabold mt-0.5 ${
                isHigh ? 'text-rose-900' : isModerate ? 'text-amber-950' : 'text-emerald-950'
              }`}>
                {translatedSepsisType}
              </p>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                {conditionDescription}
              </p>
            </div>
          </div>

          {/* Possible Infection Source */}
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

        {/* ================= 4. MODEL RESULTS AND MEDICAL SCORES ================= */}
        <div className="my-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {language === 'en' ? 'Model Results & Medical Scores' : 'மருத்துவக் குறியீடுகள்'}
            </h3>
            <button
              type="button"
              onClick={() => setShowDetailedScores(!showDetailedScores)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#007A78] hover:text-[#006967] cursor-pointer"
            >
              <span>{showDetailedScores ? (language === 'en' ? 'Hide explanations' : 'விளக்கங்களை மறைக்க') : (language === 'en' ? 'Learn more about scores' : 'மதிப்பீடுகள் பற்றி மேலும் அறிய')}</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showDetailedScores ? 'rotate-180' : ''}`} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {/* 1. AI Risk Estimate */}
            <div className="bg-slate-50/90 rounded-2xl p-4 border border-slate-200/70 hover:border-teal-200 transition-all flex flex-col justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase text-slate-500">
                  {language === 'en' ? 'AI Risk Estimate' : r.modelProb}
                </p>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className={`text-2xl sm:text-3xl font-extrabold font-mono ${isHigh ? 'text-rose-600' : isModerate ? 'text-amber-600' : 'text-slate-900'}`}>
                    {percentage}
                  </span>
                  <span className="text-xs font-mono text-slate-500">%</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-600 mt-2 leading-relaxed">
                {language === 'en'
                  ? `The model estimates a ${isHigh ? 'high' : isModerate ? 'moderate' : 'low'} risk. This is not the probability of a confirmed diagnosis unless properly validated and calibrated for that interpretation.`
                  : r.modelProbDesc}
              </p>
            </div>

            {/* 2. qSOFA Score */}
            <div className="bg-slate-50/90 rounded-2xl p-4 border border-slate-200/70 hover:border-teal-200 transition-all flex flex-col justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase text-slate-500">{r.qsofaScore}</p>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className={`text-2xl sm:text-3xl font-extrabold font-mono ${result.qsofa_score >= 2 ? 'text-rose-600' : 'text-slate-900'}`}>
                    {result.qsofa_score}
                  </span>
                  <span className="text-xs font-mono text-slate-500">/ 3</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-600 mt-2 leading-relaxed">
                {language === 'en'
                  ? result.qsofa_score >= 2
                    ? 'Two warning signs are present. Urgent medical assessment is needed.'
                    : result.qsofa_score === 1
                    ? 'One warning sign is present. Continued monitoring is needed.'
                    : 'No qSOFA warning signs are currently present.'
                  : result.qsofa_score >= 2 ? r.qsofaHighDesc : r.qsofaLowDesc}
              </p>
            </div>

            {/* 3. SIRS Score */}
            <div className="bg-slate-50/90 rounded-2xl p-4 border border-slate-200/70 hover:border-teal-200 transition-all flex flex-col justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase text-slate-500">{r.sirsScore}</p>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className={`text-2xl sm:text-3xl font-extrabold font-mono ${result.sirs_score >= 2 ? 'text-amber-600' : 'text-slate-900'}`}>
                    {result.sirs_score}
                  </span>
                  <span className="text-xs font-mono text-slate-500">/ 4</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-600 mt-2 leading-relaxed">
                {language === 'en'
                  ? result.sirs_score >= 2
                    ? 'Several signs of inflammation or infection are present.'
                    : 'Few or no signs of systemic inflammation present.'
                  : result.sirs_score >= 2 ? r.sirsHighDesc : r.sirsLowDesc}
              </p>
            </div>

            {/* 4. Shock Index */}
            <div className="bg-slate-50/90 rounded-2xl p-4 border border-slate-200/70 hover:border-teal-200 transition-all flex flex-col justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase text-slate-500">
                  {language === 'en' ? 'Shock Index' : r.shockIndex}
                </p>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className={`text-2xl sm:text-3xl font-extrabold font-mono ${result.shock_index && result.shock_index >= 0.9 ? 'text-rose-600' : 'text-slate-900'}`}>
                    {result.shock_index !== null ? result.shock_index.toFixed(2) : '--'}
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-slate-600 mt-2 leading-relaxed">
                {language === 'en'
                  ? result.shock_index && result.shock_index >= 0.9
                    ? 'The heart rate is high compared with the blood pressure. This can be a warning sign.'
                    : 'Heart rate and blood pressure balance is within normal limits.'
                  : result.shock_index && result.shock_index >= 0.9 ? r.shockElevatedDesc : r.shockNormalDesc}
              </p>
            </div>
          </div>

          {/* Expandable "Learn more" details */}
          {showDetailedScores && (
            <div className="mt-4 p-4 rounded-2xl bg-teal-50/70 border border-teal-200 text-xs text-slate-700 space-y-2 animate-in fade-in">
              <div className="flex items-center gap-1.5 font-bold text-[#007A78]">
                <HelpCircle className="w-4 h-4" />
                <span>Learn more about these medical scores</span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-slate-600 pl-1">
                <li><strong>AI Risk Estimate:</strong> Combines multiple vital signs and laboratory results to provide an early probability indicator. It guides clinical alertness.</li>
                <li><strong>qSOFA (Quick SOFA):</strong> Bedside score checking fast breathing (≥22/min), low blood pressure (≤100 mmHg), and altered alertness. A score ≥ 2 triggers urgent evaluation.</li>
                <li><strong>SIRS (Systemic Inflammatory Response Syndrome):</strong> Evaluates whether the body’s inflammatory defense is active (heart rate, breathing, temperature, WBC).</li>
                <li><strong>Shock Index:</strong> Ratio of heart rate to systolic blood pressure (HR / SBP). Values ≥ 0.9 indicate the heart is working harder to maintain circulation.</li>
              </ul>
            </div>
          )}
        </div>

        {/* ================= 5. PATIENT AND CAREGIVER GUIDANCE ("What Needs to Happen Now?") ================= */}
        <div className="mb-6 p-5 sm:p-6 rounded-2xl bg-teal-50/60 border border-teal-200/90 shadow-2xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <h3 className="text-sm sm:text-base font-extrabold uppercase tracking-wider text-[#007A78] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#007A78]" />
              <span>{language === 'en' ? 'What Needs to Happen Now?' : r.localAdviceTitle}</span>
            </h3>
            <span className="text-[11px] font-bold text-teal-800 bg-teal-100 px-3 py-1 rounded-full border border-teal-200 self-start sm:self-center">
              {language === 'en' ? 'Patient & Caregiver Guidance' : r.localAdviceSubtitle}
            </span>
          </div>

          {/* Explicit disclaimer notice: Treatments managed by trained healthcare professionals */}
          <div className="mb-4 p-3 rounded-xl bg-white/90 border border-teal-200 text-xs text-teal-950 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-[#007A78] shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong>Please Note: </strong>
              {language === 'en'
                ? 'These actions and treatments (such as IV fluids, antibiotics, oxygen, and blood tests) must be performed and managed by trained healthcare professionals in a hospital, not attempted by patients or caregivers at home.'
                : 'முக்கியக் குறிப்பு: இந்த சிகிச்சைகளும் வழிமுறைகளும் மருத்துவமனையில் பயிற்சி பெற்ற மருத்துவர்கள் மற்றும் செவிலியர்களால் மட்டுமே செய்யப்பட வேண்டும்; நோயாளிகளோ குடும்பத்தினரோ சுயமாகச் செய்யக்கூடாது.'}
            </p>
          </div>

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
                    title: 'Give Fluids if the Medical Team Advises',
                    advice: 'A doctor may give fluids through a vein to help improve blood flow and protect the organs. The amount depends on the patient\'s condition.'
                  },
                  {
                    tag: 'Antibiotics',
                    title: 'Start Antibiotics if the Doctor Prescribes Them',
                    advice: 'If a serious bacterial infection is suspected, the medical team may start antibiotics quickly. Treatment should not be delayed unnecessarily.'
                  },
                  {
                    tag: 'Blood Tests',
                    title: 'Do Blood Tests',
                    advice: 'Doctors may test the blood to look for infection, check lactate levels, and see whether organs are working properly. Blood cultures should be collected before antibiotics when this can be done without delaying treatment.'
                  },
                  {
                    tag: 'Breathing Support',
                    title: 'Help the Patient Breathe',
                    advice: 'The medical team may provide oxygen or breathing support if needed.'
                  },
                  {
                    tag: 'Close Monitoring',
                    title: 'Provide Close Hospital Monitoring',
                    advice: 'The patient may need emergency or intensive care, depending on blood pressure, breathing, organ function, and the doctor\'s assessment.'
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

        {/* ================= 6. WHY IS THE RISK HIGH? (Warning Signs Found in the Patient) ================= */}
        <div className="mb-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-blue-600" />
            <span>{language === 'en' ? 'Warning Signs Found in the Patient' : r.contributingFactorsTitle}</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {result.contributing_factors.map((rawFactor, idx) => {
              const factor = translateContributingFactor(rawFactor);
              return (
                <div
                  key={idx}
                  className="bg-slate-50/90 border border-slate-200/80 rounded-xl p-3 flex items-start gap-2.5 text-xs text-slate-800"
                >
                  <span className="w-2 h-2 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                  <span className="font-medium leading-relaxed">{factor}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* ================= 7. HOSPITAL TREATMENT CHECKLIST (Emergency Care Checklist for the Medical Team) ================= */}
        {result.clinical_actions && result.clinical_actions.length > 0 && (
          <div className="mb-6 p-5 rounded-2xl bg-blue-50/60 border border-blue-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2.5">
              <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-blue-950 flex items-center gap-1.5">
                <ClipboardList className="w-4 h-4 text-blue-700" />
                <span>{language === 'en' ? 'Emergency Care Checklist for the Medical Team' : r.hospitalBundleTitle}</span>
              </h3>
              <span className="text-[10px] font-bold text-blue-800 bg-blue-100 px-2.5 py-0.5 rounded-full border border-blue-200 self-start sm:self-center">
                For Trained Healthcare Professionals Only — Not For Self-Treatment
              </span>
            </div>

            <p className="text-[11px] text-blue-900/80 mb-3 italic">
              This checklist is for trained healthcare professionals, not for self-treatment. Treatment timing and fluid amounts must follow current clinical guidelines and the patient's condition.
            </p>

            <ul className="space-y-2">
              {result.clinical_actions.map((rawAct, i) => {
                const act = translateClinicalAction(rawAct);
                return (
                  <li key={i} className="flex items-start gap-2 text-xs text-blue-950 font-medium bg-white/70 p-2.5 rounded-xl border border-blue-100">
                    <ChevronRight className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <span className="leading-relaxed">{act}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        {/* Footer with Response Time & Medical Notice */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-2 font-mono">
            <Timer className="w-3.5 h-3.5 text-blue-600" />
            <span>{r.analysisTime}: {result.execution_time_seconds.toFixed(2)}s</span>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-slate-500 italic max-w-xl text-right">
            <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>Important Notice: This AI result is an early warning, not a confirmed diagnosis. Only a qualified healthcare professional can diagnose and treat sepsis.</span>
          </div>
        </div>

      </div>
    </div>
  );
};
