import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { AISVessel, Chokepoint, Refinery, StrategicReserveSPR } from '../types';
import { ShieldAlert, Anchor, Database, Radio, RefreshCw, PanelBottomOpen, X } from 'lucide-react';
import { AgentEngineService } from '../services/agentEngine';
import L from 'leaflet';

import 'leaflet/dist/leaflet.css';

// Fix Leaflet icons
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface GeospatialMapProps {
  chokepoints: Chokepoint[];
  refineries: Refinery[];
  sprFacilities: StrategicReserveSPR[];
  vessels: AISVessel[];
  activeScenario: string;
}

export const GeospatialMap: React.FC<GeospatialMapProps> = ({
  chokepoints,
  refineries,
  sprFacilities,
  vessels,
  activeScenario
}) => {
  const [selectedRefineryId, setSelectedRefineryId] = useState<string>('JAMNAGAR');
  const [selectedSupplierId, setSelectedSupplierId] = useState<string>('BASRA_IRAQ');
  
  // Solver Output State
  const [solverResult, setSolverResult] = useState<any>(null);
  const [isSolving, setIsSolving] = useState(false);
  const [showSolverPanel, setShowSolverPanel] = useState(true);

  // Recalculate routes and metrics when selections or scenarios transition
  useEffect(() => {
    const solveRoutes = async () => {
      setIsSolving(true);
      
      const avoidPoints: string[] = [];
      if (activeScenario === 'HORMUZ_CLOSURE') avoidPoints.push('HORMUZ');
      if (activeScenario === 'RED_SEA_ESCALATION') avoidPoints.push('BAB_EL_MANDEB');

      // Call AI routing & financial calculation service
      const result = AgentEngineService.queryDynamicAISolver(selectedSupplierId, selectedRefineryId, avoidPoints);
      
      // Simulate network request delay
      setTimeout(() => {
        setSolverResult(result);
        setIsSolving(false);
      }, 300);
    };
    solveRoutes();
  }, [selectedRefineryId, selectedSupplierId, activeScenario]);

  const centerPos: [number, number] = [18.0, 65.0];

  const createIcon = (color: string) => {
    return new L.Icon({
      iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      iconSize: [20, 32],
      iconAnchor: [10, 32],
      popupAnchor: [1, -34],
      shadowSize: [32, 32]
    });
  };

  return (
    <div className="relative w-full h-[580px] bg-slate-100 rounded-xl border border-slate-300 overflow-hidden shadow-sm flex flex-col justify-between font-sans">
      
      {/* Top HUD Custom Selectors */}
      <div className="relative z-[1000] flex justify-between items-center bg-white/95 px-4 py-2 border-b border-slate-200 shadow-sm font-mono text-xs">
        <div className="flex items-center space-x-3">
          <Radio className="w-4 h-4 text-blue-600 animate-pulse" />
          <span className="font-bold text-slate-800 uppercase">AI Solver Cockpit</span>
        </div>

        {/* Port & Supplier dropdowns */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1">
            <span className="text-[10px] text-slate-400">Supplier:</span>
            <select
              value={selectedSupplierId}
              onChange={(e) => setSelectedSupplierId(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded px-1.5 py-0.5 text-xs text-slate-700 font-semibold focus:outline-none"
            >
              <option value="BASRA_IRAQ">Basra (Iraq)</option>
              <option value="RAS_TANURA_SAUDI">Ras Tanura (Saudi)</option>
              <option value="BONNY_NIGERIA">Bonny (Nigeria)</option>
              <option value="SANTOS_BRAZIL">Santos (Brazil)</option>
            </select>
          </div>

          <div className="flex items-center space-x-1">
            <span className="text-[10px] text-slate-400">Refinery Port:</span>
            <select
              value={selectedRefineryId}
              onChange={(e) => setSelectedRefineryId(e.target.value)}
              className="bg-slate-50 border border-slate-300 rounded px-1.5 py-0.5 text-xs text-slate-700 font-semibold focus:outline-none"
            >
              <option value="JAMNAGAR">Jamnagar (Gujarat)</option>
              <option value="MANGALORE">Mangalore (Karnataka)</option>
              <option value="VISAKHAPATNAM">Visakhapatnam (AP)</option>
              <option value="PARADIP">Paradip (Odisha)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Map Canvas */}
      <div className="w-full h-full z-10 relative">
        <MapContainer
          center={centerPos}
          zoom={4}
          scrollWheelZoom={true}
          style={{ width: '100%', height: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Render Chokepoints */}
          {chokepoints.map(cp => (
            <Marker
              key={cp.id}
              position={[cp.coordinates.lat, cp.coordinates.lng]}
              icon={createIcon(cp.cviScore > 80 ? 'red' : 'orange')}
            >
              <Popup>
                <div className="font-mono text-xs">
                  <strong>{cp.name}</strong>
                  <div>CVI Score: {cp.cviScore}/100</div>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Render Refineries - Clicking marker sets it as the selected target port */}
          {refineries.map(ref => (
            <Marker
              key={ref.id}
              position={[ref.coordinates.lat, ref.coordinates.lng]}
              icon={createIcon(ref.id === selectedRefineryId ? 'red' : 'blue')}
              eventHandlers={{
                click: () => {
                  setSelectedRefineryId(ref.id);
                },
              }}
            >
              <Popup>
                <div className="font-mono text-xs">
                  <strong>{ref.name}</strong>
                  <div className="text-blue-600 font-semibold mt-1">Click to select as Destination</div>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Render SPR Caverns */}
          {sprFacilities.map(spr => (
            <Marker
              key={spr.id}
              position={[spr.coordinates.lat, spr.coordinates.lng]}
              icon={createIcon('gold')}
            >
              <Popup>
                <div className="font-mono text-xs">
                  <strong>{spr.name}</strong>
                  <div>Stock: {spr.currentLevelMillionBarrels}M bbls</div>
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Render Active AI Routed Path Polylines */}
          {solverResult && !isSolving && (
            <>
              {/* Primary AI Corridor */}
              <Polyline
                positions={solverResult.primaryRoute.coordinates}
                color="#16a34a"
                weight={4.5}
              />

              {/* Alternative AI Corridor */}
              <Polyline
                positions={solverResult.alternativeRoute.coordinates}
                color="#d97706"
                weight={3}
                dashArray="5,10"
              />
            </>
          )}
        </MapContainer>

        {/* Dynamic AI Solver Metrics Overlay Panel — Togglable */}
        {solverResult && (
          <>
            {showSolverPanel ? (
              <div className="absolute bottom-4 left-4 z-[1000] bg-white/95 border border-slate-300 rounded-xl p-4 w-96 text-xs shadow-lg space-y-3 font-mono">
                <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                  <span className="text-[10px] text-blue-600 font-bold uppercase tracking-wider">
                    AI Solver output Matrix
                  </span>
                  <div className="flex items-center space-x-1.5">
                    {isSolving && <RefreshCw className="w-3.5 h-3.5 text-blue-600 animate-spin" />}
                    <button
                      onClick={() => setShowSolverPanel(false)}
                      className="p-1 rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition"
                      title="Collapse panel"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Primary Details */}
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-800">{solverResult.primaryRoute.name}</h4>
                  <p className="text-[10px] text-slate-500 leading-relaxed">
                    {solverResult.primaryRoute.explanation}
                  </p>
                </div>

                {/* Core Calculations Grid */}
                <div className="grid grid-cols-2 gap-2 text-[10px] bg-slate-50 border border-slate-200 p-2.5 rounded-lg">
                  <div>
                    <span className="text-slate-400 block">Landed Cost</span>
                    <strong className="text-slate-800 text-xs">${solverResult.primaryRoute.landedCostUsdBbl.toFixed(2)} / bbl</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Transit Time</span>
                    <strong className="text-slate-800 text-xs">{solverResult.primaryRoute.transitDays} Days</strong>
                  </div>
                  <div className="pt-1.5 border-t border-slate-200">
                    <span className="text-slate-400 block">Daily Committment</span>
                    <strong className="text-slate-800 text-xs">${(solverResult.primaryRoute.dailyCostUsd / 1000000).toFixed(2)}M / Day</strong>
                  </div>
                  <div className="pt-1.5 border-t border-slate-200">
                    <span className="text-slate-400 block">Assay Match Score</span>
                    <strong className="text-emerald-700 text-xs">{solverResult.metrics.assayMatchScore}%</strong>
                  </div>
                </div>

                {/* Alternative Backup Info */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[9px] text-slate-500">
                  <span>Alt Route: <strong className="text-slate-700">{solverResult.alternativeRoute.name}</strong></span>
                  <span className="text-amber-700 font-semibold">{solverResult.alternativeRoute.transitDays}d | +${(solverResult.alternativeRoute.landedCostUsdBbl - solverResult.primaryRoute.landedCostUsdBbl).toFixed(2)}/bbl</span>
                </div>
              </div>
            ) : (
              /* Collapsed toggle icon */
              <button
                onClick={() => setShowSolverPanel(true)}
                className="absolute bottom-4 left-4 z-[1000] w-10 h-10 rounded-xl bg-white/95 border border-slate-300 shadow-lg flex items-center justify-center text-blue-600 hover:bg-blue-50 hover:border-blue-400 transition"
                title="Show AI Solver Output Matrix"
              >
                <PanelBottomOpen className="w-5 h-5" />
              </button>
            )}
          </>
        )}
      </div>

      {/* Bottom Legend */}
      <div className="relative z-[1000] flex items-center justify-between bg-white border-t border-slate-200 px-4 py-2.5 text-xs text-slate-700 font-mono">
        <div className="flex items-center space-x-5">
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
            <span>Primary Route (AI-Solved)</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
            <span>Alternative Backup</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600"></span>
            <span>Selected Target Port</span>
          </div>
        </div>
        <div className="text-[10px] text-slate-500">
          Optimization Engine: <strong className="text-emerald-700">Online</strong>
        </div>
      </div>
    </div>
  );
};
