import React, { useState, useRef } from 'react';
import { Header } from './components/Header';
import { ClinicalCard } from './components/ClinicalCard';
import { ChatInputBar } from './components/ChatInputBar';
import { UploadModal } from './components/UploadModal';
import { ResultPanel } from './components/ResultPanel';
import { ClinicalReportModal } from './components/ClinicalReportModal';
import { MedicalExplanationsGuide } from './components/MedicalExplanationsGuide';
import { MedicalLoadingAnimation } from './components/MedicalLoadingAnimation';
import { AlertCircle, MessageSquare } from 'lucide-react';
import { LanguageProvider, useLanguage } from './i18n/LanguageContext';
import {
  PatientFormState,
  BloodGroup,
  FieldSourceMap,
  ExtractedRecordData,
  SepsisPredictionResponse
} from './types';

// Matching the clinical default form state
const DEFAULT_FORM: PatientFormState = {
  age: '',
  blood_group: '',
  temperature: '',
  heart_rate: '',
  respiratory_rate: '',
  systolic_bp: '',
  diastolic_bp: '',
  lactate: '',
  creatinine: '',
  spo2: '',
  wbc: ''
};

// Safe JSON parser to handle network/HTML error pages without throwing SyntaxError
async function parseResponseJson(response: Response, defaultError: string) {
  let rawText = '';
  try {
    rawText = await response.text();
  } catch {
    throw new Error('Network error reading server response. Please ensure the server is running.');
  }

  try {
    const data = JSON.parse(rawText);
    if (!response.ok) {
      throw new Error(data.error || data.message || defaultError);
    }
    return data;
  } catch (parseErr: any) {
    if (parseErr?.message && !parseErr.message.includes('JSON') && !parseErr.message.includes('token')) {
      throw parseErr;
    }
    const cleanSnippet = rawText.replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim().slice(0, 100);
    if (!response.ok) {
      throw new Error(`Server returned HTTP ${response.status}: ${cleanSnippet || defaultError}`);
    }
    throw new Error(cleanSnippet ? `Server error: ${cleanSnippet}` : defaultError);
  }
}

function DashboardContent() {
  const { language, translations } = useLanguage();
  const [form, setForm] = useState<PatientFormState>(DEFAULT_FORM);
  const [bloodGroup, setBloodGroup] = useState<BloodGroup>('');
  const [sourceMap, setSourceMap] = useState<FieldSourceMap>({
    age: 'manual',
    temperature: 'manual',
    heart_rate: 'manual',
    respiratory_rate: 'manual',
    systolic_bp: 'manual',
    lactate: 'manual',
    creatinine: 'manual'
  });

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadedRecord, setUploadedRecord] = useState<ExtractedRecordData | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [predictionResult, setPredictionResult] = useState<SepsisPredictionResponse | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const [isReportOpen, setIsReportOpen] = useState(false);
  const [chatAnswer, setChatAnswer] = useState<{ query: string; reply: string } | null>(null);
  const [isChatLoading, setIsChatLoading] = useState(false);

  const resultRef = useRef<HTMLDivElement | null>(null);

  // Clear all entered inputs back to empty
  const handleClear = () => {
    setForm(DEFAULT_FORM);
    setBloodGroup('');
    setPredictionResult(null);
    setUploadedRecord(null);
    setAnalysisError(null);
    setSourceMap({
      age: 'manual',
      temperature: 'manual',
      heart_rate: 'manual',
      respiratory_rate: 'manual',
      systolic_bp: 'manual',
      lactate: 'manual',
      creatinine: 'manual'
    });
  };

  const handleFieldChange = (field: keyof PatientFormState, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setSourceMap((prev) => ({ ...prev, [field]: 'manual' }));
    if (analysisError) setAnalysisError(null);
  };

  // Upload handler with progress simulation and backend extraction
  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    setUploadProgress(10);
    setAnalysisError(null);

    const progressTimer = setInterval(() => {
      setUploadProgress((p) => (p < 85 ? p + 15 : p));
    }, 150);

    try {
      let fileContent = '';
      if (file.type.startsWith('image/')) {
        fileContent = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
      } else {
        fileContent = await file.text();
      }

      const response = await fetch('/api/extract-record', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: file.name,
          fileType: file.type || 'text/plain',
          fileContent
        })
      });

      clearInterval(progressTimer);
      setUploadProgress(100);

      const data = await parseResponseJson(response, 'Failed to extract record.');

      const extractedInfo: ExtractedRecordData = {
        fileName: file.name,
        fileSize: `${(file.size / 1024).toFixed(1)} KB`,
        fileType: file.type || 'Hospital Record',
        extracted: data.extracted || {},
        unidentifiableFields: data.unidentifiableFields || [],
        message: data.message || 'Record uploaded successfully.'
      };

      setUploadedRecord(extractedInfo);

      // Populate form with converted numeric values
      const newSourceMap = { ...sourceMap };
      const newForm = { ...form };

      if (extractedInfo.extracted.age) {
        newForm.age = String(Math.round(Number(extractedInfo.extracted.age.value)));
        newSourceMap.age = 'extracted';
      }
      if (extractedInfo.extracted.blood_group) {
        const bg = String(extractedInfo.extracted.blood_group.value) as BloodGroup;
        setBloodGroup(bg);
      }
      if (extractedInfo.extracted.temperature) {
        newForm.temperature = String(extractedInfo.extracted.temperature.value);
        newSourceMap.temperature = 'extracted';
      }
      if (extractedInfo.extracted.heart_rate) {
        newForm.heart_rate = String(extractedInfo.extracted.heart_rate.value);
        newSourceMap.heart_rate = 'extracted';
      }
      if (extractedInfo.extracted.respiratory_rate) {
        newForm.respiratory_rate = String(extractedInfo.extracted.respiratory_rate.value);
        newSourceMap.respiratory_rate = 'extracted';
      }
      if (extractedInfo.extracted.systolic_bp) {
        newForm.systolic_bp = String(extractedInfo.extracted.systolic_bp.value);
        newSourceMap.systolic_bp = 'extracted';
      }
      if (extractedInfo.extracted.lactate) {
        newForm.lactate = String(extractedInfo.extracted.lactate.value);
        newSourceMap.lactate = 'extracted';
      }
      if (extractedInfo.extracted.creatinine) {
        newForm.creatinine = String(extractedInfo.extracted.creatinine.value);
        newSourceMap.creatinine = 'extracted';
      }

      setForm(newForm);
      setSourceMap(newSourceMap);
    } catch (err: any) {
      clearInterval(progressTimer);
      setAnalysisError(err.message || 'Error parsing uploaded record. Please enter values manually.');
    } finally {
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
      }, 300);
    }
  };

  // Sample record loader with instant auto-analysis
  const handleLoadSample = async (sampleType: string) => {
    setAnalysisError(null);

    let targetForm: PatientFormState;
    let targetBg: BloodGroup;
    let recordInfo: ExtractedRecordData;

    if (sampleType === 'icu' || sampleType === 'high') {
      targetForm = {
        age: '68',
        blood_group: 'O+',
        temperature: '38.8',
        heart_rate: '122',
        respiratory_rate: '28',
        systolic_bp: '82',
        diastolic_bp: '48',
        lactate: '3.8',
        creatinine: '2.1',
        spo2: '91',
        wbc: '18.2'
      };
      targetBg = 'O+';
      recordInfo = {
        fileName: 'ICU_Septic_Shock_Chart.csv',
        fileSize: '36.4 KB',
        fileType: 'text/csv',
        extracted: {
          heart_rate: { value: 122, confidence: 0.98 },
          systolic_bp: { value: 82, confidence: 0.99 },
          temperature: { value: 38.8, confidence: 0.97 },
          respiratory_rate: { value: 28, confidence: 0.95 },
          lactate: { value: 3.8, confidence: 0.99 },
          creatinine: { value: 2.1, confidence: 0.98 },
          age: { value: 68, confidence: 0.99 }
        },
        unidentifiableFields: [],
        message: 'High risk ICU sample record loaded successfully.'
      };
    } else if (sampleType === 'ward' || sampleType === 'moderate') {
      targetForm = {
        age: '54',
        blood_group: 'A+',
        temperature: '38.2',
        heart_rate: '98',
        respiratory_rate: '22',
        systolic_bp: '106',
        diastolic_bp: '68',
        lactate: '2.1',
        creatinine: '1.4',
        spo2: '95',
        wbc: '12.4'
      };
      targetBg = 'A+';
      recordInfo = {
        fileName: 'Ward_Observation_Chart.csv',
        fileSize: '24.1 KB',
        fileType: 'text/csv',
        extracted: {
          heart_rate: { value: 98, confidence: 0.96 },
          systolic_bp: { value: 106, confidence: 0.97 },
          temperature: { value: 38.2, confidence: 0.95 },
          respiratory_rate: { value: 22, confidence: 0.94 },
          lactate: { value: 2.1, confidence: 0.97 },
          creatinine: { value: 1.4, confidence: 0.96 },
          age: { value: 54, confidence: 0.98 }
        },
        unidentifiableFields: [],
        message: 'Moderate risk ward observation sample record loaded.'
      };
    } else {
      targetForm = {
        age: '42',
        blood_group: 'B+',
        temperature: '36.8',
        heart_rate: '72',
        respiratory_rate: '14',
        systolic_bp: '120',
        diastolic_bp: '78',
        lactate: '1.1',
        creatinine: '0.9',
        spo2: '99',
        wbc: '6.8'
      };
      targetBg = 'B+';
      recordInfo = {
        fileName: 'PostOp_Stable_Observation.csv',
        fileSize: '18.7 KB',
        fileType: 'text/csv',
        extracted: {
          heart_rate: { value: 72, confidence: 0.99 },
          systolic_bp: { value: 120, confidence: 0.99 },
          temperature: { value: 36.8, confidence: 0.98 },
          respiratory_rate: { value: 14, confidence: 0.97 },
          lactate: { value: 1.1, confidence: 0.98 },
          creatinine: { value: 0.9, confidence: 0.97 },
          age: { value: 42, confidence: 0.99 }
        },
        unidentifiableFields: [],
        message: 'Low risk baseline sample record loaded successfully.'
      };
    }

    setForm(targetForm);
    setBloodGroup(targetBg);
    setUploadedRecord(recordInfo);
    setSourceMap({
      age: 'extracted',
      temperature: 'extracted',
      heart_rate: 'extracted',
      respiratory_rate: 'extracted',
      systolic_bp: 'extracted',
      lactate: 'extracted',
      creatinine: 'extracted'
    });

    // Auto-calculate prediction and display percentage & scores immediately
    setIsAnalyzing(true);
    setPredictionResult(null);
    const clientStartTime = performance.now();
    try {
      const payload = {
        age: parseInt(targetForm.age, 10),
        blood_group: targetBg,
        temperature: parseFloat(targetForm.temperature),
        heart_rate: parseFloat(targetForm.heart_rate),
        respiratory_rate: parseFloat(targetForm.respiratory_rate),
        systolic_bp: parseFloat(targetForm.systolic_bp),
        lactate: parseFloat(targetForm.lactate),
        creatinine: parseFloat(targetForm.creatinine)
      };

      const fetchPromise = fetch('/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const timerPromise = new Promise((resolve) => setTimeout(resolve, 3400));
      const [response] = await Promise.all([fetchPromise, timerPromise]);

      const data = await parseResponseJson(response, 'Failed to analyze sample data.');

      const clientElapsedSec = parseFloat(((performance.now() - clientStartTime) / 1000).toFixed(2));
      setPredictionResult({
        ...data,
        execution_time_seconds: Math.max(0.05, clientElapsedSec)
      });

      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 100);
    } catch (err: any) {
      const msg = err?.message || '';
      if (msg.includes('Failed to fetch') || msg.includes('NetworkError') || msg.includes('JSON')) {
        setAnalysisError('Unable to connect to SepsisSense server. Please ensure the server is running on http://localhost:3000.');
      } else {
        setAnalysisError(err.message || 'Error executing clinical analysis.');
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Primary Clinical Risk Analysis Handler
  const handleAnalyze = async () => {
    setAnalysisError(null);

    // Validation: Require primary vitals
    const required = [
      { key: 'age', name: 'Age' },
      { key: 'temperature', name: 'Body Temperature' },
      { key: 'heart_rate', name: 'Heart Rate' },
      { key: 'respiratory_rate', name: 'Respiratory Rate' },
      { key: 'systolic_bp', name: 'Systolic Blood Pressure' },
      { key: 'lactate', name: 'Serum Lactate' },
      { key: 'creatinine', name: 'Serum Creatinine' }
    ];

    const missing = required.filter((r) => !form[r.key as keyof PatientFormState]);
    if (missing.length > 0) {
      setAnalysisError(
        `Please complete the remaining clinical inputs: ${missing.map((m) => m.name).join(', ')}.`
      );
      return;
    }

    setIsAnalyzing(true);
    setPredictionResult(null);
    const clientStartTime = performance.now();

    try {
      const payload = {
        age: form.age ? parseInt(form.age, 10) : null,
        blood_group: bloodGroup || null,
        temperature: form.temperature ? parseFloat(form.temperature) : null,
        heart_rate: form.heart_rate ? parseFloat(form.heart_rate) : null,
        respiratory_rate: form.respiratory_rate ? parseFloat(form.respiratory_rate) : null,
        systolic_bp: form.systolic_bp ? parseFloat(form.systolic_bp) : null,
        diastolic_bp: form.diastolic_bp ? parseFloat(form.diastolic_bp) : null,
        lactate: form.lactate ? parseFloat(form.lactate) : null,
        creatinine: form.creatinine ? parseFloat(form.creatinine) : null,
        spo2: form.spo2 ? parseFloat(form.spo2) : null,
        wbc: form.wbc ? parseFloat(form.wbc) : null
      };

      const fetchPromise = fetch('/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const timerPromise = new Promise((resolve) => setTimeout(resolve, 3400));
      const [response] = await Promise.all([fetchPromise, timerPromise]);

      const data = await parseResponseJson(response, 'Clinical prediction failed.');

      const clientElapsedSec = parseFloat(((performance.now() - clientStartTime) / 1000).toFixed(2));
      setPredictionResult({
        ...data,
        execution_time_seconds: Math.max(0.05, clientElapsedSec)
      });

      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (err: any) {
      const msg = err?.message || '';
      if (msg.includes('Failed to fetch') || msg.includes('NetworkError') || msg.includes('JSON')) {
        setAnalysisError('Unable to connect to SepsisSense server. Please ensure the server is running on http://localhost:3000.');
      } else {
        setAnalysisError(err.message || 'Error assessing sepsis risk.');
      }
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Multilingual Medical Chat Inquiry Handler
  const handleSendMessage = async (text: string) => {
    setIsChatLoading(true);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: text,
          language: language,
          patientData: {
            ...form,
            blood_group: bloodGroup
          }
        })
      });

      const data = await parseResponseJson(response, 'Failed to answer inquiry.');

      setChatAnswer({
        query: text,
        reply: data.reply
      });

      // If user typed vitals in chat, extract and populate form
      if (/(?:hr|bp|temp|lactate|cr|rr|age|blood|vitals|shock|rate|group)/i.test(text)) {
        const extractRes = await fetch('/api/extract-record', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fileContent: text, fileName: 'Clinician Query' })
        });
        const extractData = await parseResponseJson(extractRes, 'Failed to extract vital values.');
        if (extractData.extracted) {
          const newForm = { ...form };
          const newSourceMap = { ...sourceMap };
          for (const [key, item] of Object.entries(extractData.extracted)) {
            if (key in newForm && (item as any).value !== undefined) {
              (newForm as any)[key] = String((item as any).value);
              newSourceMap[key] = 'extracted';
            }
          }
          if (extractData.extracted.blood_group && extractData.extracted.blood_group.value) {
            const bg = String(extractData.extracted.blood_group.value).trim().toUpperCase() as BloodGroup;
            const validBGs: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
            if (validBGs.includes(bg)) {
              setBloodGroup(bg);
              newForm.blood_group = bg;
              newSourceMap.blood_group = 'extracted';
            }
          }
          setForm(newForm);
          setSourceMap(newSourceMap);
        }
      }
    } catch (err: any) {
      setAnalysisError(err.message || 'Chat assistant error. Please try again.');
    } finally {
      setIsChatLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-teal-100 selection:text-teal-900">
      {/* Top Header Navigation */}
      <Header
        onOpenUpload={() => setIsUploadModalOpen(true)}
        onSelectPreset={handleLoadSample}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 pt-10 sm:pt-14 pb-8 flex flex-col items-center">
        {/* Centered Main Title */}
        <div className="text-center mb-6 max-w-4xl w-full px-2">
          <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 whitespace-nowrap overflow-hidden text-ellipsis">
            {translations.hero.title}
          </h1>
        </div>


        {/* Global Error Banner */}
        {analysisError && (
          <div className="max-w-4xl w-full mb-6 bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-start gap-3 text-xs sm:text-sm text-rose-800 animate-in fade-in">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="font-bold text-rose-900">{translations.alerts.noticeTitle}</p>
              <p className="mt-0.5">{analysisError}</p>
            </div>
            <button
              type="button"
              onClick={() => setAnalysisError(null)}
              className="text-rose-500 hover:text-rose-700 text-xs font-semibold px-2 py-1 cursor-pointer"
            >
              {translations.alerts.dismiss}
            </button>
          </div>
        )}

        {/* Central Clinical Information Card */}
        <ClinicalCard
          form={form}
          bloodGroup={bloodGroup}
          onFieldChange={handleFieldChange}
          onBloodGroupChange={setBloodGroup}
          onAnalyze={handleAnalyze}
          onClear={handleClear}
          isAnalyzing={isAnalyzing}
        />

        {/* Simple Medical Explanations & Sepsis Guide (Requirement 3) */}
        <MedicalExplanationsGuide onAskQuestion={handleSendMessage} />

        {/* Results Section */}
        <div ref={resultRef} className="w-full">
          {isAnalyzing && (
            <div className="w-full my-6">
              <MedicalLoadingAnimation />
            </div>
          )}

          {!isAnalyzing && predictionResult && (
            <ResultPanel
              result={predictionResult}
              form={form}
              onPrintReport={() => setIsReportOpen(true)}
              onReset={() => setPredictionResult(null)}
            />
          )}
        </div>

        {/* Medical Chat Assistant Response */}
        {chatAnswer && (
          <div className="max-w-4xl w-full mt-6 bg-white rounded-2xl border border-teal-200 shadow-sm p-5 animate-in fade-in">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2 text-xs font-bold text-[#007A78]">
                <MessageSquare className="w-4 h-4" />
                <span>{translations.chat.responseTitle}</span>
              </div>
              <button
                type="button"
                onClick={() => setChatAnswer(null)}
                className="text-xs text-slate-400 hover:text-slate-600 font-semibold cursor-pointer"
              >
                {translations.chat.closeBtn}
              </button>
            </div>
            <p className="text-xs font-medium text-slate-600 mt-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              {translations.chat.queryLabel}: &ldquo;{chatAnswer.query}&rdquo;
            </p>
            <p className="text-xs sm:text-sm text-slate-800 mt-3 leading-relaxed">
              {chatAnswer.reply}
            </p>
          </div>
        )}

        {/* ChatGPT-style Bottom Input Bar with Multilingual Quick Prompts */}
        <ChatInputBar
          onSendMessage={handleSendMessage}
          onTriggerFileUpload={() => setIsUploadModalOpen(true)}
          onTriggerImageUpload={() => setIsUploadModalOpen(true)}
          isLoading={isChatLoading}
        />
      </main>

      {/* Upload Hospital Records Modal */}
      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onFileUpload={handleFileUpload}
        isUploading={isUploading}
        uploadProgress={uploadProgress}
        uploadedRecord={uploadedRecord}
        onLoadSampleReport={(type) => {
          handleLoadSample(type);
        }}
      />

      {/* Printable Clinical Sepsis Assessment Report Modal */}
      {predictionResult && (
        <ClinicalReportModal
          isOpen={isReportOpen}
          onClose={() => setIsReportOpen(false)}
          form={form}
          bloodGroup={bloodGroup}
          result={predictionResult}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
    
      <DashboardContent />
    </LanguageProvider>
  );
}
