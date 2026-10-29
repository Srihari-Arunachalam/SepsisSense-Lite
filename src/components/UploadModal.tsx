import React, { useState, useRef } from 'react';
import {
  X,
  UploadCloud,
  FileText,
  FileSpreadsheet,
  Image as ImageIcon,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Sparkles
} from 'lucide-react';
import { ExtractedRecordData } from '../types';
import { useLanguage } from '../i18n/LanguageContext';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFileUpload: (file: File) => Promise<void>;
  isUploading: boolean;
  uploadProgress: number;
  uploadedRecord: ExtractedRecordData | null;
  onLoadSampleReport: (sampleType: 'icu' | 'ward' | 'emergency') => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  isOpen,
  onClose,
  onFileUpload,
  isUploading,
  uploadProgress,
  uploadedRecord,
  onLoadSampleReport
}) => {
  const { translations } = useLanguage();
  const u = translations.upload;
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await onFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await onFileUpload(e.target.files[0]);
    }
  };

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    if (ext === 'csv' || ext === 'xlsx' || ext === 'xls') {
      return <FileSpreadsheet className="w-6 h-6 text-emerald-600" />;
    }
    if (['png', 'jpg', 'jpeg'].includes(ext || '')) {
      return <ImageIcon className="w-6 h-6 text-purple-600" />;
    }
    return <FileText className="w-6 h-6 text-blue-600" />;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl max-w-xl w-full border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#007A78]/10 text-[#007A78] flex items-center justify-center">
              <UploadCloud className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">{u.title}</h3>
              <p className="text-xs text-slate-500">{u.subtitle}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.csv,.xlsx,.xls,.txt,image/png,image/jpeg,image/jpg"
            className="hidden"
            onChange={handleFileChange}
          />

          {/* Drag & Drop Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-6 sm:p-8 text-center cursor-pointer transition-all ${
              isDragOver
                ? 'border-[#007A78] bg-teal-50/50 scale-[0.99]'
                : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/50'
            }`}
          >
            <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3 text-slate-600">
              <UploadCloud className="w-6 h-6 stroke-[1.8]" />
            </div>
            <p className="text-sm font-semibold text-slate-800">
              {u.dragText}
            </p>
            <p className="text-xs text-[#007A78] font-medium mt-1">
              {u.browseText}
            </p>
            <p className="text-[11px] text-slate-400 mt-2">
              {u.supportedFormats}
            </p>
          </div>

          {/* Upload Progress Bar */}
          {isUploading && (
            <div className="mt-4 p-3 bg-teal-50/70 border border-teal-100 rounded-xl">
              <div className="flex items-center justify-between text-xs text-teal-800 mb-1.5 font-medium">
                <span className="flex items-center gap-1.5">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  {u.extracting}
                </span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-teal-200/50 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[#007A78] h-full transition-all duration-200 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Extracted Record Card */}
          {uploadedRecord && !isUploading && (
            <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  {getFileIcon(uploadedRecord.fileName)}
                  <div>
                    <p className="text-xs font-bold text-slate-800 line-clamp-1">
                      {uploadedRecord.fileName}
                    </p>
                    <p className="text-[10px] text-slate-400">
                      {uploadedRecord.fileSize}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Extracted</span>
                </div>
              </div>

              {/* Extracted preview tags */}
              <div className="mt-3 flex flex-wrap gap-1.5">
                {Object.entries(uploadedRecord.extracted).map(([field, item]) => (
                  <span
                    key={field}
                    className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 bg-white border border-slate-200 rounded-md text-slate-700"
                  >
                    <span className="text-slate-400">{field.replace('_', ' ')}:</span>
                    <span className="font-bold text-[#007A78]">{String(item.value)}</span>
                  </span>
                ))}
              </div>

              {/* Warning for unidentifiable fields if any */}
              {uploadedRecord.unidentifiableFields && uploadedRecord.unidentifiableFields.length > 0 && (
                <div className="mt-2.5 flex items-start gap-1.5 text-[11px] text-amber-800 bg-amber-50 p-2 rounded-lg border border-amber-200/70">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold">Unable to identify this value: </span>
                    <span>{uploadedRecord.unidentifiableFields.map(f => f.replace('_', ' ')).join(', ')}. Please enter it manually.</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Quick Mock Sample Records */}
          <div className="mt-5 pt-4 border-t border-slate-100">
            <p className="text-xs font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#007A78]" />
              <span>{u.quickSamples}</span>
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <button
                type="button"
                onClick={() => {
                  onLoadSampleReport('icu');
                  onClose();
                }}
                className="p-2.5 rounded-xl border border-slate-200 hover:border-[#007A78] hover:bg-teal-50/40 text-left transition-colors cursor-pointer"
              >
                <p className="font-bold text-slate-800">ICU Shock Chart</p>
                <p className="text-[10px] text-slate-400 mt-0.5">HR 122, Lac 3.8, SBP 82</p>
              </button>

              <button
                type="button"
                onClick={() => {
                  onLoadSampleReport('ward');
                  onClose();
                }}
                className="p-2.5 rounded-xl border border-slate-200 hover:border-[#007A78] hover:bg-teal-50/40 text-left transition-colors cursor-pointer"
              >
                <p className="font-bold text-slate-800">Ward Observation</p>
                <p className="text-[10px] text-slate-400 mt-0.5">HR 98, Lac 2.1, SBP 106</p>
              </button>

              <button
                type="button"
                onClick={() => {
                  onLoadSampleReport('emergency');
                  onClose();
                }}
                className="p-2.5 rounded-xl border border-slate-200 hover:border-[#007A78] hover:bg-teal-50/40 text-left transition-colors cursor-pointer"
              >
                <p className="font-bold text-slate-800">Stable Baseline</p>
                <p className="text-[10px] text-slate-400 mt-0.5">HR 72, Lac 1.1, SBP 120</p>
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-white border border-slate-200 rounded-xl cursor-pointer"
          >
            {u.closeBtn}
          </button>
        </div>
      </div>
    </div>
  );
};
