import React from 'react';
import { Laptop, Home, UserX, CheckCircle2, AlertOctagon } from 'lucide-react';
import { VerdictDetails } from '../types';

interface VerdictPillsProps {
  verdict: VerdictDetails;
}

export const VerdictPills: React.FC<VerdictPillsProps> = ({ verdict }) => {
  const { equipmentScamDetected, depositTrapDetected, fakeRecruiterDetected } =
    verdict;

  return (
    <div id="verdict-pills" className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      {/* Equipment Scam Pill */}
      <div
        className={`p-3 rounded-lg border flex items-center gap-3 transition-colors ${
          equipmentScamDetected
            ? 'bg-rose-950/40 border-rose-800/60 text-rose-300'
            : 'bg-slate-900/60 border-slate-800 text-slate-400'
        }`}
      >
        <div
          className={`p-2 rounded-md ${
            equipmentScamDetected
              ? 'bg-rose-500/20 text-rose-400'
              : 'bg-slate-800 text-slate-500'
          }`}
        >
          <Laptop className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[11px] font-mono uppercase text-slate-400">
            Check / Gear Trap
          </div>
          <div className="text-xs font-semibold truncate">
            {equipmentScamDetected ? 'Equipment Scam Flagged' : 'No Advance-Fee Trap'}
          </div>
        </div>
        {equipmentScamDetected ? (
          <AlertOctagon className="w-4 h-4 text-rose-400 shrink-0" />
        ) : (
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
        )}
      </div>

      {/* Deposit Trap Pill */}
      <div
        className={`p-3 rounded-lg border flex items-center gap-3 transition-colors ${
          depositTrapDetected
            ? 'bg-rose-950/40 border-rose-800/60 text-rose-300'
            : 'bg-slate-900/60 border-slate-800 text-slate-400'
        }`}
      >
        <div
          className={`p-2 rounded-md ${
            depositTrapDetected
              ? 'bg-rose-500/20 text-rose-400'
              : 'bg-slate-800 text-slate-500'
          }`}
        >
          <Home className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[11px] font-mono uppercase text-slate-400">
            Escrow / Wire Trap
          </div>
          <div className="text-xs font-semibold truncate">
            {depositTrapDetected ? 'Sight-Unseen Deposit Trap' : 'No Escrow Hijack'}
          </div>
        </div>
        {depositTrapDetected ? (
          <AlertOctagon className="w-4 h-4 text-rose-400 shrink-0" />
        ) : (
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
        )}
      </div>

      {/* Fake Recruiter Pill */}
      <div
        className={`p-3 rounded-lg border flex items-center gap-3 transition-colors ${
          fakeRecruiterDetected
            ? 'bg-amber-950/40 border-amber-800/60 text-amber-300'
            : 'bg-slate-900/60 border-slate-800 text-slate-400'
        }`}
      >
        <div
          className={`p-2 rounded-md ${
            fakeRecruiterDetected
              ? 'bg-amber-500/20 text-amber-400'
              : 'bg-slate-800 text-slate-500'
          }`}
        >
          <UserX className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[11px] font-mono uppercase text-slate-400">
            Recruiter Legitimacy
          </div>
          <div className="text-xs font-semibold truncate">
            {fakeRecruiterDetected ? 'Impersonator / Off-Platform' : 'Verified Enterprise'}
          </div>
        </div>
        {fakeRecruiterDetected ? (
          <AlertOctagon className="w-4 h-4 text-amber-400 shrink-0" />
        ) : (
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
        )}
      </div>
    </div>
  );
};
