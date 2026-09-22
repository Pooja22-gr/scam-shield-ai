import React from 'react';
import { Brain, Sparkles, ShieldCheck } from 'lucide-react';

interface PsychologicalTriggersCardProps {
  triggers: string[];
}

export const PsychologicalTriggersCard: React.FC<PsychologicalTriggersCardProps> = ({
  triggers,
}) => {
  return (
    <div id="psychological-triggers-card" className="bg-slate-900/80 border border-slate-800 rounded-xl p-5">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4 text-purple-400" />
          <h3 className="text-sm font-semibold text-slate-200">
            Psychological & Social Engineering Triggers
          </h3>
        </div>
        <span className="text-xs text-slate-400 font-mono">
          Behavioral Manipulation
        </span>
      </div>

      {triggers.length === 0 ? (
        <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono py-2">
          <ShieldCheck className="w-4 h-4" />
          No coercive psychological or high-pressure triggers identified
        </div>
      ) : (
        <div className="flex flex-wrap gap-2">
          {triggers.map((trigger, idx) => (
            <span
              key={idx}
              className="px-2.5 py-1 rounded-md text-xs font-medium bg-purple-950/40 border border-purple-800/60 text-purple-300 flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
              {trigger}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
