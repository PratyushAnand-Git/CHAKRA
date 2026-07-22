import React from 'react';
import { SPR_FACILITIES } from '../data/energyInfrastructure';
import { Database, ShieldAlert, Cpu, AlertTriangle, TrendingDown } from 'lucide-react';

export const SprPage: React.FC = () => {
  return (
    <div className="space-y-6 font-mono">
      {/* Overview Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-2">
            <Database className="w-4.5 h-4.5 text-yellow-600" />
            <span>Strategic Petroleum Reserves (SPR) Shock Absorber</span>
          </h2>
          <p className="text-xs text-slate-500">
            Monitors national SPR caverns inventory, drawdown capacities, and replenishment window curves.
          </p>
        </div>
        <div className="text-right">
          <span className="text-[11px] bg-yellow-50 text-yellow-800 border border-yellow-200 px-2.5 py-1 rounded font-bold">
            9.5 DAYS COVER
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* SPR Facilities Details */}
        <div className="col-span-2 space-y-4">
          <div className="grid grid-cols-3 gap-4">
            {SPR_FACILITIES.map(spr => {
              const fillPercent = Math.round((spr.currentLevelMillionBarrels / spr.capacityMillionBarrels) * 100);
              return (
                <div key={spr.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
                  <div className="flex items-center space-x-2 pb-1 border-b border-slate-100">
                    <Database className="w-4 h-4 text-yellow-600" />
                    <span className="text-xs font-bold text-slate-800">{spr.name}</span>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] text-slate-600">
                      <span>Cavern Fill Level:</span>
                      <strong className="text-slate-800">{fillPercent}%</strong>
                    </div>
                    {/* Fill bar */}
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
                      <div className="bg-yellow-500 h-full" style={{ width: `${fillPercent}%` }}></div>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-700 pt-1 space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Total Capacity:</span>
                      <strong>{spr.capacityMillionBarrels}M bbls</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Current Stock:</span>
                      <strong>{spr.currentLevelMillionBarrels}M bbls</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Max Drawdown:</span>
                      <strong>{(spr.maxDrawdownBpd / 1000).toFixed(0)}k bpd</strong>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Drawdown Simulation Output Panel */}
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-2">
              <TrendingDown className="w-4 h-4 text-red-600" />
              <span>Projected 7-Day Drawdown Depletion Schedule</span>
            </h3>
            <div className="grid grid-cols-7 gap-2 pt-2">
              {[1, 2, 3, 4, 5, 6, 7].map(day => (
                <div key={day} className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-center text-xs">
                  <span className="text-slate-400 block font-semibold">Day {day}</span>
                  <strong className="text-slate-800 block mt-1">450k bpd</strong>
                  <span className="text-[9px] text-slate-500">Remaining</span>
                  <span className="text-[10px] text-amber-600 font-bold block mt-0.5">32.2M</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Shock Absorber Policy Advisor */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider pb-2 border-b border-slate-100">
            SPR Shock Absorber Policy Board
          </h3>

          <div className="space-y-3">
            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs space-y-1.5">
              <span className="text-[10px] text-slate-400 uppercase font-mono">Replenishment window</span>
              <div className="text-sm font-bold text-slate-800">21 - 30 Days</div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Estimate to procure and transit replacement West African / South American crude tanker arrays.
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs space-y-1.5">
              <span className="text-[10px] text-slate-400 uppercase font-mono">Strategic Drawdown Limit</span>
              <div className="text-sm font-bold text-slate-800">950,000 bpd</div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                Maximum aggregate physical output capacity across Padur, Mangalore, and Visakhapatnam caverns.
              </p>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-[11px] text-yellow-800 flex items-start space-x-2">
            <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5 shrink-0" />
            <p className="leading-relaxed">
              <strong>Advisory Directive:</strong> Do not release reserves unconditionally. Utilize SPR drawdown solely to cover the 96-hour maritime transit gap of rerouted light/sweet Cape shipments.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
