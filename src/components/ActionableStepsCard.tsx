import React from 'react';
import { ShieldAlert, ExternalLink, CheckSquare } from 'lucide-react';

interface ActionableStepsCardProps {
  steps: string[];
  threatLevel: string;
}

export const ActionableStepsCard: React.FC<ActionableStepsCardProps> = ({
  steps,
  threatLevel,
}) => {
  const isHighRisk = threatLevel === 'High Risk' || threatLevel === 'Critical Threat';

  return (
    <div
      id="actionable-steps-card"
      className={`rounded-xl p-5 border ${
        isHighRisk
          ? 'bg-slate-900/90 border-rose-900/50 shadow-md'
          : 'bg-slate-900/80 border-slate-800'
      }`}
    >
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <ShieldAlert
            className={`w-4 h-4 ${isHighRisk ? 'text-rose-400' : 'text-emerald-400'}`}
          />
          <h3 className="text-sm font-semibold text-slate-200">
            Actionable Defense & Incident Protocols
          </h3>
        </div>
        <span className="text-xs text-slate-400 font-mono">
          Security Roadmap
        </span>
      </div>

      <div className="space-y-2.5">
        {steps.map((step, idx) => (
          <div
            key={idx}
            className="flex items-start gap-3 p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80"
          >
            <div className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] font-mono font-bold text-slate-300 shrink-0 mt-0.5">
              {idx + 1}
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">{step}</p>
          </div>
        ))}
      </div>

      {/* Official Government reporting resources */}
      {isHighRisk && (
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center gap-3">
          <span className="text-[11px] font-mono text-slate-400">
            Report Suspicious Documents:
          </span>
          <a
            href="https://reportfraud.ftc.gov"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-rose-400 hover:text-rose-300 transition-colors font-mono"
          >
            FTC ReportFraud <ExternalLink className="w-3 h-3" />
          </a>
          <a
            href="https://www.ic3.gov"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-rose-400 hover:text-rose-300 transition-colors font-mono"
          >
            FBI IC3 Complaint <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      )}
    </div>
  );
};
