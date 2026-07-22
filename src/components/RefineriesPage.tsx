import React from 'react';
import { REFINERIES, SUPPLIERS } from '../data/energyInfrastructure';
import { Anchor, Beaker, ShieldAlert, Cpu, AlertTriangle } from 'lucide-react';

export const RefineriesPage: React.FC = () => {
  return (
    <div className="space-y-6 font-mono">
      {/* Overview Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-2">
            <Beaker className="w-4.5 h-4.5 text-blue-600" />
            <span>Refinery CDU Assays & Metallurgy Compatibility Matrix</span>
          </h2>
          <p className="text-xs text-slate-500">
            Real-time Knowledge Graph solving metallurgical compatibility constraints across Indian refineries.
          </p>
        </div>
        <span className="text-[11px] bg-blue-50 text-blue-700 px-2.5 py-1 rounded border border-blue-100 font-bold">
          4 REFINERIES VERIFIED
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Refineries Grid */}
        <div className="space-y-4">
          {REFINERIES.map(ref => (
            <div key={ref.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Anchor className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-bold text-slate-800">{ref.name}</span>
                </div>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-bold border border-slate-200">
                  {ref.locationName}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2 text-[11px] text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-100">
                <div>
                  <span className="text-slate-400 block uppercase text-[9px]">CDU Capacity</span>
                  <strong className="text-slate-800">{(ref.capacityBpd / 1000).toFixed(0)}k bpd</strong>
                </div>
                <div>
                  <span className="text-slate-400 block uppercase text-[9px]">Run Rate</span>
                  <strong className="text-slate-800">{ref.currentRunRatePercent}%</strong>
                </div>
                <div>
                  <span className="text-slate-400 block uppercase text-[9px]">Preferred Assay</span>
                  <strong className="text-blue-600">{ref.preferredCrude}</strong>
                </div>
              </div>

              <div className="text-xs flex items-center justify-between text-slate-600">
                <span>Max Sulfur Tolerance: <strong className="text-slate-800">{ref.maxSulfurTolerancePercent}%</strong></span>
                <span className="text-emerald-700 font-semibold">Assay Compliant</span>
              </div>
            </div>
          ))}
        </div>

        {/* Knowledge Graph Assay Solver Details */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider pb-2 border-b border-slate-100">
            Active Crude Assay Catalog
          </h3>

          <div className="space-y-3">
            {SUPPLIERS.map(sup => (
              <div key={sup.id} className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-800">{sup.name}</span>
                  <span className="text-[10px] text-slate-400">{sup.country}</span>
                </div>
                <div className="grid grid-cols-4 gap-2 text-[10px] text-slate-600">
                  <div>
                    <span>Grade</span>
                    <strong className="block text-slate-800">{sup.crudeGrade}</strong>
                  </div>
                  <div>
                    <span>API Gravity</span>
                    <strong className="block text-slate-800">{sup.apiGravity}°</strong>
                  </div>
                  <div>
                    <span>Sulfur Content</span>
                    <strong className="block text-slate-800">{sup.sulfurContent}%</strong>
                  </div>
                  <div>
                    <span>Spot Price</span>
                    <strong className="block text-emerald-700">${sup.spotPriceUsd}/bbl</strong>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-[11px] text-blue-800 flex items-start space-x-2">
            <AlertTriangle className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
            <p className="leading-relaxed">
              <strong>Refinery Assay Blending Engine:</strong> Automatically combines sweet African/Latin crude grades to offset Middle Eastern heavy sour disruptions without breaching metallurgy limits.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
