import React from 'react';
import { AgentLogMessage } from '../types';
import { Terminal, Shield, Cpu, Activity, Zap } from 'lucide-react';

interface AgentFeedPanelProps {
  logs: AgentLogMessage[];
  overallCvi: number;
}

export const AgentFeedPanel: React.FC<AgentFeedPanelProps> = ({ logs, overallCvi }) => {
  return (
    <div className="bg-white border border-chakra-border rounded-xl p-4 flex flex-col h-[520px] shadow-sm">
      {/* Panel Header */}
      <div className="flex items-center justify-between pb-3 border-b border-chakra-border/60">
        <div className="flex items-center space-x-2">
          <Terminal className="w-4 h-4 text-chakra-accent" />
          <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-800">
            Multi-Agent Reasoning Stream
          </h3>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-[11px] font-mono text-emerald-700 font-semibold">4 AGENTS SYNCHRONIZED</span>
        </div>
      </div>

      {/* Agents Status Grid */}
      <div className="grid grid-cols-2 gap-2 my-3 font-mono">
        <div className="bg-slate-50 border border-slate-200 rounded p-2 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="w-3.5 h-3.5 text-blue-600" />
            <span className="text-[11px] text-slate-700 font-semibold">Radar Agent</span>
          </div>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-100 font-bold">CVI: {overallCvi}</span>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded p-2 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Activity className="w-3.5 h-3.5 text-amber-600" />
            <span className="text-[11px] text-slate-700 font-semibold">Sandbox</span>
          </div>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-100 font-bold">GNN ACTIVE</span>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded p-2 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Zap className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-[11px] text-slate-700 font-semibold">Action Engine</span>
          </div>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-100 font-bold">SOLVER RUN</span>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded p-2 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Cpu className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-[11px] text-slate-700 font-semibold">SPR Absorber</span>
          </div>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 font-bold">9.5d COVER</span>
        </div>
      </div>

      {/* Log Stream Terminal Container */}
      <div className="flex-1 bg-slate-50 border border-chakra-border rounded-lg p-3 overflow-y-auto font-mono text-xs space-y-2.5">
        {logs.map((log) => (
          <div key={log.id} className="flex flex-col space-y-1 pb-2 border-b border-slate-200 last:border-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-[10px] text-slate-400">[{log.timestamp}]</span>
                <span
                  className="text-[11px] font-bold px-1.5 py-0.2 rounded"
                  style={{ backgroundColor: `${log.agentColor}15`, color: log.agentColor }}
                >
                  {log.agentName}
                </span>
              </div>
              <span className={`text-[9px] px-1 rounded uppercase font-bold ${
                log.type === 'WARNING' ? 'text-amber-700 bg-amber-50 border border-amber-200' :
                log.type === 'OPTIMIZATION' ? 'text-emerald-700 bg-emerald-50 border border-emerald-200' :
                log.type === 'ACTION' ? 'text-blue-700 bg-blue-50 border border-blue-200' : 'text-slate-500 border border-slate-200'
              }`}>
                {log.type}
              </span>
            </div>
            <p className="text-slate-700 text-[11px] leading-relaxed pl-2 border-l-2 border-slate-300">
              {log.message}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
