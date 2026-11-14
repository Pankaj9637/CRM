# NEXUS — Builder Agent Prompt

Copy-paste this entire prompt to your AI coding agent (Cursor, Claude, GPT, etc.)

---

## THE PROMPT

```
You are building NEXUS, an AI-powered Account Intelligence CRM for a hackathon. You have exactly 2 hours. Build fast, no over-engineering.

There are two reference files in this project root that contain EVERYTHING you need:
- NEXUS_BLUEPRINT.md — Complete data, database schema, API code, MCP integration, Gemini prompts, raw seed JSON
- NEXUS_UI_ARCHITECTURE.md — UI layout, navigation, intelligence engine design, component structure, build order

READ BOTH FILES COMPLETELY BEFORE WRITING ANY CODE.

## What you're building

A Next.js app that:
1. Ingests customer account data from an MCP API (data already fetched and saved in seed.json in the blueprint)
2. Stores it in Turso (hosted SQLite)
3. Runs Gemini AI analysis to generate priority actions, risks, unknowns, and stakeholder power maps
4. Displays an intelligence-first dashboard with cross-account insights
5. Lets users drill into individual accounts to see deals, people, risks, evidence
6. Has a Gemini-powered copilot chat
7. Can fetch live signals from MCP (refresh button)
8. Can write notes back to MCP (write-back form)

## Tech stack

- Next.js 14+ App Router with TypeScript
- Tailwind CSS + shadcn/ui components
- Turso (libSQL) for database — use @libsql/client
- Google Gemini API via @google/generative-ai
- Deploy to Vercel

## Build in this exact order

### Step 1: Project Setup (10 min)
- Create Next.js app with TypeScript, Tailwind, App Router, src directory
- Install: @libsql/client @google/generative-ai lucide-react
- Init shadcn and add: card badge tabs button input textarea separator scroll-area
- Create .env.local with these vars (values are in the project .env file):
  GEMINI_API_KEY, MCP_TOKEN, MCP_ENDPOINT, TURSO_DATABASE_URL, TURSO_AUTH_TOKEN

### Step 2: Core Libraries (5 min)
Create these three files exactly as shown in NEXUS_BLUEPRINT.md Section 6:
- src/lib/db.ts — Turso client
- src/lib/mcp.ts — MCP caller with 1-call-per-minute rate limiter
- src/lib/gemini.ts — Gemini client wrapper

### Step 3: Seed Data + Database (15 min)
- Copy the COMPLETE JSON from NEXUS_BLUEPRINT.md Section 4 into src/data/seed.json
- Create src/app/api/seed/route.ts that:
  a. Creates all tables from NEXUS_BLUEPRINT.md Section 3 (CREATE TABLE IF NOT EXISTS)
  b. Reads seed.json
  c. Inserts all accounts, contacts (stakeholders), facts, deals (opportunities), offers, files
  d. Calls Gemini 4 times with the prompts from NEXUS_UI_ARCHITECTURE.md Section 4:
     - Priority Actions (top 5 across both accounts) → store in actions table
     - Risk Analysis → store in risks table  
     - Unknowns Register → store in unknowns table
     - Stakeholder Power Map → store in deal_contacts table
  e. Logs to sync_log
  f. Returns success with counts

### Step 4: API Routes (15 min)
- GET /api/dashboard — returns cross-account summary (pipeline totals, people with sentiments, top actions, top risks, recent signals)
- GET /api/accounts/[id] — returns single account with all related data (contacts, facts, deals, offers, actions, risks, unknowns, notes)
- GET /api/signals — calls MCP get_signals, stores new ones, returns all
- GET+POST /api/notes — GET returns all notes, POST saves to DB + calls MCP write_note
- POST /api/copilot — receives {accountId, message}, loads account data from DB, sends to Gemini with system prompt from NEXUS_BLUEPRINT.md Section 8, returns AI response

### Step 5: Layout + Navigation (10 min)
- Root layout: dark sidebar with NEXUS logo, nav links (Dashboard, Accounts), header with sync timestamp
- Three pages:
  - / (dashboard)
  - /accounts (grid)
  - /accounts/[id] (deep-dive with tabs)

### Step 6: Dashboard Page (20 min)
Build the intelligence home page per NEXUS_UI_ARCHITECTURE.md Section 1:
- Priority Actions list (top 5, color-coded by urgency, showing deal + account + contact)
- People Sentiment grid (all 10 contacts across both accounts, with relationship emoji/badge)
- Pipeline Health cards (total pipeline, blocked amount, won offers)
- Risk Alerts (top risks with severity badges)
- Signal Feed (latest signals, with Refresh button that calls /api/signals)
- Floating copilot button

### Step 7: Accounts Grid (5 min)
- Card per account showing: name, pipeline value, deal count, contact count, blocked count, health indicator
- Click → navigate to /accounts/[id]

### Step 8: Account Deep-Dive (25 min)
Tabbed workspace per NEXUS_UI_ARCHITECTURE.md Section 3:

**Overview tab**: Summary cards for this account only

**Deals tab** (answers "What is the book worth?"):
- Each deal as a card: title, stage badge, worth_up_to value, blocker with status
- Evidence list under each deal — click an evidence ID to expand and show the fact text + status badge (verified=green, told=yellow, claim=orange)
- This is the EVIDENCE TRACEABILITY feature judges will test

**People tab** (answers "Who has the power?"):
- Contact cards with name, role, relationship badge
- Under each: inferred deal roles (Decider/Payer/User/Blocker) with "AI Inferred" badge
- Deals they're connected to

**Actions tab** (answers "What should happen next?"):
- Top 3 actions for THIS account only (filtered from the 5 generated at seed)
- Each: priority number, action, reason, deal, contact, evidence citations, urgency

**Risks tab** (answers "What is at risk?"):
- Risk cards for this account: severity badge, description, affected deal, impact value, mitigation

**Evidence tab** (answers "What don't we know?"):
- Two sections: Known Evidence (facts grouped by verified/told/claim) and Unknowns (from unknowns table)
- Each unknown: what's missing, why it matters, who can provide it, suggested action

### Step 9: Copilot Chat (10 min)
- Floating button bottom-right → opens slide-out right panel
- Chat interface: message bubbles, input field, send button
- Sends to POST /api/copilot with current account context
- AI responses should include [evidence_id] citations rendered as badges

### Step 10: Note Writer (5 min)
- Form somewhere visible (sidebar or dialog): account selector, kind dropdown (note/task/risk/next_step), title, text
- Submit → POST /api/notes → show success toast
- This is the WRITE-BACK feature judges will test

### Step 11: Polish + Deploy (10 min)
- Test: seed the DB, check dashboard loads, switch accounts, check all tabs, write a note, refresh signals, ask copilot a question
- Deploy to Vercel: vercel --prod
- Set all env vars in Vercel dashboard
- Hit /api/seed on production to populate DB

## Critical rules

1. NEVER invent financial numbers — only use worth_up_to values from seed.json
2. NEVER mix account data — every query must filter by account_id
3. Every claim/number in the UI must show its evidence status badge (verified/told/claim)
4. The MCP rate limit is 1 call per minute — the rate limiter in mcp.ts handles this
5. AI-inferred information (power map roles, recommendations) must be labeled as "AI Inferred" not "Verified"
6. Store the Gemini analysis results at seed time — don't call Gemini on every page load
7. The copilot must only answer based on the selected account's data

## Design aesthetic

- Clean, professional SaaS look — think Linear or Notion
- Dark sidebar, light main area
- Status colors: verified=green, told=amber, claim=orange, unknown=gray
- Relationship: ally=green, warm=blue, neutral=gray
- Blocker: open=red, cleared=green
- Severity: critical=red, high=orange, medium=yellow
- Use shadcn components throughout
- Responsive but desktop-first is fine for hackathon

Start building now. Go step by step. Don't skip the seed step — the entire app depends on it.
```
