import React, { useState } from 'react';
import {
  GitCommit,
  ArrowRight,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Mail,
  Clock,
  DollarSign,
  Send,
  Lock,
  ChevronRight,
  Info,
  Radio,
  FileCheck2,
  CheckCircle2,
} from 'lucide-react';
import { ScamInspectionReport } from '../services/dynamicScanner';
import { LanguageCode, getUiString } from '../services/translator';

export interface AttackNode {
  id: string;
  stepNumber: string;
  title: string;
  subtitle: string;
  category: 'lure' | 'urgency' | 'financial' | 'pivot' | 'safe';
  status: 'critical' | 'high' | 'medium' | 'safe';
  icon: React.ReactNode;
  evidenceQuote?: string;
  mitigationAdvice: string;
}

interface HookVectorAttackFlowProps {
  report: ScamInspectionReport;
  targetPayload: string;
  currentLanguage: LanguageCode;
}

export const HookVectorAttackFlow: React.FC<HookVectorAttackFlowProps> = ({
  report,
  targetPayload,
  currentLanguage,
}) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const isSafe = report.scamThreatIndex < 25;
  const flags = report.detectedRedFlags;

  // Derive attack nodes from detected flags or legitimate signals
  const buildAttackChain = (): AttackNode[] => {
    if (isSafe) {
      return [
        {
          id: 'node-safe-1',
          stepNumber: '01',
          title: currentLanguage === 'hi' ? 'सत्यापित कॉर्पोरेट संपर्क' : 'Verified Corporate Contact',
          subtitle: currentLanguage === 'hi' ? 'आधिकारिक कॉर्पोरेट चैनल के माध्यम से संचार' : 'Official communication via corporate channel',
          category: 'safe',
          status: 'safe',
          icon: <Mail className="w-4 h-4 text-[#00FF9D]" />,
          mitigationAdvice: currentLanguage === 'hi' ? 'डोमेन और संपर्क विवरण वास्तविक संगठन से मेल खाते हैं।' : 'Domain and contact credentials match verified entity records.',
        },
        {
          id: 'node-safe-2',
          stepNumber: '02',
          title: currentLanguage === 'hi' ? 'मानक भर्ती/पट्टा प्रक्रिया' : 'Standard Evaluation Protocol',
          subtitle: currentLanguage === 'hi' ? 'कोई अनुचित तात्कालिकता या दबाव नहीं' : 'No artificial pressure or hasty deadlines imposed',
          category: 'safe',
          status: 'safe',
          icon: <Clock className="w-4 h-4 text-[#00FF9D]" />,
          mitigationAdvice: currentLanguage === 'hi' ? 'प्रक्रिया पारदर्शी और कानूनी रूप से स्वीकार्य है।' : 'Screening and contract review follow established regulatory norms.',
        },
        {
          id: 'node-safe-3',
          stepNumber: '03',
          title: currentLanguage === 'hi' ? 'शून्य अग्रिम वित्तीय मांग' : 'Zero Upfront Demands',
          subtitle: currentLanguage === 'hi' ? 'उपकरण खरीद या अग्रिम जमा की मांग नहीं' : 'No check buyback, deposit, or wire transfers required',
          category: 'safe',
          status: 'safe',
          icon: <FileCheck2 className="w-4 h-4 text-[#00FF9D]" />,
          mitigationAdvice: currentLanguage === 'hi' ? 'कानूनी नियोक्ता कभी भी ऑनबोर्डिंग के लिए चेक या नकद नहीं मांगते।' : 'Legitimate employers provide equipment directly without employee check routing.',
        },
        {
          id: 'node-safe-4',
          stepNumber: '04',
          title: currentLanguage === 'hi' ? 'सुरक्षित उद्यम ऑनबोर्डिंग' : 'Secured Enterprise Channel',
          subtitle: currentLanguage === 'hi' ? 'आधिकारिक पोर्टल और निगरानी चैनल' : 'Standard enterprise HRIS and signed contracts',
          category: 'safe',
          status: 'safe',
          icon: <ShieldCheck className="w-4 h-4 text-[#00FF9D]" />,
          mitigationAdvice: currentLanguage === 'hi' ? 'दस्तावेज़ सुरक्षित और कानूनी सुरक्षा प्रदान करते हैं।' : 'Communications remain logged on corporate infrastructure.',
        },
      ];
    }

    // Dangerous Phishing / Scam Flow Nodes
    const nodes: AttackNode[] = [];

    // Stage 1: Initial Hook / Unsolicited Lure
    const emailFlag = flags.find((f) => /domain|email|webmail|portal|lookalike/i.test(f.indicator));
    nodes.push({
      id: 'node-1',
      stepNumber: '01',
      title: currentLanguage === 'hi' ? 'संदिग्ध प्रारंभिक संपर्क' : 'Unsolicited Lure & Contact',
      subtitle: emailFlag
        ? (currentLanguage === 'hi' ? 'अनाधिकारिक डोमेन या मुफ्त वेबमेल' : 'Disposable domain or free webmail routing')
        : (currentLanguage === 'hi' ? 'अवांछित नौकरी प्रस्ताव या पट्टा सूची' : 'Unsolicited reachout or fraudulent listing'),
      category: 'lure',
      status: emailFlag ? (emailFlag.severity === 'Critical' ? 'critical' : 'high') : 'high',
      icon: <Mail className="w-4 h-4" />,
      evidenceQuote: emailFlag?.evidence,
      mitigationAdvice: currentLanguage === 'hi'
        ? 'आधिकारिक कॉर्पोरेट वेबसाइट पर जाकर स्वतंत्र रूप से प्रेषक की पुष्टि करें।'
        : 'Independently verify sender identity via the official corporate website directory.',
    });

    // Stage 2: Urgency Deadline / Psychological Coercion
    const urgencyFlag = flags.find((f) => /urgency|deadline|hour|pressure/i.test(f.indicator));
    nodes.push({
      id: 'node-2',
      stepNumber: '02',
      title: currentLanguage === 'hi' ? 'कृत्रिम तात्कालिकता दबाव' : 'Urgency Pressure Hook',
      subtitle: urgencyFlag
        ? (currentLanguage === 'hi' ? '12-24 घंटे की सख्त समय सीमा' : 'Strict 12–24h deadline to bypass due diligence')
        : (currentLanguage === 'hi' ? 'जल्दबाज़ी में निर्णय लेने का दबाव' : 'Forced haste preventing independent consultation'),
      category: 'urgency',
      status: urgencyFlag ? 'critical' : 'high',
      icon: <Clock className="w-4 h-4" />,
      evidenceQuote: urgencyFlag?.evidence,
      mitigationAdvice: currentLanguage === 'hi'
        ? 'कभी भी जल्दबाज़ी में हस्ताक्षर या भुगतान न करें। धोखाधड़ी हमेशा दबाव पर निर्भर करती है।'
        : 'Never sign or wire under artificial deadlines. Scammers rely on manufactured urgency.',
    });

    // Stage 3: Financial Trap (Check / Deposit / Wire)
    const financialFlag = flags.find((f) => /check|equipment|deposit|wire|zelle|crypto|fee|advance/i.test(f.indicator));
    nodes.push({
      id: 'node-3',
      stepNumber: '03',
      title: currentLanguage === 'hi' ? 'वित्तीय अग्रिम शुल्क जाल' : 'Financial Exploitation Trap',
      subtitle: financialFlag
        ? (currentLanguage === 'hi' ? 'फर्जी चेक या अप्रमाणित विक्रेता खरीद' : 'Advance check buyback or wire deposit demand')
        : (currentLanguage === 'hi' ? 'अग्रिम भुगतान या चेक अग्रेषण' : 'Overpayment check or non-refundable deposit'),
      category: 'financial',
      status: 'critical',
      icon: <DollarSign className="w-4 h-4" />,
      evidenceQuote: financialFlag?.evidence,
      mitigationAdvice: currentLanguage === 'hi'
        ? 'बैंक चेक को तुरंत मंजूरी दे सकते हैं लेकिन हफ्तों बाद बाउंस हो जाते हैं। आप पूर्ण राशि के उत्तरदायी होंगे।'
        : 'Funds appear available immediately under Regulation CC, but bounce weeks later leaving you liable.',
    });

    // Stage 4: Off-Platform Pivot & PII Exfiltration
    const pivotFlag = flags.find((f) => /telegram|signal|whatsapp|chat|pii|ssn|unmonitored/i.test(f.indicator));
    nodes.push({
      id: 'node-4',
      stepNumber: '04',
      title: currentLanguage === 'hi' ? 'अनधिकृत चैट चैनल विस्थापन' : 'Off-Platform Evasion Pivot',
      subtitle: pivotFlag
        ? (currentLanguage === 'hi' ? 'टेलीग्राम/व्हाट्सएप पर स्थानांतरण' : 'Shift to unmonitored Telegram/Signal channel')
        : (currentLanguage === 'hi' ? 'व्यक्तिगत डेटा व पहचान की चोरी' : 'PII harvesting & avoidance of corporate logging'),
      category: 'pivot',
      status: pivotFlag ? 'critical' : 'high',
      icon: <Send className="w-4 h-4" />,
      evidenceQuote: pivotFlag?.evidence,
      mitigationAdvice: currentLanguage === 'hi'
        ? 'किसी भी अज्ञात प्रेषक के साथ टेलीग्राम या सिग्नल पर भर्ती साक्षात्कार न करें।'
        : 'Enterprise hiring teams never conduct onboarding interviews exclusively over Telegram or WhatsApp.',
    });

    return nodes;
  };

  const attackNodes = buildAttackChain();
  const activeNode = attackNodes.find((n) => n.id === selectedNodeId) || attackNodes[0];

  const getNodeColor = (status: AttackNode['status'], isSelected: boolean) => {
    if (status === 'safe') {
      return isSelected
        ? 'border-[#00FF9D] bg-slate-900/95 shadow-[0_0_20px_rgba(0,255,157,0.3)] text-[#00FF9D]'
        : 'border-[#00FF9D]/30 bg-[#070C18]/80 text-[#00FF9D] hover:border-[#00FF9D]/60';
    }
    if (status === 'critical') {
      return isSelected
        ? 'border-[#FF2A6D] bg-slate-900/95 shadow-[0_0_25px_rgba(255,42,109,0.35)] text-[#FF2A6D]'
        : 'border-[#FF2A6D]/30 bg-[#070C18]/80 text-rose-300 hover:border-[#FF2A6D]/60';
    }
    return isSelected
      ? 'border-amber-400 bg-slate-900/95 shadow-[0_0_20px_rgba(251,191,36,0.3)] text-amber-300'
      : 'border-amber-500/30 bg-[#070C18]/80 text-amber-200 hover:border-amber-400/60';
  };

  return (
    <div className="bg-slate-900/70 backdrop-blur-xl border border-cyan-500/25 rounded-xl p-5 sm:p-6 shadow-[0_8px_32px_rgba(0,0,0,0.4)] space-y-5 relative overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-cyan-500/15 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-[#00F0FF] shadow-[0_0_12px_rgba(0,240,255,0.2)]">
            <GitCommit className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white font-mono flex items-center gap-1.5">
                {currentLanguage === 'hi' ? 'हुक वेक्टर अटैक फ्लो' : '"Hook Vector" Attack Flow'}
              </h3>
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-medium ${
                  isSafe
                    ? 'bg-[#00FF9D]/15 text-[#00FF9D] border border-[#00FF9D]/30'
                    : 'bg-[#FF2A6D]/15 text-[#FF2A6D] border border-[#FF2A6D]/30'
                }`}
              >
                <Radio className="w-2.5 h-2.5 animate-pulse" />
                {isSafe
                  ? (currentLanguage === 'hi' ? 'सुरक्षित पथ सत्यापित' : 'BENIGN PROTOCOL')
                  : (currentLanguage === 'hi' ? '4-चरणीय हमला श्रृंखला सक्रिय' : '4-STAGE ATTACK CHAIN ACTIVE')}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {currentLanguage === 'hi'
                ? 'प्रारंभिक संपर्क से वित्तीय दोहन तक सामाजिक इंजीनियरिंग का क्रमिक प्रवाह'
                : 'Interactive step-by-step horizontal attack chain showing scam social engineering progression'}
            </p>
          </div>
        </div>

        <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5 self-start sm:self-auto">
          <span>{currentLanguage === 'hi' ? 'विवरण देखने के लिए नोड चुनें' : 'Select node to inspect vector'}</span>
          <ChevronRight className="w-3.5 h-3.5 text-[#00F0FF]" />
        </div>
      </div>

      {/* Horizontal Interactive Node Graph */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 relative">
        {attackNodes.map((node, index) => {
          const isSelected = selectedNodeId === node.id || (!selectedNodeId && index === 0);
          const isLast = index === attackNodes.length - 1;

          return (
            <div key={node.id} className="relative flex flex-col">
              <div
                onClick={() => setSelectedNodeId(node.id)}
                className={`p-4 rounded-xl border transition-all duration-300 cursor-pointer flex flex-col justify-between h-full group ${getNodeColor(
                  node.status,
                  isSelected
                )}`}
              >
                <div className="space-y-2.5">
                  {/* Top Step Number & Status Indicator */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-white/[0.06] border border-white/[0.08] text-white">
                      STAGE {node.stepNumber}
                    </span>
                    <span
                      className={`text-[9px] font-mono uppercase px-2 py-0.5 rounded-full border ${
                        node.status === 'safe'
                          ? 'bg-[#00FF9D]/15 text-[#00FF9D] border-[#00FF9D]/30'
                          : node.status === 'critical'
                          ? 'bg-[#FF2A6D]/15 text-[#FF2A6D] border-[#FF2A6D]/30'
                          : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                      }`}
                    >
                      {node.status}
                    </span>
                  </div>

                  {/* Icon & Title */}
                  <div className="pt-1">
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="p-1.5 rounded-lg bg-white/[0.05] border border-white/[0.1]">
                        {node.icon}
                      </div>
                      <h4 className="text-xs font-bold text-white group-hover:text-[#00F0FF] transition-colors leading-tight">
                        {node.title}
                      </h4>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-snug line-clamp-2">
                      {node.subtitle}
                    </p>
                  </div>
                </div>

                {/* Bottom Evidence Callout or Tag */}
                <div className="pt-3 mt-3 border-t border-white/[0.08] flex items-center justify-between text-[10px] font-mono">
                  <span className="text-slate-500">
                    {node.evidenceQuote
                      ? (currentLanguage === 'hi' ? 'सबूत उपलब्ध' : 'Evidence Quoted')
                      : (currentLanguage === 'hi' ? 'विश्लेषण' : 'Assessment')}
                  </span>
                  <span className="text-[#00F0FF] group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                    {currentLanguage === 'hi' ? 'जांचें' : 'Inspect'}
                    <ChevronRight className="w-3 h-3" />
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Expanded Active Node Inspector Drawer */}
      {activeNode && (
        <div className="p-4 sm:p-5 rounded-xl bg-[#070C18]/90 border border-cyan-500/30 space-y-3 relative overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-cyan-500/15 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-mono text-[#00F0FF] font-bold">
                STAGE {activeNode.stepNumber} FORENSIC DRILLDOWN:
              </span>
              <span className="text-xs font-semibold text-white">
                {activeNode.title}
              </span>
            </div>
            <span
              className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                activeNode.status === 'safe'
                  ? 'bg-[#00FF9D]/15 text-[#00FF9D] border-[#00FF9D]/30'
                  : 'bg-[#FF2A6D]/15 text-[#FF2A6D] border-[#FF2A6D]/30'
              }`}
            >
              {activeNode.status.toUpperCase()} VECTOR
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Left: Verbatim Evidence Quote */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block flex items-center gap-1.5">
                <Info className="w-3 h-3 text-[#00F0FF]" />
                {currentLanguage === 'hi' ? 'मूल स्रोत से उद्धरण:' : 'Verbatim Payload Quote:'}
              </span>
              {activeNode.evidenceQuote ? (
                <div className="p-3 rounded-lg bg-slate-900/90 border-l-2 border-l-[#FF2A6D] text-slate-200 font-mono text-[11px] italic leading-relaxed">
                  "{activeNode.evidenceQuote}"
                </div>
              ) : (
                <div className="p-3 rounded-lg bg-slate-900/60 border border-cyan-500/15 text-slate-400 text-[11px]">
                  {currentLanguage === 'hi'
                    ? 'इस चरण में कोई विशिष्ट आक्रामक उद्धरण नहीं पाया गया। समग्र दस्तावेज़ संरचना से मूल्यांकित।'
                    : 'Evaluated from structural linguistic context and cross-referenced behavioral patterns.'}
                </div>
              )}
            </div>

            {/* Right: Countermeasure & Defense Protocol */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 block flex items-center gap-1.5">
                <ShieldAlert className="w-3 h-3 text-amber-400" />
                {currentLanguage === 'hi' ? 'रक्षात्मक सुरक्षा रणनीति:' : 'Defensive Countermeasure:'}
              </span>
              <div className="p-3 rounded-lg bg-amber-500/[0.06] border border-amber-500/20 text-slate-300 text-[11px] leading-relaxed">
                {activeNode.mitigationAdvice}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
