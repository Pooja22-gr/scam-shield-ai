import React from 'react';
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  BookOpen,
  Briefcase,
  Home,
  Code2,
  ScanLine,
  Lock,
  Unlock,
} from 'lucide-react';
import { VerificationMode } from '../types';

interface NavbarProps {
  mode: VerificationMode;
  onSelectMode: (mode: VerificationMode) => void;
  activeView: 'scanner' | 'tests';
  onSelectView: (view: 'scanner' | 'tests') => void;
  enablePiiShield: boolean;
  onTogglePiiShield: () => void;
  piiScrubbedCount: number;
  onOpenMatrix: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  mode,
  onSelectMode,
  activeView,
  onSelectView,
  enablePiiShield,
  onTogglePiiShield,
  piiScrubbedCount,
  onOpenMatrix,
}) => {
  return (
    <header
      id="scamguard-navbar"
      className="bg-slate-900/95 border-b border-slate-800 sticky top-0 z-30 backdrop-blur-md"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
        {/* Brand identity */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-sm shadow-emerald-950">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-100 tracking-tight text-base sm:text-lg">
                ScamGuard <span className="text-emerald-400 font-mono text-sm">AI</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-emerald-950/70 text-emerald-300 border border-emerald-700/50">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Defense Active
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              Phishing & Contract Fraud Scanner
            </p>
          </div>
        </div>

        {/* Center: View Switcher (Scanner Dashboard vs Developer Test Suite) */}
        <div className="hidden md:flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            id="view-scanner-btn"
            type="button"
            onClick={() => onSelectView('scanner')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              activeView === 'scanner'
                ? 'bg-slate-850 bg-slate-800 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ScanLine className="w-3.5 h-3.5 text-emerald-400" />
            <span>Scanner Dashboard</span>
          </button>
          <button
            id="view-testsuite-btn"
            type="button"
            onClick={() => onSelectView('tests')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
              activeView === 'tests'
                ? 'bg-slate-850 bg-slate-800 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code2 className="w-3.5 h-3.5 text-sky-400" />
            <span>Developer / Test Suite</span>
          </button>
        </div>

        {/* Right Controls: Mode Toggle, Privacy Shield Switch, Matrix Modal */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mode Switch: Job Offer vs Rental Listing */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              id="mode-job-btn"
              type="button"
              onClick={() => onSelectMode('job')}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg transition-all ${
                mode === 'job'
                  ? 'bg-emerald-600/90 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Job Offer & Employment Contract Verification"
            >
              <Briefcase className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Job Offer</span>
            </button>
            <button
              id="mode-rental-btn"
              type="button"
              onClick={() => onSelectMode('rental')}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg transition-all ${
                mode === 'rental'
                  ? 'bg-emerald-600/90 text-white shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Rental Listing & Sublease Agreement Verification"
            >
              <Home className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Rental Listing</span>
            </button>
          </div>

          {/* Privacy Shield Switch (Client-side PII Scrubbing) */}
          <button
            id="pii-shield-toggle-btn"
            type="button"
            onClick={onTogglePiiShield}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
              enablePiiShield
                ? 'bg-emerald-950/40 border-emerald-700/60 text-emerald-300'
                : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
            title="Toggle Client-Side PII Scrubbing (Auto-masks SSN, Phone, Bank details)"
          >
            {enablePiiShield ? (
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Unlock className="w-3.5 h-3.5 text-slate-500" />
            )}
            <span className="hidden md:inline">PII Shield</span>
            <span
              className={`w-2 h-2 rounded-full ${
                enablePiiShield ? 'bg-emerald-400 shadow-xs shadow-emerald-400' : 'bg-slate-600'
              }`}
            />
          </button>

          {/* Scoring Matrix Modal Button */}
          <button
            id="threat-matrix-modal-btn"
            type="button"
            onClick={onOpenMatrix}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium text-slate-300 bg-slate-850 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
            title="View Threat Index Matrix & Weights"
          >
            <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden lg:inline">Matrix</span>
          </button>
        </div>
      </div>

      {/* Mobile Sub-Navbar for View Switching */}
      <div className="md:hidden px-4 py-2 border-t border-slate-800/80 bg-slate-950 flex items-center justify-center gap-2">
        <button
          type="button"
          onClick={() => onSelectView('scanner')}
          className={`flex-1 py-1.5 text-xs font-medium rounded-lg text-center transition-all ${
            activeView === 'scanner'
              ? 'bg-slate-800 text-white'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Scanner Dashboard
        </button>
        <button
          type="button"
          onClick={() => onSelectView('tests')}
          className={`flex-1 py-1.5 text-xs font-medium rounded-lg text-center transition-all ${
            activeView === 'tests'
              ? 'bg-slate-800 text-white'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Developer / Test Suite
        </button>
      </div>
    </header>
  );
};
