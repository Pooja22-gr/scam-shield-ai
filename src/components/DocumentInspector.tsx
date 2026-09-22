import React, { useState } from 'react';
import { FileText, Eye, Code, Search } from 'lucide-react';
import { DetectedRedFlag } from '../types';

interface DocumentInspectorProps {
  content: string;
  redFlags: DetectedRedFlag[];
  selectedEvidence?: string | null;
}

export const DocumentInspector: React.FC<DocumentInspectorProps> = ({
  content,
  redFlags,
  selectedEvidence,
}) => {
  const [viewMode, setViewMode] = useState<'highlighted' | 'raw'>('highlighted');

  // Highlight matches in text
  const renderHighlightedContent = () => {
    if (!content) return <span className="text-slate-500 italic">No content submitted.</span>;

    // Collect all unique quotes
    const quotes = redFlags
      .map((rf) => rf.evidenceText?.trim())
      .filter((q): q is string => Boolean(q) && q.length > 3);

    if (quotes.length === 0 || viewMode === 'raw') {
      return (
        <pre className="font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
          {content}
        </pre>
      );
    }

    // Build regular expression safely
    let formattedText = content;

    return (
      <div className="font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
        {content.split('\n').map((line, lIdx) => {
          // Check if line contains any evidence
          const matchingFlag = redFlags.find(
            (rf) =>
              rf.evidenceText &&
              line.toLowerCase().includes(rf.evidenceText.toLowerCase().slice(0, 30))
          );

          const isSelected =
            selectedEvidence &&
            matchingFlag &&
            matchingFlag.evidenceText.toLowerCase().includes(selectedEvidence.toLowerCase().slice(0, 20));

          if (matchingFlag) {
            const flagCategoryClass =
              matchingFlag.category === 'Upfront Payment'
                ? 'bg-rose-950/70 border-rose-600/60 text-rose-200'
                : matchingFlag.category === 'Domain Mismatch'
                ? 'bg-orange-950/70 border-orange-600/60 text-orange-200'
                : matchingFlag.category === 'Urgency'
                ? 'bg-amber-950/70 border-amber-600/60 text-amber-200'
                : matchingFlag.category === 'Off-Platform Move'
                ? 'bg-purple-950/70 border-purple-600/60 text-purple-200'
                : 'bg-sky-950/70 border-sky-600/60 text-sky-200';

            return (
              <div
                key={lIdx}
                className={`py-0.5 px-1.5 rounded my-0.5 border-l-2 transition-all ${
                  isSelected ? 'ring-1 ring-white/50 ' : ''
                } ${flagCategoryClass}`}
              >
                {line}
              </div>
            );
          }

          return (
            <div key={lIdx} className="py-0.5">
              {line || '\u00A0'}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div id="document-forensic-inspector" className="bg-slate-900/80 border border-slate-800 rounded-xl p-5">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-semibold text-slate-200">
            Forensic Document View
          </h3>
          <span className="text-[11px] font-mono text-slate-400">
            ({content.split(/\s+/).filter(Boolean).length} words)
          </span>
        </div>

        <div className="flex items-center gap-1 bg-slate-800 p-0.5 rounded-lg border border-slate-700">
          <button
            onClick={() => setViewMode('highlighted')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md flex items-center gap-1.5 transition-colors ${
              viewMode === 'highlighted'
                ? 'bg-slate-700 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Eye className="w-3 h-3" />
            <span>Threat Highlights</span>
          </button>
          <button
            onClick={() => setViewMode('raw')}
            className={`px-2.5 py-1 text-xs font-medium rounded-md flex items-center gap-1.5 transition-colors ${
              viewMode === 'raw'
                ? 'bg-slate-700 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code className="w-3 h-3" />
            <span>Raw Plaintext</span>
          </button>
        </div>
      </div>

      {/* Text Area Container */}
      <div className="bg-slate-950 p-4 rounded-lg border border-slate-800/80 max-h-80 overflow-y-auto font-mono text-xs">
        {renderHighlightedContent()}
      </div>

      {/* Legend */}
      {viewMode === 'highlighted' && redFlags.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-2 text-[10px] font-mono text-slate-400">
          <span className="text-slate-500 uppercase tracking-wider">Highlight Key:</span>
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-rose-950/70 text-rose-300 border border-rose-800/60">
            Payment / Check Demand
          </span>
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-orange-950/70 text-orange-300 border border-orange-800/60">
            Domain Anomaly
          </span>
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-950/70 text-amber-300 border border-amber-800/60">
            Urgency / Pressure
          </span>
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-purple-950/70 text-purple-300 border border-purple-800/60">
            Off-Platform Move
          </span>
        </div>
      )}
    </div>
  );
};
