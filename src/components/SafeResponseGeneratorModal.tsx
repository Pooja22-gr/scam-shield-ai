import React, { useState, useEffect } from 'react';
import {
  MessageSquareText,
  Copy,
  Check,
  Download,
  X,
  ShieldCheck,
  Sparkles,
  AlertTriangle,
  Building2,
  Lock,
  Mail,
  RefreshCw,
  Globe,
} from 'lucide-react';
import { ScamInspectionReport } from '../services/dynamicScanner';
import {
  LanguageCode,
  SUPPORTED_LANGUAGES,
  buildLocalizedProbeResponse,
} from '../services/translator';
import { LanguageSelector } from './LanguageSelector';

interface SafeResponseGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: ScamInspectionReport | null;
  targetPayload: string;
  currentLanguage?: LanguageCode;
  onSelectLanguage?: (lang: LanguageCode) => void;
}

export type ProbeStrategy = 'equipment' | 'rental' | 'pii' | 'corporate';

export const SafeResponseGeneratorModal: React.FC<SafeResponseGeneratorModalProps> = ({
  isOpen,
  onClose,
  report,
  targetPayload,
  currentLanguage = 'en',
  onSelectLanguage,
}) => {
  const [strategy, setStrategy] = useState<ProbeStrategy>('corporate');
  const [selectedLang, setSelectedLang] = useState<LanguageCode>(currentLanguage);
  const [copied, setCopied] = useState(false);
  const [recipientName, setRecipientName] = useState('Hiring Team / Property Contact');
  const [customReply, setCustomReply] = useState('');

  // Keep internal language in sync with parent language
  useEffect(() => {
    setSelectedLang(currentLanguage);
  }, [currentLanguage]);

  // Determine the best initial probe strategy based on detected red flags
  useEffect(() => {
    if (!report) return;

    const flagNames = report.detectedRedFlags.map((f) => f.indicator.toLowerCase()).join(' ');
    const factorNames = report.scoreFactors.map((f) => f.factor.toLowerCase()).join(' ');
    const combinedSignals = `${flagNames} ${factorNames}`;

    if (combinedSignals.includes('equipment') || combinedSignals.includes('check')) {
      setStrategy('equipment');
    } else if (combinedSignals.includes('rental') || combinedSignals.includes('landlord') || combinedSignals.includes('lease')) {
      setStrategy('rental');
    } else if (combinedSignals.includes('pii') || combinedSignals.includes('credential') || combinedSignals.includes('ssn')) {
      setStrategy('pii');
    } else {
      setStrategy('corporate');
    }

    // Try to extract recipient name from text if available
    const nameMatch = targetPayload.match(/(?:from|regards|sincerely|contact):\s*([A-Za-z\s]{3,25})/i);
    if (nameMatch && nameMatch[1]) {
      setRecipientName(nameMatch[1].trim());
    }
  }, [report, targetPayload]);

  // Generate the professional probe script based on selected strategy and language
  useEffect(() => {
    const domain = report?.domainAnalysis?.domainName !== 'N/A' ? report?.domainAnalysis?.domainName : null;
    const generated = buildLocalizedProbeResponse(strategy, recipientName, selectedLang, domain);
    setCustomReply(generated);
  }, [strategy, recipientName, report, selectedLang]);

  if (!isOpen) return null;

  const currentLangConfig =
    SUPPORTED_LANGUAGES.find((l) => l.code === selectedLang) || SUPPORTED_LANGUAGES[0];

  const handleLangChange = (lang: LanguageCode) => {
    setSelectedLang(lang);
    if (onSelectLanguage) {
      onSelectLanguage(lang);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(customReply);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = customReply;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([customReply], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `safe-verification-reply-${strategy}-${selectedLang}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-[#070C18] border border-cyan-500/30 rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-[0_0_50px_rgba(0,240,255,0.25)] overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-cyan-500/20 bg-slate-900/60 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-[#00F0FF]">
              <MessageSquareText className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-semibold text-white">
                  Safe Verification Reply Generator
                </h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#00FF9D]/10 text-[#00FF9D] border border-[#00FF9D]/30">
                  Zero-PII Pushback Probe
                </span>
                {selectedLang !== 'en' && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-500/15 text-[#00F0FF] border border-cyan-500/40 shadow-[0_0_8px_rgba(0,240,255,0.2)]">
                    <Sparkles className="w-2.5 h-2.5" />
                    AI Translated {currentLangConfig.nativeName}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400">
                Polite, legally compliant verification template demanding proof of corporate legitimacy without exposing sensitive data.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Inline Language Selector */}
            <LanguageSelector
              currentLanguage={selectedLang}
              onSelectLanguage={handleLangChange}
              isCompact
            />

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 bg-[#050811]">
          {/* Strategy Selection Pills */}
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-300 block">
              Select Protective Counter-Probe Strategy:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setStrategy('corporate')}
                className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                  strategy === 'corporate'
                    ? 'bg-cyan-500/15 border-[#00F0FF] text-white shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-1.5 font-semibold text-xs text-[#00F0FF] mb-1">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Corporate Due Diligence</span>
                </div>
                <p className="text-[10px] text-slate-400 leading-tight">
                  Demands official enterprise email, registered business ID (EIN), and verified phone line.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setStrategy('equipment')}
                className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                  strategy === 'equipment'
                    ? 'bg-cyan-500/15 border-[#00F0FF] text-white shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-1.5 font-semibold text-xs text-[#FF2A6D] mb-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>No-Check & Direct IT</span>
                </div>
                <p className="text-[10px] text-slate-400 leading-tight">
                  Refuses advance checks or vendor wires; requests IT courier pre-configured company hardware.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setStrategy('rental')}
                className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                  strategy === 'rental'
                    ? 'bg-cyan-500/15 border-[#00F0FF] text-white shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-1.5 font-semibold text-xs text-amber-400 mb-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Rental Deed & Walkthrough</span>
                </div>
                <p className="text-[10px] text-slate-400 leading-tight">
                  Demands in-person property viewing and title deed verification; refuses sight-unseen wires.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setStrategy('pii')}
                className={`p-3 rounded-xl text-left border transition-all cursor-pointer ${
                  strategy === 'pii'
                    ? 'bg-cyan-500/15 border-[#00F0FF] text-white shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-1.5 font-semibold text-xs text-purple-400 mb-1">
                  <Lock className="w-3.5 h-3.5" />
                  <span>PII / Credential Shield</span>
                </div>
                <p className="text-[10px] text-slate-400 leading-tight">
                  Refuses SSN, passport scans, or banking OTP codes prior to countersigned contract in portal.
                </p>
              </button>
            </div>
          </div>

          {/* Recipient Customizer & Language Indicator */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400 font-mono">Recipient / Addressee:</span>
              <input
                type="text"
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="e.g. Hiring Manager, Landlord, Marcus Vance"
                className="bg-[#070C18] border border-cyan-500/20 focus:border-[#00F0FF] rounded-lg px-3 py-1.5 text-xs text-slate-200 font-mono focus:outline-hidden"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-mono">Target Language:</span>
              <span className="text-xs font-semibold text-[#00F0FF] flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-950/40 border border-cyan-500/30">
                <span>{currentLangConfig.flag}</span>
                <span>{currentLangConfig.nativeName}</span>
              </span>
            </div>
          </div>

          {/* Generated Reply Textarea */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <label className="text-xs font-semibold text-white flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#00F0FF]" />
                  Generated Verification Reply (Safe to Copy & Send):
                </label>
                {selectedLang !== 'en' && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-500/15 text-[#00F0FF] border border-cyan-500/30">
                    AI Translated {currentLangConfig.nativeName}
                  </span>
                )}
              </div>
              <span className="text-[11px] text-slate-500 font-mono">
                Editable text area • Zero PII enclosed
              </span>
            </div>
            <textarea
              rows={11}
              value={customReply}
              dir={currentLangConfig.dir}
              onChange={(e) => setCustomReply(e.target.value)}
              className="w-full bg-[#070C18] border border-cyan-500/25 focus:border-[#00F0FF] focus:shadow-[0_0_15px_rgba(0,240,255,0.2)] rounded-xl p-4 text-xs font-mono text-slate-200 leading-relaxed focus:outline-hidden resize-y select-all"
            />
          </div>

          {/* Cybersecurity Context Note */}
          <div className="p-3.5 rounded-xl bg-cyan-950/20 border border-cyan-500/20 flex items-start gap-2.5 text-xs text-slate-300">
            <ShieldCheck className="w-4 h-4 text-[#00FF9D] shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong className="text-[#00FF9D]">Cybersecurity Defense Rationale:</strong> Legitimate hiring teams and licensed property managers readily provide corporate tax IDs, official corporate domain communications, and direct office switchboard verification. Fraudulent actors operating check overpayment or deposit scams will typically disengage, object to corporate verification, or escalate artificial deadlines.
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-cyan-500/20 bg-slate-900/80 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Close
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownload}
              className="px-4 py-2 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-cyan-400" />
              <span>Download .txt</span>
            </button>

            <button
              type="button"
              onClick={handleCopy}
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-[#00F0FF] to-[#00FF9D] hover:opacity-90 text-slate-950 transition-all flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,240,255,0.3)] cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Response to Clipboard</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

function buildProbeResponse(
  strategy: ProbeStrategy,
  recipient: string,
  report: ScamInspectionReport | null
): string {
  const domain = report?.domainAnalysis?.domainName !== 'N/A' ? report?.domainAnalysis?.domainName : null;

  if (strategy === 'equipment') {
    return `Dear ${recipient},

Thank you for sending over the employment details and offer overview.

In accordance with personal financial security standards and standard remote onboarding protocol, I do not accept, deposit, or disburse funds from advance cashier checks or reimbursement drafts to third-party equipment suppliers.

To proceed smoothly with the onboarding process:
1. Please confirm whether all required hardware (laptop, peripherals, workstation tools) will be configured and shipped directly by your internal IT Department to my address at company expense.
2. Kindly provide the registered corporate name, Employer Identification Number (EIN), and physical corporate headquarters address.
3. Please confirm that all future correspondence will be conducted via an official corporate email domain${domain ? ` rather than unverified channels` : ''}.

Once these details and the formal, countersigned offer letter are verified through your official corporate portal, I will be pleased to complete standard onboarding paperwork.

Thank you for your understanding and cooperation.

Sincerely,
[Your Name]
[Your Contact Information]`;
  }

  if (strategy === 'rental') {
    return `Dear ${recipient},

Thank you for the information regarding the property listing.

Before submitting any financial holding deposits, security funds, or application fees via wire transfer, Zelle, or cash transfer, I require standard due diligence verification:

1. A physical, in-person walk-through of the property with you or a licensed property management representative.
2. Proof of ownership or property management authorization (such as the local county parcel ID, property management agreement, or state leasing license).
3. Delivery of a formal residential lease agreement completed and signed at your physical leasing office or via an authenticated digital escrow service.

Please let me know which date and time this week works best for a physical viewing at the property.

Sincerely,
[Your Name]
[Your Phone Number]`;
  }

  if (strategy === 'pii') {
    return `Dear ${recipient},

Thank you for reaching out regarding this opportunity.

To protect personal and financial data against unauthorized transmission, I do not provide sensitive personally identifiable information (including Social Security Numbers, government passport copies, or bank account credentials) via email or unverified chat platforms.

I will be glad to provide all statutory identity and tax documentation (W-4 / I-9 / direct deposit forms) exclusively through:
1. An official, encrypted corporate HR onboarding portal (e.g. Workday, ADP, BambooHR) registered under the company's verified domain.
2. After receipt of a formal, legally binding offer letter countersigned by authorized corporate leadership.

Please provide your official corporate email address and the direct phone number to your company headquarters HR department so we can coordinate secure onboarding.

Sincerely,
[Your Name]`;
  }

  // Default: Corporate Due Diligence
  return `Dear ${recipient},

Thank you for your correspondence regarding this position.

I am interested in learning more about the role. Before taking the next steps in the evaluation process, please provide the following corporate verification details to confirm company credentials:

1. Registered Legal Entity Name and State Employer Identification Number (EIN).
2. Physical corporate headquarters address and direct office switchboard phone number.
3. Your official corporate email address (matching the registered corporate domain) and LinkedIn company profile.
4. Confirmation of whether this role was posted through the official company career portal.

For security reasons, I do not conduct formal recruitment dialogues over mobile messaging applications (Telegram, WhatsApp, Signal) and require all official hiring communications to proceed through registered enterprise channels.

I look forward to your reply so we can proceed safely.

Sincerely,
[Your Name]
[Your Contact Information]`;
}
