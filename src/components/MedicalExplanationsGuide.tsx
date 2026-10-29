import React, { useState } from 'react';
import {
  BookOpen,
  ChevronDown,
  Sparkles,
  HelpCircle,
  Activity,
  HeartPulse,
  Droplets,
  Timer,
  Stethoscope,
  ShieldCheck
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface MedicalExplanationsGuideProps {
  onAskQuestion?: (query: string) => void;
}

export const MedicalExplanationsGuide: React.FC<MedicalExplanationsGuideProps> = ({ onAskQuestion }) => {
  const { translations } = useLanguage();
  const guide = translations.medicalGuide;
  const [isOpen, setIsOpen] = useState(false);
  const [activeTopic, setActiveTopic] = useState<string | null>('sepsis');

  const topicList = [
    { key: 'sepsis', icon: <HeartPulse className="w-4 h-4 text-rose-600" />, ...guide.topics.sepsis },
    { key: 'lactate', icon: <Droplets className="w-4 h-4 text-indigo-600" />, ...guide.topics.lactate },
    { key: 'qsofa', icon: <Stethoscope className="w-4 h-4 text-teal-600" />, ...guide.topics.qsofa },
    { key: 'shockIndex', icon: <Activity className="w-4 h-4 text-amber-600" />, ...guide.topics.shockIndex },
    { key: 'vitals', icon: <Timer className="w-4 h-4 text-sky-600" />, ...guide.topics.vitals },
    { key: 'bundle', icon: <ShieldCheck className="w-4 h-4 text-emerald-600" />, ...guide.topics.bundle }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto my-6 animate-in fade-in">
      <div className="bg-gradient-to-r from-teal-50/70 via-white to-blue-50/50 rounded-3xl border border-teal-200/80 shadow-xs overflow-hidden">
        {/* Toggle Bar */}
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="p-4 sm:p-5 flex items-center justify-between cursor-pointer select-none hover:bg-white/60 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#007A78] text-white flex items-center justify-center shadow-xs">
              <BookOpen className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-bold text-slate-900">{guide.title}</h3>
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 text-[#007A78]">
                  <Sparkles className="w-3 h-3" />
                  <span>Plain Language</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{guide.subtitle}</p>
            </div>
          </div>

          <button
            type="button"
            className="flex items-center gap-1.5 text-xs font-semibold text-[#007A78] bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-xl border border-teal-200 transition-colors"
          >
            <span>{isOpen ? guide.toggleClose : guide.toggleOpen}</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* Collapsible Content */}
        {isOpen && (
          <div className="px-4 sm:px-6 pb-6 pt-2 border-t border-teal-100/80 space-y-4 animate-in fade-in">
            {/* Quick Chips */}
            <div className="flex flex-wrap gap-2 pt-2">
              {topicList.map((t) => (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setActiveTopic(t.key)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    activeTopic === t.key
                      ? 'bg-[#007A78] text-white shadow-xs'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {t.icon}
                  <span>{t.title}</span>
                </button>
              ))}
            </div>

            {/* Active Topic Card */}
            {activeTopic && (() => {
              const current = topicList.find((x) => x.key === activeTopic) || topicList[0];
              return (
                <div className="bg-white rounded-2xl p-4 sm:p-5 border border-teal-100 shadow-2xs">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center">
                        {current.icon}
                      </div>
                      <h4 className="text-sm sm:text-base font-bold text-slate-900">{current.title}</h4>
                    </div>
                    {onAskQuestion && (
                      <button
                        type="button"
                        onClick={() => onAskQuestion(current.title)}
                        className="text-[11px] text-[#007A78] hover:text-[#005f5e] font-semibold underline underline-offset-2 cursor-pointer"
                      >
                        Ask AI Assistant
                      </button>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                    {current.desc}
                  </p>
                </div>
              );
            })()}

            {/* Grid of all 6 topics for fast browsing */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              {topicList.map((t) => (
                <div
                  key={t.key}
                  onClick={() => setActiveTopic(t.key)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    activeTopic === t.key
                      ? 'bg-white border-[#007A78] ring-2 ring-[#007A78]/10'
                      : 'bg-white/80 border-slate-200/70 hover:bg-white hover:border-teal-200'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {t.icon}
                    <h5 className="text-xs font-bold text-slate-900">{t.title}</h5>
                  </div>
                  <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                    {t.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
