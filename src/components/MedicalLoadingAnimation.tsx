import React, { useState, useEffect } from 'react';
import { Heart, Brain, Activity, Sparkles } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

// Custom Anatomical Lungs SVG Icon matching Lucide style and stroke
const LungsIcon: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-label="Lungs Icon"
  >
    <path d="M12 3v6" />
    <path d="M12 6c-2.5 0-5 1.5-6 4-1.2 3-2.5 5.5-2 9a4 4 0 0 0 8 1V9" />
    <path d="M12 6c2.5 0 5 1.5 6 4 1.2 3 2.5 5.5 2 9a4 4 0 0 1-8 1V9" />
    <path d="M8.5 14.5c.8 1 1.8 1.5 3.5 1.5" />
    <path d="M15.5 14.5c-.8 1-1.8 1.5-3.5 1.5" />
  </svg>
);

export const MedicalLoadingAnimation: React.FC = () => {
  const { language } = useLanguage();
  const [stepIndex, setStepIndex] = useState(0);
  const [progress, setProgress] = useState(10);

  // Multilingual step messages
  const steps = [
    {
      title:
        language === 'ta'
          ? 'உடல் முக்கிய அளவுகள் பகுப்பாய்வு செய்யப்படுகிறது...'
          : language === 'hi'
          ? 'शारीरिक महत्वपूर्ण संकेतों का विश्लेषण...'
          : language === 'te'
          ? 'శరీర ముఖ్య కొలతలను విశ్లేషిస్తోంది...'
          : language === 'ml'
          ? 'ശരീര ലക്ഷണങ്ങൾ വിശകലനം ചെയ്യുന്നു...'
          : 'Analyzing Vitals...',
      subtitle:
        language === 'ta'
          ? 'இதயத் துடிப்பு, இரத்த அழுத்தம், வெப்பநிலை மற்றும் சுவாச விகிதம் சரிபார்க்கப்படுகிறது'
          : language === 'hi'
          ? 'हृदय गति, रक्तचाप, तापमान एवं श्वसन दर का सत्यापन'
          : language === 'te'
          ? 'గుండె చప్పుడు, రక్తపోటు, ఉష్ణోగ్రత మరియు శ్వాస వేగం తనిఖీ'
          : language === 'ml'
          ? 'പൾസ്, രക്തസമ്മർദ്ദം, താപനില, ശ്വാസോച്ഛ്വാസം പരിശോധിക്കുന്നു'
          : 'Verifying Heart Rate, Blood Pressure, Temperature & Respiratory Rate',
      activeOrgan: 'heart'
    },
    {
      title:
        language === 'ta'
          ? 'மருத்துவத் தரவுகள் செயலாக்கப்படுகிறது...'
          : language === 'hi'
          ? 'नैदानिक डेटा संसाधित किया जा रहा है...'
          : language === 'te'
          ? 'క్లినికల్ సమాచారాన్ని పరిశీలిస్తోంది...'
          : language === 'ml'
          ? 'ക്ലിനിക്കൽ വിവരങ്ങൾ പരിശോധിക്കുന്നു...'
          : 'Processing Clinical Data...',
      subtitle:
        language === 'ta'
          ? 'லாக்டேட், கிரியேட்டினின், qSOFA மற்றும் SIRS அளவுகோல்கள் கணக்கிடப்படுகிறது'
          : language === 'hi'
          ? 'लैक्टेट, क्रिएटिनिन, qSOFA एवं SIRS मानदंडों की गणना'
          : language === 'te'
          ? 'లాక్టేట్, క్రియాటినిన్, qSOFA మరియు SIRS ప్రమాణాల లెక్కింపు'
          : language === 'ml'
          ? 'ലാക്റ്റേറ്റ്, ക്രിയാറ്റിനിൻ, qSOFA, SIRS മാനദണ്ഡങ്ങൾ കണക്കാക്കുന്നു'
          : 'Computing Lactate, Creatinine, qSOFA & SIRS Biomarkers',
      activeOrgan: 'brain'
    },
    {
      title:
        language === 'ta'
          ? 'AI செப்சிஸ் கணிப்பு உருவாக்கப்படுகிறது...'
          : language === 'hi'
          ? 'एआई सेप्सिस भविष्यवाणी तैयार की जा रही है...'
          : language === 'te'
          ? 'AI అంచనా రూపొందించబడుతోంది...'
          : language === 'ml'
          ? 'AI പ്രവചനം തയ്യാറാക്കുന്നു...'
          : 'Generating Prediction...',
      subtitle:
        language === 'ta'
          ? 'அபாய நிலை மற்றும் மருத்துவ வழிகாட்டுதல்கள் தொகுக்கப்படுகிறது'
          : language === 'hi'
          ? 'जोखिम वर्गीकरण एवं नैदानिक मार्गदर्शन तैयार'
          : language === 'te'
          ? 'రిస్క్ వర్గీకరణ మరియు అత్యవసర మార్గదర్శకాలు'
          : language === 'ml'
          ? 'അപകടസാധ്യതയും അടിയന്തര നിർദ്ദേശങ്ങളും തയ്യാറാക്കുന്നു'
          : 'Synthesizing Risk Stratification & Clinical Guidance',
      activeOrgan: 'lungs'
    }
  ];

  // Step sequencer: changes message at 1.2s and 2.4s
  useEffect(() => {
    const t1 = setTimeout(() => {
      setStepIndex(1);
    }, 1200);

    const t2 = setTimeout(() => {
      setStepIndex(2);
    }, 2400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  // Smooth progress bar increment
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 96) return 96;
        return prev + 3;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const current = steps[stepIndex];

  return (
    <div
      className="w-full max-w-4xl mx-auto my-8 bg-white rounded-3xl border border-slate-200/90 shadow-xl p-6 sm:p-10 transition-all animate-in fade-in zoom-in-95 duration-300"
      role="status"
      aria-live="polite"
    >
      <style>{`
        @keyframes customHeartbeat {
          0% { transform: scale(1); filter: drop-shadow(0 0 2px rgba(225, 29, 72, 0.3)); }
          12% { transform: scale(1.18); filter: drop-shadow(0 0 16px rgba(225, 29, 72, 0.65)); }
          24% { transform: scale(0.98); }
          36% { transform: scale(1.14); filter: drop-shadow(0 0 12px rgba(225, 29, 72, 0.55)); }
          50% { transform: scale(1); filter: drop-shadow(0 0 2px rgba(225, 29, 72, 0.3)); }
          100% { transform: scale(1); filter: drop-shadow(0 0 2px rgba(225, 29, 72, 0.3)); }
        }

        @keyframes customBrainGlow {
          0% { transform: scale(1); filter: drop-shadow(0 0 4px rgba(99, 102, 241, 0.3)); }
          50% { transform: scale(1.09); filter: drop-shadow(0 0 18px rgba(99, 102, 241, 0.75)); }
          100% { transform: scale(1); filter: drop-shadow(0 0 4px rgba(99, 102, 241, 0.3)); }
        }

        @keyframes customBreathing {
          0% { transform: scale(0.93); filter: drop-shadow(0 0 3px rgba(6, 182, 212, 0.3)); }
          50% { transform: scale(1.15); filter: drop-shadow(0 0 16px rgba(6, 182, 212, 0.7)); }
          100% { transform: scale(0.93); filter: drop-shadow(0 0 3px rgba(6, 182, 212, 0.3)); }
        }

        @keyframes pulseTrack {
          0% { stroke-dashoffset: 40; }
          100% { stroke-dashoffset: 0; }
        }

        .anim-heart {
          animation: customHeartbeat 1.1s ease-in-out infinite;
        }

        .anim-brain {
          animation: customBrainGlow 2.0s ease-in-out infinite;
        }

        .anim-lungs {
          animation: customBreathing 2.4s ease-in-out infinite;
        }

        .anim-track {
          stroke-dasharray: 6 6;
          animation: pulseTrack 1.2s linear infinite;
        }
      `}</style>

      {/* Main Medical Animation Stage */}
      <div className="flex flex-col items-center justify-center text-center">
        
        {/* Top Header Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-50 border border-teal-200/80 text-xs font-extrabold text-[#007A78] mb-8">
          <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '3s' }} />
          <span>AI Clinical Analysis In Progress</span>
        </div>

        {/* 3 Medical Organs Stage with Connecting Pulse Circuit */}
        <div className="relative w-full max-w-lg flex items-center justify-between px-4 sm:px-8 my-4">
          
          {/* Background Connecting Wave / Circuit Track */}
          <div className="absolute left-8 right-8 top-1/2 -translate-y-1/2 h-1 bg-slate-100 rounded-full overflow-hidden -z-0">
            <div className="h-full bg-gradient-to-r from-rose-400 via-indigo-400 to-cyan-400 opacity-60 animate-pulse" />
          </div>

          {/* SVG Animated Pulse Line Overlay */}
          <svg className="absolute left-6 right-6 top-1/2 -translate-y-1/2 w-[calc(100%-3rem)] h-6 pointer-events-none -z-0" viewBox="0 0 300 24" fill="none">
            <path
              d="M0 12 L70 12 L80 4 L90 20 L100 8 L110 16 L120 12 L180 12 L190 4 L200 20 L210 8 L220 16 L230 12 L300 12"
              stroke="#007A78"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="anim-track"
              opacity="0.8"
            />
          </svg>

          {/* ================= 1. ANIMATED HEART (Heartbeat Effect) ================= */}
          <div className="relative z-10 flex flex-col items-center">
            <div
              className={`w-16 h-16 sm:w-20 sm:h-20 rounded-3xl flex items-center justify-center transition-all duration-300 ${
                current.activeOrgan === 'heart'
                  ? 'bg-rose-500 text-white shadow-xl shadow-rose-300 ring-4 ring-rose-200 scale-105'
                  : 'bg-rose-50 text-rose-600 border-2 border-rose-200'
              }`}
            >
              <div className="anim-heart">
                <Heart className="w-8 h-8 sm:w-10 sm:h-10 fill-current stroke-[1.8]" />
              </div>
            </div>
            <span className="text-[11px] font-extrabold text-slate-700 mt-2.5">Heart</span>
            <span className="text-[10px] font-semibold text-rose-600">Vitals Pulse</span>
          </div>

          {/* ================= 2. ANIMATED BRAIN (Glowing Effect) ================= */}
          <div className="relative z-10 flex flex-col items-center">
            <div
              className={`w-16 h-16 sm:w-20 sm:h-20 rounded-3xl flex items-center justify-center transition-all duration-300 ${
                current.activeOrgan === 'brain'
                  ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-300 ring-4 ring-indigo-200 scale-105'
                  : 'bg-indigo-50 text-indigo-600 border-2 border-indigo-200'
              }`}
            >
              <div className="anim-brain">
                <Brain className="w-8 h-8 sm:w-10 sm:h-10 stroke-[2]" />
              </div>
            </div>
            <span className="text-[11px] font-extrabold text-slate-700 mt-2.5">Neural Net</span>
            <span className="text-[10px] font-semibold text-indigo-600">Model Logic</span>
          </div>

          {/* ================= 3. ANIMATED LUNGS (Breathing Effect) ================= */}
          <div className="relative z-10 flex flex-col items-center">
            <div
              className={`w-16 h-16 sm:w-20 sm:h-20 rounded-3xl flex items-center justify-center transition-all duration-300 ${
                current.activeOrgan === 'lungs'
                  ? 'bg-cyan-600 text-white shadow-xl shadow-cyan-300 ring-4 ring-cyan-200 scale-105'
                  : 'bg-cyan-50 text-cyan-600 border-2 border-cyan-200'
              }`}
            >
              <div className="anim-lungs">
                <LungsIcon className="w-8 h-8 sm:w-10 sm:h-10 stroke-[2]" />
              </div>
            </div>
            <span className="text-[11px] font-extrabold text-slate-700 mt-2.5">Lungs</span>
            <span className="text-[10px] font-semibold text-cyan-600">Oxygenation</span>
          </div>

        </div>

        {/* Dynamic Changing Status Text Area */}
        <div className="mt-8 mb-4 min-h-[72px] flex flex-col items-center justify-center transition-all duration-300">
          <div className="flex items-center gap-2 text-slate-900 font-black text-lg sm:text-xl tracking-tight">
            <Activity className="w-5 h-5 text-[#007A78] animate-pulse" />
            <h3 className="animate-in fade-in slide-in-from-bottom-2 duration-300 key={stepIndex}">
              {current.title}
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1 max-w-md animate-in fade-in duration-300">
            {current.subtitle}
          </p>
        </div>

        {/* Progress Bar in App Theme Teal */}
        <div className="w-full max-w-md mt-2 space-y-2">
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/80">
            <div
              className="h-full bg-gradient-to-r from-[#007A78] via-teal-500 to-[#006967] rounded-full transition-all duration-200 ease-out shadow-xs"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 font-semibold px-1">
            <span>Stage {stepIndex + 1} of 3</span>
            <span>{progress}%</span>
          </div>
        </div>

      </div>
    </div>
  );
};
