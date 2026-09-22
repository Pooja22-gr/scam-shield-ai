import React from 'react';
import { AlertTriangle, Quote, CheckCircle } from 'lucide-react';
import { DetectedRedFlag, RedFlagSeverity } from '../types';

interface RedFlagsListProps {
  flags: DetectedRedFlag[];
  onSelectEvidence?: (evidence: string) => void;
}

export const RedFlagsList: React.FC<RedFlagsListProps> = ({
  flags,
  onSelectEvidence,
}) => {
  const getSeverityBadge = (severity: RedFlagSeverity) => {
    switch (severity) {
      case 'Critical':
        return 'bg-rose-950/60 text-rose-300 border-rose-800';
      case 'High':
        return 'bg-orange-950/60 text-orange-300 border-orange-800';
      case 'Medium':
        return 'bg-amber-950/60 text-amber-300 border-amber-800';
      case 'Low':
      default:
        return 'bg-sky-950/60 text-sky-300 border-sky-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Upfront Payment':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
      case 'Domain Mismatch':
        return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
      case 'Urgency':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'Off-Platform Move':
        return 'text-purple-400 bg-purple-500/10 border-purple-500/20';
      case 'Structural Anomaly':
      default:
        return 'text-sky-400 bg-sky-500/10 border-sky-500/20';
    }
  };

  if (flags.length === 0) {
    return (
      <div className="bg-slate-900/80 border border-emerald-900/40 rounded-xl p-6 text-center">
        <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
        <h4 className="text-sm font-semibold text-slate-200">
          No Red Flags Detected
        </h4>
        <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
          The submitted document adheres to legitimate corporate recruitment and
          standard contractual protocols. No advance fee requests or domain
          anomalies were identified.
        </p>
      </div>
    );
  }

  return (
    <div id="detected-red-flags" className="bg-slate-900/80 border border-slate-800 rounded-xl p-5">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400" />
          <h3 className="text-sm font-semibold text-slate-200">
            Detected Threat Vectors & Red Flags ({flags.length})
          </h3>
        </div>
        <span className="text-xs text-slate-400 font-mono">
          Strict Heuristic Validation
        </span>
      </div>

      <div className="space-y-3.5">
        {flags.map((flag, index) => (
          <div
            key={index}
            className="p-4 rounded-lg bg-slate-950/60 border border-slate-800/80 hover:border-slate-700 transition-colors"
          >
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <span
                  className={`text-[11px] font-mono px-2 py-0.5 rounded-md border font-medium ${getCategoryColor(
                    flag.category
                  )}`}
                >
                  {flag.category}
                </span>
                <span
                  className={`text-[11px] font-mono px-2 py-0.5 rounded-md border uppercase font-medium ${getSeverityBadge(
                    flag.severity
                  )}`}
                >
                  {flag.severity} Severity
                </span>
              </div>
              {flag.pointsContributed && (
                <span className="text-xs font-mono font-medium text-rose-400">
                  +{flag.pointsContributed} pts
                </span>
              )}
            </div>

            <p className="text-xs text-slate-300 leading-relaxed mb-3">
              {flag.description}
            </p>

            {flag.evidenceText && (
              <div
                onClick={() => onSelectEvidence?.(flag.evidenceText)}
                className="bg-slate-900/90 rounded-md p-2.5 border border-slate-800 flex items-start gap-2 cursor-pointer hover:border-slate-700 transition-colors group"
                title="Click to highlight in text viewer"
              >
                <Quote className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5 group-hover:text-amber-400 transition-colors" />
                <div className="text-[11px] font-mono text-slate-400 italic leading-snug break-words">
                  "{flag.evidenceText}"
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
