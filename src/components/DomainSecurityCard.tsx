import React from 'react';
import { Globe, AlertCircle, CheckCircle2, ShieldCheck, ShieldAlert } from 'lucide-react';
import { DomainAnalysis } from '../types';

interface DomainSecurityCardProps {
  analysis: DomainAnalysis;
}

export const DomainSecurityCard: React.FC<DomainSecurityCardProps> = ({ analysis }) => {
  const { suspiciousDomainsFound, isLookalikeDomain, notes } = analysis;
  const hasIssues = suspiciousDomainsFound.length > 0 || isLookalikeDomain;

  return (
    <div id="domain-security-card" className="bg-slate-900/80 border border-slate-800 rounded-xl p-5">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-sky-400" />
          <h3 className="text-sm font-semibold text-slate-200">
            Entity & Domain Integrity
          </h3>
        </div>
        <span
          className={`text-[11px] font-mono px-2 py-0.5 rounded border uppercase font-medium ${
            hasIssues
              ? 'bg-orange-950/60 text-orange-300 border-orange-800'
              : 'bg-emerald-950/60 text-emerald-300 border-emerald-800'
          }`}
        >
          {hasIssues ? 'Domain Risks Found' : 'Domain Verified'}
        </span>
      </div>

      <div className="space-y-3">
        {/* Identified domains */}
        <div>
          <div className="text-[11px] font-mono text-slate-400 uppercase mb-1.5">
            Detected Domains & Routing Vectors
          </div>
          {suspiciousDomainsFound.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {suspiciousDomainsFound.map((domain, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded bg-orange-950/40 border border-orange-800/60 text-orange-300 font-mono text-xs flex items-center gap-1"
                >
                  <AlertCircle className="w-3 h-3 text-orange-400" />
                  {domain}
                </span>
              ))}
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono">
              <CheckCircle2 className="w-3.5 h-3.5" />
              No unauthenticated or consumer email domains detected
            </div>
          )}
        </div>

        {/* Lookalike domain check */}
        <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-slate-300 font-medium">
              Lookalike / Typosquatting Analysis
            </span>
            <span
              className={`font-mono text-[11px] ${
                isLookalikeDomain ? 'text-rose-400' : 'text-emerald-400'
              }`}
            >
              {isLookalikeDomain ? 'POSSIBLE LOOKALIKE' : 'CLEAN'}
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">{notes}</p>
        </div>
      </div>
    </div>
  );
};
