import React from 'react';
import { X, ShieldAlert, Award, CheckCircle } from 'lucide-react';

interface ThreatMatrixModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ThreatMatrixModal: React.FC<ThreatMatrixModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-100">
                Scam Threat Index (STI) Scoring Matrix
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Cybersecurity Evaluation Weights (0 - 100)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Weights Table */}
        <div className="space-y-4 text-xs">
          <div>
            <h4 className="font-semibold text-slate-200 mb-2">
              Weighted Threat Signal Attribution:
            </h4>
            <div className="border border-slate-800 rounded-lg overflow-hidden font-mono">
              <table className="w-full text-left">
                <thead className="bg-slate-950 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="p-2.5">Threat Signal Category</th>
                    <th className="p-2.5">Weight</th>
                    <th className="p-2.5">Example Vectors</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-slate-300">
                  <tr>
                    <td className="p-2.5 font-sans font-medium text-rose-400">
                      Upfront Payment / Wire Demands
                    </td>
                    <td className="p-2.5 text-rose-400 font-bold">+35 pts</td>
                    <td className="p-2.5 text-slate-400">
                      Cashier check overpayment, Zelle, Bitcoin, fake equipment vendor
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-sans font-medium text-orange-400">
                      Domain / Email Anomaly
                    </td>
                    <td className="p-2.5 text-orange-400 font-bold">+25 pts</td>
                    <td className="p-2.5 text-slate-400">
                      Free webmail (@fastmail, @gmail), lookalike hyphenated domains
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-sans font-medium text-amber-400">
                      High Urgency / Pressure Tactics
                    </td>
                    <td className="p-2.5 text-amber-400 font-bold">+15 pts</td>
                    <td className="p-2.5 text-slate-400">
                      24h/12h countdowns, "secure spot", manufactured scarcity
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-sans font-medium text-purple-400">
                      Off-Platform Migration
                    </td>
                    <td className="p-2.5 text-purple-400 font-bold">+15 pts</td>
                    <td className="p-2.5 text-slate-400">
                      Telegram handles, WhatsApp redirects, personal Skype interviews
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-sans font-medium text-sky-400">
                      Linguistic & Formatting Flags
                    </td>
                    <td className="p-2.5 text-sky-400 font-bold">+10 pts</td>
                    <td className="p-2.5 text-slate-400">
                      Generic "Dear Applicant", odd overseas story, secrecy mandates
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Threat Level Mapping */}
          <div>
            <h4 className="font-semibold text-slate-200 mb-2">
              Threat Level Severity Mapping:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 font-mono text-center text-xs">
              <div className="p-2.5 rounded-lg bg-emerald-950/40 border border-emerald-800 text-emerald-300">
                <div className="font-bold">0 – 19</div>
                <div className="text-[11px] font-sans">Safe</div>
              </div>
              <div className="p-2.5 rounded-lg bg-sky-950/40 border border-sky-800 text-sky-300">
                <div className="font-bold">20 – 39</div>
                <div className="text-[11px] font-sans">Low Risk</div>
              </div>
              <div className="p-2.5 rounded-lg bg-amber-950/40 border border-amber-800 text-amber-300">
                <div className="font-bold">40 – 59</div>
                <div className="text-[11px] font-sans">Moderate</div>
              </div>
              <div className="p-2.5 rounded-lg bg-orange-950/40 border border-orange-800 text-orange-300">
                <div className="font-bold">60 – 79</div>
                <div className="text-[11px] font-sans">High Risk</div>
              </div>
              <div className="p-2.5 rounded-lg bg-rose-950/40 border border-rose-800 text-rose-300">
                <div className="font-bold">80 – 100</div>
                <div className="text-[11px] font-sans">Critical</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium rounded-lg text-xs transition-colors"
          >
            Close Matrix
          </button>
        </div>
      </div>
    </div>
  );
};
