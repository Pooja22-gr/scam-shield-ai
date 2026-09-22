import React, { useMemo } from 'react';
import {
  Globe,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Lock,
  Unlock,
  Mail,
  Server,
  ExternalLink,
  Info,
  CheckCircle2,
  XCircle,
} from 'lucide-react';

interface DomainSecurityBreakdownCardProps {
  urlOrDomain: string;
  onSelectSample?: (url: string) => void;
}

export const DomainSecurityBreakdownCard: React.FC<DomainSecurityBreakdownCardProps> = ({
  urlOrDomain,
  onSelectSample,
}) => {
  const analysis = useMemo(() => {
    const raw = (urlOrDomain || '').trim();
    if (!raw) return null;

    let hostname = 'N/A';
    let protocol = 'none';
    let isHttp = false;
    let isHttps = false;

    try {
      if (raw.startsWith('http://') || raw.startsWith('https://')) {
        const urlObj = new URL(raw);
        hostname = urlObj.hostname;
        protocol = urlObj.protocol.replace(':', '');
        isHttp = protocol === 'http';
        isHttps = protocol === 'https';
      } else {
        // extract domain from text or email
        const cleaned = raw.replace(/^https?:\/\//i, '').split('/')[0].split(':')[0];
        hostname = cleaned;
      }
    } catch {
      hostname = raw.split('/')[0];
    }

    const lowerHost = hostname.toLowerCase();

    // 1. Typosquatting / Lookalike Detection
    const hasLookalikeHyphens =
      /(?:portal|careers|supplies|jobs|recruiting|hiring|verify|hr-|login-|team-|security-)[a-z0-9-]*\.[a-z]+/i.test(
        lowerHost
      ) ||
      /[a-z0-9-]+-(?:portal|supplies|login|hr|jobs|careers|team|verify|auth|wire|escrow)\.[a-z]+/i.test(
        lowerHost
      );

    const hyphenCount = (lowerHost.match(/-/g) || []).length;
    const isMultiHyphen = hyphenCount >= 2;

    const brandSpoofingKeywords = [
      'portal',
      'careers',
      'supplies',
      'jobs',
      'verify',
      'login',
      'escrow',
      'wire',
      'auth',
      'support',
      'security',
      'direct',
    ];
    const detectedKeywords = brandSpoofingKeywords.filter((k) => lowerHost.includes(k));

    // High-risk TLDs
    const highRiskTldRegex = /\.(xyz|top|live|click|work|online|cc|link|bid|tokyo|buzz|surf)$/i;
    const isHighRiskTld = highRiskTldRegex.test(lowerHost);
    const tldMatch = lowerHost.match(/\.([a-z0-9]+)$/i);
    const tld = tldMatch ? tldMatch[1] : 'unknown';

    // 2. Webmail vs Enterprise Protocol Flag
    const freeWebmailRegex =
      /(?:gmail\.com|yahoo\.com|hotmail\.com|outlook\.com|fastmail\.[a-z]+|protonmail\.com|aol\.com|zoho\.com|mail\.com|yandex\.com|icloud\.com)$/i;
    const isFreeWebmail = freeWebmailRegex.test(lowerHost);

    // Protocol status
    const isUnencryptedHttp = raw.toLowerCase().startsWith('http://');

    // Structural scoring
    let structureRiskLevel: 'Low Risk' | 'Moderate Risk' | 'High Risk' | 'Critical Risk' = 'Low Risk';
    const riskIssues: string[] = [];
    const positiveSignals: string[] = [];

    if (isHighRiskTld) {
      riskIssues.push(`High-Risk Disposable TLD (.${tld}): Frequently leveraged for short-lived spear-phishing infrastructure.`);
    }
    if (hasLookalikeHyphens || isMultiHyphen) {
      riskIssues.push(`Lookalike Typosquatting Structure: Contains multiple hyphens or spoofing keywords (${detectedKeywords.join(', ')}).`);
    }
    if (isUnencryptedHttp) {
      riskIssues.push('Unencrypted Plain HTTP Transmission: Lacks TLS/SSL encryption, leaving data exposed to man-in-the-middle interception.');
    }
    if (isFreeWebmail) {
      riskIssues.push('Consumer Webmail Domain: Commercial hiring or leasing operated via free public webmail instead of verified enterprise DNS.');
    }

    if (riskIssues.length >= 2 || (isHighRiskTld && hasLookalikeHyphens)) {
      structureRiskLevel = 'Critical Risk';
    } else if (riskIssues.length === 1) {
      structureRiskLevel = 'High Risk';
    } else {
      structureRiskLevel = 'Low Risk';
      positiveSignals.push('Standard domain syntax without anomalous hyphenation or brand spoofing keywords.');
      if (isHttps) {
        positiveSignals.push('Secure HTTPS (TLS) encrypted transport protocol confirmed.');
      }
      if (!isFreeWebmail && (tld === 'com' || tld === 'org' || tld === 'edu' || tld === 'gov' || tld === 'io')) {
        positiveSignals.push(`Established top-level domain (.${tld}) with enterprise namespace.`);
      }
    }

    return {
      hostname,
      protocol: isHttps ? 'HTTPS (TLS Encrypted)' : isHttp ? 'HTTP (Unencrypted)' : 'Not Specified in String',
      isUnencryptedHttp,
      isHttps,
      isFreeWebmail,
      hasLookalikeHyphens,
      isHighRiskTld,
      tld,
      detectedKeywords,
      structureRiskLevel,
      riskIssues,
      positiveSignals,
      domainAge: 'Domain age unavailable (Requires live WHOIS lookup)',
    };
  }, [urlOrDomain]);

  const quickSamples = [
    {
      label: 'Typosquatted Vendor',
      url: 'http://globalcorp-supplies-portal.net',
      badge: 'Critical Risk',
      badgeColor: 'text-[#FF2A6D] bg-[#FF2A6D]/10 border-[#FF2A6D]/30',
    },
    {
      label: 'Disposable Phishing TLD',
      url: 'https://amazon-careers-onboarding.xyz',
      badge: 'High Risk',
      badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    },
    {
      label: 'Rental Wire Trap',
      url: 'https://leasing-wire-deposit.link',
      badge: 'High Risk',
      badgeColor: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    },
    {
      label: 'Verified Corporate',
      url: 'https://careers.google.com',
      badge: 'Safe',
      badgeColor: 'text-[#00FF9D] bg-[#00FF9D]/10 border-[#00FF9D]/30',
    },
  ];

  return (
    <div className="space-y-4">
      {/* Sample Quick Launch Chips */}
      {onSelectSample && (
        <div className="space-y-1.5">
          <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1.5">
            <ExternalLink className="w-3 h-3 text-[#00F0FF]" />
            Quick Inspect Test Scenarios:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {quickSamples.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => onSelectSample(sample.url)}
                className="p-2.5 rounded-lg bg-[#070C18] border border-cyan-500/20 hover:border-[#00F0FF] hover:bg-cyan-500/10 transition-all text-left group cursor-pointer"
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-xs font-semibold text-white group-hover:text-[#00F0FF] transition-colors">
                    {sample.label}
                  </span>
                  <span
                    className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border ${sample.badgeColor}`}
                  >
                    {sample.badge}
                  </span>
                </div>
                <div className="text-[10px] font-mono text-slate-400 truncate group-hover:text-slate-300">
                  {sample.url}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Breakdown Card */}
      {analysis && (
        <div className="bg-[#070C18] border border-cyan-500/25 rounded-xl p-5 shadow-[0_4px_20px_rgba(0,0,0,0.5)] space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-cyan-500/15 pb-3">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#00F0FF]" />
              <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
                Domain & URL Security Architecture Breakdown
              </h4>
            </div>
            <span
              className={`text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${
                analysis.structureRiskLevel === 'Critical Risk'
                  ? 'bg-[#FF2A6D]/15 text-[#FF2A6D] border-[#FF2A6D]/30'
                  : analysis.structureRiskLevel === 'High Risk'
                  ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                  : 'bg-[#00FF9D]/15 text-[#00FF9D] border-[#00FF9D]/30'
              }`}
            >
              {analysis.structureRiskLevel}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* 1. Domain Structure Analysis */}
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-cyan-500/15 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-cyan-300">
                <Server className="w-3.5 h-3.5 text-[#00F0FF]" />
                <span>Domain Structure Analysis</span>
              </div>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Target Host:</span>
                  <span className="text-white font-mono font-semibold truncate max-w-[140px]">
                    {analysis.hostname}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Typosquatting:</span>
                  <span
                    className={`font-mono font-semibold ${
                      analysis.hasLookalikeHyphens ? 'text-[#FF2A6D]' : 'text-[#00FF9D]'
                    }`}
                  >
                    {analysis.hasLookalikeHyphens ? 'Lookalike Flagged' : 'Clean Syntax'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">TLD Risk (.${analysis.tld}):</span>
                  <span
                    className={`font-mono font-semibold ${
                      analysis.isHighRiskTld ? 'text-[#FF2A6D]' : 'text-slate-300'
                    }`}
                  >
                    {analysis.isHighRiskTld ? 'High-Risk Disposable' : 'Standard'}
                  </span>
                </div>
              </div>
            </div>

            {/* 2. Webmail vs Enterprise Protocol Flag */}
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-cyan-500/15 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-cyan-300">
                {analysis.isUnencryptedHttp ? (
                  <Unlock className="w-3.5 h-3.5 text-[#FF2A6D]" />
                ) : (
                  <Lock className="w-3.5 h-3.5 text-[#00FF9D]" />
                )}
                <span>Webmail vs Enterprise Protocol</span>
              </div>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Transport Layer:</span>
                  <span
                    className={`font-mono font-semibold flex items-center gap-1 ${
                      analysis.isUnencryptedHttp ? 'text-[#FF2A6D]' : 'text-[#00FF9D]'
                    }`}
                  >
                    {analysis.isUnencryptedHttp ? 'HTTP (Insecure)' : 'HTTPS (Encrypted)'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Mail/Host Protocol:</span>
                  <span
                    className={`font-mono font-semibold ${
                      analysis.isFreeWebmail ? 'text-amber-400' : 'text-[#00FF9D]'
                    }`}
                  >
                    {analysis.isFreeWebmail ? 'Public Consumer Webmail' : 'Enterprise Corporate DNS'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">DMARC Posture:</span>
                  <span className="text-slate-300 font-mono">
                    {analysis.isFreeWebmail ? 'Spoofable' : 'Enterprise Enforced'}
                  </span>
                </div>
              </div>
            </div>

            {/* 3. Domain Age Status */}
            <div className="p-3.5 rounded-xl bg-slate-900/60 border border-cyan-500/15 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-cyan-300">
                <Info className="w-3.5 h-3.5 text-indigo-400" />
                <span>Domain Age Status</span>
              </div>
              <div className="space-y-1 text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-mono">
                    Registry Longevity Status:
                  </span>
                  <span className="text-slate-300 font-mono text-xs italic block mt-0.5">
                    {analysis.domainAge}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 leading-tight pt-1">
                  Honest Information Policy: ScamShield never invents simulated WHOIS timestamps. Actual domain registration ages require live ICANN/WHOIS registrar queries.
                </p>
              </div>
            </div>
          </div>

          {/* Diagnostic Warnings / Safe Signals */}
          {analysis.riskIssues.length > 0 && (
            <div className="p-3 rounded-lg bg-[#FF2A6D]/10 border border-[#FF2A6D]/20 space-y-1.5">
              <span className="text-xs font-semibold text-[#FF2A6D] flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                Structural Vulnerabilities & Phishing Vectors Detected:
              </span>
              <ul className="space-y-1">
                {analysis.riskIssues.map((issue, idx) => (
                  <li key={idx} className="text-xs text-rose-200 flex items-start gap-1.5 leading-relaxed">
                    <XCircle className="w-3.5 h-3.5 text-[#FF2A6D] shrink-0 mt-0.5" />
                    <span>{issue}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {analysis.positiveSignals.length > 0 && (
            <div className="p-3 rounded-lg bg-[#00FF9D]/10 border border-[#00FF9D]/20 space-y-1.5">
              <span className="text-xs font-semibold text-[#00FF9D] flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Verified Legitimate Domain Signals:
              </span>
              <ul className="space-y-1">
                {analysis.positiveSignals.map((sig, idx) => (
                  <li key={idx} className="text-xs text-emerald-200 flex items-start gap-1.5 leading-relaxed">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#00FF9D] shrink-0 mt-0.5" />
                    <span>{sig}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
