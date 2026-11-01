import React from 'react';
import { FactorConfig } from '../../config/factorConfig';
import { useLanguage } from '../../i18n/LanguageContext';

interface RangeMeterProps {
  config: FactorConfig;
  value: number;
  status: 'normal' | 'abnormal' | 'critical';
  percentage: number;
}

export const RangeMeter: React.FC<RangeMeterProps> = ({
  config,
  value,
  status,
  percentage
}) => {
  const { translations } = useLanguage();
  const tr = translations.explainable?.topReasons;

  const [dMin, dMax] = config.displayRange;
  const [nMin, nMax] = config.normalRange;

  // Calculate zone percentages along display range
  const toPercent = (val: number) => {
    const clamped = Math.max(dMin, Math.min(dMax, val));
    return ((clamped - dMin) / (dMax - dMin)) * 100;
  };

  const normalLeft = toPercent(config.greenZone[0]);
  const normalRight = toPercent(config.greenZone[1]);
  const normalWidth = Math.max(8, normalRight - normalLeft);

  const pointerBg =
    status === 'critical'
      ? 'bg-rose-600 text-white ring-4 ring-rose-300'
      : status === 'abnormal'
      ? 'bg-amber-500 text-white ring-4 ring-amber-200'
      : 'bg-emerald-600 text-white ring-4 ring-emerald-200';

  const pointerBorder =
    status === 'critical'
      ? 'border-t-rose-600'
      : status === 'abnormal'
      ? 'border-t-amber-500'
      : 'border-t-emerald-600';

  return (
    <div className="w-full space-y-2 select-none" role="meter" aria-valuenow={value} aria-valuemin={dMin} aria-valuemax={dMax}>
      {/* Visual Bar Track */}
      <div className="relative pt-6 pb-2">
        {/* Floating Patient Pointer Bubble */}
        <div
          className="absolute -top-1.5 transition-all duration-300 -translate-x-1/2 flex flex-col items-center pointer-events-none z-10"
          style={{ left: `${Math.min(94, Math.max(6, percentage))}%` }}
        >
          <div className={`px-2 py-0.5 rounded-md text-[11px] font-black shadow-xs flex items-center gap-1 ${pointerBg}`}>
            <span>{tr?.pointerPatient || 'Patient'}:</span>
            <span className="font-mono">{value} {config.unit}</span>
          </div>
          <div className={`w-0 h-0 border-x-4 border-x-transparent border-t-5 ${pointerBorder}`} />
        </div>

        {/* Horizontal Track Bar with Traffic Light Segments */}
        <div className="h-3.5 w-full bg-slate-200 rounded-full relative overflow-hidden flex shadow-inner">
          {/* Lower Red/Yellow Zone if applicable */}
          {config.direction === 'both_bad' && (
            <div
              className="h-full bg-rose-400"
              style={{ width: `${normalLeft}%` }}
              title="Low / Abnormal Zone"
            />
          )}

          {/* Normal Safe Green Zone */}
          <div
            className="h-full bg-emerald-500 relative"
            style={{
              left: config.direction === 'both_bad' ? 0 : `${normalLeft}%`,
              width: `${normalWidth}%`
            }}
            title="Safe Normal Reference Zone"
          >
            <div className="absolute inset-0 bg-white/20 animate-pulse" />
          </div>

          {/* Higher Red/Yellow Zone */}
          <div
            className={`h-full flex-1 ${
              config.direction === 'lower_bad' ? 'bg-emerald-400' : 'bg-rose-500'
            }`}
            title="Elevated / High Danger Zone"
          />
        </div>
      </div>

      {/* Labels below the meter */}
      <div className="flex items-center justify-between text-[11px] font-medium text-slate-500 pt-0.5">
        <span className="text-slate-400 font-mono">
          {dMin} {config.unit}
        </span>

        {/* Center Normal Range Label */}
        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
          <span>
            {tr?.normalZone || 'Normal'}: {nMin} – {nMax} {config.unit}
          </span>
        </div>

        <span className="text-slate-400 font-mono">
          {dMax} {config.unit}
        </span>
      </div>
    </div>
  );
};

