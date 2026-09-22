import React, { useState } from 'react';
import {
  Terminal,
  CheckCircle2,
  XCircle,
  Play,
  RotateCcw,
  ShieldCheck,
  ShieldAlert,
  Cpu,
  Clock,
} from 'lucide-react';
import { runAllUnitTests } from '../services/testRunner';
import { TestSuiteResult } from '../types';

export const TestSuiteView: React.FC = () => {
  const [testResults, setTestResults] = useState<TestSuiteResult[]>(() =>
    runAllUnitTests()
  );
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const handleRunTests = () => {
    setIsRunning(true);
    setTimeout(() => {
      setTestResults(runAllUnitTests());
      setIsRunning(false);
    }, 400);
  };

  const totalAssertions = testResults.reduce(
    (acc, suite) => acc + suite.assertions.length,
    0
  );
  const passedAssertions = testResults.reduce(
    (acc, suite) =>
      acc + suite.assertions.filter((a) => a.passed).length,
    0
  );
  const allSuitesPassed = testResults.every((s) => s.allPassed);
  const totalDuration = testResults.reduce((acc, s) => acc + s.durationMs, 0);

  return (
    <div id="test-suite-dashboard" className="space-y-6">
      {/* Header Summary Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div
            className={`p-3 rounded-xl border ${
              allSuitesPassed
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
            }`}
          >
            <Terminal className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-semibold text-slate-100">
                Automated Security Test Suite
              </h2>
              <span
                className={`px-2 py-0.5 rounded-full text-[11px] font-mono font-bold uppercase border ${
                  allSuitesPassed
                    ? 'bg-emerald-950/60 text-emerald-300 border-emerald-700/50'
                    : 'bg-rose-950/60 text-rose-300 border-rose-700/50'
                }`}
              >
                {allSuitesPassed ? 'All Passing (100%)' : 'Failures Detected'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 font-mono">
              In-browser unit tests verifying PII regex sanitization, weighted scoring math, and domain parsing.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
          <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <strong className="text-slate-200">{passedAssertions}</strong> / {totalAssertions} asserts
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              {totalDuration} ms
            </span>
          </div>

          <button
            id="run-tests-btn"
            type="button"
            disabled={isRunning}
            onClick={handleRunTests}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 disabled:opacity-50 transition-colors shadow-sm"
          >
            {isRunning ? (
              <>
                <RotateCcw className="w-3.5 h-3.5 animate-spin" />
                <span>Executing Asserts...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Re-run Test Suite</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Test Suites Grid */}
      <div className="space-y-4">
        {testResults.map((suite) => (
          <div
            key={suite.id}
            className="bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden shadow-sm"
          >
            {/* Suite Header */}
            <div className="p-4 bg-slate-950/70 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                {suite.allPassed ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                )}
                <span className="text-sm font-semibold text-slate-200">
                  {suite.title}
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                  {suite.category}
                </span>
              </div>
              <span className="text-xs font-mono text-slate-500">
                {suite.durationMs} ms
              </span>
            </div>

            {/* Assertions List */}
            <div className="divide-y divide-slate-800/60 font-mono text-xs">
              {suite.assertions.map((assertion, idx) => (
                <div
                  key={idx}
                  className="p-3.5 hover:bg-slate-800/30 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          assertion.passed ? 'bg-emerald-400' : 'bg-rose-500'
                        }`}
                      />
                      <span className="text-slate-200 font-medium">
                        {assertion.name}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 pl-4">
                      <span className="text-slate-500">Expected: </span>
                      {assertion.expected}
                    </div>
                    {assertion.details && (
                      <div className="text-[11px] text-slate-500 pl-4 italic">
                        {assertion.details}
                      </div>
                    )}
                  </div>

                  <div className="sm:text-right pl-4 sm:pl-0 shrink-0">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold uppercase ${
                        assertion.passed
                          ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/60'
                          : 'bg-rose-950/60 text-rose-400 border border-rose-800/60'
                      }`}
                    >
                      {assertion.passed ? 'PASS' : 'FAIL'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
