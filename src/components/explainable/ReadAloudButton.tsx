import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Play, Pause, Square, AlertCircle, Waves } from 'lucide-react';
import { useLanguage } from '../../i18n/LanguageContext';
import { EvaluatedFactor } from '../../config/factorConfig';

interface ReadAloudButtonProps {
  riskLevel: 'High' | 'Moderate' | 'Low';
  probability: number;
  factors: EvaluatedFactor[];
}

export const ReadAloudButton: React.FC<ReadAloudButtonProps> = ({
  riskLevel,
  probability,
  factors
}) => {
  const { language, translations } = useLanguage();
  const exp = translations.explainable;
  const ra = exp?.readAloud;
  const tLight = exp?.trafficLight;

  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [voiceNotice, setVoiceNotice] = useState<string | null>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Initialize SpeechSynthesis
  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      synthRef.current = window.speechSynthesis;
    }

    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  // Cancel speech whenever language changes
  useEffect(() => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsPlaying(false);
      setIsPaused(false);
      setVoiceNotice(null);
    }
  }, [language]);

  // Language locale mapping
  const langLocales: Record<string, string[]> = {
    ta: ['ta-IN', 'ta_IN', 'ta'],
    hi: ['hi-IN', 'hi_IN', 'hi'],
    te: ['te-IN', 'te_IN', 'te'],
    ml: ['ml-IN', 'ml_IN', 'ml'],
    en: ['en-IN', 'en-US', 'en-GB', 'en']
  };

  const handleSpeak = () => {
    if (!synthRef.current) {
      setVoiceNotice('Text-to-speech is not supported in this browser.');
      return;
    }

    // If currently paused, resume
    if (isPlaying && isPaused) {
      synthRef.current.resume();
      setIsPaused(false);
      return;
    }

    // If already playing, toggle pause
    if (isPlaying && !isPaused) {
      synthRef.current.pause();
      setIsPaused(true);
      return;
    }

    // Cancel existing speech
    synthRef.current.cancel();

    // Prepare speech text from translated strings
    const riskSentence =
      riskLevel === 'High'
        ? tLight?.highSentence || 'High Risk: Immediate medical attention required.'
        : riskLevel === 'Moderate'
        ? tLight?.moderateSentence || 'Moderate Risk: Prompt medical checkup required.'
        : tLight?.lowSentence || 'Low Risk: Patient is currently stable.';

    // Top 3 contributing factors
    const topFactors = factors
      .filter((f) => f.status !== 'normal')
      .slice(0, 3)
      .map((f) => {
        const factorTranslation = exp?.factors?.[f.key as keyof typeof exp.factors];
        const valText = `${f.value} ${f.config.unit}`;
        const reason =
          f.statusVariant === 'low'
            ? factorTranslation?.simpleAbnormalLow || factorTranslation?.simpleAbnormalHigh
            : factorTranslation?.simpleAbnormalHigh;
        return `${factorTranslation?.name || f.config.nameKey}: ${valText}. ${reason || ''}`;
      })
      .join('. ');

    const fullSpeechText = `${riskSentence}. ${topFactors ? topFactors : ''}`;

    const utterance = new SpeechSynthesisUtterance(fullSpeechText);
    utteranceRef.current = utterance;

    // Select suitable voice
    const availableVoices = synthRef.current.getVoices();
    const targetLocales = langLocales[language] || ['en-US'];

    let matchedVoice: SpeechSynthesisVoice | null = null;
    for (const loc of targetLocales) {
      matchedVoice = availableVoices.find((v) => v.lang.replace('_', '-').toLowerCase().startsWith(loc.toLowerCase())) || null;
      if (matchedVoice) break;
    }

    if (matchedVoice) {
      utterance.voice = matchedVoice;
      utterance.lang = matchedVoice.lang;
    } else {
      utterance.lang = targetLocales[0];
      // If language is not English and no specific regional voice found, warn gracefully
      if (language !== 'en' && availableVoices.length > 0) {
        setVoiceNotice(ra?.voiceUnavailable || 'Regional voice not installed in browser; falling back to default voice.');
      }
    }

    utterance.rate = 0.95; // Slightly slower for clarity
    utterance.pitch = 1.0;

    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
      setVoiceNotice(null);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    utterance.onerror = (e) => {
      setIsPlaying(false);
      setIsPaused(false);
      console.warn('SpeechSynthesis error:', e);
    };

    synthRef.current.speak(utterance);
  };

  const handleStop = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsPlaying(false);
      setIsPaused(false);
    }
  };

  return (
    <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-white/90 rounded-2xl border border-teal-200/90 shadow-2xs my-4">
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
            isPlaying ? 'bg-teal-600 text-white animate-pulse' : 'bg-teal-50 text-[#007A78] border border-teal-200'
          }`}
        >
          {isPlaying ? <Waves className="w-5 h-5 animate-pulse" /> : <Volume2 className="w-5 h-5 stroke-[2.2]" />}
        </div>

        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs sm:text-sm font-extrabold text-slate-900">
              {ra?.readButton || '🔊 Read Aloud (Padichi Kaattu)'}
            </span>
            {isPlaying && (
              <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 animate-pulse">
                {isPaused ? ra?.paused || 'Paused' : ra?.playing || 'Speaking'}
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-500 font-medium">
            Listen to the summary and top factors in your chosen language
          </p>
        </div>
      </div>

      {/* Control buttons */}
      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
        {/* Play / Pause button */}
        <button
          type="button"
          onClick={handleSpeak}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#007A78] hover:bg-[#006967] shadow-2xs hover:scale-102 active:scale-98 transition-all cursor-pointer"
        >
          {isPlaying && !isPaused ? (
            <>
              <Pause className="w-3.5 h-3.5" />
              <span>{ra?.pause || 'Pause'}</span>
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isPlaying && isPaused ? ra?.resume || 'Resume' : ra?.readButton || 'Play'}</span>
            </>
          )}
        </button>

        {/* Stop button */}
        {isPlaying && (
          <button
            type="button"
            onClick={handleStop}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition-colors cursor-pointer"
            title="Stop audio"
          >
            <Square className="w-3.5 h-3.5 fill-current" />
            <span>{ra?.stop || 'Stop'}</span>
          </button>
        )}
      </div>

      {/* Graceful Voice Notice banner if needed */}
      {voiceNotice && (
        <div className="w-full mt-2 p-2 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
          <span>{voiceNotice}</span>
        </div>
      )}
    </div>
  );
};

