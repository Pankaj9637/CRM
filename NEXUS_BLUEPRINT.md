# NEXUS MVP — Complete Build Blueprint

> **Goal**: Build in 2 hours. Copy-paste ready. No fluff.

---

## 1. SETUP (10 min)

```bash
npx create-next-app@latest nexus --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm
cd nexus
npm install @libsql/client @google/generative-ai lucide-react
npx shadcn@latest init -d
npx shadcn@latest add card badge tabs button input textarea dialog sheet separator scroll-area
```

### .env.local
```
GEMINI_API_KEY=<from .env>
MCP_TOKEN=aq1.2e20d156-f258-479f-b035-b6c28844a822.xyqhsMLqR5QoaoZtFTnVQI50N9Lr32o2
MCP_ENDPOINT=https://questathon.aihackerscollective.com/api/public/mcp
TURSO_DATABASE_URL=<after turso db create nexus>
TURSO_AUTH_TOKEN=<after turso db tokens create nexus>
```

### Turso setup
```bash
# Install: npm install -g @tursodatabase/cli
turso auth login
turso db create nexus
turso db show nexus --url        # copy to TURSO_DATABASE_URL
turso db tokens create nexus     # copy to TURSO_AUTH_TOKEN
```

---

## 2. FILE STRUCTURE

```
src/
├── app/
│   ├── layout.tsx              # Root layout with font + providers
│   ├── page.tsx                # Main CRM page
│   ├── api/
│   │   ├── seed/route.ts       # POST: ingest MCP data into Turso
│   │   ├── accounts/route.ts   # GET: return both accounts from DB
│   │   ├── signals/route.ts    # GET: fetch fresh signals from MCP
│   │   ├── notes/route.ts      # GET+POST: read/write notes via MCP
│   │   └── copilot/route.ts    # POST: Gemini AI chat
│   └── globals.css
├── lib/
│   ├── db.ts                   # Turso client
│   ├── mcp.ts                  # MCP caller with rate limit
│   └── gemini.ts               # Gemini client
├── components/
│   ├── account-switcher.tsx    # Tab bar: Account A | Account B
│   ├── overview.tsx            # Account summary cards
│   ├── deal-intelligence.tsx   # Deal table with evidence links
│   ├── power-map.tsx           # Stakeholder grid
│   ├── next-actions.tsx        # Top 3 recommendations
│   ├── risk-radar.tsx          # Risk cards
│   ├── evidence-panel.tsx      # Evidence + unknowns
│   ├── copilot.tsx             # Chat sidebar
│   └── note-writer.tsx         # Write-back form
├── data/
│   └── seed.json               # Raw MCP data (see Section 4)
```

---

## 3. DATABASE SCHEMA (Turso/SQLite)

```sql
-- Run via seed API route or turso shell
CREATE TABLE IF NOT EXISTS accounts (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  official_story TEXT,
  raw_json TEXT NOT NULL,
  synced_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS contacts (
  id TEXT PRIMARY KEY,
  account_id TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT,
  relationship TEXT,
  available INTEGER DEFAULT 1
);

CREATE TABLE IF NOT EXISTS facts (
  id TEXT PRIMARY KEY,
  account_id TEXT NOT NULL,
  text TEXT NOT NULL,
  said_by TEXT,
  status TEXT,           -- claim | told | verified
  verified_by TEXT,      -- file id if verified
  learned_at_minute INTEGER
);

CREATE TABLE IF NOT EXISTS deals (
  id TEXT PRIMARY KEY,
  account_id TEXT NOT NULL,
  title TEXT NOT NULL,
  stage TEXT,
  worth_up_to INTEGER,
  size TEXT,
  blocker_text TEXT,
  blocker_status TEXT,   -- open | cleared
  evidence_ids TEXT,     -- JSON array of fact/file ids
  deadline_text TEXT,
  deadline_passed INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS offers (
  id TEXT PRIMARY KEY,
  account_id TEXT NOT NULL,
  title TEXT NOT NULL,
  value INTEGER,
  pitch_to TEXT,
  status TEXT            -- won | open | declined
);

CREATE TABLE IF NOT EXISTS files (
  id TEXT PRIMARY KEY,
  account_id TEXT NOT NULL,
  title TEXT,
  path TEXT,
  content TEXT           -- fetched file content cached here
);

CREATE TABLE IF NOT EXISTS signals (
  id TEXT PRIMARY KEY,
  account_id TEXT,
  text TEXT,
  raw_json TEXT,
  fetched_at TEXT DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS notes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  account_id TEXT,
  kind TEXT DEFAULT 'note',  -- note | task | risk | next_step
  title TEXT,
  text TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now')),
  synced_to_mcp INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS sync_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tool_name TEXT,
  status TEXT,
  timestamp TEXT DEFAULT (datetime('now'))
);
```

---

## 4. RAW MCP SEED DATA

This is the ACTUAL data returned from `get_my_accounts`. Save as `src/data/seed.json`:

```json
{
 "format": "account-quest-v2-export/1",
 "player": "2e20d156-f258-479f-b035-b6c28844a822",
 "exported_at": "2026-11-14T09:31:11.469Z",
 "accounts": [
  {
   "id": "A",
   "name": "Eastern Counties Police Alliance",
   "official_story": "Rollout under way. 4 forces, 35 docks, 300-dock framework tender in preparation.",
   "stakeholders": [
    {"id": "rhys_calder", "name": "Rhys Calder", "role": "Alliance drone programme lead", "relationship": "ally", "available": true},
    {"id": "karen_mbeki", "name": "Insp. Karen Mbeki", "role": "Drone unit inspector, Westmere", "relationship": "ally", "available": true},
    {"id": "fatima_osei", "name": "Fatima Osei", "role": "Data protection officer, Tarn Valley", "relationship": "neutral", "available": true},
    {"id": "ewan_brooks", "name": "Ewan Brooks", "role": "Finance business partner, Metro Central", "relationship": "neutral", "available": true},
    {"id": "hannah_doyle", "name": "Hannah Doyle", "role": "Alliance procurement lead", "relationship": "neutral", "available": true}
   ],
   "facts": [
    {"id": "rc_appetite_0", "text": "All four forces are keen.", "said_by": "Rhys Calder", "status": "claim", "learned_at_minute": 2},
    {"id": "rc_appetite_2", "text": "Only Westmere and Metro Central fly operationally. Tarn Valley has never flown a live mission and Norwold only trains.", "said_by": "Rhys Calder", "status": "told", "learned_at_minute": 2},
    {"id": "km_usage_0", "text": "We're flying all the time.", "said_by": "Insp. Karen Mbeki", "status": "told", "learned_at_minute": 4},
    {"id": "km_usage_1", "text": "14 of 18 docks flew last month, mostly patrol support and missing-person searches.", "said_by": "Insp. Karen Mbeki", "status": "verified", "verified_by": "flight_log_force_month", "learned_at_minute": 4},
    {"id": "km_staff_2", "text": "Six officers who also do other duties. Overtime is the main cost. Scaling to 30 docks needs nine more trained operators and shift cover.", "said_by": "Insp. Karen Mbeki", "status": "told", "learned_at_minute": 5},
    {"id": "fo_dpia_0", "text": "We are working through the assessment and it is not finished.", "said_by": "Fatima Osei", "status": "told", "learned_at_minute": 9},
    {"id": "fo_dpia_2", "text": "It cannot be signed until we receive the data-flow documents we asked the FlytBase support desk for four months ago. Nobody replied.", "said_by": "Fatima Osei", "status": "told", "learned_at_minute": 9},
    {"id": "pj_ticket", "text": "The Tarn Valley ticket asking for data-flow documents was logged four months ago and never answered. It sits in the support queue unassigned.", "said_by": "Pranjal Suyal", "status": "told", "learned_at_minute": 12},
    {"id": "srv_dataflow", "text": "Engineering can produce the data-flow pack (flows, retention, video storage location, access controls) in a week, with the CSM owning the ask: sending it, chasing it, answering the DPO.", "said_by": "SRV", "status": "told", "learned_at_minute": 14},
    {"id": "rc_funding_0", "text": "The alliance has the budget.", "said_by": "Rhys Calder", "status": "claim", "learned_at_minute": 22},
    {"id": "rc_funding_2", "text": "There is no pooled budget. Each force funds from its own budget and each chief finance officer must approve a call-off.", "said_by": "Rhys Calder", "status": "told", "learned_at_minute": 22},
    {"id": "eb_heli_1", "text": "A helicopter hour costs the force about 1,500 pounds all-in.", "said_by": "Ewan Brooks", "status": "verified", "verified_by": "helicopter_cost_overtime", "learned_at_minute": 25},
    {"id": "km_value_2", "text": "Two missing-person finds in under 12 minutes against about 40 for the helicopter. These are anecdotes. Nobody has compared cost per flight.", "said_by": "Insp. Karen Mbeki", "status": "told", "learned_at_minute": 26},
    {"id": "eb_sign_2", "text": "His chief finance officer will sign a call-off only with a cost per flight set against helicopter hours.", "said_by": "Ewan Brooks", "status": "told", "learned_at_minute": 27},
    {"id": "km_others_2", "text": "Tarn Valley's data protection officer has not signed off. Norwold's chief constable is cautious after a local privacy row.", "said_by": "Insp. Karen Mbeki", "status": "told", "learned_at_minute": 31},
    {"id": "hd_calloff_2", "text": "A force's call-off needs its own finance sign-off. The alliance cannot commit them.", "said_by": "Rhys Calder", "status": "told", "learned_at_minute": 33},
    {"id": "rc_tender_0", "text": "A 300-dock framework tender, spec being finalised.", "said_by": "Rhys Calder", "status": "told", "learned_at_minute": 41},
    {"id": "rc_tender_2", "text": "The tender specification locks soon (see Deadlines). It has no costed operating model, and nobody has agreed who would fly 300 docks.", "said_by": "Rhys Calder", "status": "told", "learned_at_minute": 41},
    {"id": "rc_stadium_0", "text": "Westmere's stadium project is a 30-dock opportunity.", "said_by": "Rhys Calder", "status": "claim", "learned_at_minute": 46},
    {"id": "kb_stadium_view", "text": "The superintendent thinks 30 docks is unrealistic with current staffing. Nobody has asked her.", "said_by": "Insp. Karen Mbeki", "status": "told", "learned_at_minute": 47},
    {"id": "fo_needs_3", "text": "With data flows, retention periods, video storage location and access controls I can finish in three weeks. Norwold is waiting to copy my assessment.", "said_by": "Fatima Osei", "status": "told", "learned_at_minute": 68},
    {"id": "rc_stadium_3", "text": "The stadium idea came from one superintendent's chat with the stadium operator. No funding, no event-day policing plan, and approval is needed before the specification locks.", "said_by": "Rhys Calder", "status": "told", "learned_at_minute": 120}
   ],
   "opportunities": [
    {
     "id": "a_renewal",
     "title": "Renew the alliance contract (35 docks)",
     "stage": "qualified",
     "worth_up_to": 350000,
     "size": null,
     "blocker": {"text": "Nobody can show which forces actually use the docks", "status": "open"},
     "evidence": ["rc_appetite_0","rc_appetite_2","km_usage_1","km_value_2","flight_log_force_month"],
     "deadline": null
    },
    {
     "id": "a_tarn",
     "title": "Tarn Valley and Norwold go live",
     "stage": "qualified",
     "worth_up_to": 200000,
     "size": null,
     "blocker": {"text": "The DPIA cannot be signed without the data-flow documents FlytBase never sent", "status": "open"},
     "evidence": ["rc_appetite_2","km_others_2","fo_dpia_2","fo_needs_3","pj_ticket","srv_dataflow","support_ticket_history"],
     "deadline": null
    },
    {
     "id": "a_westmere",
     "title": "Scale Westmere's fleet",
     "stage": "qualified",
     "worth_up_to": 250000,
     "size": null,
     "blocker": {"text": "No cost per flight against helicopter hours", "status": "open"},
     "evidence": ["km_staff_2","km_value_2","eb_heli_1","eb_sign_2","helicopter_cost_overtime","flight_log_force_month"],
     "deadline": null
    },
    {
     "id": "a_tender",
     "title": "Position for the 300-dock framework tender",
     "stage": "qualified",
     "worth_up_to": 1500000,
     "size": null,
     "blocker": {"text": "The specification has no costed operating model", "status": "open"},
     "evidence": ["rc_tender_2","hd_calloff_2","rc_funding_2","eb_sign_2","km_staff_2"],
     "deadline": {"text": "The tender specification locks. Whatever is not in it by then is out.", "soon": false, "passed": false, "met": false}
    }
   ],
   "offers": [
    {"id": "a_priority_support", "title": "Priority support for the drone units", "value": 60000, "pitch_to": "Insp. Karen Mbeki", "status": "won"},
    {"id": "a_training", "title": "Operator training for new pilots", "value": 45000, "pitch_to": "Insp. Karen Mbeki", "status": "won"},
    {"id": "a_extra_docks", "title": "Extra docks for Metro Central", "value": 180000, "pitch_to": "Ewan Brooks", "status": "open"}
   ],
   "deadlines": [
    {"text": "The tender specification locks. Whatever is not in it by then is out.", "passed": false}
   ]
  },
  {
   "id": "B",
   "name": "Aldermoor Industrial Group",
   "official_story": "ROI proven. 15 plants, 14 docks installed, 13 flying. Case study for 40-plant sister company in preparation.",
   "stakeholders": [
    {"id": "stefan_roy", "name": "Stefan Roy", "role": "Group head of security", "relationship": "ally", "available": true},
    {"id": "beatriz_alonso", "name": "Beatriz Alonso", "role": "Plant manager, Plant 7", "relationship": "neutral", "available": true},
    {"id": "nadia_rahman", "name": "Nadia Rahman", "role": "Group finance controller", "relationship": "warm", "available": true},
    {"id": "owen_fitch", "name": "Owen Fitch", "role": "Group IT infrastructure lead", "relationship": "neutral", "available": true},
    {"id": "julian_tate", "name": "Julian Tate", "role": "Insurance and risk manager", "relationship": "ally", "available": true}
   ],
   "facts": [
    {"id": "sr_roll_0", "text": "Thirteen of fifteen plants are flying.", "said_by": "Stefan Roy", "status": "claim", "learned_at_minute": 55},
    {"id": "sr_roll_2", "text": "Four plants fly regularly. Nine only log test flights. Plant 15 has no dock.", "said_by": "Stefan Roy", "status": "verified", "verified_by": "flight_log_by_plant", "learned_at_minute": 55},
    {"id": "sr_roi_0", "text": "ROI is proven, about 1.2 million euros a year saved.", "said_by": "Stefan Roy", "status": "claim", "learned_at_minute": 56},
    {"id": "sr_roi_2", "text": "The figure is his own spreadsheet of guard patrol hours the drones could replace. No guard contract has been reduced and finance has booked no saving.", "said_by": "Stefan Roy", "status": "verified", "verified_by": "roi_spreadsheet", "learned_at_minute": 56},
    {"id": "sr_repl_2", "text": "The rollout template lives mostly in his deputy's head. The deputy leaves soon (see Deadlines), and nothing is written down.", "said_by": "Stefan Roy", "status": "told", "learned_at_minute": 57},
    {"id": "sr_plants_2", "text": "Plants pay a share of the security budget. Several managers resent paying for equipment they did not choose.", "said_by": "Stefan Roy", "status": "told", "learned_at_minute": 58},
    {"id": "nr_cost_2", "text": "Security costs are charged to plants through an annual allocation. The drones added cost and she sees no reduction in any guard contract. Nobody has shown her the 1.2 million figure.", "said_by": "Nadia Rahman", "status": "told", "learned_at_minute": 64},
    {"id": "of_weak_1", "text": "Plants 11 to 14 have weak links and he had no part in the installs.", "said_by": "Owen Fitch", "status": "told", "learned_at_minute": 70},
    {"id": "ba_use_0", "text": "It's useful at night.", "said_by": "Beatriz Alonso", "status": "told", "learned_at_minute": 73},
    {"id": "ba_use_2", "text": "The dock flies nightly, but the plant's guard contractor does not act on drone alerts because their contract does not cover it. Alerts go to her phone.", "said_by": "Beatriz Alonso", "status": "told", "learned_at_minute": 73},
    {"id": "ba_deputy_0", "text": "Stefan's deputy, not Stefan, set up the Plant 7 dock and most of the others. He is the one who knows how a rollout is actually done.", "said_by": "Beatriz Alonso", "status": "told", "learned_at_minute": 73},
    {"id": "nr_evidence_2", "text": "She would accept ROI built on measured changes: guard contract renewals (three renew within four months), the insurance premium and incident losses.", "said_by": "Nadia Rahman", "status": "told", "learned_at_minute": 80},
    {"id": "jt_prem_2", "text": "The insurer cut premiums by 6% across nine plants, about 180,000 euros a year, citing the drone patrols. It is the only hard financial benefit and nobody in security asked him.", "said_by": "Neel Sharma", "status": "told", "learned_at_minute": 85},
    {"id": "jt_review_2", "text": "The insurer's review is in five months. Consistent flight logs by plant would extend the discount, and plants with idle docks put it at risk.", "said_by": "Julian Tate", "status": "told", "learned_at_minute": 89},
    {"id": "jt_intro_3", "text": "He can introduce the insurer's surveyor.", "said_by": "Julian Tate", "status": "verified", "verified_by": "insurer_log_pack", "learned_at_minute": 93},
    {"id": "nr_sister_1", "text": "The 40-plant sister company is not her budget and she has no view on it.", "said_by": "Nadia Rahman", "status": "told", "learned_at_minute": 96}
   ],
   "opportunities": [
    {
     "id": "b_renewal",
     "title": "Renew the Aldermoor contract (14 docks)",
     "stage": "qualified",
     "worth_up_to": 140000,
     "size": null,
     "blocker": {"text": "Finance cannot verify the savings the programme claims", "status": "open"},
     "evidence": ["sr_roll_0","sr_roll_2","ba_use_2","nr_cost_2","jt_prem_2","nr_evidence_2"],
     "deadline": null
    },
    {
     "id": "b_idle",
     "title": "Bring the idle plants into regular patrol",
     "stage": "qualified",
     "worth_up_to": 180000,
     "size": null,
     "blocker": {"text": "The network project will cut the docks off, and nobody owns adoption", "status": "open"},
     "evidence": ["sr_roll_2","of_weak_1","ba_use_2","sr_plants_2","sr_repl_2"],
     "deadline": {"text": "Stefan's deputy leaves, and the rollout know-how with him unless it is written down first.", "soon": false, "passed": false, "met": false}
    },
    {
     "id": "b_insurance",
     "title": "Protect and extend the insurance discount",
     "stage": "agreed",
     "worth_up_to": 90000,
     "size": "base",
     "blocker": {"text": "No consistent flight logs by plant for the insurer's review", "status": "cleared"},
     "evidence": ["jt_prem_2","jt_review_2","jt_intro_3","flight_log_by_plant","insurance_pack_template"],
     "deadline": null
    },
    {
     "id": "b_sister",
     "title": "Case study for the 40-plant sister company",
     "stage": "qualified",
     "worth_up_to": 1200000,
     "size": null,
     "blocker": {"text": "Every number rests on an unverified spreadsheet", "status": "open"},
     "evidence": ["sr_roi_2","jt_prem_2","nr_evidence_2","sr_roll_2","nr_sister_1","allocation_guard_summary","flight_log_by_plant"],
     "deadline": null
    }
   ],
   "offers": [
    {"id": "b_priority_support", "title": "Night-time priority support for Plant 7", "value": 50000, "pitch_to": "Beatriz Alonso", "status": "declined"},
    {"id": "b_reporting", "title": "Flight-log reporting by plant for finance and the insurer", "value": 70000, "pitch_to": "Nadia Rahman", "status": "won"},
    {"id": "b_more_plants", "title": "Docks for Plant 15 and two idle plants", "value": 160000, "pitch_to": "Stefan Roy", "status": "won"}
   ],
   "deadlines": [
    {"text": "Stefan's deputy leaves, and the rollout know-how with him unless it is written down first.", "passed": false}
   ]
  }
 ],
 "files": [
  {"id": "flight_log_force_month", "title": "Flight log force month", "account": "A"},
  {"id": "support_ticket_history", "title": "Support ticket history", "account": "A"},
  {"id": "helicopter_cost_overtime", "title": "Helicopter cost overtime", "account": "A"},
  {"id": "flight_log_by_plant", "title": "Flight log by plant", "account": "B"},
  {"id": "roi_spreadsheet", "title": "Roi spreadsheet", "account": "B"},
  {"id": "allocation_guard_summary", "title": "Allocation guard summary", "account": "B"},
  {"id": "insurance_pack_template", "title": "Insurance pack template", "account": "B"},
  {"id": "insurer_log_pack", "title": "Insurer log pack", "account": "B"}
 ]
}
```

---

## 5. KEY NUMBERS (from MCP data, use these — don't invent)

### Account A — Eastern Counties Police Alliance
| Deal | worth_up_to | Stage | Blocker Status |
|------|------------|-------|---------------|
| Renew alliance contract (35 docks) | $350,000 | qualified | open |
| Tarn Valley and Norwold go live | $200,000 | qualified | open |
| Scale Westmere's fleet | $250,000 | qualified | open |
| 300-dock framework tender | $1,500,000 | qualified | open |
| **Pipeline Total** | **$2,300,000** | | |

Won offers: $105,000 (priority support $60k + training $45k)
Open offer: $180,000 (extra docks Metro Central)

### Account B — Aldermoor Industrial Group
| Deal | worth_up_to | Stage | Blocker Status |
|------|------------|-------|---------------|
| Renew Aldermoor contract (14 docks) | $140,000 | qualified | open |
| Bring idle plants into patrol | $180,000 | qualified | open |
| Protect insurance discount | $90,000 | agreed | cleared |
| Case study 40-plant sister co | $1,200,000 | qualified | open |
| **Pipeline Total** | **$1,610,000** | | |

Won offers: $230,000 (reporting $70k + more plants $160k)
Declined offer: $50,000 (night support Plant 7)

---

## 6. CORE LIB FILES

### `src/lib/db.ts`
```typescript
import { createClient } from '@libsql/client';

export const db = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});
```

### `src/lib/mcp.ts`
```typescript
const MCP_ENDPOINT = process.env.MCP_ENDPOINT!;
const MCP_TOKEN = process.env.MCP_TOKEN!;

let lastCallTime = 0;

export async function callMCP(toolName: string, args: Record<string, any> = {}) {
  // Rate limit: 1 call per minute
  const now = Date.now();
  const elapsed = now - lastCallTime;
  if (elapsed < 60000 && lastCallTime > 0) {
    const wait = 60000 - elapsed;
    await new Promise(r => setTimeout(r, wait));
  }
  lastCallTime = Date.now();

  const res = await fetch(MCP_ENDPOINT, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${MCP_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      jsonrpc: '2.0',
      method: 'tools/call',
      params: { name: toolName, arguments: args },
      id: Date.now(),
    }),
  });
  const data = await res.json();
  if (data.result?.content?.[0]?.text) {
    return JSON.parse(data.result.content[0].text);
  }
  return data.result;
}
```

### `src/lib/gemini.ts`
```typescript
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function askGemini(systemPrompt: string, userMessage: string) {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
  const result = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: userMessage }] }],
    systemInstruction: systemPrompt,
  });
  return result.response.text();
}
```

---

## 7. API ROUTES

### `src/app/api/seed/route.ts`
Reads `seed.json`, inserts into Turso tables. Call once at startup.
- Parse each account → INSERT into `accounts`
- Parse stakeholders → INSERT into `contacts`
- Parse facts → INSERT into `facts`
- Parse opportunities → INSERT into `deals`
- Parse offers → INSERT into `offers`
- Parse files → INSERT into `files`
- Log to `sync_log`

### `src/app/api/accounts/route.ts`
```
GET → query all tables by account_id, return structured JSON
?id=A or ?id=B
```
Returns: `{ account, contacts, facts, deals, offers, files, notes }`

### `src/app/api/signals/route.ts`
```
GET → callMCP('get_signals') → store new ones in signals table → return all
```
This is the LIVE UPDATE demo. Add a "Refresh Signals" button in UI.

### `src/app/api/notes/route.ts`
```
GET → return all notes from DB
POST { account, kind, title, text } → save to DB + callMCP('write_note', {...})
```
This is the WRITE-BACK demo.

### `src/app/api/copilot/route.ts`
```
POST { accountId, message } →
  1. Load account data from DB
  2. Build system prompt with account context
  3. Call askGemini(systemPrompt, message)
  4. Return response
```

---

## 8. GEMINI SYSTEM PROMPT (for copilot)

```
You are NEXUS, an AI account intelligence copilot for a CRM system.

You are analyzing account: {account.name}

RULES:
- Only use the data provided below. NEVER invent numbers, people, or documents.
- Always cite evidence IDs (e.g. [km_usage_1]) when making claims.
- Distinguish between "verified" (backed by a file), "told" (someone said it), and "claim" (unverified assertion).
- If you don't know something, say so explicitly.
- When recommending actions, be specific: name the person, the deal, and the reason.

ACCOUNT DATA:
{JSON.stringify(accountData)}

Answer the user's question based solely on this data.
```

---

## 9. MAIN PAGE STRUCTURE

### `src/app/page.tsx`
```
Top bar: NEXUS logo + "Last synced: {time}" + Refresh button
Account tabs: [Eastern Counties Police Alliance] [Aldermoor Industrial Group]
Selected account workspace:
  - Overview cards (pipeline value, deals count, contacts, risks)
  - Tab navigation: Deals | People | Actions | Risks | Evidence | Unknowns
  - Active tab content
  - Floating copilot button → opens chat sidebar
```

### Component behavior per tab:

**Overview** — 4 summary cards:
- Pipeline: sum of worth_up_to for all deals
- Won: sum of won offer values
- At Risk: count of deals with open blockers
- Contacts: count with relationship badges

**Deal Intelligence** — Table/cards:
- Each deal: title, stage badge, worth_up_to, blocker (if open → red), evidence list
- Click evidence ID → show fact text + status badge (verified/told/claim)
- This is the TRACEABILITY demo

**People & Power Map** — Grid:
- Each contact: name, role, relationship badge (ally=green, warm=blue, neutral=gray)
- Under each: list deals they're connected to (via evidence + offers pitch_to)
- Inferred roles (use Gemini at seed time to generate and store):
  - Decider / Payer / User / Blocker per deal

**Next Best Actions** — 3 cards:
- Pre-generate with Gemini at seed time, store in DB
- Each: priority, action, deal, contact, reason, evidence, target date

**Risk Radar** — Cards:
- Every deal with blocker_status="open"
- Every deadline (passed or upcoming)
- Contacts with "neutral" relationship on key deals
- Missing evidence items

**Evidence & Unknowns** — Two sections:
- Evidence: all facts grouped by status (verified → told → claim)
- Unknowns: facts/files referenced in deals but not in the facts table

---

## 10. STAKEHOLDER ROLE INFERENCE (pre-generate with Gemini)

At seed time, call Gemini ONCE per account with this prompt:

```
Given the following account data, for each deal identify who fills these roles:
- Decider: who makes or approves the decision
- Payer: who controls the budget
- User: who uses the product/service
- Blocker: who is preventing progress

Only use people from the stakeholders list. If a role is unknown, say "Unknown".
Mark your confidence as "inferred" since this is AI analysis, not verified data.

Account data: {accountData}

Return as JSON: { "deal_id": { "decider": {...}, "payer": {...}, "user": {...}, "blocker": {...} } }
```

Store the result. Display with an "AI Inferred" badge (not "Verified").

---

## 11. MCP TOOLS REFERENCE

| Tool | Use | When to call |
|------|-----|-------------|
| `get_my_accounts` | Full account data | Once at seed time |
| `get_file` (id) | File content | Once per file at seed |
| `get_all_paperwork` (account: A/B) | Contracts, emails, tickets, flights | Once per account at seed |
| `get_signals` | Live events | On "Refresh" button click |
| `list_notes` | Saved notes | On page load |
| `write_note` (text, account, kind, title) | Save a note | On user submit |
| `get_flytbase_team` | Internal team info | Once at seed |
| `get_feature_requests` | Feature requests | Once at seed |
| `get_release_notes` | Software updates | Once at seed |
| `search_paperwork` (q, account?) | Search records | Optional, for copilot |

**RATE LIMIT: 1 call per minute. Queue all calls. Cache everything.**

---

## 12. UI DESIGN NOTES

- **Dark sidebar** with NEXUS logo, account switcher, nav links
- **Light main area** with cards
- **Color scheme**: 
  - Verified = green badge
  - Told = yellow badge  
  - Claim = orange badge
  - Unknown = gray badge
  - Blocker open = red
  - Blocker cleared = green
  - Ally = green dot
  - Warm = blue dot
  - Neutral = gray dot
- **Copilot**: slide-out right panel, chat bubbles, input at bottom
- Use shadcn Card, Badge, Tabs, Button, Dialog throughout

---

## 13. DEPLOYMENT (last 20 min)

```bash
# Vercel
npm i -g vercel
vercel login
vercel --prod

# Set env vars in Vercel dashboard:
# GEMINI_API_KEY, MCP_TOKEN, MCP_ENDPOINT, TURSO_DATABASE_URL, TURSO_AUTH_TOKEN

# After deploy, hit /api/seed once to populate DB
```

### .gitignore additions
```
.env.local
.env
```

---

## 14. BUILD ORDER (2 hours)

| Time | Task | Files |
|------|------|-------|
| 0-10 | Setup Next.js + deps + Turso + env | terminal |
| 10-20 | Create db.ts, mcp.ts, gemini.ts, seed.json | src/lib/*, src/data/ |
| 20-35 | Build seed API route + run it | api/seed/route.ts |
| 35-55 | Build accounts API + main page layout + account switcher | api/accounts, page.tsx, account-switcher |
| 55-75 | Build Deal Intelligence + Evidence panel | deal-intelligence.tsx, evidence-panel.tsx |
| 75-85 | Build Power Map + Risk Radar | power-map.tsx, risk-radar.tsx |
| 85-95 | Build Next Actions (Gemini pre-generated) | next-actions.tsx |
| 95-110 | Build Copilot chat | copilot.tsx, api/copilot/route.ts |
| 110-115 | Build signals refresh | api/signals/route.ts, signal display |
| 115-120 | Build note writer | note-writer.tsx, api/notes/route.ts |
| 120-130 | Test both accounts, fix bugs | - |
| 130-140 | Deploy to Vercel | terminal |
| 140-150 | Write README + Google Doc | - |
| 150-160 | Record 3-min video | - |

---

## 15. DEMO SCRIPT (3-min video)

1. **0:00-0:20** — Open app, show both account tabs
2. **0:20-0:50** — Account A: show pipeline ($2.3M), walk through deals
3. **0:50-1:10** — Click a deal value → trace to evidence → show verified badge (TRACEABILITY)
4. **1:10-1:30** — Show Power Map: stakeholders, roles, relationships
5. **1:30-1:50** — Show Next Best Actions: 3 ranked recommendations
6. **1:50-2:10** — Show Risk Radar: blockers, deadlines
7. **2:10-2:20** — Click Refresh Signals → new event appears (LIVE UPDATE)
8. **2:20-2:35** — Write a note → save → verify it persists (WRITE-BACK)
9. **2:35-2:50** — Ask Copilot: "What is our biggest risk?" → show AI response with citations
10. **2:50-3:00** — Brief code walkthrough: show MCP rate limiter, Gemini integration

---

**This blueprint is everything. Hand it to any AI, say "build this", and it has all the data, all the schemas, all the routes, all the prompts.**
