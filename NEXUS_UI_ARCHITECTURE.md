# NEXUS — Updated UI & Intelligence Architecture

> This overrides Section 9 of the main blueprint. Intelligence-first approach.

---

## NEW APP STRUCTURE

```
/                  → Dashboard (cross-account intelligence home)
/accounts          → All accounts grid
/accounts/[id]     → Single account deep-dive workspace
```

---

## 1. DASHBOARD (Home Page) — The Intelligence Hub

This is NOT a data dump. This is the **command center** that answers: "What do I need to do RIGHT NOW?"

### Layout:

```
┌─────────────────────────────────────────────────────┐
│  NEXUS                        🔔 Signals  ⟳ Sync   │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌─── PRIORITY ACTIONS ──────────────────────────┐  │
│  │ 🔴 1. Send data-flow docs to Fatima Osei      │  │
│  │      → Unblocks $200K Tarn Valley deal         │  │
│  │      Account: Eastern Counties | Due: ASAP     │  │
│  │                                                │  │
│  │ 🟠 2. Build cost-per-flight analysis           │  │
│  │      → Unblocks $250K Westmere scale           │  │
│  │      Account: Eastern Counties | Due: 2 weeks  │  │
│  │                                                │  │
│  │ 🟡 3. Get insurer premium letter to Nadia      │  │
│  │      → Proves ROI, unblocks $140K renewal      │  │
│  │      Account: Aldermoor | Due: Before review    │  │
│  └────────────────────────────────────────────────┘  │
│                                                     │
│  ┌── PEOPLE SENTIMENT ──┐  ┌── PIPELINE HEALTH ──┐  │
│  │ 😊 Rhys Calder  ALLY │  │ Total: $3.91M       │  │
│  │ 😊 Karen Mbeki  ALLY │  │ Blocked: $2.52M     │  │
│  │ 😐 Fatima Osei  NEUT │  │ Agreed: $90K        │  │
│  │ 😐 Ewan Brooks  NEUT │  │ Won offers: $335K   │  │
│  │ 😐 Hannah Doyle NEUT │  │                     │  │
│  │ 😊 Stefan Roy   ALLY │  │ ┌──── A ─────────┐  │  │
│  │ 😐 Beatriz A.   NEUT │  │ │ $2.3M pipeline  │  │  │
│  │ 🙂 Nadia Rahman WARM │  │ │ 4 deals blocked │  │  │
│  │ 😐 Owen Fitch   NEUT │  │ └─────────────────┘  │  │
│  │ 😊 Julian Tate  ALLY │  │ ┌──── B ─────────┐  │  │
│  │                      │  │ │ $1.61M pipeline │  │  │
│  │ 🔴 5 Neutral (risk!) │  │ │ 3 deals blocked │  │  │
│  └──────────────────────┘  │ └─────────────────┘  │  │
│                            └──────────────────────┘  │
│                                                     │
│  ┌── RISK ALERTS ────────────────────────────────┐  │
│  │ ⚠️ Tender spec locks soon — no operating      │  │
│  │    model ready (Account A, $1.5M at stake)     │  │
│  │ ⚠️ Stefan's deputy leaving — rollout knowledge │  │
│  │    not documented (Account B, $180K at stake)   │  │
│  │ ⚠️ 4-month-old support ticket unanswered       │  │
│  │    (Account A, blocks $200K deal)               │  │
│  └────────────────────────────────────────────────┘  │
│                                                     │
│  ┌── LIVE SIGNALS ───────────────────────────────┐  │
│  │ (fetched from MCP get_signals — shows new      │  │
│  │  events since last check)                      │  │
│  └────────────────────────────────────────────────┘  │
│                                                     │
│  💬 Ask NEXUS anything...                           │
└─────────────────────────────────────────────────────┘
```

### Dashboard API: `GET /api/dashboard`

This route loads ALL accounts from DB and runs the intelligence engine:

```typescript
// Pseudocode for dashboard data assembly
export async function GET() {
  const accounts = await db.execute('SELECT * FROM accounts');
  const allDeals = await db.execute('SELECT * FROM deals');
  const allContacts = await db.execute('SELECT * FROM contacts');
  const allFacts = await db.execute('SELECT * FROM facts');
  const allRisks = buildRisks(allDeals, allFacts); // from blockers + deadlines
  const allSignals = await db.execute('SELECT * FROM signals ORDER BY fetched_at DESC LIMIT 10');

  // Pre-generated at seed time by Gemini:
  const priorityActions = await db.execute('SELECT * FROM actions ORDER BY priority ASC LIMIT 5');
  
  return {
    pipeline: {
      total: sumDeals(allDeals),
      blocked: sumDeals(allDeals.filter(d => d.blocker_status === 'open')),
      agreed: sumDeals(allDeals.filter(d => d.stage === 'agreed')),
      won_offers: sumOffers(wonOffers),
    },
    people: allContacts.map(c => ({
      ...c,
      sentiment: c.relationship, // ally/warm/neutral = sentiment
      accountName: getAccountName(c.account_id),
      linkedDeals: getLinkedDeals(c, allDeals, allFacts),
    })),
    priorityActions,
    risks: allRisks,
    signals: allSignals,
    accounts: accounts.map(a => ({
      id: a.id,
      name: a.name,
      pipeline: sumDeals(allDeals.filter(d => d.account_id === a.id)),
      blockedCount: allDeals.filter(d => d.account_id === a.id && d.blocker_status === 'open').length,
    })),
  };
}
```

---

## 2. ACCOUNTS PAGE — Portfolio View

Simple grid of account cards. Click to enter deep-dive.

```
┌─────────────────────────────────────────────┐
│  MY ACCOUNTS                                │
│                                             │
│  ┌──────────────────┐ ┌──────────────────┐  │
│  │ 🏛️ Eastern       │ │ 🏭 Aldermoor     │  │
│  │ Counties Police  │ │ Industrial Group │  │
│  │                  │ │                  │  │
│  │ Pipeline: $2.3M  │ │ Pipeline: $1.61M │  │
│  │ Deals: 4         │ │ Deals: 4         │  │
│  │ Contacts: 5      │ │ Contacts: 5      │  │
│  │ Blocked: 4       │ │ Blocked: 3       │  │
│  │ Health: ⚠️       │ │ Health: ⚠️       │  │
│  │                  │ │                  │  │
│  │ [Enter →]        │ │ [Enter →]        │  │
│  └──────────────────┘ └──────────────────┘  │
└─────────────────────────────────────────────┘
```

---

## 3. ACCOUNT DEEP-DIVE — `/accounts/[id]`

When you click into an account, you get the full workspace with tabs:

**Tabs**: Overview | Deals | People & Power | Actions | Risks | Evidence | Unknowns

Each tab answers one of the five challenge questions:

| Tab | Challenge Question |
|-----|--------------------|
| Deals | Q1: What is the book worth? |
| People & Power | Q2: Who has the power? |
| Actions | Q3: What should happen next? |
| Risks | Q4: What is at risk? |
| Evidence + Unknowns | Q5: What don't we know? |

The **copilot** chat panel is available on every page (floating button → slide-out).

---

## 4. INTELLIGENCE ENGINE — The Core

The AI isn't a feature. It IS the product. Here's exactly what Gemini does:

### At Seed Time (run once, store results):

**Call 1: Priority Actions Generator**
```
Prompt: Given these two accounts with their deals, blockers, contacts, 
facts and deadlines, generate the TOP 5 priority actions across ALL 
accounts, ranked by commercial impact and urgency.

For each action return:
{
  "priority": 1,
  "action": "specific action description",
  "reason": "why this matters now",
  "deal_id": "which deal",
  "deal_title": "deal name", 
  "account_id": "A or B",
  "contact": "who to engage",
  "evidence_ids": ["supporting fact ids"],
  "urgency": "immediate|this_week|this_month",
  "impact_value": dollar amount at stake
}

Rules: Only use data provided. Cite evidence IDs. Never invent.

Data: {allAccountData}
```
→ Store result in `actions` table.

**Call 2: Risk Analysis**
```
Prompt: Analyze these accounts for commercial risks. Consider:
- Deals with open blockers
- Approaching or missed deadlines  
- Neutral/cold contacts on important deals
- Missing evidence for key claims
- Contradictions between claims and verified facts
- Key person dependencies

For each risk return:
{
  "severity": "critical|high|medium",
  "risk": "description",
  "deal_id": "affected deal",
  "account_id": "A or B",
  "impact_value": dollar amount at risk,
  "mitigation": "what can be done",
  "evidence_ids": ["supporting facts"]
}

Data: {allAccountData}
```
→ Store in `risks` table.

**Call 3: Unknowns Register**
```
Prompt: What critical information is MISSING from these accounts?
Look for:
- Evidence IDs referenced in deals that have no matching fact
- Stakeholder roles that can't be determined
- Financial claims without verification
- Deals with no deadline information
- Contacts with no relationship depth

For each unknown return:
{
  "what_missing": "description",
  "why_matters": "impact on decisions",
  "deal_id": "affected deal",
  "account_id": "A or B",
  "who_can_provide": "person or source",
  "suggested_action": "how to resolve"
}

Data: {allAccountData}
```
→ Store in `unknowns` table.

**Call 4: Stakeholder Power Map**
```
Prompt: For each deal, determine who fills each role based on the evidence:
- Decider, Payer, User, Blocker
Use ONLY the stakeholders listed. Mark confidence as "inferred".

Return JSON: { "deal_id": { "decider": "name|Unknown", ... } }

Data: {allAccountData}
```
→ Store in `deal_contacts` table.

### At Runtime (live copilot):

When user asks a question, load that account's data from DB and send to Gemini with the system prompt from the main blueprint (Section 8).

---

## 5. UPDATED FILE STRUCTURE

```
src/
├── app/
│   ├── layout.tsx                # Sidebar nav + header
│   ├── page.tsx                  # Dashboard (intelligence home)
│   ├── accounts/
│   │   ├── page.tsx              # Accounts grid
│   │   └── [id]/
│   │       └── page.tsx          # Account deep-dive (tabbed)
│   └── api/
│       ├── seed/route.ts         # Ingest MCP + run Gemini analysis
│       ├── dashboard/route.ts    # Cross-account intelligence
│       ├── accounts/route.ts     # Single account data
│       ├── accounts/[id]/route.ts
│       ├── signals/route.ts      # Live signals refresh
│       ├── notes/route.ts        # Read + write notes
│       └── copilot/route.ts      # Gemini chat
├── components/
│   ├── sidebar.tsx               # App navigation
│   ├── dashboard/
│   │   ├── priority-actions.tsx  # Top actions list
│   │   ├── people-sentiment.tsx  # Contact sentiment grid
│   │   ├── pipeline-health.tsx   # Pipeline summary cards
│   │   ├── risk-alerts.tsx       # Top risks
│   │   └── signal-feed.tsx       # Live signals
│   ├── account/
│   │   ├── overview-tab.tsx
│   │   ├── deals-tab.tsx
│   │   ├── people-tab.tsx
│   │   ├── actions-tab.tsx
│   │   ├── risks-tab.tsx
│   │   └── evidence-tab.tsx
│   ├── copilot.tsx               # Floating chat panel
│   └── note-writer.tsx           # Write-back form
├── lib/
│   ├── db.ts
│   ├── mcp.ts
│   └── gemini.ts
└── data/
    └── seed.json                 # Raw MCP data
```

---

## 6. UPDATED BUILD ORDER (2 hours)

| Min | Task |
|-----|------|
| 0-10 | Next.js + Turso + deps + env setup |
| 10-25 | lib files (db, mcp, gemini) + seed.json + DB schema |
| 25-35 | Seed API route: parse JSON → insert all tables |
| 35-45 | Seed API part 2: call Gemini 4 times for actions/risks/unknowns/power map → store |
| 45-60 | Dashboard page + dashboard API route |
| 60-70 | Dashboard components: priority-actions, pipeline-health, people-sentiment |
| 70-80 | Accounts grid page + account deep-dive page with tabs |
| 80-95 | Account tabs: deals-tab (with evidence traceability), people-tab |
| 95-105 | Account tabs: actions-tab, risks-tab, evidence-tab |
| 105-115 | Copilot: chat API + floating panel |
| 115-120 | Signals refresh + note writer (write-back) |
| 120-130 | Test everything, fix bugs |
| 130-140 | Deploy to Vercel |
| 140-150 | README + Google Doc |
| 150-160 | Record 3-min video |

---

## 7. KEY INSIGHT FOR THE BUILDER

The seed step does the HEAVY LIFTING:
1. Parse MCP JSON → fill 7 tables
2. Call Gemini 4 times → fill actions, risks, unknowns, deal_contacts
3. After seed, the ENTIRE app is just reading from the DB
4. Only signals refresh and note write-back touch MCP again
5. Only the copilot chat touches Gemini again

**This means 80% of the app is just frontend reading from API routes that query SQLite. Fast to build.**
