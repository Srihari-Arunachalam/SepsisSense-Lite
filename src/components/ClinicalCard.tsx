import React, { useState } from 'react';
import {
  User,
  Stethoscope,
  FlaskConical,
  Activity,
  Info,
  ChevronDown,
  Loader2,
  CheckCircle2
} from 'lucide-react';
import { PatientFormState, BloodGroup } from '../types';
import { useLanguage } from '../i18n/LanguageContext';

interface ClinicalCardProps {
  form: PatientFormState;
  bloodGroup: BloodGroup;
  onFieldChange: (field: keyof PatientFormState, value: string) => void;
  onBloodGroupChange: (bg: BloodGroup) => void;
  onAnalyze: () => void;
  onClear?: () => void;
  isAnalyzing: boolean;
}

export const ClinicalCard: React.FC<ClinicalCardProps> = ({
  form,
  bloodGroup,
  onFieldChange,
  onBloodGroupChange,
  onAnalyze,
  onClear,
  isAnalyzing
}) => {
  const { translations } = useLanguage();
  const f = translations.form;
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);

  // Count required fields filled (7 required: age, temp, hr, rr, sbp, lactate, creatinine)
  const requiredFields: (keyof PatientFormState)[] = [
    'age',
    'temperature',
    'heart_rate',
    'respiratory_rate',
    'systolic_bp',
    'lactate',
    'creatinine'
  ];

  const filledCount = requiredFields.filter((field) => form[field] && form[field].trim() !== '').length;
  const remainingCount = 7 - filledCount;

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm max-w-4xl w-full mx-auto overflow-hidden">
      <div className="p-6 sm:p-8 space-y-7">
        {/* ================= SECTION 1: PATIENT INFORMATION ================= */}
        <div>
          <div className="flex items-center gap-2 text-[#007A78] text-xs font-bold uppercase tracking-wider mb-3">
            <User className="w-4 h-4 stroke-[2.2]" />
            <span>{f.patientInfo}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {/* Age */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  <label htmlFor="field-age" className="text-sm font-semibold text-slate-800">
                    {f.age}
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onMouseEnter={() => setActiveTooltip('age')}
                      onMouseLeave={() => setActiveTooltip(null)}
                      onClick={() => setActiveTooltip(activeTooltip === 'age' ? null : 'age')}
                      className="text-slate-400 hover:text-slate-600 focus:outline-none"
                    >
                      <Info className="w-3.5 h-3.5" />
                    </button>
                    {activeTooltip === 'age' && (
                      <div className="absolute left-0 top-5 w-64 p-2 bg-slate-900 text-white text-[11px] rounded-lg shadow-lg z-50 leading-relaxed animate-in fade-in">
                        {f.tooltips.age}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="relative flex items-center">
                <input
                  id="field-age"
                  type="number"
                  step="1"
                  min="0"
                  max="125"
                  value={form.age}
                  onChange={(e) => onFieldChange('age', e.target.value)}
                  placeholder={f.agePlaceholder}
                  className="w-full h-11 pl-4 pr-16 bg-white border border-slate-200 rounded-xl text-slate-900 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-[#007A78]/20 focus:border-[#007A78] transition-all"
                />
                <span className="absolute right-4 text-xs font-normal text-slate-400 pointer-events-none">
                  yrs
                </span>
              </div>
            </div>

            {/* Blood Group */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="field-blood-group" className="text-sm font-semibold text-slate-800">
                  {f.bloodGroup}
                </label>
              </div>

              <div className="relative flex items-center">
                <select
                  id="field-blood-group"
                  value={bloodGroup}
                  onChange={(e) => onBloodGroupChange(e.target.value as BloodGroup)}
                  className="w-full h-11 px-4 bg-white border border-slate-200 rounded-xl text-slate-900 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-[#007A78]/20 focus:border-[#007A78] transition-all appearance-none cursor-pointer"
                >
                  <option value="">{f.bloodGroupSelect}</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
                <ChevronDown className="w-4 h-4 text-slate-400 absolute right-4 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* ================= SECTION 2: VITAL SIGNS ================= */}
        <div>
          <div className="flex items-center gap-2 text-[#007A78] text-xs font-bold uppercase tracking-wider mb-3">
            <Stethoscope className="w-4 h-4 stroke-[2.2]" />
            <span>{f.vitalSigns}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {/* Temperature */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  <label htmlFor="field-temp" className="text-sm font-semibold text-slate-800">
                    {f.temp}
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onMouseEnter={() => setActiveTooltip('temp')}
                      onMouseLeave={() => setActiveTooltip(null)}
                      onClick={() => setActiveTooltip(activeTooltip === 'temp' ? null : 'temp')}
                      className="text-slate-400 hover:text-slate-600 focus:outline-none"
                    >
                      <Info className="w-3.5 h-3.5" />
                    </button>
                    {activeTooltip === 'temp' && (
                      <div className="absolute left-0 top-5 w-64 p-2 bg-slate-900 text-white text-[11px] rounded-lg shadow-lg z-50 leading-relaxed animate-in fade-in">
                        {f.tooltips.temperature}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="relative flex items-center">
                <input
                  id="field-temp"
                  type="number"
                  step="0.1"
                  min="28"
                  max="45"
                  value={form.temperature}
                  onChange={(e) => onFieldChange('temperature', e.target.value)}
                  placeholder={f.tempPlaceholder}
                  className="w-full h-11 pl-4 pr-16 bg-white border border-slate-200 rounded-xl text-slate-900 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-[#007A78]/20 focus:border-[#007A78] transition-all"
                />
                <span className="absolute right-4 text-xs font-normal text-slate-400 pointer-events-none">
                  °C
                </span>
              </div>
            </div>

            {/* Heart Rate */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  <label htmlFor="field-hr" className="text-sm font-semibold text-slate-800">
                    {f.heartRate}
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onMouseEnter={() => setActiveTooltip('hr')}
                      onMouseLeave={() => setActiveTooltip(null)}
                      onClick={() => setActiveTooltip(activeTooltip === 'hr' ? null : 'hr')}
                      className="text-slate-400 hover:text-slate-600 focus:outline-none"
                    >
                      <Info className="w-3.5 h-3.5" />
                    </button>
                    {activeTooltip === 'hr' && (
                      <div className="absolute left-0 top-5 w-64 p-2 bg-slate-900 text-white text-[11px] rounded-lg shadow-lg z-50 leading-relaxed animate-in fade-in">
                        {f.tooltips.heart_rate}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="relative flex items-center">
                <input
                  id="field-hr"
                  type="number"
                  step="1"
                  min="20"
                  max="300"
                  value={form.heart_rate}
                  onChange={(e) => onFieldChange('heart_rate', e.target.value)}
                  placeholder={f.heartRatePlaceholder}
                  className="w-full h-11 pl-4 pr-16 bg-white border border-slate-200 rounded-xl text-slate-900 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-[#007A78]/20 focus:border-[#007A78] transition-all"
                />
                <span className="absolute right-4 text-xs font-normal text-slate-400 pointer-events-none">
                  bpm
                </span>
              </div>
            </div>

            {/* Respiratory Rate */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  <label htmlFor="field-rr" className="text-sm font-semibold text-slate-800">
                    {f.respRate}
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onMouseEnter={() => setActiveTooltip('rr')}
                      onMouseLeave={() => setActiveTooltip(null)}
                      onClick={() => setActiveTooltip(activeTooltip === 'rr' ? null : 'rr')}
                      className="text-slate-400 hover:text-slate-600 focus:outline-none"
                    >
                      <Info className="w-3.5 h-3.5" />
                    </button>
                    {activeTooltip === 'rr' && (
                      <div className="absolute left-0 top-5 w-64 p-2 bg-slate-900 text-white text-[11px] rounded-lg shadow-lg z-50 leading-relaxed animate-in fade-in">
                        {f.tooltips.respiratory_rate}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="relative flex items-center">
                <input
                  id="field-rr"
                  type="number"
                  step="1"
                  min="4"
                  max="80"
                  value={form.respiratory_rate}
                  onChange={(e) => onFieldChange('respiratory_rate', e.target.value)}
                  placeholder={f.respRatePlaceholder}
                  className="w-full h-11 pl-4 pr-16 bg-white border border-slate-200 rounded-xl text-slate-900 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-[#007A78]/20 focus:border-[#007A78] transition-all"
                />
                <span className="absolute right-4 text-xs font-normal text-slate-400 pointer-events-none">
                  /min
                </span>
              </div>
            </div>

            {/* Systolic Blood Pressure */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  <label htmlFor="field-sbp" className="text-sm font-semibold text-slate-800">
                    {f.systolicBp}
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onMouseEnter={() => setActiveTooltip('sbp')}
                      onMouseLeave={() => setActiveTooltip(null)}
                      onClick={() => setActiveTooltip(activeTooltip === 'sbp' ? null : 'sbp')}
                      className="text-slate-400 hover:text-slate-600 focus:outline-none"
                    >
                      <Info className="w-3.5 h-3.5" />
                    </button>
                    {activeTooltip === 'sbp' && (
                      <div className="absolute left-0 top-5 w-64 p-2 bg-slate-900 text-white text-[11px] rounded-lg shadow-lg z-50 leading-relaxed animate-in fade-in">
                        {f.tooltips.systolic_bp}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="relative flex items-center">
                <input
                  id="field-sbp"
                  type="number"
                  step="1"
                  min="30"
                  max="300"
                  value={form.systolic_bp}
                  onChange={(e) => onFieldChange('systolic_bp', e.target.value)}
                  placeholder={f.systolicBpPlaceholder}
                  className="w-full h-11 pl-4 pr-16 bg-white border border-slate-200 rounded-xl text-slate-900 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-[#007A78]/20 focus:border-[#007A78] transition-all"
                />
                <span className="absolute right-4 text-xs font-normal text-slate-400 pointer-events-none">
                  mmHg
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ================= SECTION 3: LABORATORY MARKERS ================= */}
        <div>
          <div className="flex items-center gap-2 text-[#007A78] text-xs font-bold uppercase tracking-wider mb-3">
            <FlaskConical className="w-4 h-4 stroke-[2.2]" />
            <span>{f.labMarkers}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {/* Lactate */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  <label htmlFor="field-lactate" className="text-sm font-semibold text-slate-800">
                    {f.lactate}
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onMouseEnter={() => setActiveTooltip('lactate')}
                      onMouseLeave={() => setActiveTooltip(null)}
                      onClick={() => setActiveTooltip(activeTooltip === 'lactate' ? null : 'lactate')}
                      className="text-slate-400 hover:text-slate-600 focus:outline-none"
                    >
                      <Info className="w-3.5 h-3.5" />
                    </button>
                    {activeTooltip === 'lactate' && (
                      <div className="absolute left-0 top-5 w-64 p-2 bg-slate-900 text-white text-[11px] rounded-lg shadow-lg z-50 leading-relaxed animate-in fade-in">
                        {f.tooltips.lactate}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="relative flex items-center">
                <input
                  id="field-lactate"
                  type="number"
                  step="0.01"
                  min="0.1"
                  max="30"
                  value={form.lactate}
                  onChange={(e) => onFieldChange('lactate', e.target.value)}
                  placeholder={f.lactatePlaceholder}
                  className="w-full h-11 pl-4 pr-16 bg-white border border-slate-200 rounded-xl text-slate-900 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-[#007A78]/20 focus:border-[#007A78] transition-all"
                />
                <span className="absolute right-4 text-xs font-normal text-slate-400 pointer-events-none">
                  mmol/L
                </span>
              </div>
            </div>

            {/* Creatinine */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5">
                  <label htmlFor="field-cr" className="text-sm font-semibold text-slate-800">
                    {f.creatinine}
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onMouseEnter={() => setActiveTooltip('creatinine')}
                      onMouseLeave={() => setActiveTooltip(null)}
                      onClick={() => setActiveTooltip(activeTooltip === 'creatinine' ? null : 'creatinine')}
                      className="text-slate-400 hover:text-slate-600 focus:outline-none"
                    >
                      <Info className="w-3.5 h-3.5" />
                    </button>
                    {activeTooltip === 'creatinine' && (
                      <div className="absolute left-0 top-5 w-64 p-2 bg-slate-900 text-white text-[11px] rounded-lg shadow-lg z-50 leading-relaxed animate-in fade-in">
                        {f.tooltips.creatinine}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="relative flex items-center">
                <input
                  id="field-cr"
                  type="number"
                  step="0.01"
                  min="0.1"
                  max="25"
                  value={form.creatinine}
                  onChange={(e) => onFieldChange('creatinine', e.target.value)}
                  placeholder={f.creatininePlaceholder}
                  className="w-full h-11 pl-4 pr-16 bg-white border border-slate-200 rounded-xl text-slate-900 font-medium text-sm focus:outline-none focus:ring-2 focus:ring-[#007A78]/20 focus:border-[#007A78] transition-all"
                />
                <span className="absolute right-4 text-xs font-normal text-slate-400 pointer-events-none">
                  mg/dL
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= CARD FOOTER ================= */}
      <div className="bg-slate-50/50 border-t border-slate-100 px-6 sm:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-slate-500 font-medium">
          {remainingCount === 0 ? (
            <span className="text-emerald-700 font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              {f.requiredComplete}: 7 / 7
            </span>
          ) : (
            <span>
              {f.requiredComplete}: {filledCount} / 7
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          {filledCount > 0 && onClear && (
            <button
              type="button"
              onClick={onClear}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 px-3.5 py-2 rounded-full hover:bg-slate-200/70 border border-slate-200 transition-colors cursor-pointer"
            >
              {f.resetBtn}
            </button>
          )}

          <button
            type="button"
            disabled={isAnalyzing}
            onClick={onAnalyze}
            className={`inline-flex items-center gap-2.5 px-6 py-2.5 bg-[#007A78] hover:bg-[#006967] text-white rounded-full text-sm font-semibold transition-all shadow-xs cursor-pointer ${
              isAnalyzing ? 'opacity-80 cursor-not-allowed' : 'active:scale-98 hover:shadow-md'
            }`}
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{f.analyzingBtn}</span>
              </>
            ) : (
              <>
                <Activity className="w-4 h-4 stroke-[2.2]" />
                <span>{f.analyzeBtn}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
