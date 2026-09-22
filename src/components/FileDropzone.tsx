import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, Image as ImageIcon, CheckCircle, AlertCircle, FileCheck } from 'lucide-react';

interface FileDropzoneProps {
  onFileProcessed: (text: string, filename: string) => void;
  mode: 'job' | 'rental';
}

export const FileDropzone: React.FC<FileDropzoneProps> = ({
  onFileProcessed,
  mode,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentFileName, setCurrentFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      processSelectedFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const processSelectedFile = (file: File) => {
    setCurrentFileName(file.name);
    setIsProcessing(true);

    const isPlainText =
      file.type.includes('text') || file.name.endsWith('.txt');

    if (isPlainText) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = (event.target?.result as string) || '';
        setTimeout(() => {
          setIsProcessing(false);
          onFileProcessed(content, file.name);
        }, 300);
      };
      reader.readAsText(file);
    } else {
      // Simulate OCR text extraction for PDF / Image
      setTimeout(() => {
        setIsProcessing(false);
        const sampleOcrText =
          mode === 'job'
            ? `[OCR EXTRACTION FROM: ${file.name}]
Dear Applicant,

We are pleased to offer you the position of Remote Administrative Assistant at Summit Global Logistics.
Starting Hourly Rate: $40.00/hr.

You will receive a cashier check of $2,950 for home office setup. You must deposit the check and transfer $2,600 via Zelle to our authorized hardware vendor (tech-vendor-portal@fastmail.com) within 24 hours.

Contact HR Manager via Telegram: @SummitLogistics_HR to complete registration.

Best regards,
Hiring Team`
            : `[OCR EXTRACTION FROM: ${file.name}]
LEASE AGREEMENT & PROPERTY RESERVATION

Property: 1200 Pacific Heights Blvd, Apt 4B.
Monthly Rent: $1,300 (All Utilities Included).

Due to urgent overseas humanitarian travel, the landlord cannot conduct an in-person viewing.
The keys will be couriered via FedEx upon receipt of $2,600 security deposit via Western Union or Bitcoin.

Do not contact the on-site leasing office. Send wire receipt to WhatsApp: +1 (555) 019-4821.`;

        onFileProcessed(sampleOcrText, file.name);
      }, 700);
    }
  };

  return (
    <div className="space-y-3">
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.png,.jpg,.jpeg,.txt,.doc,.docx"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) processSelectedFile(file);
        }}
      />

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
          isDragging
            ? 'border-emerald-400 bg-emerald-500/10'
            : 'border-slate-800 bg-slate-950/60 hover:border-slate-700 hover:bg-slate-900/50'
        }`}
      >
        <div className="max-w-md mx-auto flex flex-col items-center justify-center space-y-3">
          <div className="p-3.5 rounded-full bg-slate-900 border border-slate-800 text-emerald-400">
            {isProcessing ? (
              <div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <UploadCloud className="w-8 h-8" />
            )}
          </div>

          <div>
            <h4 className="text-sm font-semibold text-slate-200">
              {isProcessing
                ? `Performing OCR & Document Extraction on ${currentFileName}...`
                : 'Drag & drop document or click to browse'}
            </h4>
            <p className="text-xs text-slate-400 mt-1">
              Supports offer letters & rental contracts in PDF, PNG, JPG, or TXT format.
            </p>
          </div>

          <div className="flex items-center gap-2 text-[11px] font-mono text-slate-500 pt-1">
            <span className="flex items-center gap-1">
              <FileText className="w-3.5 h-3.5" /> PDF / TXT
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <ImageIcon className="w-3.5 h-3.5" /> OCR Scan (PNG/JPG)
            </span>
          </div>
        </div>
      </div>

      {currentFileName && !isProcessing && (
        <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-slate-300 font-mono font-medium">
              Loaded: {currentFileName}
            </span>
          </div>
          <span className="text-[11px] font-mono text-emerald-400">
            OCR Ingestion Ready
          </span>
        </div>
      )}
    </div>
  );
};
