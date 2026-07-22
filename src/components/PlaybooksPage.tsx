import React from 'react';
import { ProcurementRecommendation } from '../types';
import { FileText, CheckCircle2, AlertTriangle, Play, Check } from 'lucide-react';

interface PlaybooksPageProps {
  playbook: ProcurementRecommendation | null;
  isExecuted: boolean;
}

export const PlaybooksPage: React.FC<PlaybooksPageProps> = ({ playbook, isExecuted }) => {
  // Sample historical playbook entries
  const playbooks = [
    {
      id: 'PLAYBOOK-7410',
      timestamp: '14:50:41',
      refinery: 'Reliance Jamnagar Mega Refinery',
      supplier: 'Basra Oil Terminal (Iraq)',
      altSupplier: 'Bonny Offshore (Nigeria)',
      volume: '150,000 bpd',
      costPremium: '+$3.40/bbl',
      reduction: '86.4%',
      status: isExecuted ? 'EXECUTED' : 'PENDING_APPROVAL'
    },
    {
      id: 'PLAYBOOK-2180',
      timestamp: '11:22:15',
      refinery: 'MRPL Mangalore Refinery',
      supplier: 'Ras Tanura (Saudi Arabia)',
      altSupplier: 'Santos Basin (Brazil)',
      volume: '80,000 bpd',
      costPremium: '+$2.10/bbl',
      reduction: '74.2%',
      status: 'EXECUTED'
    },
    {
      id: 'PLAYBOOK-9014',
      timestamp: '09:12:04',
      refinery: 'HPCL Visakhapatnam Refinery',
      supplier: 'Basra Oil Terminal (Iraq)',
      altSupplier: 'Santos Basin (Brazil)',
      volume: '100,000 bpd',
      costPremium: '+$1.80/bbl',
      reduction: '82.1%',
      status: 'ARCHIVED'
    }
  ];

  return (
    <div className="space-y-6 font-mono">
      {/* Overview Banner */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center space-x-2">
            <FileText className="w-4.5 h-4.5 text-emerald-600" />
            <span>Procurement Rerouting Playbooks & Execution Log</span>
          </h2>
          <p className="text-xs text-slate-500">
            Audit history of active, executed, and archived supply chain resilience recommendations.
          </p>
        </div>
        <span className="text-[11px] bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded border border-emerald-100 font-bold">
          3 TOTAL LOGS
        </span>
      </div>

      {/* Playbooks Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse text-xs text-slate-700">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold text-[10px] uppercase">
              <th className="p-3">Playbook ID</th>
              <th className="p-3">Timestamp</th>
              <th className="p-3">Target Refinery</th>
              <th className="p-3">Alternative Supplier</th>
              <th className="p-3">Volume (bpd)</th>
              <th className="p-3">Cost Premium</th>
              <th className="p-3">Risk Reduction</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-mono">
            {playbooks.map(pb => (
              <tr key={pb.id} className="hover:bg-slate-50">
                <td className="p-3 font-bold text-blue-600">{pb.id}</td>
                <td className="p-3 text-slate-400">{pb.timestamp}</td>
                <td className="p-3 font-semibold text-slate-800">{pb.refinery}</td>
                <td className="p-3">
                  <span className="text-red-600 line-through mr-1">{pb.supplier}</span>
                  <span className="text-emerald-700">→ {pb.altSupplier}</span>
                </td>
                <td className="p-3 font-bold">{pb.volume}</td>
                <td className="p-3 text-red-600">{pb.costPremium}</td>
                <td className="p-3 text-emerald-700 font-bold">-{pb.reduction}</td>
                <td className="p-3">
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${
                    pb.status === 'EXECUTED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                    pb.status === 'PENDING_APPROVAL' ? 'bg-yellow-50 text-yellow-700 border-yellow-200 animate-pulse' :
                    'bg-slate-100 text-slate-500 border-slate-200'
                  }`}>
                    {pb.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
