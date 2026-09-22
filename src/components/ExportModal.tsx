import React, { useState } from 'react';
import { X, Copy, Check, Download, FileCode } from 'lucide-react';
import { SecurityInspectionReport } from '../types';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: SecurityInspectionReport;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  report,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Format strictly per the operational directive schema
  const exportPayload = {
    scamThreatIndex: report.scamThreatIndex,
    riskLevel: report.riskLevel,
    summary: report.summary,
    domainAnalysis: {
      suspiciousDomainsFound: report.domainAnalysis.suspiciousDomainsFound,
      isLookalikeDomain: report.domainAnalysis.isLookalikeDomain,
      notes: report.domainAnalysis.notes,
    },
    detectedRedFlags: report.detectedRedFlags.map((rf) => ({
      category: rf.category,
      severity: rf.severity,
      description: rf.description,
      evidenceText: rf.evidenceText,
    })),
    psychologicalTriggers: report.psychologicalTriggers,
    verdictDetails: {
      equipmentScamDetected: report.verdictDetails.equipmentScamDetected,
      depositTrapDetected: report.verdictDetails.depositTrapDetected,
      fakeRecruiterDetected: report.verdictDetails.fakeRecruiterDetected,
    },
    actionableSteps: report.actionableSteps,
  };

  const jsonString = JSON.stringify(exportPayload, null, 2);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(jsonString);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = jsonString;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `scamguard-report-${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-100">
                Security Intelligence Export (Raw JSON)
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Standardized Forensic Threat Schema
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* JSON Code Viewer */}
        <div className="p-5 flex-1 overflow-y-auto bg-slate-950 font-mono text-xs text-emerald-300 select-all leading-relaxed border-b border-slate-800">
          <pre>{jsonString}</pre>
        </div>

        {/* Actions */}
        <div className="p-4 bg-slate-900 flex items-center justify-between gap-3">
          <span className="text-xs text-slate-400 font-mono hidden sm:inline">
            Compliant with ScamGuard AI threat schema
          </span>
          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Copied JSON</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Raw JSON</span>
                </>
              )}
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download .json</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
