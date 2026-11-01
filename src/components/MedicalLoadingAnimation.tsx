import React, { useState, useEffect } from 'react';
import { Heart, Brain, Sparkles, Activity } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

export const MedicalLoadingAnimation: React.FC = () => {
  const { language } = useLanguage();
  const [currentStep, setCurrentStep] = useState(0);

  // Multilingual animated loading messages matching existing language support
  const messages: Record<string, string[]> = {
    en: [
      'Analyzing Vitals...',
      'Processing Clinical Data...',
      'Generating Prediction...'
    ],
    ta: [
      'உடல் அளவுகள் ஆய்வு செய்யப்படுகிறது...',
      'மருத்துவத் தரவுகள் செயலாக்கப்படுகிறது...',
      'AI கணிப்பு உருவாக்கப்படுகிறது...'
    ],
    hi: [
      'शारीरिक संकेतों का विश्लेषण किया जा रहा है...',
      'नैदानिक डेटा संसाधित किया जा रहा है...',
      'एआई भविष्यवाणी तैयार की जा रही है...'
    ],
    te: [
      'శరీర సంకేతాల విశ్లేషణ జరుగుతోంది...',
      'క్లినికల్ డేటా ప్రాసెస్ చేయబడుతోంది...',
      'AI అంచనా రూపొందించబడుతోంది...'
    ],
    ml: [
      'ശരീര ലക്ഷണങ്ങൾ വിശകലനം ചെയ്യുന്നു...',
      'ക്ലിനിക്കൽ വിവരങ്ങൾ പ്രോസസ്സ് ചെയ്യുന്നു...',
      'AI പ്രവചനം തയ്യാറാക്കുന്നു...'
    ]
  };

  const activeMessages = messages[language] || messages.en;

  useEffect(() => {
    // Step transitions across 3.4-second cycle
    const t1 = setTimeout(() => setCurrentStep(1), 1100);
    const t2 = setTimeout(() => setCurrentStep(2), 2200);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  return (
    <div className="w-full bg-white rounded-3xl border border-slate-200/90 shadow-md p-6 sm:p-8 animate-in fade-in duration-300">
      <style>{`
        @keyframes heartbeat {
          0% { transform: scale(1); }
          12% { transform: scale(1.18); }
          24% { transform: scale(1.04); }
          38% { transform: scale(1.24); }
          60% { transform: scale(1); }
          100% { transform: scale(1); }
        }

        @keyframes breathe {
          0%, 100% { transform: scale(0.94); }
          50% { transform: scale(1.14); }
        }

        @keyframes brainGlow {
          0%, 100% {
            filter: drop-shadow(0 0 3px rgba(0, 122, 120, 0.4));
            transform: scale(1);
          }
          50% {
            filter: drop-shadow(0 0 14px rgba(0, 122, 120, 0.85));
            transform: scale(1.07);
          }
        }

        @keyframes pulseFlow {
          0% { stroke-dashoffset: 120; opacity: 0.3; }
          50% { opacity: 1; }
          100% { stroke-dashoffset: 0; opacity: 0.3; }
        }
      `}</style>

      {/* Main Container */}
      <div className="max-w-xl mx-auto flex flex-col items-center text-center space-y-6">
        
        {/* Animated Medical Icons Trio with Connecting Pulse Stream */}
        <div className="relative w-full py-4 flex items-center justify-around">
          
          {/* Subtle Telemetry Connecting Line */}
          <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 pointer-events-none -z-0">
            <svg className="w-full h-8" preserveAspectRatio="none" viewBox="0 0 300 32">
              <path
                d="M 10 16 L 80 16 L 90 6 L 100 26 L 110 16 L 190 16 L 200 6 L 210 26 L 220 16 L 290 16"
                fill="none"
                stroke="#007A78"
                strokeWidth="2"
                strokeLinecap="round"
                strokeDasharray="8 6"
                style={{
                  animation: 'pulseFlow 1.8s linear infinite'
                }}
              />
            </svg>
          </div>

          {/* 1. ❤️ Heart with Heartbeat Contraction Effect */}
          <div className="relative flex flex-col items-center z-10">
            <div
              className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center transition-all ${
                currentStep === 0
                  ? 'bg-rose-100 ring-4 ring-rose-400/30 shadow-lg shadow-rose-200/50'
                  : 'bg-rose-50/80 ring-2 ring-rose-200'
              }`}
            >
              <Heart
                className="w-8 h-8 sm:w-10 sm:h-10 text-rose-500 fill-rose-500/25"
                style={{
                  animation: 'heartbeat 1.2s ease-in-out infinite'
                }}
              />
            </div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-rose-700 mt-2">
              Vitals
            </span>
          </div>

          {/* 2. 🫁 Lungs with Smooth Expansion/Breathing Effect */}
          <div className="relative flex flex-col items-center z-10">
            <div
              className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center transition-all ${
                currentStep === 1
                  ? 'bg-cyan-100 ring-4 ring-cyan-400/30 shadow-lg shadow-cyan-200/50'
                  : 'bg-cyan-50/80 ring-2 ring-cyan-200'
              }`}
            >
              {/* Anatomical Medical Lungs Icon with Breathing Scale */}
              <div
                style={{
                  animation: 'breathe 2.4s ease-in-out infinite'
                }}
                className="text-cyan-600"
              >
                <svg
                  className="w-8 h-8 sm:w-10 sm:h-10"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.9"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {/* Trachea & Bronchi */}
                  <path d="M12 2v6" />
                  <path d="M12 8c-2 0-3 1.5-4 3" />
                  <path d="M12 8c2 0 3 1.5 4 3" />
                  {/* Left Lung */}
                  <path
                    d="M6 11c-2.5 1-3.5 4-3.5 7 0 2.5 1.5 3.8 3.5 4 2.5.2 4-1.8 4-4.5V11c-.8-.2-2.5-.5-4 .5z"
                    fill="currentColor"
                    fillOpacity="0.2"
                  />
                  {/* Right Lung */}
                  <path
                    d="M18 11c2.5 1 3.5 4 3.5 7 0 2.5-1.5 3.8-3.5 4-2.5.2-4-1.8-4-4.5V11c.8-.2 2.5-.5 4 .5z"
                    fill="currentColor"
                    fillOpacity="0.2"
                  />
                </svg>
              </div>
            </div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-cyan-800 mt-2">
              Respiration
            </span>
          </div>

          {/* 3. 🧠 Brain with Subtle Glowing/Synaptic Pulse Effect */}
          <div className="relative flex flex-col items-center z-10">
            <div
              className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center transition-all ${
                currentStep === 2
                  ? 'bg-teal-100 ring-4 ring-[#007A78]/30 shadow-lg shadow-teal-200/50'
                  : 'bg-teal-50/80 ring-2 ring-teal-200'
              }`}
            >
              <Brain
                className="w-8 h-8 sm:w-10 sm:h-10 text-[#007A78] fill-[#007A78]/25"
                style={{
                  animation: 'brainGlow 2.0s ease-in-out infinite'
                }}
              />
            </div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#007A78] mt-2">
              AI Engine
            </span>
          </div>

        </div>

        {/* Dynamic Status Text & Telemetry Indicator */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-teal-50 border border-teal-200 text-[#007A78] text-xs font-bold shadow-2xs">
            <Activity className="w-3.5 h-3.5 animate-pulse text-[#007A78]" />
            <span>SepsisSense Lite AI Assessment</span>
          </div>

          <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight transition-all duration-300">
            {activeMessages[currentStep]}
          </h3>

          <p className="text-xs text-slate-500 font-medium">
            Cross-referencing qSOFA, SIRS criteria, and hemodynamic biomarkers
          </p>
        </div>

        {/* Smooth 3-Step Progress Track */}
        <div className="w-full max-w-xs flex items-center justify-between gap-2 pt-1">
          {[0, 1, 2].map((stepIdx) => (
            <div
              key={stepIdx}
              className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
                currentStep >= stepIdx ? 'bg-[#007A78]' : 'bg-slate-200'
              }`}
            />
          ))}
        </div>

      </div>
    </div>
  );
};

