import React, { useState } from 'react';
import { EvaluatedFactor } from '../../config/factorConfig';
import { RangeMeter } from './RangeMeter';
import { CheckCircle2, AlertTriangle, AlertOctagon, HelpCircle } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

interface FactorCardProps {
  factor: EvaluatedFactor;
  rank?: number;
  showDoctorTerm?: boolean;
}

export const FactorCard: React.FC<FactorCardProps> = ({ factor, rank, showDoctorTerm = false }) => {
  const { translations } = useLanguage();
  const exp = translations.explainable;
  const factorTranslation = exp?.factors?.[factor.key as keyof typeof exp.factors];
  const tr = exp?.topReasons;

  const [showTooltip, setShowTooltip] = useState(false);

  const isCritical = factor.status === 'critical';
  const isAbnormal = factor.status === 'abnormal';
  const isNormal = factor.status === 'normal';

  // Card theme styling
  const cardTheme = isCritical
    ? {
        bg: 'bg-rose-50/70 border-rose-300 ring-2 ring-rose-400/20',
        badgeBg: 'bg-rose-100 text-rose-800 border-rose-300',
        icon: <AlertOctagon className="w-4 h-4 text-rose-600 shrink-0" />,
        statusText: tr?.dangerStatus || '🚨 Critical Danger',
        valColor: 'text-rose-700'
      }
    : isAbnormal
    ? {
        bg: 'bg-amber-50/70 border-amber-300 ring-2 ring-amber-400/20',
        badgeBg: 'bg-amber-100 text-amber-900 border-amber-300',
        icon: <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />,
        statusText: tr?.warningStatus || '⚠️ Warning Sign',
        valColor: 'text-amber-800'
      }
    : {
        bg: 'bg-emerald-50/60 border-emerald-200 ring-1 ring-emerald-300/20',
        badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        icon: <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />,
        statusText: tr?.normalStatus || '✅ Normal-ah irukku',
        valColor: 'text-emerald-800'
      };

  // Determine explanation sentence
  const simpleExplanation = isNormal
    ? factorTranslation?.simpleNormal || 'Normal level. Within safe healthy range.'
    : factor.statusVariant === 'low'
    ? factorTranslation?.simpleAbnormalLow || factorTranslation?.simpleAbnormalHigh || 'Abnormally low level.'
    : factorTranslation?.simpleAbnormalHigh || 'Abnormally high level.';

  return (
    <div
      className={`rounded-2xl p-4 sm:p-5 border transition-all ${cardTheme.bg} shadow-2xs hover:shadow-xs relative flex flex-col justify-between`}
    >
      <div>
        {/* Header: Icon, Name, Rank, and Status Badge */}
        <div className="flex flex-wrap sm:flex-nowrap items-start justify-between gap-2.5 mb-2.5">
          <div className="flex items-center gap-2 min-w-0">
            {/* Emoji container */}
            <span className="text-xl sm:text-2xl shrink-0 p-1 bg-white rounded-xl shadow-2xs border border-slate-200/60" role="img" aria-hidden="true">
              {factor.config.icon}
            </span>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                  {factorTranslation?.name || factor.config.nameKey}
                </h3>

                {/* Optional Help / Tooltip */}
                <div className="relative inline-block">
                  <button
                    type="button"
                    onClick={() => setShowTooltip(!showTooltip)}
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                    className="text-slate-400 hover:text-slate-600 p-0.5 focus:outline-none"
                    aria-label="Information about parameter"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                  </button>

                  {showTooltip && (
                    <div className="absolute left-0 bottom-6 w-64 p-2.5 bg-slate-900 text-white text-[11px] font-normal leading-relaxed rounded-xl shadow-xl z-30 animate-in fade-in">
                      {factorTranslation?.tooltip || 'Clinical parameter contributing to sepsis assessment.'}
                    </div>
                  )}
                </div>

                {rank && rank <= 3 && !isNormal && (
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-rose-600 text-white shadow-2xs">
                    #{rank}
                  </span>
                )}
              </div>

              {/* Doctor Term (shown in Doctor View or subtle subtitle) */}
              {showDoctorTerm && (
                <p className="text-[11px] font-semibold text-blue-700 italic truncate">
                  {factorTranslation?.doctorTerm || factor.config.doctorTermKey}
                </p>
              )}
            </div>
          </div>

          {/* Status Badge */}
          <div className={`px-2.5 py-1 rounded-full text-[11px] sm:text-xs font-bold border flex items-center gap-1.5 shrink-0 whitespace-nowrap self-start ${cardTheme.badgeBg}`}>
            {cardTheme.icon}
            <span>{cardTheme.statusText}</span>
          </div>
        </div>

        {/* Patient's Actual Reading */}
        <div className="my-2.5 flex items-baseline gap-2 bg-white/70 px-3 py-1.5 rounded-xl border border-slate-200/60 w-fit">
          <span className="text-xs font-semibold text-slate-500">
            {tr?.patientValue || 'Patient Value'}:
          </span>
          <span className={`text-base sm:text-lg font-black font-mono ${cardTheme.valColor}`}>
            {factor.value} {factor.config.unit}
          </span>
        </div>

        {/* Simple Language Explanation Sentence */}
        <p className="text-xs sm:text-sm font-semibold text-slate-800 my-2 leading-relaxed">
          {simpleExplanation}
        </p>
      </div>

      {/* Visual Range Meter */}
      <div className="mt-3 pt-3 border-t border-slate-200/60">
        <RangeMeter
          config={factor.config}
          value={factor.value}
          status={factor.status}
          percentage={factor.percentage}
        />
      </div>
    </div>
  );
};

