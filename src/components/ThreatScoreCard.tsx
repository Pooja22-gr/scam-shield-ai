import React from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  ShieldX,
  Info,
  Flame,
} from 'lucide-react';
import { RiskLevel, SecurityInspectionReport } from '../types';

interface ThreatScoreCardProps {
  report: SecurityInspectionReport;
}

export const ThreatScoreCard: React.FC<ThreatScoreCardProps> = ({ report }) => {
  const { scamThreatIndex, riskLevel, detectedRedFlags, piiScrubbedCount } = report;

  const pointsByCategory = {
    payment: detectedRedFlags
      .filter((rf) => rf.category === 'Upfront Payment')
      .reduce((sum, r) => sum + (r.pointsContributed || 0), 0),
    domain: detectedRedFlags
      .filter((rf) => rf.category === 'Domain Mismatch')
      .reduce((sum, r) => sum + (r.pointsContributed || 0), 0),
    urgency: detectedRedFlags
      .filter((rf) => rf.category === 'Urgency')
      .reduce((sum, r) => sum + (r.pointsContributed || 0), 0),
    offplatform: detectedRedFlags
      .filter((rf) => rf.category === 'Off-Platform Move')
      .reduce((sum, r) => sum + (r.pointsContributed || 0), 0),
    linguistic: detectedRedFlags
      .filter((rf) => rf.category === 'Structural Anomaly')
      .reduce((sum, r) => sum + (r.pointsContributed || 0), 0),
  };

  const getRiskTheme = (level: RiskLevel) => {
    switch (level) {
      case 'Critical Threat':
        return {
          badgeBg: 'bg-rose-500/10 border-rose-500/40 text-rose-400 shadow-rose-950/40',
          meterColor: '#f43f5e',
          textColor: 'text-rose-400',
          icon: ShieldX,
          border: 'border-rose-900/40',
          tierLabel: 'Tier 5 • Critical Threat (80-100%)',
        };
      case 'High Risk':
        return {
          badgeBg: 'bg-orange-500/10 border-orange-500/40 text-orange-400 shadow-orange-950/40',
          meterColor: '#fb923c',
          textColor: 'text-orange-400',
          icon: ShieldAlert,
          border: 'border-orange-900/40',
          tierLabel: 'Tier 4 • High Risk (60-79%)',
        };
      case 'Moderate Risk':
        return {
          badgeBg: 'bg-amber-500/10 border-amber-500/40 text-amber-400 shadow-amber-950/40',
          meterColor: '#fbbf24',
          textColor: 'text-amber-400',
          icon: AlertTriangle,
          border: 'border-amber-900/40',
          tierLabel: 'Tier 3 • Moderate Risk (40-59%)',
        };
      case 'Low Risk':
        return {
          badgeBg: 'bg-sky-500/10 border-sky-500/40 text-sky-400 shadow-sky-950/40',
          meterColor: '#38bdf8',
          textColor: 'text-sky-400',
          icon: Info,
          border: 'border-sky-900/40',
          tierLabel: 'Tier 2 • Low Risk (20-39%)',
        };
      case 'Safe':
      default:
        return {
          badgeBg: 'bg-emerald-500/10 border-emerald-500/40 text-emerald-400 shadow-emerald-950/40',
          meterColor: '#10b981',
          textColor: 'text-emerald-400',
          icon: ShieldCheck,
          border: 'border-emerald-900/40',
          tierLabel: 'Tier 1 • Safe / Verified (0-19%)',
        };
    }
  };

  const theme = getRiskTheme(riskLevel);
  const Icon = theme.icon;

  // Semi-circle gauge calculation
  // Radius = 65, semi-circumference = Math.PI * 65 ≈ 204.2
  const r = 65;
  const halfCircumference = Math.PI * r;
  const strokeDashoffset =
    halfCircumference - (scamThreatIndex / 100) * halfCircumference;

  // Needle angle: from -180 deg to 0 deg
  const needleAngle = -180 + (scamThreatIndex / 100) * 180;

  return (
    <div
      id="threat-score-card"
      className={`bg-slate-900/90 rounded-2xl p-6 border ${theme.border} shadow-xl relative overflow-hidden`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4 mb-5">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl border ${theme.badgeBg}`}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-200">
              Scam Threat Index (STI) Meter
            </h3>
            <p className="text-xs text-slate-400 font-mono">
              {theme.tierLabel}
            </p>
          </div>
        </div>

        {/* Risk Level Badge */}
        <div className="flex items-center gap-2">
          {piiScrubbedCount > 0 && (
            <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-mono bg-emerald-950/60 border border-emerald-700/50 text-emerald-300">
              <ShieldCheck className="w-3 h-3" />
              {piiScrubbedCount} PII Sanitized
            </span>
          )}
          <div
            id="risk-level-badge"
            className={`px-3.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border shadow-sm ${theme.badgeBg}`}
          >
            {riskLevel}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Semi-circular Speedometer Gauge */}
        <div className="md:col-span-5 flex flex-col items-center justify-center pt-2">
          <div className="relative w-56 h-32 flex items-center justify-center overflow-hidden">
            <svg viewBox="0 0 160 90" className="w-full h-full">
              {/* Arc background segments */}
              {/* Green Safe segment: 0 - 19% */}
              <path
                d="M 15 80 A 65 65 0 0 1 145 80"
                fill="none"
                stroke="#1e293b"
                strokeWidth="14"
                strokeLinecap="round"
              />

              {/* Dynamic filled threat arc */}
              <path
                d="M 15 80 A 65 65 0 0 1 145 80"
                fill="none"
                stroke={theme.meterColor}
                strokeWidth="14"
                strokeDasharray={halfCircumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />

              {/* Indicator Needle */}
              <g
                transform={`translate(80, 80) rotate(${needleAngle})`}
                className="transition-all duration-1000 ease-out"
              >
                <line
                  x1="0"
                  y1="0"
                  x2="52"
                  y2="0"
                  stroke="#f8fafc"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <circle cx="0" cy="0" r="5" fill="#f8fafc" />
                <circle cx="0" cy="0" r="2.5" fill={theme.meterColor} />
              </g>
            </svg>

            {/* Centered Threat Score Display */}
            <div className="absolute bottom-0 inset-x-0 flex flex-col items-center justify-center text-center translate-y-1">
              <span className={`text-3xl font-mono font-bold tracking-tight ${theme.textColor}`}>
                {scamThreatIndex}%
              </span>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                Scam Threat Score
              </span>
            </div>
          </div>

          {/* Tier Scale Indicator Chips */}
          <div className="grid grid-cols-5 gap-1 text-[10px] font-mono w-full max-w-xs mt-3 text-center">
            <span className="text-emerald-400 font-medium">Safe &lt;20</span>
            <span className="text-sky-400 font-medium">Low &lt;40</span>
            <span className="text-amber-400 font-medium">Mod &lt;60</span>
            <span className="text-orange-400 font-medium">High &lt;80</span>
            <span className="text-rose-400 font-medium">Crit &ge;80</span>
          </div>
        </div>

        {/* Vector breakdown bars */}
        <div className="md:col-span-7 space-y-3">
          <div className="text-xs font-medium text-slate-300 mb-1 flex items-center justify-between">
            <span>Threat Vector Breakdown</span>
            <span className="text-slate-500 font-mono text-[11px]">
              Weights: +35 / +25 / +15 / +15 / +10
            </span>
          </div>

          {/* Upfront Payment */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                Upfront Payment & Deposit Trap
              </span>
              <span className="font-mono text-slate-400">
                {pointsByCategory.payment} / 35 pts
              </span>
            </div>
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-rose-500 transition-all duration-700"
                style={{ width: `${(pointsByCategory.payment / 35) * 100}%` }}
              />
            </div>
          </div>

          {/* Domain / Email Anomaly */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-orange-500" />
                Lookalike Domain & Webmail Integrity
              </span>
              <span className="font-mono text-slate-400">
                {pointsByCategory.domain} / 25 pts
              </span>
            </div>
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-orange-500 transition-all duration-700"
                style={{ width: `${(pointsByCategory.domain / 25) * 100}%` }}
              />
            </div>
          </div>

          {/* Urgency */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                Psychological Urgency Radar
              </span>
              <span className="font-mono text-slate-400">
                {pointsByCategory.urgency} / 15 pts
              </span>
            </div>
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-500 transition-all duration-700"
                style={{ width: `${(pointsByCategory.urgency / 15) * 100}%` }}
              />
            </div>
          </div>

          {/* Off-Platform */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-purple-500" />
                Off-Platform Migration (Telegram / WhatsApp)
              </span>
              <span className="font-mono text-slate-400">
                {pointsByCategory.offplatform} / 15 pts
              </span>
            </div>
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-500 transition-all duration-700"
                style={{ width: `${(pointsByCategory.offplatform / 15) * 100}%` }}
              />
            </div>
          </div>

          {/* Linguistic / Structural */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-sky-500" />
                Structural & Linguistic Red Flags
              </span>
              <span className="font-mono text-slate-400">
                {pointsByCategory.linguistic} / 10 pts
              </span>
            </div>
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-sky-500 transition-all duration-700"
                style={{ width: `${(pointsByCategory.linguistic / 10) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
