import React from 'react';
import { AlertOctagon, AlertTriangle, CheckCircle, ShieldAlert, HeartPulse } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

interface RiskCardProps {
  riskLevel: 'High' | 'Moderate' | 'Low';
  probability: number;
}

export const RiskCard: React.FC<RiskCardProps> = ({ riskLevel, probability }) => {
  const { translations } = useLanguage();
  const tLight = translations.explainable?.trafficLight;

  const isHigh = riskLevel === 'High';
  const isModerate = riskLevel === 'Moderate';

  // Visual traffic light theme
  const theme = isHigh
    ? {
        bg: 'bg-gradient-to-br from-rose-50 via-rose-100/60 to-red-50',
        border: 'border-2 border-rose-400/90',
        glow: 'shadow-lg shadow-rose-200/50 ring-4 ring-rose-500/15',
        badge: 'bg-rose-600 text-white border-rose-700',
        iconBg: 'bg-rose-600 text-white shadow-md shadow-rose-300 ring-4 ring-rose-200',
        titleColor: 'text-rose-950',
        textColor: 'text-rose-900',
        emoji: '🔴',
        badgeText: tLight?.highBadge || 'HIGH RISK',
        title: tLight?.highTitle || 'High Risk (Romba Aabathu)',
        sentence: tLight?.highSentence || 'This patient has a high chance of sepsis. Immediate medical assessment by a doctor is urgently required.'
      }
    : isModerate
    ? {
        bg: 'bg-gradient-to-br from-amber-50 via-amber-100/60 to-yellow-50',
        border: 'border-2 border-amber-400/90',
        glow: 'shadow-lg shadow-amber-200/50 ring-4 ring-amber-500/15',
        badge: 'bg-amber-600 text-white border-amber-700',
        iconBg: 'bg-amber-500 text-white shadow-md shadow-amber-300 ring-4 ring-amber-200',
        titleColor: 'text-amber-950',
        textColor: 'text-amber-900',
        emoji: '🟡',
        badgeText: tLight?.moderateBadge || 'MODERATE RISK',
        title: tLight?.moderateTitle || 'Moderate Risk (Echarikkai / Nadhutharam)',
        sentence: tLight?.moderateSentence || 'Warning signs of developing infection are present. A healthcare professional should evaluate the patient promptly.'
      }
    : {
        bg: 'bg-gradient-to-br from-emerald-50 via-teal-50 to-emerald-100/50',
        border: 'border-2 border-emerald-400/90',
        glow: 'shadow-lg shadow-emerald-200/50 ring-4 ring-emerald-500/15',
        badge: 'bg-emerald-600 text-white border-emerald-700',
        iconBg: 'bg-emerald-600 text-white shadow-md shadow-emerald-300 ring-4 ring-emerald-200',
        titleColor: 'text-emerald-950',
        textColor: 'text-emerald-900',
        emoji: '🟢',
        badgeText: tLight?.lowBadge || 'LOW RISK',
        title: tLight?.lowTitle || 'Low Risk (Bayappada Theva Illa)',
        sentence: tLight?.lowSentence || 'The patient’s vital signs are currently within safe baseline limits. Continue routine care and seek medical help if symptoms worsen.'
      };

  return (
    <div
      className={`w-full rounded-3xl p-6 sm:p-7 ${theme.bg} ${theme.border} ${theme.glow} transition-all animate-in fade-in slide-in-from-top-3 duration-300`}
      role="region"
      aria-label="Traffic Light Risk Indicator"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
        <div className="flex items-start gap-4">
          {/* Traffic light icon container */}
          <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center shrink-0 ${theme.iconBg}`}>
            {isHigh ? (
              <AlertOctagon className="w-8 h-8 sm:w-9 sm:h-9 stroke-[2.4] animate-pulse" />
            ) : isModerate ? (
              <AlertTriangle className="w-8 h-8 sm:w-9 sm:h-9 stroke-[2.4]" />
            ) : (
              <CheckCircle className="w-8 h-8 sm:w-9 sm:h-9 stroke-[2.4]" />
            )}
          </div>

          <div className="space-y-1.5">
            {/* Top Emoji & Badge */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xl" role="img" aria-hidden="true">
                {theme.emoji}
              </span>
              <span className={`text-xs font-black tracking-wider uppercase px-3 py-1 rounded-full border shadow-2xs ${theme.badge}`}>
                {theme.badgeText}
              </span>
              <span className="text-xs font-bold text-slate-500 bg-white/70 px-2.5 py-0.5 rounded-md border border-slate-200/80">
                AI Risk Index: {(probability * 100).toFixed(0)}%
              </span>
            </div>

            {/* Clear, bold, readable title */}
            <h2 className={`text-xl sm:text-2xl font-black tracking-tight leading-snug ${theme.titleColor}`}>
              {theme.title}
            </h2>

            {/* One clear, compassionate, actionable sentence */}
            <p className={`text-sm sm:text-base font-semibold leading-relaxed max-w-3xl ${theme.textColor}`}>
              {theme.sentence}
            </p>
          </div>
        </div>

        {/* Visual traffic light indicator pills */}
        <div className="hidden lg:flex flex-col items-center gap-2 p-2.5 bg-white/80 rounded-2xl border border-slate-200/80 shadow-2xs self-center shrink-0">
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
              isHigh ? 'bg-rose-500 text-white ring-4 ring-rose-200 shadow-sm' : 'bg-rose-200 opacity-40'
            }`}
            title="Red - High Risk"
          >
            <span className="w-2 h-2 rounded-full bg-white" />
          </div>
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
              isModerate ? 'bg-amber-500 text-white ring-4 ring-amber-200 shadow-sm' : 'bg-amber-200 opacity-40'
            }`}
            title="Yellow - Moderate Risk"
          >
            <span className="w-2 h-2 rounded-full bg-white" />
          </div>
          <div
            className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
              !isHigh && !isModerate ? 'bg-emerald-500 text-white ring-4 ring-emerald-200 shadow-sm' : 'bg-emerald-200 opacity-40'
            }`}
            title="Green - Low Risk"
          >
            <span className="w-2 h-2 rounded-full bg-white" />
          </div>
        </div>
      </div>
    </div>
  );
};

