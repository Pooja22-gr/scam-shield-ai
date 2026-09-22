import React from 'react';
import { Globe, AlertTriangle, CheckCircle2, ShieldAlert, Link as LinkIcon } from 'lucide-react';

interface UrlInspectorCardProps {
  urlInput: string;
  onUrlChange: (url: string) => void;
  mode: 'job' | 'rental';
}

export const UrlInspectorCard: React.FC<UrlInspectorCardProps> = ({
  urlInput,
  onUrlChange,
  mode,
}) => {
  const quickExamples =
    mode === 'job'
      ? [
          {
            label: 'Lookalike Typosquat Portal',
            url: 'https://careers-google-logistics-portal.top/apply',
          },
          {
            label: 'Verified Corporate Portal',
            url: 'https://careers.cloudscaletech.com/jobs/senior-frontend-eng',
          },
        ]
      : [
          {
            label: 'Phishing Sublease Listing',
            url: 'https://craigslist-luxury-apartments-direct.xyz/post/450grand',
          },
          {
            label: 'Legitimate Property Listing',
            url: 'https://www.zillow.com/homedetails/450-Grand-Ave/2091823_zpid/',
          },
        ];

  return (
    <div className="space-y-4 bg-slate-950/60 p-5 rounded-2xl border border-slate-800">
      <div>
        <label className="block text-xs font-medium text-slate-300 mb-1">
          {mode === 'job'
            ? 'Job Application or Recruiter Portal URL:'
            : 'Rental Listing or Property Verification URL:'}
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
            <LinkIcon className="w-4 h-4" />
          </div>
          <input
            type="url"
            value={urlInput}
            onChange={(e) => onUrlChange(e.target.value)}
            placeholder={
              mode === 'job'
                ? 'https://company-careers-portal.com/apply/operations-associate'
                : 'https://craigslist-sublet-direct.xyz/apartments/san-francisco'
            }
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs font-mono text-slate-200 placeholder:text-slate-600 focus:outline-hidden focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/40"
          />
        </div>
      </div>

      {/* Quick Example URLs */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[11px] font-mono text-slate-500">
          Try Example URLs:
        </span>
        {quickExamples.map((ex, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => onUrlChange(ex.url)}
            className="px-2.5 py-1 rounded-lg text-[11px] font-mono bg-slate-900 border border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white transition-colors"
          >
            {ex.label}
          </button>
        ))}
      </div>

      {/* Real-time hint */}
      <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-400 flex items-start gap-2.5">
        <Globe className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          The URL inspector automatically detects deceptive hyphenated brand names,
          disposable high-risk top-level domains (.xyz, .top), and insecure HTTP protocols before scanning.
        </p>
      </div>
    </div>
  );
};
