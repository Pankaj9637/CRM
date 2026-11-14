# NEXUS — AI-Powered Account Intelligence CRM

NEXUS is an intelligence-first Account CRM built for enterprise deal execution. It ingests customer account data from the Model Context Protocol (MCP) API, stores structured records in SQLite/Turso, and synthesizes commercial priorities, stakeholder power dynamics, and evidentiary proof using Google Gemini 2.5.

---

## 🌟 Core Highlights

### 1. Answers The 5 Challenge Questions
- **Q1: What is the book worth?** (`/accounts/[id]` → Deals Tab)
  - Every deal worth up to its maximum ceiling ($3.91M across portfolio: $2.30M Account A, $1.61M Account B).
  - Evidence Traceability: click any evidence badge (e.g. `[km_usage_1]`, `[eb_heli_1]`) to expand the underlying fact, speaker attribution, and verification status (**verified** / **told** / **claim**).
- **Q2: Who has the power?** (`/accounts/[id]` → People & Power Tab)
  - Stakeholder sentiment matrix (Allies, Warm, and Neutral risk alerts).
  - AI-inferred decision authority breakdown per deal: **Decider**, **Payer**, **User**, and **Blocker** with transparent **"AI Inferred"** badges.
- **Q3: What should happen next?** (`/` & `/accounts/[id]` → Actions Tab)
  - Ranked priority actions color-coded by urgency (**Immediate**, **This Week**, **This Month**).
  - Clear financial impact at stake, target stakeholder to engage, and cited evidence.
- **Q4: What is at risk?** (`/` & `/accounts/[id]` → Risks Tab)
  - Critical commercial risks: stalled DPIA documents, unverified ROI models, key-person departures (Stefan's deputy leaving), and tender specification freeze deadlines.
  - Financial exposure calculated with tactical mitigation action items.
- **Q5: What don't we know?** (`/accounts/[id]` → Evidence & Unknowns Tab)
  - Dedicated **Unknowns Register** highlighting active blindspots, who can provide missing information, and suggested resolutions.
  - Complete evidence repository graded by credibility.

---

### 2. Live MCP Integration & Write-Back
- **Live Signals Feed**: Polls `get_signals` from the MCP endpoint with an automated 1-call-per-minute rate limiter.
- **Write-Back Form**: Write notes, tasks, risks, and next steps that save to SQLite and immediately push back to the MCP via `write_note`.

---

### 3. Grounded Gemini Copilot
- Context-aware slide-out assistant accessible on every page.
- Strict system prompt prevents hallucinations and enforces citation of evidence IDs `[evidence_id]` in brackets.
- Interactive evidence tags in chat bubbles open the instant **Evidence Inspector** modal.

---

## 🛠 Tech Stack

- **Framework**: Next.js 14+ (App Router, React 18, TypeScript)
- **Styling**: Tailwind CSS with custom Linear/Notion dark sidebar + light workspace aesthetic
- **Database**: Turso / libSQL SQLite client (`@libsql/client`)
- **AI Engine**: Google Gemini 2.5 Flash via `@google/generative-ai`
- **Protocol**: MCP (Model Context Protocol) via JSON-RPC 2.0
- **Icons**: Lucide React

---

## 📁 Project Structure

```
├── src/
│   ├── app/
│   │   ├── layout.tsx                # Sidebar, header, copilot & note writer modals
│   │   ├── page.tsx                  # Command Center (cross-account intelligence)
│   │   ├── accounts/
│   │   │   ├── page.tsx              # Accounts portfolio grid
│   │   │   └── [id]/
│   │   │       └── page.tsx          # Account deep-dive workspace (6 tabs)
│   │   └── api/
│   │       ├── seed/route.ts         # Ingests seed data + runs Gemini intelligence analysis
│   │       ├── dashboard/route.ts    # Cross-account portfolio synthesis
│   │       ├── accounts/route.ts     # Account summaries
│   │       ├── accounts/[id]/route.ts# Deep-dive account details
│   │       ├── signals/route.ts      # MCP get_signals poll & cache
│   │       ├── notes/route.ts        # DB persistence & MCP write_note sync
│   │       └── copilot/route.ts      # Grounded Gemini chat with evidence citations
│   ├── components/
│   │   ├── sidebar.tsx               # Dark sidebar with live connector statuses
│   │   ├── badge.tsx                 # Status badges (verified, told, claim, etc.)
│   │   ├── evidence-inspector.tsx    # Evidence traceability popover
│   │   ├── copilot-drawer.tsx        # Slide-out AI assistant
│   │   ├── note-writer-modal.tsx     # Write-back modal
│   │   ├── dashboard/                # Command Center components
│   │   └── account/                  # 6 deep-dive workspace tabs
│   ├── lib/
│   │   ├── db.ts                     # Turso/libSQL client
│   │   ├── mcp.ts                    # MCP client with 60s rate limiter
│   │   ├── gemini.ts                 # Gemini 2.5 client with fallbacks
│   │   └── utils.ts                  # Class & currency formatters
│   └── data/
│       └── seed.json                 # Exported MCP account records
├── scripts/
│   └── run-seed.mjs                  # Direct database seeder script
├── BUILDER_PROMPT.md
├── NEXUS_BLUEPRINT.md
└── NEXUS_UI_ARCHITECTURE.md
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Configuration
Ensure `.env.local` contains:
```env
GEMINI_API_KEY=<your-gemini-key>
MCP_TOKEN=aq1.2e20d156-f258-479f-b035-b6c28844a822.xyqhsMLqR5QoaoZtFTnVQI50N9Lr32o2
MCP_CONNECTOR=aq1.2e20d156-f258-479f-b035-b6c28844a822.xyqhsMLqR5QoaoZtFTnVQI50N9Lr32o2
MCP_ENDPOINT=https://questathon.aihackerscollective.com/api/public/mcp
TURSO_DATABASE_URL=file:nexus.db
TURSO_AUTH_TOKEN=
```

### 3. Seed Database
Run the direct seed script or trigger `/api/seed`:
```bash
node scripts/run-seed.mjs
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for Production
```bash
npm run build
npm run start
```
