import React, { useState } from 'react';
import {
  FileText,
  Copy,
  Check,
  Download,
  ExternalLink,
  X,
  ShieldAlert,
  ShieldCheck,
  Building,
  Scale,
} from 'lucide-react';
import { ScamInspectionReport } from '../services/dynamicScanner';

interface OfficialFraudReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: ScamInspectionReport | null;
  targetPayload: string;
}

export const OfficialFraudReportModal: React.FC<OfficialFraudReportModalProps> = ({
  isOpen,
  onClose,
  report,
  targetPayload,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !report) return null;

  const incidentId = `INC-${new Date().getFullYear()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  const timestamp = new Date().toISOString();

  // Generate statutory legal categories based on indicators
  const statutoryViolations: string[] = [];
  const allFlags = report.detectedRedFlags.map((f) => f.indicator.toLowerCase()).join(' ');

  if (allFlags.includes('check') || allFlags.includes('equipment') || allFlags.includes('overpayment')) {
    statutoryViolations.push('18 U.S.C. § 1344 (Bank Fraud & Advance-Fee Check Schemes)');
  }
  if (allFlags.includes('wire') || allFlags.includes('zelle') || allFlags.includes('deposit')) {
    statutoryViolations.push('18 U.S.C. § 1343 (Wire Fraud & Fraud by Wire, Radio, or Television)');
  }
  if (allFlags.includes('pii') || allFlags.includes('ssn') || allFlags.includes('credential')) {
    statutoryViolations.push('18 U.S.C. § 1028 (Fraud and Related Activity in Connection with Identification Documents)');
  }
  if (allFlags.includes('telegram') || allFlags.includes('urgency') || allFlags.includes('lookalike')) {
    statutoryViolations.push('18 U.S.C. § 1030 (Fraud and Related Activity in Connection with Computers & Phishing)');
  }
  if (statutoryViolations.length === 0) {
    statutoryViolations.push('General Consumer Protection & Anti-Phishing Deception (FTC Act 15 U.S.C. § 45)');
  }

  // Pre-formatted Official Incident Dossier
  const reportDossier = `================================================================================
OFFICIAL CYBERCRIME & FRAUD INCIDENT DOSSIER
Prepared for Submission to:
• Federal Trade Commission (FTC) - ReportFraud.ftc.gov
• FBI Internet Crime Complaint Center (IC3) - IC3.gov
• State Attorney General & Consumer Protection Division
================================================================================
INCIDENT TRACKING REFERENCE : ${incidentId}
GENERATION TIMESTAMP        : ${timestamp}
FORENSIC ENGINE             : ScamShield AI (Cybersecurity Inspection System)

1. THREAT ASSESSMENT & CLASSIFICATION
--------------------------------------------------------------------------------
Scam Threat Index          : ${report.scamThreatIndex} / 100
Calculated Threat Level    : ${report.riskLevel.toUpperCase()}
Executive Summary          : ${report.summary}

Applicable Statutory Violations:
${statutoryViolations.map((v) => `  * ${v}`).join('\n')}

Active Score Factors:
${report.scoreFactors.map((sf) => `  * ${sf.factor} (+${sf.points} pts)`).join('\n')}

2. SUSPECT / PERPETRATOR DIGITAL IDENTIFIERS
--------------------------------------------------------------------------------
Suspect URL / Hostname     : ${report.domainAnalysis.domainName}
Domain Age Status          : ${report.domainAnalysis.domainAge}
Domain Infrastructure Notes: ${report.domainAnalysis.notes}
${
  report.domainAnalysis.suspiciousPatterns.length > 0
    ? `Flagged DNS / URL Patterns :\n${report.domainAnalysis.suspiciousPatterns
        .map((p) => `  - ${p}`)
        .join('\n')}`
    : 'No suspicious DNS anomalies extracted.'
}

3. OBJECTIVE FORENSIC EVIDENCE & EXTRACTED QUOTES
--------------------------------------------------------------------------------
${report.detectedRedFlags
  .map(
    (rf, idx) => `[INDICATOR #${idx + 1}] ${rf.indicator} (${rf.severity} Severity)
  Quoted Evidence : "${rf.evidence}"
  Security Threat : ${rf.explanation}
`
  )
  .join('\n')}

4. COMPLAINANT MITIGATION LOG
--------------------------------------------------------------------------------
[X] Communications ceased upon forensic red-flag detection.
[X] No advance funds or equipment payments disbursed to perpetrator.
[X] Zero personally identifiable information (SSN/banking credentials) surrendered.
[X] Suspect electronic messages and URLs preserved for evidentiary custody.

Recommended Follow-Up Steps:
${report.recommendedActions.map((act, idx) => `  ${idx + 1}. ${act}`).join('\n')}

================================================================================
ORIGINAL PAYLOAD ARCHIVE (EVIDENTIARY EXHIBIT A)
--------------------------------------------------------------------------------
${targetPayload.trim()}
================================================================================
END OF DOSSIER • SUBMITTED FOR REGULATORY REVIEW AND LAW ENFORCEMENT RECORDING
================================================================================`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(reportDossier);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = reportDossier;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([reportDossier], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `official-scam-report-${incidentId}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="bg-[#070C18] border border-cyan-500/30 rounded-2xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-[0_0_60px_rgba(0,240,255,0.25)] overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 border-b border-cyan-500/20 bg-slate-900/70 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#FF2A6D]/10 border border-[#FF2A6D]/30 flex items-center justify-center text-[#FF2A6D]">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white">
                  Official Fraud Incident Report (FTC / IC3 Ready)
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#FF2A6D]/15 text-[#FF2A6D] border border-[#FF2A6D]/30 font-bold">
                  Ref: {incidentId}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Standardized forensic incident dossier pre-formatted for direct copy-paste into federal and state fraud reporting portals.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Agency Quick-Launch Link Row */}
        <div className="px-6 py-3 bg-[#050811] border-b border-cyan-500/15 flex flex-wrap items-center justify-between gap-3 text-xs">
          <span className="text-slate-400 font-mono text-[11px]">
            Direct Official Regulatory Reporting Portals:
          </span>
          <div className="flex items-center gap-2">
            <a
              href="https://reportfraud.ftc.gov/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1 rounded-lg bg-slate-900 border border-cyan-500/30 hover:border-[#00F0FF] text-cyan-300 hover:text-white transition-colors flex items-center gap-1.5 text-[11px] font-medium"
            >
              <span>FTC (ReportFraud.ftc.gov)</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <a
              href="https://www.ic3.gov/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1 rounded-lg bg-slate-900 border border-cyan-500/30 hover:border-[#00F0FF] text-cyan-300 hover:text-white transition-colors flex items-center gap-1.5 text-[11px] font-medium"
            >
              <span>FBI IC3 (Internet Crime)</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Report Dossier Viewer */}
        <div className="p-6 overflow-y-auto flex-1 bg-[#050811] space-y-4">
          <div className="relative">
            <pre className="p-4 rounded-xl bg-[#070C18] border border-cyan-500/20 text-[#00FF9D] font-mono text-xs leading-relaxed whitespace-pre-wrap select-all max-h-[460px] overflow-y-auto">
              {reportDossier}
            </pre>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-cyan-500/20 bg-slate-900/80 flex flex-wrap items-center justify-between gap-3">
          <span className="text-[11px] font-mono text-slate-400">
            Admissible forensic dossier format • Never claims unverified registry ages
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownload}
              className="px-4 py-2 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>Download Report (.txt)</span>
            </button>

            <button
              type="button"
              onClick={handleCopy}
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-[#FF2A6D] to-[#FF6584] hover:opacity-90 text-white transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(255,42,109,0.4)] cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Dossier Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Official Scam Report</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
