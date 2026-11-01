import React from 'react';
import { Users, Stethoscope, Sparkles } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

export type ViewMode = 'simple' | 'doctor';

interface ViewToggleProps {
  mode: ViewMode;
  onChange: (mode: ViewMode) => void;
}

export const ViewToggle: React.FC<ViewToggleProps> = ({ mode, onChange }) => {
  const { translations } = useLanguage();
  const exp = translations.explainable?.viewMode;

  return (
    <div className="flex flex-wrap items-center gap-2.5">
      {/* Segmented Toggle Control */}
      <div className="inline-flex items-center p-1 bg-slate-100/90 rounded-2xl border border-slate-200 shadow-2xs">
        {/* Simple View Button */}
        <button
          type="button"
          onClick={() => onChange('simple')}
          className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer whitespace-nowrap ${
            mode === 'simple'
              ? 'bg-[#007A78] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
          aria-pressed={mode === 'simple'}
        >
          <Users className="w-4 h-4 shrink-0" />
          <span>{exp?.simple || 'Simple View (Patient & Family)'}</span>
          <span
            className={`text-[10px] font-black uppercase px-1.5 py-0.5 rounded-full ${
              mode === 'simple' ? 'bg-white/25 text-white' : 'bg-slate-200 text-slate-600'
            }`}
          >
            Default
          </span>
        </button>

        {/* Doctor View Button */}
        <button
          type="button"
          onClick={() => onChange('doctor')}
          className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer whitespace-nowrap ${
            mode === 'doctor'
              ? 'bg-blue-700 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
          }`}
          aria-pressed={mode === 'doctor'}
        >
          <Stethoscope className="w-4 h-4 shrink-0" />
          <span>{exp?.doctor || 'Doctor View (Clinical & SHAP)'}</span>
        </button>
      </div>

      {/* Mode Guidance Subtitle */}
      <div className="hidden xl:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-teal-50/60 border border-teal-200/80 text-[11px] font-semibold text-teal-900 whitespace-nowrap">
        <Sparkles className="w-3.5 h-3.5 text-[#007A78] shrink-0" />
        <span>
          {mode === 'simple'
            ? exp?.simpleSubtitle || 'Easy-to-understand explanations with visual meters'
            : exp?.doctorSubtitle || 'Detailed clinical metrics, SHAP contributions & protocol'}
        </span>
      </div>
    </div>
  );
};
