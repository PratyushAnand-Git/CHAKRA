import React from 'react';
import { ProcurementRecommendation, SPROptimizationOutput } from '../types';
import { CheckCircle2, X, DollarSign, Clock, ShieldCheck, Beaker, AlertTriangle, Send } from 'lucide-react';

interface ProcurementPlaybookModalProps {
  playbook: ProcurementRecommendation | null;
  sprAdvice: SPROptimizationOutput | null;
  onClose: () => void;
  onExecute: () => void;
}

export const ProcurementPlaybookModal: React.FC<ProcurementPlaybookModalProps> = ({
  playbook,
  sprAdvice,
  onClose,
  onExecute
}) => {
  if (!playbook) return null;

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white border border-slate-300 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col font-sans">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-800 uppercase tracking-wide">
                PROCUREMENT REROUTING PLAYBOOK
              </h2>
              <p className="text-xs text-emerald-600 font-mono">
                ACTION SOLVER // ID: {playbook.playbookId}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          
          {/* Executive Summary Banner */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center justify-between">
            <div>
              <span className="text-xs font-mono font-bold text-emerald-700 uppercase tracking-wider">
                STRATEGIC RESILIENCE SUMMARY
              </span>
              <p className="text-sm text-slate-700 mt-1">
                Replaces high-risk <strong className="text-red-600">{playbook.originalSupplier}</strong> with <strong className="text-emerald-700">{playbook.recommendedSupplier}</strong> while maintaining <strong>{playbook.refineryAssayMatchScore}% refinery assay compatibility</strong> for {playbook.targetRefineryName}.
              </p>
            </div>
            <div className="text-right pl-4">
              <span className="text-2xl font-bold font-mono text-emerald-600">-{playbook.riskReductionPercent}%</span>
              <div className="text-[10px] text-slate-500 uppercase font-mono">Risk Reduction</div>
            </div>
          </div>

          {/* Key Metric Cards */}
          <div className="grid grid-cols-4 gap-4 font-mono">
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <div className="flex items-center space-x-2 text-slate-500 text-xs mb-1">
                <DollarSign className="w-4 h-4 text-emerald-600" />
                <span>Price Premium</span>
              </div>
              <div className="text-lg font-bold text-slate-800">+${playbook.costPremiumUsdPerBbl.toFixed(2)}/bbl</div>
              <div className="text-[10px] text-slate-400">Spot & Freight</div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <div className="flex items-center space-x-2 text-slate-500 text-xs mb-1">
                <Clock className="w-4 h-4 text-amber-600" />
                <span>Transit Delta</span>
              </div>
              <div className="text-lg font-bold text-slate-800">+{playbook.transitTimeDeltaDays} Days</div>
              <div className="text-[10px] text-slate-400">Cape Bypass Route</div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <div className="flex items-center space-x-2 text-slate-500 text-xs mb-1">
                <Beaker className="w-4 h-4 text-blue-600" />
                <span>Refinery Assay</span>
              </div>
              <div className="text-lg font-bold text-emerald-700">{playbook.refineryAssayMatchScore}% Match</div>
              <div className="text-[10px] text-slate-400">Sulfur & API</div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
              <div className="flex items-center space-x-2 text-slate-500 text-xs mb-1">
                <ShieldCheck className="w-4 h-4 text-chakra-accent" />
                <span>Stabilization</span>
              </div>
              <div className="text-lg font-bold text-chakra-accent">4 Days</div>
              <div className="text-[10px] text-emerald-600 font-semibold">vs 47d baseline</div>
            </div>
          </div>

          {/* Technical Deep-Dive */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
              <h3 className="text-xs font-mono font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-2">
                <Beaker className="w-4 h-4 text-blue-600 shrink-0" />
                <span>CRUDE BLENDING SPECIFICATION</span>
              </h3>
              <div className="text-xs text-slate-700 space-y-2 font-mono bg-white p-3 rounded-lg border border-slate-200">
                <div><span className="text-slate-400">Target Crude Grade:</span> <strong className="text-blue-700">{playbook.crudeGrade}</strong></div>
                <div><span className="text-slate-400">Volume Required:</span> <strong>{playbook.volumeBpd.toLocaleString()} bpd</strong></div>
                <div className="pt-2 border-t border-slate-100 text-emerald-700 text-[11px]">
                  <strong>Blending:</strong> {playbook.blendingStrategy}
                </div>
              </div>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
              <h3 className="text-xs font-mono font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-yellow-600 shrink-0" />
                <span>SPR DRAWDOWN AUTHORIZATION</span>
              </h3>
              <div className="text-xs text-slate-700 space-y-2 font-mono bg-white p-3 rounded-lg border border-slate-200">
                <div><span className="text-slate-400">Recommended Drawdown:</span> <strong className="text-yellow-600">{sprAdvice?.recommendedReleaseRateBpd.toLocaleString() || '450,000'} bpd</strong></div>
                <div><span className="text-slate-400">Buffer Cover:</span> <strong>{sprAdvice?.bufferDaysRemaining || 74} Days Remaining</strong></div>
                <div className="pt-2 border-t border-slate-100 text-yellow-700 text-[11px]">
                  <strong>Directive:</strong> {sprAdvice?.policyAdvice}
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50">
          <div className="text-xs font-mono text-slate-500">
            Total Landed Cost: <strong className="text-slate-800">${(playbook.financialImpactTotalUsdDay / 1000000).toFixed(2)}M USD/Day</strong>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-mono text-slate-500 hover:text-slate-800 border border-slate-300 hover:bg-slate-50 transition"
            >
              CANCEL
            </button>
            <button
              onClick={onExecute}
              className="px-5 py-2 rounded-lg text-xs font-mono font-bold text-white bg-emerald-600 hover:bg-emerald-500 border border-emerald-400 shadow-sm flex items-center space-x-2 transition"
            >
              <Send className="w-3.5 h-3.5" />
              <span>APPROVE & ROUTE ORDERS</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
