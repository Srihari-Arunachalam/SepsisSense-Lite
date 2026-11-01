import React from 'react';
import { AlertCircle, CheckCircle, ShieldAlert, PhoneCall, ChevronRight, Info } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

interface ActionBoxProps {
  riskLevel: 'High' | 'Moderate' | 'Low';
}

export const ActionBox: React.FC<ActionBoxProps> = ({ riskLevel }) => {
  const { translations } = useLanguage();
  const act = translations.explainable?.actionBox;

  const isHigh = riskLevel === 'High';
  const isModerate = riskLevel === 'Moderate';

  const steps = isHigh
    ? act?.highRiskSteps || [
        'Seek immediate medical care at the nearest hospital or emergency room.',
        'Inform the doctor: "I am concerned about possible sepsis."',
        'Ensure the patient remains hydrated if conscious; do not allow them to sleep off severe worsening symptoms.',
        'Follow instructions from trained medical professionals without delay.'
      ]
    : isModerate
    ? act?.moderateRiskSteps || [
        'Arrange a prompt medical checkup with a doctor or health clinic.',
        'Recheck temperature, breathing rate, and heart rate every 1 to 2 hours.',
        'Take prescribed antibiotics or medications exactly as directed by the doctor.',
        'Seek emergency medical care immediately if sudden high fever, rapid breathing, or confusion develops.'
      ]
    : act?.lowRiskSteps || [
        'Continue regular rest, routine recovery, and adequate hydration.',
        'Monitor for any emerging infection symptoms (fever, chills, persistent cough, or pain).',
        'Contact a doctor if new symptoms appear or the patient’s condition deteriorates.'
      ];

  const theme = isHigh
    ? {
        bg: 'bg-rose-50/90 border-2 border-rose-300',
        headerText: 'text-rose-950',
        badge: 'bg-rose-600 text-white',
        badgeText: act?.highRiskBadge || '🚨 Immediate Emergency Action Required',
        stepIconBg: 'bg-rose-100 text-rose-700 border-rose-200'
      }
    : isModerate
    ? {
        bg: 'bg-amber-50/90 border-2 border-amber-300',
        headerText: 'text-amber-950',
        badge: 'bg-amber-600 text-white',
        badgeText: act?.moderateRiskBadge || '⚠️ Prompt Medical Evaluation Required',
        stepIconBg: 'bg-amber-100 text-amber-800 border-amber-200'
      }
    : {
        bg: 'bg-teal-50/80 border-2 border-teal-300',
        headerText: 'text-teal-950',
        badge: 'bg-[#007A78] text-white',
        badgeText: act?.lowRiskBadge || '✅ Safe Routine Monitoring Guidance',
        stepIconBg: 'bg-teal-100 text-teal-800 border-teal-200'
      };

  return (
    <div className={`w-full rounded-3xl p-6 sm:p-7 ${theme.bg} shadow-sm my-6 transition-all`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-4 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full ${theme.badge}`}>
              {theme.badgeText}
            </span>
          </div>
          <h3 className={`text-lg sm:text-xl font-black tracking-tight ${theme.headerText}`}>
            {act?.title || 'What Should I Do Next? (Enna Pannanum?)'}
          </h3>
          <p className="text-xs sm:text-sm font-medium text-slate-600 mt-0.5">
            {act?.subtitle || 'Clear emergency medical guidance based on current risk level'}
          </p>
        </div>

        {isHigh && (
          <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-rose-600 text-white text-xs font-black shadow-xs shrink-0 self-start sm:self-center">
            <PhoneCall className="w-4 h-4 animate-bounce" />
            <span>Emergency Care Needed</span>
          </div>
        )}
      </div>

      {/* Action Steps List */}
      <div className="mt-5 space-y-3">
        {steps.map((step, idx) => (
          <div
            key={idx}
            className="flex items-start gap-3 bg-white/90 p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 shadow-2xs hover:border-slate-300 transition-colors"
          >
            <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 mt-0.5 border font-black text-xs ${theme.stepIconBg}`}>
              {idx + 1}
            </div>
            <div className="flex-1">
              <p className="text-xs sm:text-sm font-bold text-slate-900 leading-relaxed">
                {step}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Medical Safety Disclaimer Note */}
      <div className="mt-5 p-3 rounded-xl bg-white/80 border border-slate-200/70 flex items-start gap-2 text-slate-600 text-xs leading-relaxed">
        <Info className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
        <p className="italic">
          {act?.importantNotice ||
            'Important: AI results provide early risk stratification, not a diagnosis. Sepsis treatments must always be administered by healthcare professionals in a clinic or hospital.'}
        </p>
      </div>
    </div>
  );
};

