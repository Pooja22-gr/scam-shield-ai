import React, { useState } from 'react';
import {
  FileText,
  Printer,
  Download,
  Copy,
  Check,
  X,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Scale,
  Calendar,
  Lock,
} from 'lucide-react';
import { ScamInspectionReport } from '../services/dynamicScanner';
import { LanguageCode, getUiString } from '../services/translator';

interface ForensicReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: ScamInspectionReport | null;
  targetPayload: string;
  currentLanguage: LanguageCode;
}

export const ForensicReportModal: React.FC<ForensicReportModalProps> = ({
  isOpen,
  onClose,
  report,
  targetPayload,
  currentLanguage,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !report) return null;

  const caseId = `SCAMSHIELD-CASE-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  const timestamp = new Date().toLocaleString();

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadHtml = () => {
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>ScamShield AI - Forensic Evidence Dossier ${caseId}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; margin: 40px; color: #1e293b; background: #fff; line-height: 1.5; }
    .header { border-bottom: 2px solid #0f172a; padding-bottom: 16px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: flex-start; }
    .brand { font-size: 20px; font-weight: bold; color: #0284c7; }
    .badge { display: inline-block; padding: 4px 10px; border-radius: 9999px; font-size: 12px; font-weight: bold; text-transform: uppercase; background: ${report.scamThreatIndex >= 50 ? '#fee2e2' : '#dcfce7'}; color: ${report.scamThreatIndex >= 50 ? '#dc2626' : '#16a34a'}; border: 1px solid ${report.scamThreatIndex >= 50 ? '#f87171' : '#4ade80'}; }
    .score-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin-bottom: 24px; display: flex; align-items: center; justify-content: space-between; }
    .score-num { font-size: 36px; font-weight: bold; color: ${report.scamThreatIndex >= 50 ? '#dc2626' : '#16a34a'}; font-family: monospace; }
    h2 { font-size: 16px; border-bottom: 1px solid #cbd5e1; padding-bottom: 6px; margin-top: 24px; text-transform: uppercase; letter-spacing: 0.5px; color: #334155; }
    table { width: 100%; border-collapse: collapse; margin-top: 12px; margin-bottom: 24px; font-size: 13px; }
    th, td { border: 1px solid #cbd5e1; padding: 10px; text-align: left; }
    th { background: #f1f5f9; font-weight: 600; color: #1e293b; }
    .evidence-quote { background: #fff1f2; border-left: 3px solid #e11d48; padding: 8px 12px; font-family: monospace; font-size: 12px; color: #9f1239; margin-top: 4px; }
    .footer { margin-top: 40px; border-top: 1px solid #e2e8f0; padding-top: 16px; font-size: 11px; color: #64748b; text-align: center; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="brand">ScamShield AI • Forensic Investigation Report</div>
      <div style="font-size: 12px; color: #64748b; margin-top: 4px;">Classification: Official Forensic Dossier // Case ID: ${caseId}</div>
    </div>
    <div style="text-align: right;">
      <span class="badge">${report.riskLevel} (${report.scamThreatIndex}/100)</span>
      <div style="font-size: 11px; color: #64748b; margin-top: 4px;">Generated: ${timestamp}</div>
    </div>
  </div>

  <div class="score-box">
    <div>
      <div style="font-size: 12px; text-transform: uppercase; color: #64748b; font-weight: 600;">Calculated Scam Threat Index</div>
      <div class="score-num">${report.scamThreatIndex} <span style="font-size: 16px; color: #64748b;">/ 100</span></div>
      <div style="font-size: 13px; color: #334155; margin-top: 4px;">Risk Status: <strong>${report.riskLevel}</strong></div>
    </div>
    <div style="max-width: 60%; font-size: 13px; color: #475569; line-height: 1.6;">
      <strong>Executive Verdict:</strong> ${report.summary}
    </div>
  </div>

  <h2>1. Forensic Evidence & Detected Red Flags (${report.detectedRedFlags.length})</h2>
  <table>
    <thead>
      <tr>
        <th style="width: 25%;">Indicator</th>
        <th style="width: 15%;">Severity</th>
        <th style="width: 60%;">Quoted Verbatim Evidence & Security Impact</th>
      </tr>
    </thead>
    <tbody>
      ${report.detectedRedFlags
        .map(
          (rf) => `
        <tr>
          <td><strong>${rf.indicator}</strong></td>
          <td><span style="font-weight: bold; color: ${rf.severity === 'Critical' ? '#dc2626' : '#d97706'};">${rf.severity}</span></td>
          <td>
            <div class="evidence-quote">"${rf.evidence}"</div>
            <div style="margin-top: 6px; font-size: 12px; color: #334155;">${rf.explanation}</div>
          </td>
        </tr>
      `
        )
        .join('')}
    </tbody>
  </table>

  <h2>2. Contributing Risk Factors Matrix</h2>
  <table>
    <thead>
      <tr>
        <th>Risk Factor</th>
        <th style="width: 120px;">Score Contribution</th>
      </tr>
    </thead>
    <tbody>
      ${report.scoreFactors
        .map(
          (f) => `
        <tr>
          <td>${f.factor}</td>
          <td style="font-family: monospace; font-weight: bold; color: #e11d48;">+${f.points} pts</td>
        </tr>
      `
        )
        .join('')}
    </tbody>
  </table>

  <h2>3. Domain & URL Infrastructure Assessment</h2>
  <table>
    <tbody>
      <tr>
        <td style="width: 30%; font-weight: bold; background: #f8fafc;">Target Host</td>
        <td>${report.domainAnalysis.domainName}</td>
      </tr>
      <tr>
        <td style="font-weight: bold; background: #f8fafc;">Domain Age Status</td>
        <td>${report.domainAnalysis.domainAge}</td>
      </tr>
      <tr>
        <td style="font-weight: bold; background: #f8fafc;">Technical Assessment Notes</td>
        <td>${report.domainAnalysis.notes}</td>
      </tr>
    </tbody>
  </table>

  <h2>4. Recommended Incident Response Actions</h2>
  <ol style="font-size: 13px; color: #334155; line-height: 1.8;">
    ${report.recommendedActions.map((act) => `<li>${act}</li>`).join('')}
  </ol>

  <div class="footer">
    This document was generated by ScamShield AI Cybersecurity & Anti-Phishing Inspection Engine.
    Intended for law enforcement submission, internal audit, or legal cross-reference.
  </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ScamShield_Forensic_Report_${caseId}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleCopyText = async () => {
    const textReport = `================================================================================
SCAMSHIELD AI • FORENSIC INCIDENT INVESTIGATION REPORT
Case ID: ${caseId}
Timestamp: ${timestamp}
Scam Threat Index: ${report.scamThreatIndex}/100 [${report.riskLevel}]
================================================================================

EXECUTIVE VERDICT:
${report.summary}

DETECTED RED FLAGS & FORENSIC EVIDENCE (${report.detectedRedFlags.length} vectors):
${report.detectedRedFlags
  .map(
    (rf, i) => `[${i + 1}] ${rf.indicator} (${rf.severity})
    EVIDENCE: "${rf.evidence}"
    EXPLANATION: ${rf.explanation}`
  )
  .join('\n\n')}

SCORE FACTORS:
${report.scoreFactors.map((sf) => `• ${sf.factor}: +${sf.points} pts`).join('\n')}

DOMAIN ASSESSMENT:
Host: ${report.domainAnalysis.domainName}
Age: ${report.domainAnalysis.domainAge}
Notes: ${report.domainAnalysis.notes}

RECOMMENDED ACTIONS:
${report.recommendedActions.map((a, i) => `${i + 1}. ${a}`).join('\n')}
================================================================================`;

    try {
      await navigator.clipboard.writeText(textReport);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      {/* Print Specific CSS Stylesheet */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-dossier, #printable-dossier * {
            visibility: visible;
          }
          #printable-dossier {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            background: #ffffff !important;
            color: #0f172a !important;
            padding: 20px !important;
            border: none !important;
            box-shadow: none !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div
        id="printable-dossier"
        className="w-full max-w-4xl bg-slate-900 border border-cyan-500/30 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden my-auto flex flex-col max-h-[92vh]"
      >
        {/* Modal Top Bar (Hidden on print) */}
        <div className="no-print p-4 sm:p-5 bg-slate-950/90 border-b border-cyan-500/20 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-[#00F0FF]">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-white font-mono flex items-center gap-2">
                <span>{currentLanguage === 'hi' ? 'फोरेंसिक साक्ष्य रिपोर्ट निर्यात' : 'Forensic Evidence Report'}</span>
                <span className="text-[10px] font-mono text-cyan-400 font-normal">
                  [{caseId}]
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                {currentLanguage === 'hi'
                  ? 'मुद्रण योग्य आधिकारिक पीडीएफ या स्टैंडअलोन एचटीएमएल रिपोर्ट तैयार करें'
                  : 'Official printable PDF or standalone HTML cybercrime incident summary'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#00F0FF] text-slate-950 hover:bg-[#00FF9D] transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_0_12px_rgba(0,240,255,0.3)]"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{currentLanguage === 'hi' ? 'प्रिंट / पीडीएफ सेव करें' : 'Print / Save PDF'}</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadHtml}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-cyan-500/15 text-[#00F0FF] hover:bg-cyan-500/25 border border-cyan-500/30 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{currentLanguage === 'hi' ? 'HTML डाउनलोड करें' : 'Download HTML'}</span>
            </button>

            <button
              type="button"
              onClick={handleCopyText}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-800 border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#00FF9D]" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Formal Report Body */}
        <div className="p-6 sm:p-8 space-y-6 overflow-y-auto font-sans text-xs">
          {/* Official Document Letterhead */}
          <div className="border-b-2 border-cyan-500/30 pb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white tracking-wider font-mono">
                  SCAMSHIELD AI FORENSIC INCIDENT DOSSIER
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-500/15 text-[#00F0FF] border border-cyan-500/30">
                  OFFICIAL INVESTIGATION
                </span>
              </div>
              <div className="text-[11px] text-slate-400 mt-1 font-mono">
                CASE ID: {caseId} • DATE: {timestamp}
              </div>
            </div>

            <div className="text-right">
              <div
                className={`inline-block px-3 py-1 rounded-full text-xs font-mono font-bold border ${
                  report.scamThreatIndex >= 50
                    ? 'bg-[#FF2A6D]/20 text-[#FF2A6D] border-[#FF2A6D]/40'
                    : 'bg-[#00FF9D]/20 text-[#00FF9D] border-[#00FF9D]/40'
                }`}
              >
                {report.riskLevel} ({report.scamThreatIndex}/100)
              </div>
              <div className="text-[10px] text-slate-400 mt-1">
                EVALUATION PROTOCOL V2.4
              </div>
            </div>
          </div>

          {/* Section: Executive Verdict Box */}
          <div className="p-4 rounded-xl bg-[#070C18]/90 border border-cyan-500/20 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-bold">
                {currentLanguage === 'hi' ? 'कार्यकारी खतरा निष्कर्ष:' : 'Executive Threat Assessment:'}
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                Threat Index: {report.scamThreatIndex}%
              </span>
            </div>
            <p className="text-slate-200 text-xs leading-relaxed">
              {report.summary}
            </p>
          </div>

          {/* Section: Forensic Evidence Table */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-[#FF2A6D]" />
              <span>{currentLanguage === 'hi' ? 'उद्धृत फोरेंसिक सबूत:' : 'Forensic Red Flags & Quoted Evidence:'}</span>
              <span className="text-[10px] text-slate-500">
                ({report.detectedRedFlags.length} identified)
              </span>
            </h4>

            <div className="space-y-2.5">
              {report.detectedRedFlags.map((flag, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-[#070C18]/60 border border-cyan-500/15 space-y-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF2A6D]" />
                      {flag.indicator}
                    </span>
                    <span
                      className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full border ${
                        flag.severity === 'Critical'
                          ? 'bg-[#FF2A6D]/15 text-[#FF2A6D] border-[#FF2A6D]/30'
                          : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                      }`}
                    >
                      {flag.severity}
                    </span>
                  </div>

                  {/* Quoted Snippet */}
                  <div className="p-2.5 rounded-lg bg-black/40 border-l-2 border-l-[#FF2A6D] font-mono text-[11px] text-slate-300 italic">
                    "{flag.evidence}"
                  </div>

                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    {flag.explanation}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Contributing Factors Matrix */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 font-mono">
              {currentLanguage === 'hi' ? 'योगदान देने वाले जोखिम कारक:' : 'Contributing Risk Factor Weights:'}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {report.scoreFactors.map((factor, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded-lg bg-[#070C18]/40 border border-cyan-500/15 flex items-center justify-between"
                >
                  <span className="text-slate-300 text-[11px]">{factor.factor}</span>
                  <span className="text-[#FF2A6D] font-mono font-bold text-[11px]">
                    +{factor.points} pts
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Recommended Actions */}
          <div className="p-4 rounded-xl bg-amber-500/[0.04] border border-amber-500/20 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 font-mono flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span>{currentLanguage === 'hi' ? 'सिफारिश की गई सुरक्षा कार्रवाई:' : 'Recommended Defensive Actions:'}</span>
            </h4>
            <ol className="list-decimal list-inside space-y-1 text-[11px] text-slate-300 leading-relaxed">
              {report.recommendedActions.map((action, idx) => (
                <li key={idx}>{action}</li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};
