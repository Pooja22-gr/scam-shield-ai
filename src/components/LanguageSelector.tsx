import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check, Sparkles } from 'lucide-react';
import { LanguageCode, SUPPORTED_LANGUAGES, LanguageOption } from '../services/translator';

interface LanguageSelectorProps {
  currentLanguage: LanguageCode;
  onSelectLanguage: (lang: LanguageCode) => void;
  className?: string;
  isCompact?: boolean;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  currentLanguage,
  onSelectLanguage,
  className = '',
  isCompact = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeOption =
    SUPPORTED_LANGUAGES.find((l) => l.code === currentLanguage) || SUPPORTED_LANGUAGES[0];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div
      ref={dropdownRef}
      id="scamshield-language-selector-container"
      className={`relative inline-block text-left ${className}`}
    >
      {/* Sleek Glassmorphic Language Selector Trigger Button */}
      <button
        id="scamshield-language-selector-btn"
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className={`group flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-900 border border-cyan-500/30 hover:border-[#00F0FF] shadow-sm hover:shadow-[0_0_12px_rgba(0,240,255,0.2)] transition-all duration-200 text-xs font-medium text-slate-200 cursor-pointer backdrop-blur-md ${
          isOpen ? 'border-[#00F0FF] shadow-[0_0_15px_rgba(0,240,255,0.25)] ring-1 ring-[#00F0FF]/40' : ''
        }`}
      >
        <div className="flex items-center justify-center text-[#00F0FF] group-hover:scale-110 transition-transform">
          <Globe className="w-3.5 h-3.5" />
        </div>

        <span className="text-sm leading-none">{activeOption.flag}</span>

        {!isCompact && (
          <span className="text-slate-100 font-semibold tracking-wide">
            {activeOption.nativeName}
          </span>
        )}

        {activeOption.code !== 'en' && !isCompact && (
          <span className="hidden md:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono bg-cyan-500/15 text-[#00F0FF] border border-cyan-500/30">
            AI Active
          </span>
        )}

        <ChevronDown
          className={`w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-300 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-[#00F0FF]' : ''
          }`}
        />
      </button>

      {/* Glassmorphic Dropdown Menu */}
      {isOpen && (
        <div
          id="scamshield-language-dropdown-menu"
          role="menu"
          aria-orientation="vertical"
          className="absolute right-0 mt-2 w-64 origin-top-right rounded-xl bg-slate-900/95 backdrop-blur-xl border border-cyan-500/40 shadow-[0_10px_35px_rgba(0,0,0,0.65)] ring-1 ring-cyan-500/20 z-50 py-1.5 animate-in fade-in zoom-in-95 duration-150 divide-y divide-cyan-500/10"
        >
          {/* Header Info */}
          <div className="px-3.5 py-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <Sparkles className="w-3 h-3 text-[#00F0FF]" />
                Multilingual AI Engine
              </span>
              <span className="text-[10px] font-mono text-[#00FF9D]">7 Languages</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Instantly translate threat reports & verification scripts
            </p>
          </div>

          {/* Language Options List */}
          <div className="py-1">
            {SUPPORTED_LANGUAGES.map((lang: LanguageOption) => {
              const isSelected = lang.code === currentLanguage;
              return (
                <button
                  key={lang.code}
                  role="menuitem"
                  id={`lang-option-${lang.code}`}
                  onClick={() => {
                    onSelectLanguage(lang.code);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2 text-xs transition-colors cursor-pointer text-left ${
                    isSelected
                      ? 'bg-cyan-500/15 text-[#00F0FF] font-semibold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base leading-none">{lang.flag}</span>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-white font-medium">{lang.nativeName}</span>
                        {lang.code === 'en' ? (
                          <span className="text-[10px] text-slate-400 font-mono">(Default)</span>
                        ) : (
                          <span className="text-[10px] text-slate-400 font-mono">
                            ({lang.label})
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="flex items-center gap-1 text-[#00FF9D]">
                      <Check className="w-3.5 h-3.5" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Footer note on preserving English source evidence */}
          <div className="px-3.5 py-2 bg-slate-950/40 text-[10px] text-slate-400 font-mono">
            <span className="text-[#00F0FF]">Note:</span> Original English quotes are preserved in
            Evidence for cross-referencing.
          </div>
        </div>
      )}
    </div>
  );
};
