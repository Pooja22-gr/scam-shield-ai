import React, { useState } from 'react';
import { MessageSquareText, Copy, Check, ShieldAlert, Sparkles } from 'lucide-react';

interface SafeResponseCardProps {
  template: string;
  threatLevel: string;
}

export const SafeResponseCard: React.FC<SafeResponseCardProps> = ({
  template,
  threatLevel,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(template);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = template;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const isScam = threatLevel === 'Critical Threat' || threatLevel === 'High Risk';

  return (
    <div
      id="safe-response-card"
      className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-sm space-y-3"
    >
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <MessageSquareText className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-semibold text-slate-200">
            Safe Verification & Pushback Response Script
          </h3>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied Template</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Response</span>
            </>
          )}
        </button>
      </div>

      <p className="text-xs text-slate-400 leading-relaxed">
        {isScam
          ? 'Use this hardened template to reject advance-fee demands and insist on corporate domain email verification or in-person walk-throughs.'
          : 'Standard verification response confirming receipt and requesting enterprise onboarding coordinates.'}
      </p>

      {/* Script Box */}
      <div className="bg-slate-950 p-4 rounded-lg border border-slate-800/80 font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed select-all">
        {template}
      </div>
    </div>
  );
};
