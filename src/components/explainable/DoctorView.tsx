import React from 'react';
import { EvaluatedFactor } from '../../config/factorConfig';
import { SepsisPredictionResponse } from '../../types';
import { useLanguage } from '../../i18n/LanguageContext';
import {
  Activity,
  HeartPulse,
  Stethoscope,
  ClipboardList,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Info,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon
} from 'lucide-react';

interface DoctorViewProps {
  result: SepsisPredictionResponse;
  factors: EvaluatedFactor[];
}

export const DoctorView: React.FC<DoctorViewProps> = ({ result, factors }) => {
  const { language, translations, translateClinicalAction } = useLanguage();
  const dv = translations.explainable?.doctorView;
  const expFactors = translations.explainable?.factors;

  const isHigh = result.risk_level === 'High';
  const isModerate = result.risk_level === 'Moderate';
  const percentage = (result.probability * 100).toFixed(0);

  // Sort factors for SHAP chart: largest absolute impact first
  const shapSorted = [...factors].sort((a, b) => Math.abs(b.shapDelta) - Math.abs(a.shapDelta));

  return (
    <div className="w-full space-y-7 animate-in fade-in duration-300">
      {/* Doctor View Header Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-900 text-white shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Stethoscope className="w-5 h-5 text-sky-400" />
              <span className="text-xs font-black uppercase tracking-wider text-sky-300">
                {dv?.title || 'Clinical & Diagnostic Dashboard (Doctor View)'}
              </span>
            </div>
            <h3 className="text-lg sm:text-xl font-black">
              {result.risk_level} Risk Stratification — ML Probability Index: {percentage}%
            </h3>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl">
              Calibrated logistic regression baseline with qSOFA, SIRS criteria, and organ hypoperfusion markers.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span
              className={`px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider border ${
                isHigh
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500'
                  : isModerate
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500'
                  : 'bg-emerald-500/20 text-emerald-300 border-emerald-500'
              }`}
            >
              {result.risk_level} RISK
            </span>
          </div>
        </div>
      </div>

      {/* ================= 1. SHAP FEATURE IMPORTANCE CHART ================= */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
                {dv?.shapTitle || 'SHAP-Style Feature Contribution to Risk'}
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {dv?.shapDesc ||
                'Red bars indicate features elevating sepsis risk; green bars indicate protective or normalized physiological parameters.'}
            </p>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-3 text-xs font-bold self-start sm:self-center">
            <span className="flex items-center gap-1 text-rose-700">
              <span className="w-3 h-3 rounded-sm bg-rose-500" />
              <span>{dv?.riskIncreases || 'Increases Risk (+)'}</span>
            </span>
            <span className="flex items-center gap-1 text-emerald-700">
              <span className="w-3 h-3 rounded-sm bg-emerald-500" />
              <span>{dv?.riskDecreases || 'Protective / Normal (-)'}</span>
            </span>
          </div>
        </div>

        {/* Horizontal Bar Chart */}
        <div className="space-y-3 pt-2">
          {shapSorted.map((f) => {
            const isPositive = f.shapDelta > 0;
            const barWidth = Math.min(100, Math.max(10, Math.abs(f.shapDelta) * 2.5));
            const trInfo = expFactors?.[f.key as keyof typeof expFactors];

            return (
              <div key={f.key} className="flex flex-col sm:flex-row sm:items-center gap-2 text-xs">
                {/* Parameter & Doctor Term */}
                <div className="w-full sm:w-56 shrink-0 flex items-center justify-between sm:justify-start gap-1.5 font-bold text-slate-800">
                  <div className="flex items-center gap-1.5">
                    <span role="img" aria-hidden="true">{f.config.icon}</span>
                    <span className="truncate">{trInfo?.name || f.config.nameKey}</span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-500 sm:hidden">
                    {f.value} {f.config.unit}
                  </span>
                </div>

                {/* Split Center Bar Track */}
                <div className="flex-1 h-7 bg-slate-100 rounded-lg relative overflow-hidden flex items-center px-2 border border-slate-200/80">
                  {/* Center midline */}
                  <div className="absolute left-1/2 top-0 bottom-0 w-px bg-slate-300 z-10" />

                  {isPositive ? (
                    // Positive (Risk Increasing) bar extending right
                    <div
                      className="absolute left-1/2 top-1 bottom-1 bg-gradient-to-r from-rose-400 to-rose-600 rounded-r-md transition-all flex items-center justify-end pr-2 text-white font-mono text-[10px] font-black shadow-2xs"
                      style={{ width: `${barWidth / 2}%` }}
                    >
                      +{f.shapDelta}%
                    </div>
                  ) : (
                    // Negative (Protective / Normal) bar extending left
                    <div
                      className="absolute right-1/2 top-1 bottom-1 bg-gradient-to-l from-emerald-400 to-emerald-600 rounded-l-md transition-all flex items-center justify-start pl-2 text-white font-mono text-[10px] font-black shadow-2xs"
                      style={{ width: `${barWidth / 2}%` }}
                    >
                      {f.shapDelta}%
                    </div>
                  )}

                  {/* Subtle label within track */}
                  <span className="relative z-20 text-[10px] font-semibold text-slate-500 ml-auto hidden sm:inline-block">
                    {f.value} {f.config.unit}
                  </span>
                </div>

                {/* Doctor Clinical Term */}
                <div className="w-48 shrink-0 text-[11px] font-bold text-slate-600 hidden md:block truncate pl-2">
                  {trInfo?.doctorTerm || f.config.doctorTermKey}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ================= 2. CLINICAL PARAMETERS TABLE ================= */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm space-y-4">
        <h3 className="text-sm sm:text-base font-extrabold text-slate-900 flex items-center gap-2">
          <Activity className="w-4 h-4 text-blue-600" />
          <span>{dv?.tableTitle || 'Physiological Parameters & Diagnostic Terminology'}</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider font-extrabold text-[10px] bg-slate-50/80">
                <th className="py-2.5 px-3 rounded-l-lg">{dv?.colParameter || 'Parameter'}</th>
                <th className="py-2.5 px-3">{dv?.colDoctorTerm || 'Clinical Term'}</th>
                <th className="py-2.5 px-3">{dv?.colPatientValue || 'Patient Value'}</th>
                <th className="py-2.5 px-3">{dv?.colNormalRange || 'Reference Range'}</th>
                <th className="py-2.5 px-3">{dv?.colStatus || 'Status'}</th>
                <th className="py-2.5 px-3 rounded-r-lg text-right">{dv?.colShapImpact || 'Impact'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {factors.map((f) => {
                const trInfo = expFactors?.[f.key as keyof typeof expFactors];
                const isCrit = f.status === 'critical';
                const isAbn = f.status === 'abnormal';

                return (
                  <tr key={f.key} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2.5 px-3 font-bold text-slate-900 flex items-center gap-1.5">
                      <span>{f.config.icon}</span>
                      <span>{trInfo?.name || f.config.nameKey}</span>
                    </td>
                    <td className="py-2.5 px-3 font-semibold text-blue-900">
                      {trInfo?.doctorTerm || f.config.doctorTermKey}
                    </td>
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-900">
                      {f.value} {f.config.unit}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-500">
                      {f.config.normalRange[0]} – {f.config.normalRange[1]} {f.config.unit}
                    </td>
                    <td className="py-2.5 px-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold text-[10px] uppercase ${
                          isCrit
                            ? 'bg-rose-100 text-rose-800'
                            : isAbn
                            ? 'bg-amber-100 text-amber-900'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {isCrit ? 'Critical' : isAbn ? 'Abnormal' : 'Normal'}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-extrabold">
                      <span className={f.shapDelta > 0 ? 'text-rose-600' : 'text-emerald-600'}>
                        {f.shapDelta > 0 ? `+${f.shapDelta}%` : `${f.shapDelta}%`}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= 3. DIAGNOSTIC SCORES & PROTOCOLS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* qSOFA Score */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2">
          <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
            {dv?.qsofaTitle || 'qSOFA Score'}
          </p>
          <div className="flex items-baseline gap-1.5">
            <span
              className={`text-3xl font-black font-mono ${
                result.qsofa_score >= 2 ? 'text-rose-600' : 'text-slate-900'
              }`}
            >
              {result.qsofa_score}
            </span>
            <span className="text-xs font-mono text-slate-400">/ 3</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            {result.qsofa_score >= 2
              ? 'Meets quick Sepsis Organ Failure criteria (≥2). Urgent ICU/emergency sepsis evaluation required.'
              : result.qsofa_score === 1
              ? 'Sub-threshold bedside score (1). Close vital sign monitoring warranted.'
              : 'Zero qSOFA points currently met.'}
          </p>
        </div>

        {/* SIRS Score */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2">
          <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
            {dv?.sirsTitle || 'SIRS Criteria'}
          </p>
          <div className="flex items-baseline gap-1.5">
            <span
              className={`text-3xl font-black font-mono ${
                result.sirs_score >= 2 ? 'text-amber-600' : 'text-slate-900'
              }`}
            >
              {result.sirs_score}
            </span>
            <span className="text-xs font-mono text-slate-400">/ 4</span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            {result.sirs_score >= 2
              ? 'Meets systemic inflammatory response criteria (HR, RR, Temp, WBC).'
              : 'Sub-threshold systemic inflammation.'}
          </p>
        </div>

        {/* Shock Index */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs space-y-2">
          <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
            {dv?.shockIndexTitle || 'Shock Index (HR / SBP)'}
          </p>
          <div className="flex items-baseline gap-1.5">
            <span
              className={`text-3xl font-black font-mono ${
                result.shock_index && result.shock_index >= 0.9 ? 'text-rose-600' : 'text-slate-900'
              }`}
            >
              {result.shock_index !== null ? result.shock_index.toFixed(2) : '--'}
            </span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            {result.shock_index && result.shock_index >= 0.9
              ? 'Elevated ratio (≥0.9). Early marker of occult hemodynamic hypoperfusion.'
              : 'Normal hemodynamic balance (<0.7).'}
          </p>
        </div>
      </div>

      {/* ================= 4. HOSPITAL 1-HOUR PROTOCOL CHECKLIST ================= */}
      {result.clinical_actions && result.clinical_actions.length > 0 && (
        <div className="p-6 rounded-3xl bg-blue-50/70 border border-blue-200 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-blue-950 flex items-center gap-2">
              <ClipboardList className="w-4 h-4 text-blue-700" />
              <span>{dv?.bundleTitle || 'Surviving Sepsis Campaign 1-Hour Care Bundle Checklist'}</span>
            </h3>
            <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200 self-start sm:self-center">
              Hospital Protocol
            </span>
          </div>

          <div className="space-y-2 pt-1">
            {result.clinical_actions.map((act, i) => (
              <div
                key={i}
                className="flex items-start gap-2.5 p-3 rounded-xl bg-white/90 border border-blue-100 text-xs text-blue-950 font-medium shadow-2xs"
              >
                <ChevronRight className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{translateClinicalAction(act)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

