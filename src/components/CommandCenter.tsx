import React, { useState, useEffect } from 'react';
import {
  CHOKEPOINTS,
  REFINERIES,
  SPR_FACILITIES,
  INITIAL_VESSELS
} from '../data/energyInfrastructure';
import { AgentEngineService } from '../services/agentEngine';
import { GeospatialMap } from './GeospatialMap';
import { AgentFeedPanel } from './AgentFeedPanel';
import { ProcurementPlaybookModal } from './ProcurementPlaybookModal';
import { ExecutiveDeckModal } from './ExecutiveDeckModal';
import { RefineriesPage } from './RefineriesPage';
import { SprPage } from './SprPage';
import { PlaybooksPage } from './PlaybooksPage';
import {
  ShieldAlert,
  Activity,
  Zap,
  CheckCircle2,
  Database,
  Play,
  RotateCcw,
  Presentation,
  Sparkles,
  Map,
  Layers,
  FileText,
  AlertTriangle,
  Globe,
  Radio,
  ExternalLink,
  Wifi
} from 'lucide-react';
import { ProcurementRecommendation, RiskIntelligenceOutput, LiveThreatSignal } from '../types';

export const CommandCenter: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'MAP' | 'REFINERIES' | 'SPR' | 'PLAYBOOKS'>('MAP');
  const [activeScenario, setActiveScenario] = useState<string>('BASE_LINE');
  const [riskData, setRiskData] = useState<RiskIntelligenceOutput>(() => AgentEngineService.calculateRiskIntelligence());
  const [simData, setSimData] = useState(() => AgentEngineService.simulateDisruptionScenario('BASE_LINE'));
  const [playbook, setPlaybook] = useState<ProcurementRecommendation | null>(null);
  const [sprAdvice, setSprAdvice] = useState(() => AgentEngineService.optimizeSprDrawdown(450000));
  const [agentLogs, setAgentLogs] = useState(() => AgentEngineService.generateInitialAgentLogs());
  
  const [showPlaybookModal, setShowPlaybookModal] = useState(false);
  const [showDeckModal, setShowDeckModal] = useState(false);
  const [isExecuted, setIsExecuted] = useState(false);
  const [isScanningLive, setIsScanningLive] = useState(false);
  const [liveSignals, setLiveSignals] = useState<LiveThreatSignal[]>([]);
  const [scanSourceCount, setScanSourceCount] = useState(0);
  const [lastScanTime, setLastScanTime] = useState<string | null>(null);

  // Scan live threat signals from internet APIs (GDELT, ReliefWeb, Wikipedia, RSS)
  const handleLiveThreatScan = async () => {
    setIsScanningLive(true);
    const { risk, liveSignals: signals } = await AgentEngineService.getLiveRiskIntelligence(activeScenario);
    setRiskData(risk);
    setLiveSignals(signals);
    setLastScanTime(new Date().toLocaleTimeString());

    // Count unique API sources that returned data
    const uniqueSources = new Set(signals.map(s => s.apiProvider));
    setScanSourceCount(uniqueSources.size);

    setIsScanningLive(false);

    // Generate detailed per-source agent logs
    const newLogId = `${Date.now()}`;
    const gdeltCount = signals.filter(s => s.apiProvider === 'GDELT Project').length;
    const rwCount = signals.filter(s => s.apiProvider === 'ReliefWeb (UN OCHA)').length;
    const wikiCount = signals.filter(s => s.apiProvider === 'Wikipedia').length;
    const rssCount = signals.filter(s => s.apiProvider.startsWith('RSS')).length;
    const criticalCount = signals.filter(s => s.severity === 'CRITICAL').length;
    const highCount = signals.filter(s => s.severity === 'HIGH').length;

    const newLogs = [
      ...agentLogs,
      {
        id: `${newLogId}-sweep`,
        timestamp: new Date().toLocaleTimeString(),
        agentName: 'Radar Agent' as const,
        agentColor: '#2563eb',
        message: `MULTI-SOURCE INTELLIGENCE SWEEP COMPLETE: Fetched ${signals.length} signals from ${uniqueSources.size}/4 live APIs. [GDELT: ${gdeltCount} | ReliefWeb: ${rwCount} | Wikipedia: ${wikiCount} | RSS: ${rssCount}]`,
        type: 'INFO' as const
      },
      ...(criticalCount > 0 ? [{
        id: `${newLogId}-critical`,
        timestamp: new Date().toLocaleTimeString(),
        agentName: 'Radar Agent' as const,
        agentColor: '#2563eb',
        message: `⚠ CRITICAL THREAT DETECTED: ${criticalCount} CRITICAL-severity and ${highCount} HIGH-severity signals identified. CVI recalculated to ${risk.overallCvi}/100. Confidence: ${(risk.confidenceScore * 100).toFixed(0)}%.`,
        type: 'WARNING' as const
      }] : []),
    ];
    setAgentLogs(newLogs);
  };

  // Handle Crisis Scenario Trigger
  const handleTriggerScenario = (scenarioKey: string) => {
    setActiveScenario(scenarioKey);
    setIsExecuted(false);

    const updatedRisk = AgentEngineService.calculateRiskIntelligence(scenarioKey);
    const updatedSim = AgentEngineService.simulateDisruptionScenario(scenarioKey);
    const updatedPlaybook = AgentEngineService.generateProcurementPlaybook(scenarioKey);
    const updatedSpr = AgentEngineService.optimizeSprDrawdown(updatedSim.delayedCrudeVolumeBpd * 0.3);

    setRiskData(updatedRisk);
    setSimData(updatedSim);
    setPlaybook(updatedPlaybook);
    setSprAdvice(updatedSpr);

    // Append new logs to agent stream
    const newLogId = `${Date.now()}`;
    const newLogs = [
      ...agentLogs,
      {
        id: `${newLogId}-1`,
        timestamp: new Date().toLocaleTimeString(),
        agentName: 'Radar Agent' as const,
        agentColor: '#2563eb',
        message: `CRISIS EVENT TRIGGERED: ${updatedSim.scenarioTitle}. Corridor Vulnerability Index recalculated to ${updatedRisk.overallCvi}/100.`,
        type: 'WARNING' as const
      },
      {
        id: `${newLogId}-2`,
        timestamp: new Date().toLocaleTimeString(),
        agentName: 'Sandbox Modeller' as const,
        agentColor: '#d97706',
        message: `GNN propagation: Delayed crude volume estimated at ${(updatedSim.delayedCrudeVolumeBpd / 1000000).toFixed(2)}M bpd across ${updatedSim.affectedTankersCount} tankers.`,
        type: 'ACTION' as const
      },
      {
        id: `${newLogId}-3`,
        timestamp: new Date().toLocaleTimeString(),
        agentName: 'Action Engine' as const,
        agentColor: '#16a34a',
        message: `Knowledge Graph Solver: Auto-generated Playbook ${updatedPlaybook.playbookId} rerouting to ${updatedPlaybook.recommendedSupplier}.`,
        type: 'OPTIMIZATION' as const
      }
    ];
    setAgentLogs(newLogs);
  };

  const handleReset = () => {
    setActiveScenario('BASE_LINE');
    setIsExecuted(false);
    setRiskData(AgentEngineService.calculateRiskIntelligence());
    setSimData(AgentEngineService.simulateDisruptionScenario('BASE_LINE'));
    setPlaybook(null);
    setSprAdvice(AgentEngineService.optimizeSprDrawdown(450000));
  };

  const handleExecutePlaybook = () => {
    setIsExecuted(true);
    setShowPlaybookModal(false);

    if (playbook) {
      setPlaybook({ ...playbook, status: 'EXECUTED' });
    }

    setAgentLogs(prev => [
      ...prev,
      {
        id: `${Date.now()}`,
        timestamp: new Date().toLocaleTimeString(),
        agentName: 'Action Engine',
        agentColor: '#16a34a',
        message: `EXECUTION CONFIRMED: Order dispatched to Indian Oil Trading Desk. Rerouted supply active. Stabilization lag reduced to <4 days!`,
        type: 'OPTIMIZATION'
      }
    ]);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans p-4 space-y-4">
      
      {/* Top War Room Command Bar */}
      <header className="bg-white border border-chakra-border rounded-xl px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-chakra-accent shadow-sm">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-bold tracking-tight text-slate-900 font-mono">
                PROJECT CHAKRA
              </h1>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200">
                ACTIVE MONITOR
              </span>
            </div>
            <p className="text-xs font-mono text-slate-500">
              Cognitive Heuristic for Anticipatory Knowledge & Resilience in Energy
            </p>
          </div>
        </div>

        {/* Global Live Indicators */}
        <div className="flex items-center space-x-6 font-mono text-xs">
          <div className="bg-slate-50 border border-chakra-border px-3 py-1.5 rounded-lg text-center shadow-inner">
            <span className="text-[10px] text-slate-500 block uppercase">CORRIDOR RISK (CVI)</span>
            <span className={`text-base font-bold ${riskData.overallCvi > 80 ? 'text-red-600' : 'text-amber-600'}`}>
              {riskData.overallCvi}/100
            </span>
          </div>

          <div className="bg-slate-50 border border-chakra-border px-3 py-1.5 rounded-lg text-center shadow-inner">
            <span className="text-[10px] text-slate-500 block uppercase">INDIA SPR COVER</span>
            <span className="text-base font-bold text-slate-800">9.5 DAYS</span>
          </div>

          <button
            onClick={handleLiveThreatScan}
            disabled={isScanningLive}
            className={`px-4 py-2 rounded-lg text-xs font-bold border transition flex items-center space-x-2 shadow-sm ${
              isScanningLive ? 'bg-slate-100 text-slate-400 border-slate-300' : 'bg-blue-50 text-blue-700 border-blue-300 hover:bg-blue-100'
            }`}
          >
            <Activity className={`w-4 h-4 ${isScanningLive ? 'animate-spin' : ''}`} />
            <span>{isScanningLive ? 'SCANNING INTERNET FEEDS...' : 'SCAN LIVE CONFLICTS'}</span>
          </button>

          <button
            onClick={() => setShowDeckModal(true)}
            className="px-4 py-2 rounded-lg text-xs font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 flex items-center space-x-2 shadow-sm transition"
          >
            <Presentation className="w-4 h-4 text-chakra-accent" />
            <span>EXECUTIVE DECK</span>
          </button>
        </div>
      </header>

      {/* Tabs Navigation Bar */}
      <nav className="flex items-center space-x-2 bg-white border border-chakra-border rounded-xl p-1.5 shadow-sm font-mono text-xs">
        <button
          onClick={() => setActiveTab('MAP')}
          className={`px-4 py-2 rounded-lg font-bold flex items-center space-x-2 transition ${
            activeTab === 'MAP' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Map className="w-4 h-4" />
          <span>GEOSPATIAL DIGITAL TWIN</span>
        </button>

        <button
          onClick={() => setActiveTab('REFINERIES')}
          className={`px-4 py-2 rounded-lg font-bold flex items-center space-x-2 transition ${
            activeTab === 'REFINERIES' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>REFINERY ASSAYS</span>
        </button>

        <button
          onClick={() => setActiveTab('SPR')}
          className={`px-4 py-2 rounded-lg font-bold flex items-center space-x-2 transition ${
            activeTab === 'SPR' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>STRATEGIC RESERVES (SPR)</span>
        </button>

        <button
          onClick={() => setActiveTab('PLAYBOOKS')}
          className={`px-4 py-2 rounded-lg font-bold flex items-center space-x-2 transition ${
            activeTab === 'PLAYBOOKS' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>PLAYBOOKS LOG</span>
        </button>
      </nav>

      {/* Conditional Rendering of Pages */}
      <main className="space-y-4">
        {activeTab === 'MAP' && (
          <>
            {/* Interactive Crisis Scenario Injector Bar */}
            <section className="bg-white border border-chakra-border rounded-xl p-4 flex items-center justify-between font-mono shadow-sm">
              <div className="flex items-center space-x-3">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <div>
                  <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    REAL-TIME DISRUPTION SIMULATION SANDBOX
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    Inject live geopolitical crisis triggers to evaluate autonomous multi-agent response:
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  onClick={() => handleTriggerScenario('HORMUZ_CLOSURE')}
                  className={`px-3.5 py-2 rounded-lg text-xs font-bold border transition flex items-center space-x-2 ${
                    activeScenario === 'HORMUZ_CLOSURE'
                      ? 'bg-red-600 text-white border-red-500 shadow-sm'
                      : 'bg-slate-50 text-red-700 border-red-200 hover:border-red-400'
                  }`}
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Hormuz Blockade (48h)</span>
                </button>

                <button
                  onClick={() => handleTriggerScenario('RED_SEA_ESCALATION')}
                  className={`px-3.5 py-2 rounded-lg text-xs font-bold border transition flex items-center space-x-2 ${
                    activeScenario === 'RED_SEA_ESCALATION'
                      ? 'bg-amber-600 text-white border-amber-400 shadow-sm'
                      : 'bg-slate-50 text-amber-700 border-amber-200 hover:border-amber-400'
                  }`}
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Red Sea Missile Attacks</span>
                </button>

                <button
                  onClick={() => handleTriggerScenario('OPEC_CUT')}
                  className={`px-3.5 py-2 rounded-lg text-xs font-bold border transition flex items-center space-x-2 ${
                    activeScenario === 'OPEC_CUT'
                      ? 'bg-purple-600 text-white border-purple-400 shadow-sm'
                      : 'bg-slate-50 text-purple-700 border-purple-200 hover:border-purple-400'
                  }`}
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>OPEC+ Emergency Cut</span>
                </button>

                <button
                  onClick={handleReset}
                  className="p-2 rounded-lg bg-slate-50 border border-slate-300 text-slate-500 hover:text-slate-700 transition"
                  title="Reset Simulation"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </section>

            {/* Map Grid */}
            <div className="grid grid-cols-3 gap-4">
              <div className="col-span-2">
                <GeospatialMap
                  chokepoints={CHOKEPOINTS}
                  refineries={REFINERIES}
                  sprFacilities={SPR_FACILITIES}
                  vessels={INITIAL_VESSELS}
                  activeScenario={activeScenario}
                />
              </div>
              <div className="col-span-1">
                <AgentFeedPanel
                  logs={agentLogs}
                  overallCvi={riskData.overallCvi}
                />
              </div>
            </div>

            {/* ═══ LIVE THREAT INTELLIGENCE FEED ═══ */}
            {liveSignals.length > 0 && (
              <div className="bg-white border border-chakra-border rounded-xl shadow-sm overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-slate-50">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Globe className="w-5 h-5 text-red-600" />
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse border border-white"></span>
                    </div>
                    <div>
                      <h3 className="text-xs font-mono font-bold text-slate-800 uppercase tracking-wider">
                        LIVE THREAT INTELLIGENCE FEED
                      </h3>
                      <p className="text-[10px] text-slate-500 font-mono">
                        {liveSignals.length} signals from {scanSourceCount} live internet APIs • Last scan: {lastScanTime}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {['GDELT Project', 'ReliefWeb (UN OCHA)', 'Wikipedia', 'RSS'].map(src => {
                      const hasData = liveSignals.some(s => s.apiProvider.includes(src.split(' ')[0]));
                      return (
                        <span key={src} className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold border ${
                          hasData
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-slate-100 text-slate-400 border-slate-200'
                        }`}>
                          <Wifi className="w-2.5 h-2.5 inline mr-0.5" />
                          {src.split(' ')[0].split('(')[0]}
                        </span>
                      );
                    })}
                  </div>
                </div>

                <div className="max-h-[280px] overflow-y-auto divide-y divide-slate-100">
                  {liveSignals.map((signal) => (
                    <div key={signal.id} className="px-4 py-3 hover:bg-slate-50 transition flex items-start gap-3 font-mono text-xs">
                      {/* Severity Indicator */}
                      <div className="flex flex-col items-center pt-0.5 shrink-0">
                        <span className={`w-2.5 h-2.5 rounded-full ${
                          signal.severity === 'CRITICAL' ? 'bg-red-600 animate-pulse' :
                          signal.severity === 'HIGH' ? 'bg-amber-500' :
                          signal.severity === 'MEDIUM' ? 'bg-yellow-400' : 'bg-slate-300'
                        }`}></span>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0 space-y-1.5">
                        <p className="text-slate-800 leading-relaxed text-[11px]">
                          {signal.headline}
                        </p>
                        <div className="flex flex-wrap items-center gap-2">
                          {/* Severity badge */}
                          <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold border ${
                            signal.severity === 'CRITICAL' ? 'bg-red-50 text-red-700 border-red-200' :
                            signal.severity === 'HIGH' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                            signal.severity === 'MEDIUM' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                            'bg-slate-50 text-slate-500 border-slate-200'
                          }`}>
                            {signal.severity}
                          </span>
                          {/* API Source */}
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                            {signal.apiProvider}
                          </span>
                          {/* Region */}
                          <span className="px-1.5 py-0.5 rounded text-[9px] bg-slate-100 text-slate-600 border border-slate-200">
                            {signal.region}
                          </span>
                          {/* Source name */}
                          <span className="text-[9px] text-slate-400">
                            via {signal.source}
                          </span>
                        </div>
                      </div>

                      {/* Metrics */}
                      <div className="shrink-0 text-right space-y-1">
                        <div className={`text-xs font-bold ${
                          signal.cviDelta >= 12 ? 'text-red-600' :
                          signal.cviDelta >= 6 ? 'text-amber-600' : 'text-slate-600'
                        }`}>
                          +{signal.cviDelta.toFixed(1)} CVI
                        </div>
                        <div className="text-[9px] text-slate-400">
                          Relevance: {signal.energyRelevance}%
                        </div>
                        {signal.url && (
                          <a
                            href={signal.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[9px] text-blue-600 hover:text-blue-800 flex items-center justify-end gap-0.5"
                          >
                            Source <ExternalLink className="w-2.5 h-2.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Feed Footer */}
                <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[10px] font-mono text-slate-500">
                  <span>
                    Aggregated CVI Impact: <strong className="text-red-600">
                      +{liveSignals.reduce((sum, s) => sum + s.cviDelta, 0).toFixed(1)}
                    </strong> from {liveSignals.length} signals
                  </span>
                  <span>
                    Avg. Energy Relevance: <strong className="text-blue-700">
                      {Math.round(liveSignals.reduce((sum, s) => sum + s.energyRelevance, 0) / liveSignals.length)}%
                    </strong>
                  </span>
                </div>
              </div>
            )}

            {/* Bottom Row */}
            <div className="grid grid-cols-3 gap-4 font-mono">
              <div className="col-span-2 bg-white border border-chakra-border rounded-xl p-4 shadow-sm space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-chakra-border/60">
                  <div className="flex items-center space-x-2">
                    <Activity className="w-4 h-4 text-amber-500" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                      SANDBOX MODELLER // CASCADING ECONOMIC IMPACTS
                    </h3>
                  </div>
                  <span className="text-[11px] text-slate-500">
                    Scenario: <strong className="text-amber-600">{simData.scenarioTitle}</strong>
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-3 pt-1">
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                    <div className="text-[10px] text-slate-500 uppercase">Supply Delay</div>
                    <div className="text-base font-bold text-red-600">
                      {(simData.delayedCrudeVolumeBpd / 1000000).toFixed(2)}M bpd
                    </div>
                    <div className="text-[9px] text-slate-400">{simData.affectedTankersCount} Tankers</div>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                    <div className="text-[10px] text-slate-500 uppercase">Jamnagar CDU</div>
                    <div className="text-base font-bold text-amber-600">
                      -18.5% Run Rate
                    </div>
                    <div className="text-[9px] text-slate-400">Assay Deficit</div>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                    <div className="text-[10px] text-slate-500 uppercase">Diesel Spike</div>
                    <div className="text-base font-bold text-red-600">
                      +₹{simData.economicImpact.domesticDieselPriceSpikeInr.toFixed(2)}/L
                    </div>
                    <div className="text-[9px] text-slate-400">Retail Premium</div>
                  </div>

                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                    <div className="text-[10px] text-slate-500 uppercase">Quarterly GDP</div>
                    <div className="text-base font-bold text-amber-600">
                      -{simData.economicImpact.projectedQuarterlyGdpDipPercent}%
                    </div>
                    <div className="text-[9px] text-slate-400">Baseline Delta</div>
                  </div>
                </div>
              </div>

              <div className="col-span-1 bg-white border border-emerald-500/30 rounded-xl p-4 shadow-sm flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-emerald-600">
                    <CheckCircle2 className="w-4 h-4" />
                    <h3 className="text-xs font-bold uppercase tracking-wider">
                      ACTION PLAYBOOK GENERATOR
                    </h3>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {playbook
                      ? `Reroutes ${playbook.volumeBpd.toLocaleString()} bpd to ${playbook.recommendedSupplier}.`
                      : 'Click below to launch the optimization solver.'}
                  </p>
                </div>

                <div className="pt-3">
                  {isExecuted ? (
                    <div className="w-full py-2.5 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-700 font-bold text-xs flex items-center justify-center space-x-2 shadow-sm">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>ORDER APPROVED & EXECUTION QUEUED</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        if (!playbook) {
                          const pb = AgentEngineService.generateProcurementPlaybook(activeScenario);
                          setPlaybook(pb);
                        }
                        setShowPlaybookModal(true);
                      }}
                      className="w-full py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 border border-emerald-400 text-white font-bold text-xs shadow-md flex items-center justify-center space-x-2 transition"
                    >
                      <Zap className="w-4 h-4 fill-current" />
                      <span>VIEW EXECUTABLE PLAYBOOK</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'REFINERIES' && <RefineriesPage />}
        {activeTab === 'SPR' && <SprPage />}
        {activeTab === 'PLAYBOOKS' && <PlaybooksPage playbook={playbook} isExecuted={isExecuted} />}
      </main>

      {/* Modals */}
      {showPlaybookModal && (
        <ProcurementPlaybookModal
          playbook={playbook}
          sprAdvice={sprAdvice}
          onClose={() => setShowPlaybookModal(false)}
          onExecute={handleExecutePlaybook}
        />
      )}

      {showDeckModal && (
        <ExecutiveDeckModal onClose={() => setShowDeckModal(false)} />
      )}

    </div>
  );
};
