import React, { useEffect, useRef } from 'react';
import { FileText, Eye, AlertTriangle, ShieldAlert, Sparkles, Navigation } from 'lucide-react';
import { ScamInspectionReport } from '../services/dynamicScanner';

interface EvidenceHighlightViewerProps {
  text: string;
  redFlags: ScamInspectionReport['detectedRedFlags'];
  activeIndex: number | null;
  onSelectRedFlag: (index: number) => void;
}

interface TextSegment {
  content: string;
  isEvidence: boolean;
  flagIndex?: number;
  indicator?: string;
  severity?: 'Low' | 'Medium' | 'High' | 'Critical';
}

export const EvidenceHighlightViewer: React.FC<EvidenceHighlightViewerProps> = ({
  text,
  redFlags,
  activeIndex,
  onSelectRedFlag,
}) => {
  const activeElementRef = useRef<HTMLSpanElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll to active highlighted evidence when activeIndex changes
  useEffect(() => {
    if (activeIndex !== null && activeElementRef.current) {
      activeElementRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [activeIndex]);

  // Segment the text into plain text and evidence highlights
  const segments = React.useMemo(() => {
    if (!text || redFlags.length === 0) {
      return [{ content: text || '', isEvidence: false }];
    }

    // Collect all valid matches
    interface MatchPos {
      start: number;
      end: number;
      flagIndex: number;
      indicator: string;
      severity: 'Low' | 'Medium' | 'High' | 'Critical';
    }

    const matches: MatchPos[] = [];

    redFlags.forEach((rf, fIdx) => {
      // Clean snippet for matching (remove leading/trailing ellipsis)
      const cleanSnippet = rf.evidence.replace(/^\.{3}\s*/, '').replace(/\s*\.{3}$/, '').trim();
      if (!cleanSnippet || cleanSnippet.length < 3) return;

      // Search for exact or case-insensitive occurrence
      const lowerText = text.toLowerCase();
      const lowerSnippet = cleanSnippet.toLowerCase();

      // Check if evidence contains "..." indicating multiple parts (e.g. "check ... equipment")
      if (cleanSnippet.includes('...')) {
        const parts = cleanSnippet.split('...').map((p) => p.trim()).filter(Boolean);
        parts.forEach((part) => {
          let pos = lowerText.indexOf(part.toLowerCase());
          while (pos !== -1) {
            matches.push({
              start: pos,
              end: pos + part.length,
              flagIndex: fIdx,
              indicator: rf.indicator,
              severity: rf.severity,
            });
            pos = lowerText.indexOf(part.toLowerCase(), pos + part.length);
          }
        });
      } else {
        let pos = lowerText.indexOf(lowerSnippet);
        while (pos !== -1) {
          matches.push({
            start: pos,
            end: pos + cleanSnippet.length,
            flagIndex: fIdx,
            indicator: rf.indicator,
            severity: rf.severity,
          });
          pos = lowerText.indexOf(lowerSnippet, pos + cleanSnippet.length);
        }
      }
    });

    if (matches.length === 0) {
      return [{ content: text, isEvidence: false }];
    }

    // Sort matches by start position and resolve overlaps
    matches.sort((a, b) => a.start - b.start);

    const nonOverlapping: MatchPos[] = [];
    let lastEnd = -1;

    for (const m of matches) {
      if (m.start >= lastEnd) {
        nonOverlapping.push(m);
        lastEnd = m.end;
      }
    }

    // Build segments
    const result: TextSegment[] = [];
    let cursor = 0;

    for (const m of nonOverlapping) {
      if (m.start > cursor) {
        result.push({
          content: text.substring(cursor, m.start),
          isEvidence: false,
        });
      }
      result.push({
        content: text.substring(m.start, m.end),
        isEvidence: true,
        flagIndex: m.flagIndex,
        indicator: m.indicator,
        severity: m.severity,
      });
      cursor = m.end;
    }

    if (cursor < text.length) {
      result.push({
        content: text.substring(cursor),
        isEvidence: false,
      });
    }

    return result;
  }, [text, redFlags]);

  return (
    <div className="bg-[#070C18] border border-cyan-500/25 rounded-xl overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.5)] flex flex-col">
      {/* Header bar */}
      <div className="px-4 py-3 bg-slate-900/80 border-b border-cyan-500/20 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-[#00F0FF]" />
          <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
            Inspected Payload & Live Evidence Callouts
          </h4>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/15 text-[#00F0FF] border border-cyan-500/30">
            {redFlags.length} Vectors Tagged
          </span>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
          <span className="flex items-center gap-1 text-[#FF2A6D]">
            <span className="w-2 h-2 rounded-full bg-[#FF2A6D] animate-ping" />
            Click card to auto-scroll & highlight
          </span>
        </div>
      </div>

      {/* Interactive Payload Document Display */}
      <div
        ref={containerRef}
        className="p-5 max-h-[380px] overflow-y-auto font-mono text-xs text-slate-200 leading-relaxed bg-[#050811] space-y-2 select-text"
      >
        <div className="whitespace-pre-wrap">
          {segments.map((seg, idx) => {
            if (!seg.isEvidence) {
              return <span key={idx}>{seg.content}</span>;
            }

            const isCurrentActive = activeIndex === seg.flagIndex;
            const isCritical = seg.severity === 'Critical';

            return (
              <span
                key={idx}
                ref={isCurrentActive ? activeElementRef : null}
                onClick={() => {
                  if (seg.flagIndex !== undefined) {
                    onSelectRedFlag(seg.flagIndex);
                  }
                }}
                className={`relative inline-block rounded-md px-1.5 py-0.5 my-0.5 cursor-pointer transition-all duration-300 ${
                  isCurrentActive
                    ? 'bg-[#FF2A6D]/25 text-white border-2 border-[#FF2A6D] shadow-[0_0_20px_rgba(255,42,109,0.8)] font-bold scale-[1.02] z-10'
                    : isCritical
                    ? 'bg-[#FF2A6D]/15 text-[#FF6584] border border-[#FF2A6D]/40 hover:bg-[#FF2A6D]/25 hover:border-[#FF2A6D]'
                    : 'bg-cyan-500/15 text-[#00F0FF] border border-cyan-500/40 hover:bg-cyan-500/25 hover:border-[#00F0FF]'
                }`}
                title={`Click to focus Red Flag #${(seg.flagIndex ?? 0) + 1}: ${seg.indicator}`}
              >
                {/* Active Indicator Floating Beacon */}
                {isCurrentActive && (
                  <span className="absolute -top-3 left-0 -translate-y-1/2 px-1.5 py-0.2 rounded-full text-[9px] font-sans font-bold bg-[#FF2A6D] text-slate-950 uppercase tracking-wider shadow-[0_0_10px_#FF2A6D] whitespace-nowrap pointer-events-none flex items-center gap-1">
                    <AlertTriangle className="w-2.5 h-2.5 fill-slate-950" />
                    Target Evidence
                  </span>
                )}
                {seg.content}
              </span>
            );
          })}
        </div>
      </div>

      {/* Sub-footer guidance */}
      <div className="px-4 py-2 bg-slate-900/60 border-t border-cyan-500/15 flex items-center justify-between text-[11px] text-slate-400">
        <span className="flex items-center gap-1.5">
          <Eye className="w-3.5 h-3.5 text-[#00FF9D]" />
          <span>Interactive text evidence map synchronized with threat engine.</span>
        </span>
        {activeIndex !== null && (
          <span className="text-[#00F0FF] font-mono font-semibold">
            Focused Vector #{activeIndex + 1}: {redFlags[activeIndex]?.indicator}
          </span>
        )}
      </div>
    </div>
  );
};
