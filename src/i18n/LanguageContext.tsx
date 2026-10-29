import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { SupportedLanguage } from '../types';
import { TRANSLATIONS, Translations } from './translations';

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (path: string, fallback?: string) => string;
  translations: Translations;
  translateSepsisType: (type: string, riskLevel: 'High' | 'Moderate' | 'Low') => string;
  translateSuspectedSource: (source: string) => string;
  translateAdviceItem: (item: { tag: string; title: string; advice: string }) => { tag: string; title: string; advice: string };
  translateContributingFactor: (factor: string) => string;
  translateClinicalAction: (action: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'sepsissense_language';

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as SupportedLanguage;
      if (saved && ['en', 'ta', 'hi', 'te', 'ml'].includes(saved)) {
        return saved;
      }
    } catch {
      // ignore storage access issues
    }
    return 'en';
  });

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
      document.documentElement.lang = lang;
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    try {
      document.documentElement.lang = language;
    } catch {
      // ignore
    }
  }, [language]);

  // Safe dot-notation lookup with fallback to English
  const t = (path: string, fallback?: string): string => {
    const currentDict = TRANSLATIONS[language] || TRANSLATIONS.en;
    const fallbackDict = TRANSLATIONS.en;

    const resolve = (obj: any, keys: string[]): any => {
      let curr = obj;
      for (const k of keys) {
        if (curr === undefined || curr === null || typeof curr !== 'object') return undefined;
        curr = curr[k];
      }
      return curr;
    };

    const keys = path.split('.');
    const val = resolve(currentDict, keys);
    if (typeof val === 'string') return val;

    const fallbackVal = resolve(fallbackDict, keys);
    if (typeof fallbackVal === 'string') return fallbackVal;

    return fallback || path;
  };

  // Helper to translate sepsis severity / possible condition across languages
  const translateSepsisType = (type: string, riskLevel: 'High' | 'Moderate' | 'Low'): string => {
    if (language === 'en') {
      if (riskLevel === 'High') return 'Possible Condition: Serious Infection — Emergency Warning';
      if (riskLevel === 'Moderate') return 'Possible Condition: Developing Infection — Moderate Warning';
      return 'Possible Condition: Stable — Low Warning';
    }

    if (riskLevel === 'High' || type.toLowerCase().includes('shock') || type.toLowerCase().includes('serious') || type.toLowerCase().includes('emergency')) {
      switch (language) {
        case 'ta': return 'சாத்தியமான நிலை: தீவிர தொற்று — அவசர எச்சரிக்கை';
        case 'hi': return 'संभावित स्थिति: गंभीर संक्रमण — आपातकालीन चेतावनी';
        case 'te': return 'సాధ్యమైన పరిస్థితి: తీవ్రమైన ఇన్ఫెక్షన్ — అత్యవసర హెచ్చరిక';
        case 'ml': return 'സാധ്യമായ അവസ്ഥ: ഗുരുതരമായ അണുബാധ — അടിയന്തര മുന്നറിയിപ്പ്';
      }
    } else if (riskLevel === 'Moderate' || type.toLowerCase().includes('moderate') || type.toLowerCase().includes('developing')) {
      switch (language) {
        case 'ta': return 'சாத்தியமான நிலை: உருவாகும் தொற்று — நடுத்தர எச்சரிக்கை';
        case 'hi': return 'संभावित स्थिति: बढ़ता संक्रमण — मध्यम चेतावनी';
        case 'te': return 'సాధ్యమైన పరిస్థితి: అభివృద్ధి చెందుతున్న ఇన్ఫెక్షన్ — మధ్యస్థ హెచ్చరిక';
        case 'ml': return 'സാധ്യമായ അവസ്ഥ: പടരുന്ന അണുബാധ — മിതമായ മുന്നറിയിപ്പ്';
      }
    } else {
      switch (language) {
        case 'ta': return 'சாத்தியமான நிலை: நிலையான உடல்நிலை — குறைந்த எச்சரிக்கை';
        case 'hi': return 'संभावित स्थिति: स्थिर — कम चेतावनी';
        case 'te': return 'సాధ్యమైన పరిస్థితి: స్థిరమైన స్థితి — తక్కువ హెచ్చరిక';
        case 'ml': return 'സാധ്യമായ അവസ്ഥ: സുരക്ഷിതമായ അവസ്ഥ — കുറഞ്ഞ മുന്നറിയിപ്പ്';
      }
    }
    return type;
  };

  // Helper to translate suspected infection sources (Patient-friendly English)
  const translateSuspectedSource = (source: string): string => {
    const s = (source || '').toLowerCase();

    if (s.includes('respir') || s.includes('lung') || s.includes('chest') || s.includes('pneumonia')) {
      if (language === 'en') return 'Possible Infection Source: Lungs or Chest';
      switch (language) {
        case 'ta': return 'சாத்தியமான தொற்று மூலம்: நுரையீரல் அல்லது மார்பு';
        case 'hi': return 'संभावित संक्रमण स्रोत: फेफड़े या छाती';
        case 'te': return 'సాధ్యమైన ఇన్ఫెక్షన్ మూలం: ఊపిరితిత్తులు లేదా ఛాతీ';
        case 'ml': return 'സാധ്യമായ അണുബാധ ഉറവിടം: ശ്വാസകോശം അല്ലെങ്കിൽ നെഞ്ച്';
      }
    } else if (s.includes('urin') || s.includes('uti') || s.includes('kidney') || s.includes('renal')) {
      if (language === 'en') return 'Possible Infection Source: Kidneys or Urinary Tract';
      switch (language) {
        case 'ta': return 'சாத்தியமான தொற்று மூலம்: சிறுநீரகம் அல்லது சிறுநீர்ப் பாதை';
        case 'hi': return 'संभावित संक्रमण स्रोत: गुर्दे या मूत्र पथ';
        case 'te': return 'సాధ్యమైన ఇన్ఫెక్షన్ మూలం: మూత్రపిండాలు లేదా మూత్ర మార్గం';
        case 'ml': return 'സാധ്യമായ അണുബാധ ഉറവിടം: വൃക്ക അല്ലെങ്കിൽ മൂത്രനാളി';
      }
    } else if (s.includes('blood') || s.includes('bacteremia') || s.includes('systemic')) {
      if (language === 'en') return 'Possible Infection Source: Bloodstream or Body-wide Infection';
      switch (language) {
        case 'ta': return 'சாத்தியமான தொற்று மூலம்: இரத்த ஓட்டம் அல்லது உடல் முழுவதுமான தொற்று';
        case 'hi': return 'संभावित संक्रमण स्रोत: रक्तप्रवाह या पूरे शरीर में संक्रमण';
        case 'te': return 'సాధ్యమైన ఇన్ఫెక్షన్ మూలం: రక్తప్రవాహం లేదా శరీరవ్యాప్త ఇన్ఫెక్షన్';
        case 'ml': return 'സാധ്യമായ അണുബാധ ഉറവിടം: രക്തചംക്രമണം അല്ലെങ്കിൽ ശരീരവ്യാപകമായ അണുബാധ';
      }
    }

    if (language === 'en') return 'Infection source not yet known';
    switch (language) {
      case 'ta': return 'தொற்றுக்கான மூலம் இன்னும் உறுதியாகத் தெரியவில்லை';
      case 'hi': return 'संक्रमण का स्रोत अभी ज्ञात नहीं है';
      case 'te': return 'ఇన్ఫెక్షన్ మూలం ఇంకా తెలియరాలేదు';
      case 'ml': return 'അണുബാധയുടെ ഉറവിടം ഇതുവരെ സ്ഥിരീകരിച്ചിട്ടില്ല';
    }
    return 'Infection source not yet known';
  };

  // Helper to translate advice items
  const translateAdviceItem = (item: { tag: string; title: string; advice: string }) => {
    if (language === 'en') return item;
    const tagLower = item.tag.toLowerCase();
    const titleLower = item.title.toLowerCase();

    if (tagLower.includes('urgent') || titleLower.includes('saline') || titleLower.includes('fluid')) {
      switch (language) {
        case 'ta':
          return {
            tag: 'அவசர சிகிச்சை',
            title: 'அவசர நரம்புவழி சலைன் திரவங்கள் வழங்குக',
            advice: 'குறைந்த இரத்த அழுத்தத்தை உடனடியாக உயர்த்தவும், சிறுநீரகம் மற்றும் இதயத்தைப் பாதுகாக்கவும் நரம்புவழி (IV) திரவங்களை உடனடியாகத் தொடங்குங்கள்.'
          };
        case 'hi':
          return {
            tag: 'आपातकालीन देखभाल',
            title: 'तत्काल आईवी सलाइन फ्लूइड दें',
            advice: 'गिरे हुए रक्तचाप को तुरंत बढ़ाने और गुर्दे व दिल की सुरक्षा के लिए नस के माध्यम से (IV) तुरंत सलाइन फ्लूइड शुरू करें।'
          };
        case 'te':
          return {
            tag: 'అత్యవసర సంరక్షణ',
            title: 'తక్షణ సెలైన్ ద్రవాలు ఎక్కించండి',
            advice: 'తక్కువ రక్తపోటును వెంటనే పెంచడానికి, మూత్రపిండాలు మరియు గుండెను రక్షించడానికి వెంటనే సెలైన్ (IV) ద్రవాలను ప్రారంభించండి.'
          };
        case 'ml':
          return {
            tag: 'അടിയന്തര ശുശ്രൂഷ',
            title: 'അടിയന്തര സലൈൻ ഡ്രിപ്പ് നൽകുക',
            advice: 'കുറഞ്ഞ രക്തസമ്മർദ്ദം ഉയർത്താനും വൃക്കകളെയും ഹൃദയത്തെയും സംരക്ഷിക്കാനും ഉടൻ തന്നെ ഐവി (IV) സലൈൻ ഡ്രിപ്പ് നൽകുക.'
          };
      }
    }

    if (tagLower.includes('antibiotic') || titleLower.includes('antibiotic')) {
      switch (language) {
        case 'ta':
          return {
            tag: 'மருந்துகள்',
            title: '1 மணி நேரத்திற்குள் நரம்புவழி ஆன்டிபயாடிக் தொடங்கவும்',
            advice: 'தொற்று பரவி உறுப்புகளைப் பாதிக்காமல் தடுக்க, உடனே பரந்த அளவிலான நரம்புவழி ஆன்டிபயாடிக் மருந்துகளைக் கொடுங்கள்.'
          };
        case 'hi':
          return {
            tag: 'एंटीबायोटिक्स',
            title: '1 घंटे के भीतर आईवी एंटीबायोटिक्स शुरू करें',
            advice: 'संक्रमण को फैलने और अन्य अंगों को नुकसान पहुंचाने से रोकने के लिए तुरंत ब्रॉड-स्पेक्ट्रम आईवी एंटीबायोटिक्स दें।'
          };
        case 'te':
          return {
            tag: 'యాంటీబయాటిక్స్',
            title: '1 గంటలోపు ఐవి యాంటీబయాటిక్స్ ప్రారంభించండి',
            advice: 'ఇన్ఫెక్షన్ మరింత వ్యాపించకుండా ఆపడానికి వెంటనే బలమైన ఐవి యాంటీబయాటిక్స్ ఇవ్వండి.'
          };
        case 'ml':
          return {
            tag: 'ആന്റിബയോട്ടിക്കുകൾ',
            title: '1 മണിക്കൂറിനുള്ളിൽ ഐവി ആന്റിബയോട്ടിക് നൽകുക',
            advice: 'അണുക്കൾ കൂടുതൽ അവയവങ്ങളിലേക്ക് പടരുന്നത് തടയാൻ ഉടൻ തന്നെ ശക്തമായ ഐവി ആന്റിബയോട്ടിക്കുകൾ നൽകുക.'
          };
      }
    }

    if (tagLower.includes('lab') || titleLower.includes('lactate') || titleLower.includes('culture')) {
      switch (language) {
        case 'ta':
          return {
            tag: 'பரிசோதனை',
            title: 'இரத்தக் கல்ச்சர் மற்றும் லாக்டேட் பரிசோதனை எடுக்கவும்',
            advice: 'தொற்றுக்கான சரியான பாக்டீரியாவைக் கண்டறிய இரத்த மாதிரிகளை எடுக்கவும்; திசுக்களுக்கு ஆக்சிஜன் கிடைக்கிறதா என லாக்டேட் அளவை மீண்டும் சோதிக்கவும்.'
          };
        case 'hi':
          return {
            tag: 'लैब टेस्ट',
            title: 'ब्लड कल्चर एवं लैक्टेट टेस्ट कराएं',
            advice: 'बैक्टीरिया की पहचान के लिए ब्लड सैंपल लें और कोशिकाओं में ऑक्सीजन स्तर की जांच के लिए लैक्टेट टेस्ट दोबारा करें।'
          };
        case 'te':
          return {
            tag: 'ల్యాబ్ పరీక్షలు',
            title: 'బ్లడ్ కల్చర్ మరియు లాక్టేట్ పరీక్ష చేయండి',
            advice: 'బ్యాక్టీరియాను గుర్తించడానికి రక్త నమూనాలను తీసుకోండి మరియు కణాలకు ఆక్సిజన్ అందుతోందో లేదో చూడటానికి లాక్టేట్ పరీక్ష చేయండి.'
          };
        case 'ml':
          return {
            tag: 'ലാബ് പരിശോധന',
            title: 'ബ്ലഡ് കൾച്ചറും ലാക്റ്റേറ്റ് പരിശോധനയും നടത്തുക',
            advice: 'ബാക്ടീരിയയെ തിരിച്ചറിയാൻ രക്തസാമ്പിളുകൾ എടുക്കുക; ഓക്സിജൻ ലഭ്യത ഉറപ്പാക്കാൻ ലാക്റ്റേറ്റ് പരിശോധന ആവർത്തിക്കുക.'
          };
      }
    }

    if (tagLower.includes('breath') || titleLower.includes('oxygen')) {
      switch (language) {
        case 'ta':
          return {
            tag: 'சுவாசம்',
            title: 'ஆக்சிஜன் மற்றும் சுவாச ஆதரவு வழங்கவும்',
            advice: 'சுவாச வேகம் அதிகமாக இருந்தால் (நிமிடத்திற்கு 20-க்கு மேல்) அல்லது ஆக்சிஜன் அளவு குறைந்தால் உடனடியாக ஆக்சிஜன் வழங்கவும்.'
          };
        case 'hi':
          return {
            tag: 'श्वसन सहायता',
            title: 'ऑक्सीजन एवं श्वसन सहायता प्रदान करें',
            advice: 'यदि सांस तेज चल रही हो (20/मिनट से अधिक) या ऑक्सीजन कम हो, तो तुरंत ऑक्सीजन सपोर्ट दें।'
          };
        case 'te':
          return {
            tag: 'శ్వాసక్రియ',
            title: 'ఆక్సిజన్ మరియు శ్వాస మద్దతు అందించండి',
            advice: 'శ్వాస వేగంగా ఉంటే (నిమిషానికి 20 కంటే ఎక్కువ) లేదా ఆక్సిజన్ తక్కువగా ఉంటే వెంటనే ఆక్సిజన్ అందించండి.'
          };
        case 'ml':
          return {
            tag: 'ശ്വാസോച്ഛ്വാസം',
            title: 'ഓക്സിജൻ സഹായം നൽകുക',
            advice: 'ശ്വാസമെടുക്കാൻ ബുദ്ധിമുട്ടുണ്ടെങ്കിലോ ഓക്സിജൻ നില കുറവാണെങ്കിലോ ഉടൻ തന്നെ ഓക്സിജൻ നൽകുക.'
          };
      }
    }

    if (tagLower.includes('hospital') || tagLower.includes('unit') || titleLower.includes('icu')) {
      switch (language) {
        case 'ta':
          return {
            tag: 'மருத்துவமனை பிரிவு',
            title: 'தீவிர சிகிச்சைப் பிரிவுக்கு (ICU) மாற்றவும்',
            advice: 'தொடர்ச்சியான 24 மணி நேர இரத்த அழுத்தம் மற்றும் உடல் முக்கிய அளவுகளைக் கண்காணிக்க நோயாளியை உடனடியாக ICU-க்கு மாற்றவும்.'
          };
        case 'hi':
          return {
            tag: 'अस्पताल वार्ड',
            title: 'आईसीयू (ICU) में तत्काल स्थानांतरित करें',
            advice: 'लगातार 24 घंटे रक्तचाप और शारीरिक संकेतों की निगरानी के लिए मरीज को तुरंत आईसीयू में भर्ती करें।'
          };
        case 'te':
          return {
            tag: 'హాస్పిటల్ యూనిట్',
            title: 'వెంటనే ఐసీయూ (ICU) కు తరలించండి',
            advice: '24 గంటల పర్యవేక్షణ కోసం రోగిని వెంటనే ఐసీయూ లేదా క్రిటికల్ కేర్ విభాగానికి తరలించండి.'
          };
        case 'ml':
          return {
            tag: 'ആശുപത്രി വിഭാഗം',
            title: 'ഉടൻ ഐസിയുവിലേക്ക് (ICU) മാറ്റുക',
            advice: '24 മണിക്കൂറും കൃത്യമായ നിരീക്ഷണം ഉറപ്പാക്കാൻ രോഗിയെ ഉടൻ തീവ്രപരിചരണ വിഭാഗത്തിലേക്ക് മാറ്റുക.'
          };
      }
    }

    // Default translations for monitoring / stable
    switch (language) {
      case 'ta':
        return {
          tag: 'கண்காணிப்பு',
          title: 'உடல் அளவுகளைத் தொடர்ந்து கண்காணிக்கவும்',
          advice: 'வெப்பநிலை, இதயத் துடிப்பு மற்றும் இரத்த அழுத்தத்தை ஒவ்வொரு 2 முதல் 4 மணி நேரத்திற்கும் பரிசோதிக்கவும்.'
        };
      case 'hi':
        return {
          tag: 'निगरानी',
          title: 'शारीरिक संकेतों की नियमित जांच करें',
          advice: 'तापमान, हृदय गति और रक्तचाप की हर 2 से 4 घंटे में नियमित जांच जारी रखें।'
        };
      case 'te':
        return {
          tag: 'పర్యవేక్షణ',
          title: 'శరీర సంకేతాలను క్రమం తప్పకుండా తనిఖీ చేయండి',
          advice: 'ఉష్ణోగ్రత, పల్స్ మరియు రక్తపోటును ప్రతి 2 నుండి 4 గంటలకు క్రమం తప్పకుండా నమోదు చేయండి.'
        };
      case 'ml':
        return {
          tag: 'നിരീക്ഷണം',
          title: 'ശരീര ലക്ഷണങ്ങൾ കൃത്യമായി പരിശോധിക്കുക',
          advice: 'താപനില, പൾസ്, രക്തസമ്മർദ്ദം എന്നിവ ഓരോ 2-4 മണിക്കൂറിലും കൃത്യമായി പരിശോധിക്കുക.'
        };
    }
    return item;
  };

  // Helper to translate contributing factors
  const translateContributingFactor = (factor: string): string => {
    if (language === 'en') return factor;
    const f = factor.toLowerCase();

    if (f.includes('heart rate') || f.includes('tachycardia')) {
      switch (language) {
        case 'ta': return `அதிகரித்த இதயத் துடிப்பு (${factor.replace(/[^0-9]/g, '') || 'அதிகம்'} bpm)`;
        case 'hi': return `बढ़ी हुई हृदय गति (${factor.replace(/[^0-9]/g, '') || 'उच्च'} bpm)`;
        case 'te': return `పెరిగిన గుండె వేగం (${factor.replace(/[^0-9]/g, '') || 'ఎక్కువ'} bpm)`;
        case 'ml': return `കൂടിയ ഹൃദയമിടിപ്പ് നിരക്ക് (${factor.replace(/[^0-9]/g, '') || 'ഉയർന്നത്'} bpm)`;
      }
    }

    if (f.includes('respiratory') || f.includes('tachypnea')) {
      switch (language) {
        case 'ta': return `வேகமான சுவாச விகிதம் (${factor.replace(/[^0-9]/g, '') || 'அதிகம்'} சுவாசம்/நிமிடம்)`;
        case 'hi': return `तीव्र श्वसन दर (${factor.replace(/[^0-9]/g, '') || 'उच्च'} सांस/मिनट)`;
        case 'te': return `వేగవంతమైన శ్వాసక్రియ (${factor.replace(/[^0-9]/g, '') || 'ఎక్కువ'} శ్వాసలు/నిమిషం)`;
        case 'ml': return `വേഗത്തിലുള്ള ശ്വാസോച്ഛ്വാസം (${factor.replace(/[^0-9]/g, '') || 'കൂടിയത്'} ശ്വാസം/മിനിറ്റ്)`;
      }
    }

    if (f.includes('blood pressure') || f.includes('hypotension') || f.includes('systolic')) {
      switch (language) {
        case 'ta': return `குறைந்த சிஸ்டாலிக் இரத்த அழுத்தம் (${factor.replace(/[^0-9]/g, '') || 'குறைவு'} mmHg)`;
        case 'hi': return `कम सिस्टोलिक रक्तचाप (${factor.replace(/[^0-9]/g, '') || 'निम्न'} mmHg)`;
        case 'te': return `తక్కువ సిస్టోలిక్ రక్తపోటు (${factor.replace(/[^0-9]/g, '') || 'తక్కువ'} mmHg)`;
        case 'ml': return `കുറഞ്ഞ രക്തസമ്മർദ്ദം (${factor.replace(/[^0-9]/g, '') || 'കുറഞ്ഞത്'} mmHg)`;
      }
    }

    if (f.includes('lactate')) {
      switch (language) {
        case 'ta': return 'செல்களுக்கு ஆக்சிஜன் குறைபாட்டைக் காட்டும் அதிகரித்த லாக்டேட் அளவு';
        case 'hi': return 'कोशिकाओं में ऑक्सीजन की कमी दर्शाने वाला बढ़ा हुआ लैक्टेट स्तर';
        case 'te': return 'కణాలకు ఆక్సిజన్ కొరతను సూచించే పెరిగిన లాక్టేట్ స్థాయి';
        case 'ml': return 'കോശങ്ങളിലെ ഓക്സിജൻ കുറവിനെ സൂചിപ്പിക്കുന്ന ഉയർന്ന ലാക്റ്റേറ്റ്';
      }
    }

    if (f.includes('fever') || f.includes('temperature') || f.includes('hypothermia')) {
      switch (language) {
        case 'ta': return 'அசாதாரண உடல் வெப்பநிலை (காய்ச்சல் அல்லது தீவிரக் குளிர்ச்சி)';
        case 'hi': return 'असामान्य शारीरिक तापमान (तेज बुखार या अत्यधिक ठंड)';
        case 'te': return 'అసాధారణ శరీర ఉష్ణోగ్రత (తీవ్ర జ్వరం లేదా చల్లబడటం)';
        case 'ml': return 'അസാധാരണ ശരീര താപനില (കഠിനമായ പനി അല്ലെങ്കിൽ ശരീരം തണുത്തുറയൽ)';
      }
    }

    if (f.includes('shock index')) {
      switch (language) {
        case 'ta': return 'அதிகரித்த ஷாக் இன்டெக்ஸ் (இரத்த ஓட்டச் சமநிலையின்மை)';
        case 'hi': return 'बढ़ा हुआ शॉक इंडेक्स (रक्त प्रवाह अस्थिरता)';
        case 'te': return 'పెరిగిన షాక్ ఇండెక్స్ (రక్తప్రసరణలో అసమతుల్యత)';
        case 'ml': return 'കൂടിയ ഷോക്ക് ഇൻഡക്സ് (രക്തയോട്ടത്തിലെ വ്യതിയാനം)';
      }
    }

    return factor;
  };

  // Helper to translate 1-hour bundle actions
  const translateClinicalAction = (action: string): string => {
    if (language === 'en') return action;
    const a = action.toLowerCase();

    if (a.includes('lactate')) {
      switch (language) {
        case 'ta': return 'இரத்த லாக்டேட் அளவை உடனடியாகப் பரிசோதிக்கவும்; ஆரம்ப அளவு > 2.0 என்றால் 2-4 மணி நேரத்தில் மீண்டும் பரிசோதிக்கவும்.';
        case 'hi': return 'रक्त लैक्टेट स्तर तुरंत मापें; यदि प्रारंभिक लैक्टेट > 2.0 है तो 2-4 घंटे में पुनः जांचें।';
        case 'te': return 'వెంటనే బ్లడ్ లాక్టేట్ స్థాయిని కొలవండి; ప్రారంభంలో > 2.0 ఉంటే 2-4 గంటల్లో మళ్లీ పరీక్షించండి.';
        case 'ml': return 'രക്തത്തിലെ ലാക്റ്റേറ്റ് അളവ് ഉടൻ പരിശോധിക്കുക; പ്രാരംഭ അളവ് > 2.0 ആണെങ്കിൽ 2-4 മണിക്കൂറിനുള്ളിൽ വീണ്ടും പരിശോധിക്കുക.';
      }
    }

    if (a.includes('blood culture') || a.includes('culture')) {
      switch (language) {
        case 'ta': return 'ஆன்டிபயாடிக் மருந்துகளைத் தொடங்குவதற்கு முன்பே இரத்தக் கல்ச்சர் மாதிரிகளைச் சேகரிக்கவும்.';
        case 'hi': return 'एंटीबायोटिक्स शुरू करने से पहले ब्लड कल्चर नमूने एकत्र करें।';
        case 'te': return 'యాంటీబయాటిక్స్ ప్రారంభించడానికి ముందే బ్లడ్ కల్చర్ నమూనాలను సేకరించండి.';
        case 'ml': return 'ആന്റിബയോട്ടിക് മരുന്നുകൾ നൽകുന്നതിന് മുമ്പ് തന്നെ ബ്ലഡ് കൾച്ചർ സാമ്പിളുകൾ ശേഖരിക്കുക.';
      }
    }

    if (a.includes('broad-spectrum') || a.includes('antimicrobial') || a.includes('antibiotic')) {
      switch (language) {
        case 'ta': return '1 மணி நேரத்திற்குள் பரந்த அளவிலான நரம்புவழி (IV) ஆன்டிபயாடிக் மருந்துகளைத் தொடங்கவும்.';
        case 'hi': return '1 घंटे के भीतर ब्रॉड-स्पेक्ट्रम आईवी एंटीबायोटिक्स तुरंत शुरू करें।';
        case 'te': return '1 గంటలోపు బలమైన బ్రాడ్-స్పెక్ట్రమ్ ఐవి యాంటీబయాటిక్స్ ప్రారంభించండి.';
        case 'ml': return '1 മണിക്കൂറിനുള്ളിൽ വിപുലമായ ഐവി ആന്റിബയോട്ടിക് ചികിത്സ ആരംഭിക്കുക.';
      }
    }

    if (a.includes('crystalloid') || a.includes('fluid') || a.includes('30 ml/kg')) {
      switch (language) {
        case 'ta': return 'குறைந்த இரத்த அழுத்தம் அல்லது லாக்டேட் ≥ 4.0 உள்ளபோது 30 mL/kg சலைன் திரவத்தை வேகமாக ஏற்றவும்.';
        case 'hi': return 'कम रक्तचाप या लैक्टेट ≥ 4.0 होने पर तुरंत 30 mL/kg सलाइन फ्लूइड तेजी से चढ़ाएं।';
        case 'te': return 'తక్కువ రక్తపోటు లేదా లాక్టేట్ ≥ 4.0 ఉన్నప్పుడు 30 mL/kg సెలైన్ ద్రవాన్ని వేగంగా ఎక్కించండి.';
        case 'ml': return 'കുറഞ്ഞ രക്തസമ്മർദ്ദമോ ലാക്റ്റേറ്റ് ≥ 4.0 ഉള്ളപ്പോഴോ ഉടൻ 30 mL/kg സലൈൻ ദ്രാവകം വേഗത്തിൽ നൽകുക.';
      }
    }

    if (a.includes('vasopressor') || a.includes('norepinephrine')) {
      switch (language) {
        case 'ta': return 'திரவங்கள் ஏற்றிய பின்னரும் இரத்த அழுத்தம் (MAP < 65) குறைவாக இருந்தால் வாசோபிரசர் மருந்துகளைப் பயன்படுத்தவும்.';
        case 'hi': return 'फ्लूइड देने के बाद भी रक्तचाप कम रहने पर वासोप्रेसर (नोरेपिनेफ्रिन) दवाएं शुरू करें।';
        case 'te': return 'ద్రవాలు ఎక్కించిన తర్వాత కూడా రక్తపోటు తక్కువగా ఉంటే వాసోప్రెసర్ మందులను ఉపయోగించండి.';
        case 'ml': return 'സലൈൻ നൽകിയ ശേഷവും രക്തസമ്മർദ്ദം കുറവാണെങ്കിൽ വാസോപ്രസ്സർ മരുന്നുകൾ നൽകുക.';
      }
    }

    return action;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        translations: TRANSLATIONS[language] || TRANSLATIONS.en,
        translateSepsisType,
        translateSuspectedSource,
        translateAdviceItem,
        translateContributingFactor,
        translateClinicalAction
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
