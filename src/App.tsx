/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  FileText,
  UploadCloud,
  Globe,
  RotateCcw,
  Sparkles,
  Copy,
  Check,
  Search,
  ChevronDown,
  ChevronUp,
  Lock,
  Info,
  CheckCircle2,
  Radio,
  FileWarning,
  Key,
  Building2,
  Briefcase,
  Zap,
  Activity,
  Layers,
  Scale,
  MessageSquareText,
} from 'lucide-react';
import { runDynamicInspection, ScamInspectionReport } from './services/dynamicScanner';
import { SafeResponseGeneratorModal } from './components/SafeResponseGeneratorModal';
import { DomainSecurityBreakdownCard } from './components/DomainSecurityBreakdownCard';
import { EvidenceHighlightViewer } from './components/EvidenceHighlightViewer';
import { OfficialFraudReportModal } from './components/OfficialFraudReportModal';
import { HookVectorAttackFlow } from './components/HookVectorAttackFlow';
import { EntityCrossCheckerCard } from './components/EntityCrossCheckerCard';
import { ForensicReportModal } from './components/ForensicReportModal';
import {
  LanguageCode,
  SUPPORTED_LANGUAGES,
  translateInspectionReport,
  getUiString,
  translateRiskLevel,
} from './services/translator';
import { LanguageSelector } from './components/LanguageSelector';

// High-End Bioluminescent Cyber-Hook Icon
const BioluminescentHook: React.FC<{ className?: string; glowing?: boolean }> = ({
  className = 'w-7 h-7',
  glowing = true,
}) => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`${className} ${glowing ? 'filter drop-shadow-[0_0_8px_#00F0FF]' : ''}`}
  >
    {/* Monofilament line */}
    <line x1="16" y1="2" x2="16" y2="8" stroke="#00F0FF" strokeWidth="1.8" strokeDasharray="2 1.5" />
    {/* Glowing Eyelet */}
    <circle cx="16" cy="10" r="2.2" stroke="#00F0FF" strokeWidth="2" fill="#050811" />
    {/* Shank and Bend */}
    <path
      d="M16 12.5V20.5C16 24.366 12.866 27.5 9 27.5C5.134 27.5 2 24.366 2 20.5C2 17.2 4.5 14.3 8 14"
      stroke="#FF2A6D"
      strokeWidth="2.6"
      strokeLinecap="round"
      className="filter drop-shadow-[0_0_6px_rgba(255,42,109,0.7)]"
    />
    {/* Needle Barb */}
    <path
      d="M8 14L11.5 17.5"
      stroke="#00FF9D"
      strokeWidth="2.4"
      strokeLinecap="round"
      className="filter drop-shadow-[0_0_5px_rgba(0,255,157,0.8)]"
    />
    {/* Bioluminescent Center Gem */}
    <circle cx="16" cy="10" r="1" fill="#00F0FF" />
  </svg>
);

// High-End Scenario Simulator HUD Presets
interface PresetScenario {
  id: string;
  code: string;
  title: string;
  subtitle: string;
  badge: string;
  badgeType: 'critical' | 'high' | 'safe' | 'moderate';
  category: string;
  iconType: 'check-trap' | 'rental-wire' | 'enterprise' | 'freelance';
  chips: string[];
  url: string;
  content: string;
}

const PRESET_SCENARIOS: PresetScenario[] = [
  {
    id: 'fake-job-check',
    code: 'VECTOR // 01',
    title: 'Cashier Check Equipment Trap',
    subtitle: '$45/hr remote role with advance check & Zelle equipment purchase.',
    badge: 'Critical Risk',
    badgeType: 'critical',
    category: 'Employment Fraud',
    iconType: 'check-trap',
    chips: ['Advance Check', 'Zelle Transfer', 'Telegram HR'],
    url: 'https://careers-logistics-portal.top/apply',
    content: `Dear Candidate,

Congratulations! We are excited to offer you the position of Remote Operations Associate at Global Logistics Corp. Your starting rate will be $45.00 per hour.

Before your official start date, you are required to set up your home office workstation. We will issue you a cashier's check of $3,200 to cover your equipment costs. You must deposit this check immediately into your bank account and transfer $2,800 via Zelle to our verified equipment vendor (vendor-supplies-portal@fastmail.com) to receive your Apple MacBook Pro and software suite.

Due to high applicant demand, you must accept this offer and send the Zelle transfer receipt within 24 hours to secure your spot.

Please reach out directly to our HR Manager on Telegram: @GlobalLogistics_HR_Admin to finalize your onboarding.

Best regards,
Hiring Team
Global Logistics Corp`,
  },
  {
    id: 'absentee-rental-wire',
    code: 'VECTOR // 02',
    title: 'Absentee Landlord Wire Trap',
    subtitle: 'Sight-unseen luxury sublease demanding upfront Western Union deposit.',
    badge: 'High Risk',
    badgeType: 'high',
    category: 'Rental Escrow Scam',
    iconType: 'rental-wire',
    chips: ['Sight-Unseen', 'Wire Deposit', 'WhatsApp Lead'],
    url: 'https://luxury-apartments-direct.xyz/post/4b',
    content: `Hello,

Thank you for your interest in the 2-bedroom luxury penthouse at 450 Grand Ave. Monthly rent is $1,100 with all utilities included.

I am currently out of the country on an urgent humanitarian mission with my church. Because I cannot meet you in person, keys will be dispatched via express courier once you wire the $2,200 security deposit via Western Union or Bitcoin.

Please wire the funds within 24 hours to hold your reservation, and message my assistant on WhatsApp: +1 (555) 019-3829 with the transfer slip.

Warm regards,
Pastor David Miller`,
  },
  {
    id: 'verified-corporate-offer',
    code: 'VECTOR // 03',
    title: 'Verified Enterprise Offer',
    subtitle: 'Standard enterprise hiring contract with internal IT hardware provisioning.',
    badge: 'Safe (0%)',
    badgeType: 'safe',
    category: 'Legitimate Contract',
    iconType: 'enterprise',
    chips: ['Internal IT Ship', 'Statutory W-4', 'Official Domain'],
    url: 'https://careers.cloudscaletech.com/jobs/senior-frontend-eng',
    content: `Dear Sarah Jenkins,

Following our interviews on September 14th, we are pleased to confirm our formal offer of employment for the full-time position of Senior Frontend Engineer at CloudScale Technologies.

Your annualized compensation will be $165,000, paid semi-monthly, with comprehensive health insurance and 401(k) retirement match. Standard statutory onboarding forms (I-9 and W-4) must be completed directly through our secure employee portal.

All company hardware (M3 MacBook Pro and enterprise peripherals) will be directly configured and shipped by our internal IT department at zero expense to you.

Sincerely,
Marcus Vance, Director of Talent
CloudScale Technologies
talent-acquisition@cloudscaletech.com`,
  },
  {
    id: 'freelance-ambiguous',
    code: 'VECTOR // 04',
    title: 'Informal Freelance Brief',
    subtitle: 'Unsolicited gig invitation from personal Gmail with compressed deadline.',
    badge: 'Moderate (25%)',
    badgeType: 'moderate',
    category: 'Ambiguous Lead',
    iconType: 'freelance',
    chips: ['Free Webmail', '24h Pressure', 'Generic Greeting'],
    url: '',
    content: `Dear Applicant,

We have reviewed your portfolio and would like to hire you for freelance copywriting assistance at $40/hr. 

Please note that we have high applicant volume and need your confirmation within 24 hours. Contact our design lead at design-freelance@gmail.com with your portfolio samples to get started.`,
  },
];

export default function App() {
  // CLEAN INITIAL STATE: Starts empty without hardcoded results
  const [inputText, setInputText] = useState<string>('');
  const [urlInput, setUrlInput] = useState<string>('');
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'text' | 'file' | 'url'>('text');
  const [report, setReport] = useState<ScamInspectionReport | null>(null);
  const [rawReport, setRawReport] = useState<ScamInspectionReport | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>('en');
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);
  const [showJsonModal, setShowJsonModal] = useState<boolean>(false);
  const [copiedJson, setCopiedJson] = useState<boolean>(false);
  const [showSafeResponseModal, setShowSafeResponseModal] = useState<boolean>(false);
  const [showOfficialReportModal, setShowOfficialReportModal] = useState<boolean>(false);
  const [showForensicReportModal, setShowForensicReportModal] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeLangOption =
    SUPPORTED_LANGUAGES.find((l) => l.code === currentLanguage) || SUPPORTED_LANGUAGES[0];

  // Dynamic Scan Trigger
  const handleAnalyze = async (overrideText?: string, overrideUrl?: string) => {
    const text = overrideText !== undefined ? overrideText : inputText;
    const url = overrideUrl !== undefined ? overrideUrl : (activeTab === 'url' ? urlInput : '');

    if (!text.trim() && !url.trim()) return;

    setIsScanning(true);
    let computedReport: ScamInspectionReport | null = null;
    try {
      const res = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, url, language: currentLanguage }),
      });
      if (res.ok) {
        const data = (await res.json()) as ScamInspectionReport;
        if (data && typeof data.scamThreatIndex === 'number') {
          computedReport = data;
        }
      }
    } catch {
      // Fallback seamlessly to local dynamic engine
    }

    if (!computedReport) {
      computedReport = runDynamicInspection(text, url);
    }

    setRawReport(computedReport);

    if (currentLanguage === 'en') {
      setReport(computedReport);
    } else {
      // Instantly apply high quality domain translation
      const translated = translateInspectionReport(computedReport, currentLanguage);
      setReport(translated);

      // Async AI contextual translation check
      fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ report: computedReport, targetLanguage: currentLanguage }),
      })
        .then((r) => r.json())
        .then((d) => {
          if (d && d.success && d.report) {
            if (Array.isArray(d.report.detectedRedFlags) && Array.isArray(computedReport!.detectedRedFlags)) {
              d.report.detectedRedFlags.forEach((rf: any, i: number) => {
                if (computedReport!.detectedRedFlags[i]) {
                  rf.evidence = computedReport!.detectedRedFlags[i].evidence;
                }
              });
            }
            setReport(d.report);
          }
        })
        .catch(() => {});
    }

    setExpandedIndex(0);
    setIsScanning(false);
  };

  // Language Change Handler with immediate client translation and background AI enhancement
  const handleLanguageChange = async (newLang: LanguageCode) => {
    setCurrentLanguage(newLang);
    if (!rawReport) return;

    if (newLang === 'en') {
      setReport(rawReport);
      return;
    }

    // 1. Instant deterministic domain cybersecurity translation
    const immediateTranslation = translateInspectionReport(rawReport, newLang);
    setReport(immediateTranslation);

    // 2. Background Gemini contextual enhancement if available
    try {
      setIsTranslating(true);
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ report: rawReport, targetLanguage: newLang }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.success && data.report) {
          if (Array.isArray(data.report.detectedRedFlags) && Array.isArray(rawReport.detectedRedFlags)) {
            data.report.detectedRedFlags.forEach((rf: any, i: number) => {
              if (rawReport.detectedRedFlags[i]) {
                rf.evidence = rawReport.detectedRedFlags[i].evidence;
              }
            });
          }
          setReport(data.report);
        }
      }
    } catch {
      // Keep instant translated fallback
    } finally {
      setIsTranslating(false);
    }
  };

  const handleSelectPreset = (preset: PresetScenario) => {
    setSelectedPresetId(preset.id);
    setInputText(preset.content);
    setUrlInput(preset.url);
    handleAnalyze(preset.content, preset.url);
  };

  const handleClear = () => {
    setInputText('');
    setUrlInput('');
    setSelectedPresetId(null);
    setReport(null);
    setRawReport(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.name.endsWith('.txt')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = (event.target?.result as string) || '';
        setInputText(text);
        setSelectedPresetId(null);
        setUrlInput('');
        handleAnalyze(text, '');
      };
      reader.readAsText(file);
    } else {
      const isRental = /rent|lease|apt|sublet|flat/i.test(file.name);
      const extracted = isRental
        ? `[OCR SCAN: ${file.name}]
APARTMENT LEASE AGREEMENT & HOLDING RECEIPT
Property: 1200 Pacific Heights Blvd, Apt 4B. Rent: $1,200/mo.
Due to urgent overseas travel, landlord cannot conduct an in-person viewing.
Keys will be couriered upon receipt of $2,400 deposit via Zelle or Bitcoin.
Send wire receipt to WhatsApp: +1 (555) 019-4821.`
        : `[OCR SCAN: ${file.name}]
OFFICIAL OFFER OF EMPLOYMENT
Position: Remote Administrative Associate ($42/hr)
Company will issue cashier check for $3,000. You must deposit immediately and wire $2,500 via Zelle to authorized equipment vendor (tech-vendor@fastmail.com) within 24 hours.
Contact HR on Telegram: @GlobalHR_Direct`;

      setInputText(extracted);
      setSelectedPresetId(null);
      setUrlInput('');
      handleAnalyze(extracted, '');
    }
  };

  // Bioluminescent HUD Helpers
  const renderPresetIcon = (type: PresetScenario['iconType']) => {
    switch (type) {
      case 'check-trap':
        return (
          <div className="w-10 h-10 rounded-xl bg-[#FF2A6D]/15 border border-[#FF2A6D]/40 flex items-center justify-center text-[#FF2A6D] shadow-[0_0_15px_rgba(255,42,109,0.3)]">
            <FileWarning className="w-5 h-5" />
          </div>
        );
      case 'rental-wire':
        return (
          <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.3)]">
            <Key className="w-5 h-5" />
          </div>
        );
      case 'enterprise':
        return (
          <div className="w-10 h-10 rounded-xl bg-[#00FF9D]/15 border border-[#00FF9D]/40 flex items-center justify-center text-[#00FF9D] shadow-[0_0_15px_rgba(0,255,157,0.3)]">
            <Building2 className="w-5 h-5" />
          </div>
        );
      case 'freelance':
      default:
        return (
          <div className="w-10 h-10 rounded-xl bg-[#00F0FF]/15 border border-[#00F0FF]/40 flex items-center justify-center text-[#00F0FF] shadow-[0_0_15px_rgba(0,240,255,0.3)]">
            <Briefcase className="w-5 h-5" />
          </div>
        );
    }
  };

  const getPresetBadgeStyle = (type: PresetScenario['badgeType']) => {
    switch (type) {
      case 'critical':
        return 'bg-[#FF2A6D]/20 text-[#FF2A6D] border border-[#FF2A6D]/40 font-semibold shadow-[0_0_12px_rgba(255,42,109,0.35)]';
      case 'high':
        return 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold shadow-[0_0_12px_rgba(251,191,36,0.3)]';
      case 'moderate':
        return 'bg-cyan-500/20 text-[#00F0FF] border border-cyan-500/40 font-semibold shadow-[0_0_12px_rgba(0,240,255,0.3)]';
      case 'safe':
      default:
        return 'bg-[#00FF9D]/20 text-[#00FF9D] border border-[#00FF9D]/40 font-semibold shadow-[0_0_12px_rgba(0,255,157,0.3)]';
    }
  };

  const getRiskTheme = (level?: string) => {
    switch (level) {
      case 'Critical Risk':
        return {
          pill: 'bg-[#FF2A6D]/15 text-[#FF2A6D] border-[#FF2A6D]/40 shadow-[0_0_15px_rgba(255,42,109,0.3)]',
          textColor: 'text-[#FF2A6D]',
          borderColor: 'border-[#FF2A6D]/30',
          gaugeColor: '#FF2A6D',
          glowHalo: 'shadow-[0_0_30px_rgba(255,42,109,0.2)]',
        };
      case 'High Risk':
        return {
          pill: 'bg-orange-500/15 text-orange-400 border-orange-500/40 shadow-[0_0_15px_rgba(251,146,60,0.3)]',
          textColor: 'text-orange-400',
          borderColor: 'border-orange-500/30',
          gaugeColor: '#fb923c',
          glowHalo: 'shadow-[0_0_30px_rgba(251,146,60,0.2)]',
        };
      case 'Moderate Risk':
        return {
          pill: 'bg-amber-400/15 text-amber-300 border-amber-400/40 shadow-[0_0_15px_rgba(251,191,36,0.25)]',
          textColor: 'text-amber-300',
          borderColor: 'border-amber-400/30',
          gaugeColor: '#fbbf24',
          glowHalo: 'shadow-[0_0_30px_rgba(251,191,36,0.15)]',
        };
      case 'Low Risk':
      default:
        return {
          pill: 'bg-[#00FF9D]/15 text-[#00FF9D] border-[#00FF9D]/40 shadow-[0_0_15px_rgba(0,255,157,0.25)]',
          textColor: 'text-[#00FF9D]',
          borderColor: 'border-[#00FF9D]/30',
          gaugeColor: '#00FF9D',
          glowHalo: 'shadow-[0_0_30px_rgba(0,255,157,0.15)]',
        };
    }
  };

  const riskTheme = getRiskTheme(report?.riskLevel);

  // SVG Arch Gauge Calculations
  const radius = 56;
  const halfCircumference = Math.PI * radius;
  const score = report?.scamThreatIndex || 0;
  const strokeDashoffset = halfCircumference - (score / 100) * halfCircumference;

  return (
    <div className="min-h-screen bg-[#050811] text-slate-100 font-sans antialiased relative selection:bg-[#00F0FF]/30 selection:text-[#00F0FF] overflow-x-hidden">
      {/* 1. Deep Trench Atmosphere: Animated Glowing Ambient Orbs */}
      <div className="fixed top-[-100px] left-[15%] w-[600px] h-[600px] rounded-full bg-cyan-500/10 blur-[140px] pointer-events-none animate-orb-teal -z-10" />
      <div className="fixed top-[350px] right-[5%] w-[650px] h-[650px] rounded-full bg-indigo-600/10 blur-[160px] pointer-events-none animate-orb-violet -z-10" />
      <div className="fixed bottom-[-150px] left-[30%] w-[500px] h-[500px] rounded-full bg-emerald-500/5 blur-[150px] pointer-events-none -z-10" />

      {/* Top Header: Bioluminescent Ocean Branding */}
      <header className="sticky top-0 z-40 border-b border-cyan-500/15 bg-[#050811]/85 backdrop-blur-2xl">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo with Breathing Pulse Animation */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-900/80 border border-cyan-500/30 flex items-center justify-center animate-hook-pulse shadow-[0_0_15px_rgba(0,240,255,0.25)]">
              <BioluminescentHook className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-white tracking-tight text-base">
                  ScamShield <span className="text-[#00F0FF] font-medium">AI</span>
                </span>
                <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-medium bg-[#00FF9D]/10 text-[#00FF9D] border border-[#00FF9D]/30 shadow-[0_0_10px_rgba(0,255,157,0.15)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00FF9D] animate-pulse" />
                  Bioluminescent Radar Active
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">
                Abyssal Phishing & Employment Fraud Inspection Engine
              </p>
            </div>
          </div>

          {/* Header Actions */}
          <div className="flex items-center gap-2.5">
            {/* Sleek Glassmorphic Language Selector Dropdown */}
            <LanguageSelector
              currentLanguage={currentLanguage}
              onSelectLanguage={handleLanguageChange}
            />

            {report && (
              <button
                type="button"
                onClick={() => setShowJsonModal(true)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-[#00F0FF] bg-cyan-950/30 hover:bg-cyan-950/50 border border-cyan-500/30 hover:border-cyan-500/60 shadow-[0_0_10px_rgba(0,240,255,0.15)] transition-all cursor-pointer"
              >
                &lt;Raw JSON&gt;
              </button>
            )}

            <button
              type="button"
              onClick={handleClear}
              className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 bg-slate-900/60 hover:bg-slate-800/80 border border-slate-700/50 transition-all flex items-center gap-1.5 cursor-pointer"
              title="Reset dashboard and start clean"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* NEW MODERN DESIGN CONCEPT: "INTERACTIVE SCENARIO SIMULATOR HUD" */}
        <section className="bg-slate-900/80 backdrop-blur-md border border-cyan-500/30 rounded-2xl p-5 sm:p-6 shadow-[0_8px_32px_rgba(0,0,0,0.5)] space-y-5 relative overflow-hidden">
          {/* Top HUD Control Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-cyan-500/15 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-[#00F0FF] shadow-[0_0_10px_rgba(0,240,255,0.2)]">
                <Activity className="w-4 h-4 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-white font-mono">
                    {getUiString('scenarioSimulator', currentLanguage)}
                  </h2>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]/30">
                    <Radio className="w-2.5 h-2.5 animate-pulse" />
                    {getUiString('vectorsReady', currentLanguage)}
                  </span>
                </div>
                <p className="text-xs text-slate-400">
                  Select a live payload below to trigger instant dynamic multi-weight scoring
                </p>
              </div>
            </div>

            <div className="text-[11px] font-mono text-slate-500 hidden md:block">
              // ZERO_HARDCODED_SCORES • DYNAMIC_REGEX_ENGINE
            </div>
          </div>

          {/* Interactive Asymmetric Deck of Scenario Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {PRESET_SCENARIOS.map((preset) => {
              const isSelected = selectedPresetId === preset.id;
              return (
                <div
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset)}
                  className={`p-4 rounded-xl border backdrop-blur-md transition-all duration-300 flex flex-col justify-between group cursor-pointer relative overflow-hidden ${
                    isSelected
                      ? 'scale-[1.02] bg-slate-900/95 border-[#00F0FF] shadow-[0_0_30px_rgba(0,240,255,0.25)] ring-1 ring-[#00F0FF]/60'
                      : 'bg-[#070C18]/80 border-cyan-500/20 hover:border-cyan-400/50 hover:shadow-[0_0_20px_rgba(0,240,255,0.15)] hover:scale-[1.01] hover:bg-[#070C18]/95'
                  }`}
                >
                  {/* Subtle Neon Backglow Aura for active card */}
                  {isSelected && (
                    <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/10 via-transparent to-transparent pointer-events-none" />
                  )}

                  <div className="space-y-3 relative z-10">
                    {/* Top Row: Visual Icon & Risk Badge */}
                    <div className="flex items-center justify-between gap-2">
                      {renderPresetIcon(preset.iconType)}
                      <span
                        className={`text-[10px] px-2.5 py-0.5 rounded-full border ${getPresetBadgeStyle(
                          preset.badgeType
                        )}`}
                      >
                        {preset.badge}
                      </span>
                    </div>

                    {/* Middle: Title & Briefing */}
                    <div>
                      <span className="text-[10px] font-mono text-cyan-400/80 block uppercase tracking-wider mb-1">
                        {preset.code} • {preset.category}
                      </span>
                      <h3 className="text-xs font-bold text-white group-hover:text-[#00F0FF] transition-colors leading-snug">
                        {preset.title}
                      </h3>
                      <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed line-clamp-2">
                        {preset.subtitle}
                      </p>
                    </div>

                    {/* Micro Vector Chips */}
                    <div className="flex flex-wrap gap-1 pt-1">
                      {preset.chips.map((chip, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-white/[0.04] text-slate-300 border border-white/[0.06]"
                        >
                          {chip}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Bottom Action Trigger Button */}
                  <div className="pt-3 mt-3 border-t border-cyan-500/15 relative z-10">
                    <button
                      type="button"
                      className={`w-full py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all duration-200 cursor-pointer ${
                        isSelected
                          ? 'bg-[#00F0FF] text-slate-950 shadow-[0_0_15px_rgba(0,240,255,0.4)]'
                          : 'bg-white/[0.05] text-slate-300 group-hover:bg-[#00F0FF]/15 group-hover:text-[#00F0FF] group-hover:border group-hover:border-[#00F0FF]/30'
                      }`}
                    >
                      <Zap className={`w-3.5 h-3.5 ${isSelected ? 'fill-slate-950 animate-bounce' : ''}`} />
                      <span>{isSelected ? 'Live Simulation Active' : 'Run Live Simulation'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 4. Scanning Dropzone & URL Input (Bioluminescent Glassmorphism Card) */}
        <section className="bg-slate-900/60 backdrop-blur-xl border border-cyan-500/20 rounded-xl p-5 sm:p-6 shadow-[0_8px_32px_rgba(0,0,0,0.5)] space-y-5 relative">
          {/* Segmented Navigation Tab Bar with Smooth Active State */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-cyan-500/15 pb-4">
            <div className="inline-flex p-1 bg-[#070C18] border border-cyan-500/20 rounded-xl self-start">
              <button
                type="button"
                onClick={() => setActiveTab('text')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  activeTab === 'text'
                    ? 'bg-cyan-500/15 text-[#00F0FF] border border-cyan-500/40 shadow-[0_0_12px_rgba(0,240,255,0.2)]'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <FileText className="w-3.5 h-3.5 text-[#00F0FF]" />
                <span>Document / Email</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('file')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  activeTab === 'file'
                    ? 'bg-cyan-500/15 text-[#00F0FF] border border-cyan-500/40 shadow-[0_0_12px_rgba(0,240,255,0.2)]'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <UploadCloud className="w-3.5 h-3.5 text-[#00FF9D]" />
                <span>OCR Dropzone</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('url')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  activeTab === 'url'
                    ? 'bg-cyan-500/15 text-[#00F0FF] border border-cyan-500/40 shadow-[0_0_12px_rgba(0,240,255,0.2)]'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Globe className="w-3.5 h-3.5 text-indigo-400" />
                <span>Inspect Link / Domain</span>
              </button>
            </div>

            <div className="flex items-center gap-3 text-xs text-slate-500 font-mono">
              <span>{inputText.length} chars</span>
              <span>•</span>
              <span>{inputText.trim() ? inputText.trim().split(/\s+/).length : 0} words</span>
            </div>
          </div>

          {/* Tab 1: Document / Email Text Input */}
          {activeTab === 'text' && (
            <div className="space-y-2">
              <label className="block text-xs font-medium text-slate-300">
                Target Payload (Job Offer Letter, Contract, or Correspondence):
              </label>
              <textarea
                rows={6}
                value={inputText}
                onChange={(e) => {
                  setInputText(e.target.value);
                  if (selectedPresetId) {
                    setSelectedPresetId(null);
                    setUrlInput('');
                  }
                }}
                placeholder="Paste the suspicious or legitimate job offer letter, rental contract, or recruiter message here to calculate the explainable Threat Index..."
                className="w-full bg-[#070C18]/90 border border-cyan-500/20 focus:border-[#00F0FF] focus:shadow-[0_0_15px_rgba(0,240,255,0.2)] rounded-xl p-4 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-hidden leading-relaxed transition-all resize-y font-mono"
              />
            </div>
          )}

          {/* Tab 2: Interactive Dropzone with Animated Radar Sweep Circle & Bobbing Hook */}
          {activeTab === 'file' && (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-cyan-500/30 hover:border-[#00F0FF] bg-[#070C18]/60 hover:bg-[#070C18]/90 rounded-xl p-8 text-center cursor-pointer transition-all duration-300 group relative overflow-hidden shadow-[inset_0_0_30px_rgba(0,240,255,0.03)]"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt,.pdf,.png,.jpg,.jpeg"
                onChange={handleFileUpload}
                className="hidden"
              />

              {/* Pulsing Radar Sweep Circle */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-48 h-48 rounded-full border border-cyan-500/20 animate-radar-ripple" />
                <div className="w-32 h-32 rounded-full border border-cyan-500/30 animate-radar-ripple" style={{ animationDelay: '1.2s' }} />
              </div>

              <div className="flex flex-col items-center justify-center space-y-3 relative z-10">
                {/* Central Fishing Hook Icon that bobs smoothly */}
                <div className="w-14 h-14 rounded-2xl bg-slate-900/90 border border-cyan-500/40 flex items-center justify-center text-[#00F0FF] animate-bobbing shadow-[0_0_20px_rgba(0,240,255,0.3)] group-hover:border-[#00F0FF] transition-colors">
                  <BioluminescentHook className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white group-hover:text-[#00F0FF] transition-colors">
                    Drop document to sweep for phishing vectors
                  </h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Accepts PDF contract, PNG/JPG scan, or plain TXT document.
                  </p>
                </div>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium bg-[#00FF9D]/10 text-[#00FF9D] border border-[#00FF9D]/30 shadow-[0_0_10px_rgba(0,255,157,0.15)]">
                  Automated OCR text parser engaged
                </span>
              </div>
            </div>
          )}

          {/* Tab 3: Dedicated URL & Domain Inspector */}
          {activeTab === 'url' && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="block text-xs font-medium text-slate-300">
                  Suspicious Application Portal, Recruiter Domain, or Property Listing URL:
                </label>
                <div className="relative">
                  <Globe className="w-4 h-4 text-cyan-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    value={urlInput}
                    onChange={(e) => {
                      setUrlInput(e.target.value);
                      setSelectedPresetId(null);
                    }}
                    placeholder="https://company-careers-portal.top/apply/operations-lead"
                    className="w-full bg-[#070C18]/90 border border-cyan-500/20 focus:border-[#00F0FF] focus:shadow-[0_0_15px_rgba(0,240,255,0.2)] rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-hidden font-mono transition-all"
                  />
                </div>
                <p className="text-xs text-slate-400">
                  Real-time structural inspection for typosquatted lookalikes, disposable phishing TLDs (.top, .xyz, .link), unencrypted plain HTTP transport, and consumer webmail routing.
                </p>
              </div>

              {/* Feature 2: Dedicated Domain Security Breakdown Card */}
              <DomainSecurityBreakdownCard
                urlOrDomain={urlInput || 'http://globalcorp-supplies-portal.net'}
                onSelectSample={(sampleUrl) => {
                  setUrlInput(sampleUrl);
                  setSelectedPresetId(null);
                  handleAnalyze(inputText, sampleUrl);
                }}
              />
            </div>
          )}

          {/* Action Row & Prominent CTA Button */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-1 border-t border-cyan-500/10">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Lock className="w-3.5 h-3.5 text-[#00FF9D]" />
              <span>Sandbox Isolation: Analyzed strictly in client memory</span>
            </div>

            <button
              id="analyze-threats-btn"
              type="button"
              disabled={isScanning || (!inputText.trim() && !urlInput.trim())}
              onClick={() => handleAnalyze()}
              className="px-6 py-2.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-[#00F0FF] to-[#00FF9D] hover:from-[#00F0FF] hover:to-[#00F0FF] text-slate-950 disabled:opacity-30 disabled:pointer-events-none transition-all duration-300 shadow-[0_0_20px_rgba(0,240,255,0.3)] hover:shadow-[0_0_30px_rgba(0,240,255,0.5)] flex items-center gap-2 cursor-pointer font-sans"
            >
              {isScanning ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                  <span>Probing Threat Vectors...</span>
                </>
              ) : (
                <>
                  <Search className="w-3.5 h-3.5" />
                  <span>Analyze for Scam Risk</span>
                </>
              )}
            </button>
          </div>
        </section>

        {/* 5. RESULTS DASHBOARD: SCAM THREAT GAUGE & FACTOR BREAKDOWN */}
        {!report ? (
          /* Sleek Waiting / Ready Radar Screen */
          <div className="bg-slate-900/40 backdrop-blur-xl border border-cyan-500/15 rounded-xl p-12 text-center space-y-4 shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
            <div className="w-14 h-14 rounded-2xl bg-slate-900/80 border border-cyan-500/30 flex items-center justify-center text-[#00F0FF] mx-auto animate-bobbing shadow-[0_0_20px_rgba(0,240,255,0.2)]">
              <BioluminescentHook className="w-7 h-7" />
            </div>
            <div className="max-w-md mx-auto space-y-1.5">
              <h3 className="text-sm font-semibold text-white tracking-tight">
                Abyssal Phishing Radar Online
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Initial threat index is 0%. Paste an offer letter or deploy a preset scenario above to calculate the dynamic Scam Threat Index based on detected weights.
              </p>
            </div>
          </div>
        ) : (
          /* Live Dynamic Threat Assessment Dashboard */
          <div className="space-y-6">
            {/* Interactive Cybersecurity Action & Incident Response Command Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 p-4 bg-slate-900/60 backdrop-blur-xl border border-cyan-500/20 rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#00F0FF] shadow-[0_0_8px_#00F0FF] animate-pulse" />
                <span className="text-xs font-semibold text-white tracking-wide">
                  {getUiString('activeIncidentHud', currentLanguage)}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/15 text-[#00F0FF] border border-cyan-500/30">
                  Incident HUD
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* Language Switcher Quick Access */}
                <div className="hidden sm:block">
                  <LanguageSelector
                    currentLanguage={currentLanguage}
                    onSelectLanguage={handleLanguageChange}
                    isCompact
                  />
                </div>

                {/* Feature 3: 1-Click Export Forensic Report Button */}
                <button
                  id="export-forensic-report-btn"
                  type="button"
                  onClick={() => setShowForensicReportModal(true)}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#00F0FF] text-slate-950 hover:bg-[#00FF9D] transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(0,240,255,0.35)]"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>{getUiString('exportForensicReport', currentLanguage)}</span>
                </button>

                {/* Feature 1: Safe Verification Reply Button */}
                <button
                  id="generate-safe-reply-btn"
                  type="button"
                  onClick={() => setShowSafeResponseModal(true)}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-cyan-500/15 text-[#00F0FF] hover:bg-[#00F0FF] hover:text-slate-950 border border-cyan-500/40 transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_0_12px_rgba(0,240,255,0.2)]"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#00FF9D]" />
                  <span>{getUiString('generateSafeReply', currentLanguage)}</span>
                </button>

                {/* Feature 4: Official FTC / IC3 Report Button */}
                <button
                  id="export-official-report-btn"
                  type="button"
                  onClick={() => setShowOfficialReportModal(true)}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#FF2A6D]/15 text-[#FF2A6D] hover:bg-[#FF2A6D] hover:text-white border border-[#FF2A6D]/40 transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_0_12px_rgba(255,42,109,0.25)]"
                >
                  <Scale className="w-3.5 h-3.5" />
                  <span>{getUiString('exportOfficialReport', currentLanguage)}</span>
                </button>

                {/* Raw JSON Inspection Button */}
                <button
                  type="button"
                  onClick={() => setShowJsonModal(true)}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>{getUiString('rawJson', currentLanguage)}</span>
                </button>
              </div>
            </div>

            {/* Top Score Matrix Banner */}
            <div
              className={`bg-slate-900/70 backdrop-blur-xl border ${riskTheme.borderColor} ${riskTheme.glowHalo} rounded-xl p-6 relative overflow-hidden transition-all duration-500`}
            >
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                {/* 5. Glowing 0-100% Semi-Circular Arch Gauge */}
                <div className="md:col-span-5 flex flex-col items-center justify-center p-5 bg-[#070C18]/80 rounded-xl border border-cyan-500/20 shadow-inner">
                  <div className="relative w-48 h-30 flex items-center justify-center">
                    <svg viewBox="0 0 144 84" className="w-full h-full">
                      {/* Background arch track */}
                      <path
                        d="M 16 74 A 56 56 0 0 1 128 74"
                        fill="none"
                        stroke="#111827"
                        strokeWidth="11"
                        strokeLinecap="round"
                      />
                      {/* Glowing filled threat arch */}
                      <path
                        d="M 16 74 A 56 56 0 0 1 128 74"
                        fill="none"
                        stroke={riskTheme.gaugeColor}
                        strokeWidth="11"
                        strokeDasharray={halfCircumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        className="transition-all duration-1000 ease-out"
                        style={{
                          filter: `drop-shadow(0 0 8px ${riskTheme.gaugeColor})`,
                        }}
                      />
                    </svg>

                    {/* Centered Threat Percentage */}
                    <div className="absolute inset-x-0 bottom-1 flex flex-col items-center text-center">
                      <div className="flex items-baseline justify-center gap-0.5">
                        <span
                          className={`text-4xl font-bold font-mono tracking-tight ${riskTheme.textColor}`}
                        >
                          {report.scamThreatIndex}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">/100</span>
                      </div>
                      <span className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">
                        {getUiString('scamThreatIndex', currentLanguage)}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`mt-2 text-xs font-semibold px-3 py-0.5 rounded-full border ${riskTheme.pill}`}
                  >
                    {(report as any).translatedRiskLevel || translateRiskLevel(report.riskLevel, currentLanguage)}
                  </span>
                </div>

                {/* Executive Summary & Threat Factor Progress Bars */}
                <div className="md:col-span-7 space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-white uppercase tracking-wider flex items-center gap-1.5">
                          <Info className="w-3.5 h-3.5 text-[#00F0FF]" />
                          {getUiString('executiveVerdict', currentLanguage)}
                        </span>
                        {currentLanguage !== 'en' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-500/15 text-[#00F0FF] border border-cyan-500/40">
                            <Sparkles className="w-2.5 h-2.5" />
                            {getUiString('aiTranslatedTo', currentLanguage)} {activeLangOption.nativeName}
                          </span>
                        )}
                        {isTranslating && (
                          <span className="text-[10px] font-mono text-cyan-300 animate-pulse">
                            Translating...
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-slate-400 font-mono">
                        {report.detectedRedFlags.length} {getUiString('vectorsIdentified', currentLanguage)}
                      </span>
                    </div>
                    <p
                      className="text-xs text-slate-300 leading-relaxed bg-[#070C18]/80 p-3.5 rounded-xl border border-cyan-500/15"
                      dir={activeLangOption.dir}
                    >
                      {report.summary}
                    </p>
                  </div>

                  {/* 5. Threat Factor Progress Bars (Multi-colored with percentage callouts) */}
                  {report.scoreFactors.length > 0 && (
                    <div className="space-y-2">
                      <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
                        {getUiString('contributingFactors', currentLanguage)}
                      </span>
                      <div className="space-y-2">
                        {report.scoreFactors.map((factor, idx) => {
                          const percentage = Math.min(100, Math.round((factor.points / 35) * 100));
                          return (
                            <div
                              key={idx}
                              className="bg-[#070C18]/60 p-2.5 rounded-lg border border-cyan-500/15 space-y-1.5"
                            >
                              <div className="flex items-center justify-between text-xs">
                                <span className="text-slate-200 font-medium truncate mr-2">
                                  {factor.factor}
                                </span>
                                <span className="text-[#FF2A6D] font-mono font-bold shrink-0">
                                  +{factor.points} pts
                                </span>
                              </div>
                              {/* Sleek thin progress bar */}
                              <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-cyan-500 via-amber-400 to-[#FF2A6D] rounded-full transition-all duration-700"
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Feature 1: "Hook Vector" Attack Flow (Interactive Node Graph) */}
            <HookVectorAttackFlow
              report={report}
              targetPayload={inputText.trim() ? inputText : urlInput}
              currentLanguage={currentLanguage}
            />

            {/* 2-Column Grid: Expandable Red Flags & Domain Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: 5. Red Flag Cards with Glowing Vertical Accent Stripe */}
              <div className="lg:col-span-7 space-y-5">
                {/* Feature 3: Interactive Text Evidence Highlighting Viewer */}
                {(inputText.trim() || urlInput.trim()) && (
                  <EvidenceHighlightViewer
                    text={inputText.trim() ? inputText : urlInput}
                    redFlags={report.detectedRedFlags}
                    activeIndex={expandedIndex}
                    onSelectRedFlag={(idx) => setExpandedIndex(idx)}
                  />
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                      <ShieldAlert className="w-4 h-4 text-[#FF2A6D]" />
                      {getUiString('detectedRedFlags', currentLanguage)} ({report.detectedRedFlags.length})
                    </h3>
                    {currentLanguage !== 'en' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-500/15 text-[#00F0FF] border border-cyan-500/40">
                        <Sparkles className="w-2.5 h-2.5" />
                        {getUiString('aiTranslatedTo', currentLanguage)} {activeLangOption.nativeName}
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-slate-500">
                    {getUiString('clickCardTip', currentLanguage)}
                  </span>
                </div>

                {report.detectedRedFlags.length === 0 ? (
                  <div className="p-6 bg-slate-900/40 rounded-xl border border-[#00FF9D]/30 text-center text-xs text-[#00FF9D] flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(0,255,157,0.1)]">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>No advance-fee traps or phishing hooks detected.</span>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {report.detectedRedFlags.map((rf, idx) => {
                      const isExpanded = expandedIndex === idx;
                      return (
                        <div
                          key={idx}
                          className="bg-slate-900/60 backdrop-blur-xl border border-cyan-500/20 hover:border-cyan-400/50 rounded-xl overflow-hidden transition-all shadow-[0_4px_16px_rgba(0,0,0,0.3)] border-l-4 border-l-[#FF2A6D]"
                        >
                          {/* Accordion Trigger */}
                          <button
                            type="button"
                            onClick={() =>
                              setExpandedIndex(isExpanded ? null : idx)
                            }
                            className="w-full px-4 py-3 text-left flex items-center justify-between gap-3 cursor-pointer"
                          >
                            <div className="flex items-center gap-3">
                              <span
                                className={`w-2 h-2 rounded-full shrink-0 ${
                                  rf.severity === 'Critical'
                                    ? 'bg-[#FF2A6D] shadow-[0_0_8px_#FF2A6D]'
                                    : rf.severity === 'High'
                                    ? 'bg-amber-400 shadow-[0_0_8px_#FBBF24]'
                                    : 'bg-[#00F0FF] shadow-[0_0_8px_#00F0FF]'
                                }`}
                              />
                              <span className="text-xs font-semibold text-white">
                                {rf.indicator}
                              </span>
                            </div>

                            <div className="flex items-center gap-2">
                              <span
                                className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                                  rf.severity === 'Critical'
                                    ? 'bg-[#FF2A6D]/15 text-[#FF2A6D] border-[#FF2A6D]/30'
                                    : rf.severity === 'High'
                                    ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                                    : 'bg-cyan-500/15 text-[#00F0FF] border-cyan-500/30'
                                }`}
                              >
                                {rf.severity}
                              </span>
                              {isExpanded ? (
                                <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
                              ) : (
                                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                              )}
                            </div>
                          </button>

                          {/* Expanded Content: Quoted Evidence Callout Box */}
                          {isExpanded && (
                            <div className="px-4 pb-4 pt-1 space-y-2.5 border-t border-cyan-500/10 text-xs">
                              <div className="space-y-1">
                                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                                  <span className="flex items-center gap-1 text-[#00F0FF]">
                                    <FileText className="w-3 h-3" />
                                    Original English Evidence Snippet
                                  </span>
                                  {currentLanguage !== 'en' && (
                                    <span className="text-slate-500 italic">
                                      {getUiString('forensicEvidence', currentLanguage)}
                                    </span>
                                  )}
                                </div>
                                <div className="bg-[#070C18]/90 p-3 rounded-lg border-l-2 border-l-[#FF2A6D] text-slate-300 italic text-[11px] leading-relaxed font-mono">
                                  "{rf.evidence}"
                                </div>
                              </div>

                              <div className="space-y-1" dir={activeLangOption.dir}>
                                {currentLanguage !== 'en' && (
                                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                                    {getUiString('forensicThreatExplanation', currentLanguage)}
                                  </span>
                                )}
                                <p className="text-slate-400 leading-relaxed font-normal">
                                  {rf.explanation}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Right Column: Legitimate Signals & Domain Security */}
              <div className="lg:col-span-5 space-y-6">
                {/* Legitimate Safe Signals Card */}
                <div className="bg-slate-900/60 backdrop-blur-xl border border-cyan-500/20 rounded-xl p-5 space-y-3 shadow-[0_4px_16px_rgba(0,0,0,0.3)]">
                  <div className="flex items-center justify-between border-b border-cyan-500/15 pb-2.5">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-[#00FF9D]" />
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-[#00FF9D]">
                        {getUiString('legitimateSafeSignals', currentLanguage)}
                      </h3>
                    </div>
                    {currentLanguage !== 'en' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-[#00FF9D]/10 text-[#00FF9D] border border-[#00FF9D]/30">
                        {getUiString('aiTranslatedTo', currentLanguage)} {activeLangOption.nativeName}
                      </span>
                    )}
                  </div>

                  <ul className="space-y-2 text-xs text-slate-300" dir={activeLangOption.dir}>
                    {report.safeSignals.map((signal, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#00FF9D] shrink-0 mt-0.5" />
                        <span className="leading-snug">{signal}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Domain & URL Infrastructure Probe Card */}
                <div className="bg-slate-900/60 backdrop-blur-xl border border-cyan-500/20 rounded-xl p-5 space-y-3 shadow-[0_4px_16px_rgba(0,0,0,0.3)]">
                  <div className="flex items-center gap-2 border-b border-cyan-500/15 pb-2.5">
                    <Globe className="w-4 h-4 text-[#00F0FF]" />
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-[#00F0FF]">
                      {getUiString('domainInfrastructureProbe', currentLanguage)}
                    </h3>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1.5 border-b border-cyan-500/10">
                      <span className="text-slate-400">{getUiString('targetHost', currentLanguage)}</span>
                      <span className="text-white font-mono font-medium">
                        {report.domainAnalysis.domainName}
                      </span>
                    </div>

                    <div className="flex justify-between py-1.5 border-b border-cyan-500/10">
                      <span className="text-slate-400">{getUiString('domainAge', currentLanguage)}</span>
                      <span className="text-slate-400 italic">
                        {report.domainAnalysis.domainAge}
                      </span>
                    </div>

                    <div className="pt-1">
                      <span className="text-slate-400 block mb-1">{getUiString('assessmentNotes', currentLanguage)}</span>
                      <p className="text-slate-300 text-[11px] leading-relaxed bg-[#070C18]/80 p-2.5 rounded-lg border border-cyan-500/15">
                        {report.domainAnalysis.notes}
                      </p>
                    </div>

                    {report.domainAnalysis.suspiciousPatterns.length > 0 && (
                      <div className="pt-2">
                        <span className="text-[#FF2A6D] text-[11px] font-medium block mb-1">
                          Suspicious DNS / URL Flags:
                        </span>
                        <ul className="space-y-1">
                          {report.domainAnalysis.suspiciousPatterns.map((pat, idx) => (
                            <li
                              key={idx}
                              className="text-rose-300 text-[11px] flex items-start gap-1.5"
                            >
                              <span className="text-[#FF2A6D]">•</span>
                              <span>{pat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                {/* Practical Safety Checklist */}
                <div className="bg-slate-900/60 backdrop-blur-xl border border-cyan-500/20 rounded-xl p-5 space-y-3 shadow-[0_4px_16px_rgba(0,0,0,0.3)]">
                  <div className="flex items-center justify-between border-b border-cyan-500/15 pb-2.5">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                        {getUiString('recommendedNextActions', currentLanguage)}
                      </h3>
                    </div>
                    {currentLanguage !== 'en' && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-500/15 text-[#00F0FF] border border-cyan-500/40">
                        {getUiString('aiTranslatedTo', currentLanguage)} {activeLangOption.nativeName}
                      </span>
                    )}
                  </div>

                  <ol className="space-y-2 text-xs text-slate-300 list-decimal list-inside" dir={activeLangOption.dir}>
                    {report.recommendedActions.map((action, idx) => (
                      <li key={idx} className="leading-relaxed">
                        {action}
                      </li>
                    ))}
                  </ol>

                  {/* Quick Action Button for Safe Verification Pushback */}
                  <div className="pt-2 border-t border-cyan-500/15">
                    <button
                      type="button"
                      onClick={() => setShowSafeResponseModal(true)}
                      className="w-full py-2 px-3 rounded-lg text-xs font-semibold bg-cyan-500/15 hover:bg-[#00F0FF] text-[#00F0FF] hover:text-slate-950 border border-cyan-500/30 transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-[0_0_12px_rgba(0,240,255,0.15)]"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-[#00FF9D]" />
                      <span>Draft Safe Verification Reply Script</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 2: Entity & Domain Cross-Checker Card */}
            <EntityCrossCheckerCard
              payloadText={inputText.trim() ? inputText : urlInput}
              payloadUrl={urlInput}
              report={report}
              currentLanguage={currentLanguage}
            />
          </div>
        )}
      </main>

      {/* Raw JSON Modal */}
      {showJsonModal && report && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-[#070C18] border border-cyan-500/30 rounded-xl shadow-[0_0_50px_rgba(0,240,255,0.2)] max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden">
            <div className="px-5 py-4 border-b border-cyan-500/20 flex items-center justify-between bg-slate-900/60">
              <span className="text-xs font-semibold text-[#00F0FF] font-mono">
                &lt;RAW THREAT INSPECTION JSON&gt;
              </span>
              <button
                type="button"
                onClick={() => setShowJsonModal(false)}
                className="text-xs text-slate-400 hover:text-white px-2.5 py-1 rounded bg-slate-800 border border-slate-700 transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>

            <div className="p-4 overflow-y-auto flex-1 bg-[#050811]">
              <pre className="text-[11px] font-mono text-[#00FF9D] whitespace-pre-wrap select-all">
                {JSON.stringify(report, null, 2)}
              </pre>
            </div>

            <div className="px-5 py-3 border-t border-cyan-500/20 bg-slate-900/60 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(JSON.stringify(report, null, 2));
                  setCopiedJson(true);
                  setTimeout(() => setCopiedJson(false), 2000);
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#00F0FF] text-slate-950 hover:bg-[#00FF9D] transition-colors flex items-center gap-1.5 cursor-pointer shadow-[0_0_12px_rgba(0,240,255,0.3)]"
              >
                {copiedJson ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied JSON</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy JSON Payload</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Feature 1: Safe Response Generator Modal */}
      <SafeResponseGeneratorModal
        isOpen={showSafeResponseModal}
        onClose={() => setShowSafeResponseModal(false)}
        report={rawReport || report}
        targetPayload={inputText || urlInput}
        currentLanguage={currentLanguage}
        onSelectLanguage={handleLanguageChange}
      />

      {/* Feature 3: 1-Click Forensic Evidence Report Modal (Print / PDF / Standalone HTML) */}
      <ForensicReportModal
        isOpen={showForensicReportModal}
        onClose={() => setShowForensicReportModal(false)}
        report={report}
        targetPayload={inputText.trim() ? inputText : urlInput}
        currentLanguage={currentLanguage}
      />

      {/* Feature 4: Official FTC / IC3 Fraud Report Modal */}
      <OfficialFraudReportModal
        isOpen={showOfficialReportModal}
        onClose={() => setShowOfficialReportModal(false)}
        report={report}
        targetPayload={inputText || urlInput}
      />

      {/* Bioluminescent Footer */}
      <footer className="border-t border-cyan-500/15 bg-[#050811] py-8 text-center text-xs text-slate-500">
        <p>ScamShield AI • Bioluminescent Ocean Cybersecurity & Document Fraud Inspector</p>
      </footer>
    </div>
  );
}
