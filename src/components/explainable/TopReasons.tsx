import React, { useState } from 'react';
import { EvaluatedFactor } from '../../config/factorConfig';
import { FactorCard } from './FactorCard';
import { ChevronDown, Sparkles, Filter } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';

interface TopReasonsProps {
  factors: EvaluatedFactor[];
  showDoctorTerms?: boolean;
}

export const TopReasons: React.FC<TopReasonsProps> = ({ factors, showDoctorTerms = false }) => {
  const { translations } = useLanguage();
  const tr = translations.explainable?.topReasons;

  const [expanded, setExpanded] = useState(false);

  // Sort factors by importance:
  // 1. Critical first (highest risk points)
  // 2. Abnormal next
  // 3. Normal last
  const sortedFactors = [...factors].sort((a, b) => {
    if (b.riskPoints !== a.riskPoints) {
      return b.riskPoints - a.riskPoints;
    }
    return Math.abs(b.shapDelta) - Math.abs(a.shapDelta);
  });

  const top3 = sortedFactors.slice(0, 3);
  const remaining = sortedFactors.slice(3);
  const displayedFactors = expanded ? sortedFactors : top3;

  return (
    <div className="w-full my-6 space-y-4">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-teal-100 text-[#007A78] flex items-center justify-center font-bold">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight">
              {tr?.title || 'Top 3 Key Contributing Factors (Mukkiyamaana 3 Kaaranam)'}
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              {tr?.subtitle || 'The primary physiological parameters driving this assessment'}
            </p>
          </div>
        </div>

        {/* Counter Pill */}
        <span className="text-xs font-bold px-3 py-1 bg-slate-100 text-slate-700 rounded-full border border-slate-200 self-start sm:self-center">
          {expanded ? sortedFactors.length : top3.length} / {sortedFactors.length} Factors
        </span>
      </div>

      {/* Grid of Factor Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {displayedFactors.map((factor, idx) => (
          <FactorCard
            key={factor.key}
            factor={factor}
            rank={idx + 1}
            showDoctorTerm={showDoctorTerms}
          />
        ))}
      </div>

      {/* Expand / Collapse Button */}
      {remaining.length > 0 && (
        <div className="flex justify-center pt-2">
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white hover:bg-slate-50 text-slate-800 text-xs sm:text-sm font-extrabold rounded-full border border-slate-300 shadow-2xs hover:shadow-xs transition-all cursor-pointer"
          >
            <Filter className="w-3.5 h-3.5 text-[#007A78]" />
            <span>
              {expanded
                ? tr?.hideAll || 'Show Top 3 Only (Mukkiyamaana 3 Mattum)'
                : `${tr?.viewAll || 'View All Factors (Ellam Paarkka)'} (${sortedFactors.length})`}
            </span>
            <ChevronDown
              className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${
                expanded ? 'rotate-180' : ''
              }`}
            />
          </button>
        </div>
      )}
    </div>
  );
};

