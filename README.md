# Project CHAKRA

> **Cognitive Heuristic for Anticipatory Knowledge & Resilience in Energy**

Project CHAKRA is an advanced agentic multi-agent orchestrator and geospatial digital twin designed to secure, monitor, and optimize national energy supply chains. By combining real-time global intelligence pipelines with deep domain constraint solvers, CHAKRA enables dynamic, high-fidelity rerouting and strategic reserve management when maritime and trade corridors face escalation.

---
<img width="1915" height="977" alt="Screenshot 2026-07-23 002312" src="https://github.com/user-attachments/assets/2961552f-2049-49b9-9670-3d65c5ce7d1c" />


## Key Pillars of the System

CHAKRA coordinates four specialized autonomous agents to model impacts and execute supply mitigations within minutes:

### 1. Radar Agent (Geopolitical Intelligence)
- Continuously scans global security feeds using **GDELT**, **ReliefWeb (UN OCHA)**, **Wikipedia Current Events**, and **Maritime RSS feeds**.
- Automatically extracts events, classifies conflict intensity, maps affected corridors, and dynamically recalculates the **Corridor Vulnerability Index (CVI)**.

### 2. Sandbox Modeller (Impact Simulation)
- Evaluates cascading economic and operational impacts using simulated GNN propagation.
- Computes run-rate drops across major refineries, predicts retail fuel price spikes, and estimates national quarterly GDP deltas.

### 3. Action Engine (Refinery Assay Blending & Routing)
- Automatically computes alternative shipping corridors (e.g., Cape of Good Hope rerouting) during chokepoint closures.
- Factors in spot prices, freight premiums, and transit time deltas.
- **Refinery Assay Compatibility:** Matches specific refinery metallurgy constraints (sulfur tolerance, API gravity) by calculating optimal blending ratios of available sweet and sour crudes.

### 4. SPR Shock Absorber (Strategic Reserve Management)
- Optimizes drawdown levels across underground cavern networks (e.g., Padur, Mangalore, Visakhapatnam).
- Calculates the minimum required release rates to bridge the exact transit gap of rerouted supply, preventing market panic and premature depletion.

---

## Tech Stack & Architecture

- **Core Framework:** React 18 (TypeScript) + Vite
- **Styling:** Tailwind CSS with custom design tokens for high-density command consoles
- **Geospatial Engine:** Leaflet & React-Leaflet with interactive markers, popups, and dynamic route polylines
- **Data Layer:** Static reference database modeling real-world Indian refineries, storage caverns, and maritime chokepoints

---

## Getting Started

### Prerequisites

Make sure you have Node.js (v18 or higher) and npm installed.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/PratyushAnand-Git/CHAKRA.git
   cd CHAKRA
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Build for production:
   ```bash
   npm run build
   ```
