# NEXUS — Intelligence Engine & Dynamic Accounts Prompt

Copy and paste this prompt to your AI coding agent (Cursor, Claude, Windsurf, etc.) to implement:
1. **Rich Stakeholder Personas & Info Cards**
2. **Forensic Call & Email Insights (Claim vs. Reality)**
3. **Zero-Code Dynamic Account Discovery**

---

```markdown
You are enhancing NEXUS CRM with three critical enterprise intelligence capabilities:
1. Rich Stakeholder Personas & Info Cards (with platform telemetry & power mapping)
2. Forensic Call & Email Evidence Engine (triangulating claims vs. actual paperwork)
3. Zero-Code Dynamic Account Auto-Discovery (supporting any new accounts from MCP automatically)

Follow these specifications strictly:

================================================================================
PART 1: ZERO-CODE DYNAMIC ACCOUNT AUTO-DISCOVERY
================================================================================
Do NOT hardcode accounts "A" and "B" anywhere in your business logic or UI.
Make all account ingestion and routing completely data-driven:

1. Ingestion / Sync Route (`src/app/api/seed/route.ts` & `src/app/api/sync/route.ts`):
   - Call MCP `get_my_accounts` (or `GET /api/public/v1/export`).
   - Iterate dynamically through `exportData.accounts`:
     ```typescript
     for (const acc of exportData.accounts) {
       // Upsert account
       await db.execute({
         sql: `INSERT INTO accounts (id, name, official_story, raw_json, synced_at)
               VALUES (?, ?, ?, ?, datetime('now'))
               ON CONFLICT(id) DO UPDATE SET name=excluded.name, raw_json=excluded.raw_json, synced_at=datetime('now')`,
         args: [acc.id, acc.name, acc.official_story, JSON.stringify(acc)]
       });

       // Auto-fetch paperwork pack dynamically for each discovered account
       try {
         const packData = await callMCP('get_all_paperwork', { account: acc.id });
         // store records into paperwork table (account_id, path, kind, text, data)
       } catch (e) {
         console.warn(`No paperwork pack found for account ${acc.id}`);
       }
     }
     ```

2. Dynamic Navigation & Routing:
   - Dashboard & Accounts Grid must fetch `SELECT * FROM accounts` and render tabs/cards dynamically.
   - The deep-dive page `/accounts/[id]` dynamically renders based on `params.id`.
   - If the upstream MCP server introduces Account C tomorrow, clicking "Sync" will ingest Account C and display it in the UI with zero code changes.

================================================================================
PART 2: STAKEHOLDER PERSONA & POWER INFO CARDS
================================================================================
In `src/components/account/people-tab.tsx` (and `person-card.tsx`), build rich Person Info Cards for each stakeholder.

Each Person Info Card must display:
1. Header:
   - Full Name, Official Title, and Police Force / Plant location.
   - Relationship Badge:
     - Ally (Green: Rhys Calder, Karen Mbeki, Stefan Roy, Julian Tate)
     - Warm (Blue: Nadia Rahman)
     - Neutral (Gray/Amber: Fatima Osei, Ewan Brooks, Hannah Doyle, Beatriz Alonso, Owen Fitch)
2. Activity & Engagement Meter:
   - Extract sign-in activity from `users.json` records in the paperwork:
     - Insp. Karen Mbeki: "62 logins in last 90 days — High Power User"
     - Stefan Roy: "0 logins in last 90 days — Inactive / Delegated"
     - Deputy (U02): "38 logins in last 90 days — Daily Operational Lead"
3. Four Mandatory Commercial Roles (Power Map):
   - Tag each person with their inferred deal role: [Decider] | [Payer] | [User] | [Blocker] | [Champion]
4. The Hot-Button / Pain Point:
   - Karen Mbeki: "Saturday 5 Dec public policing event & dying night batteries"
   - Fatima Osei: "Unanswered 4-month-old Ticket FB-10412 blocking DPIA sign-off"
   - Ewan Brooks: "Demands drone cost-per-flight vs. £1,500/hr helicopter benchmark"
   - Nadia Rahman: "Requires plant-by-plant quote; rejects unverified €1.2M savings"
   - Beatriz Alonso: "Woken up by night alerts; guard contractor refuses to respond"
5. Actionable "How to Engage" Drawer:
   - An AI-generated, specific engagement directive for this stakeholder.

================================================================================
PART 3: FORENSIC CALL & EMAIL INSIGHTS (CLAIM VS. REALITY)
================================================================================
In `src/components/account/deals-tab.tsx` and `evidence-tab.tsx`, implement the **Forensic Reality Check**:

1. Evidence Integrity Badges:
   - Every deal value and claim must carry a provenance badge:
     - [VERIFIED] (Green): Backed by file or confirmed telemetry (e.g., flight logs, contract, insurer discount letter).
     - [TOLD] (Yellow): Stated by a person during a call or email.
     - [CLAIM / CONTRADICTED] (Red/Orange): Stated verbally, but contradicted by records.

2. Smoking Gun Forensic Drawers:
   When a user clicks on a deal blocker or evidence item, show a slide-out drawer with the exact source excerpt:
   
   - Deal: "Tarn Valley and Norwold go live ($200,000)"
     -> Surface Support Ticket FB-10412 (Opened 2026-06-29, Chased 2026-08-14, Unassigned).
     -> Show text: "The Tarn Valley ticket asking for data-flow documents was logged 4 months ago and never answered."
     -> Action: "Send data-flow pack (`srv_dataflow`) to Fatima Osei to unlock $200k."

   - Deal: "Renew Aldermoor contract ($140,000) & Case Study ($1,200,000)"
     -> Surface Email 2026-07-16 from Stefan Roy ("ROI is proven, €1.2M saved... [No detail received]").
     -> Surface Email 2026-10-08 from Group Finance ("Send quote broken down by plant... Unanswered").
     -> Contradiction Warning: "Stefan told FlytBase to ignore Finance. Finance controls the renewal."

3. Evidence Traceability Links:
   Every recommendation must link back to specific file or fact IDs (e.g. `[Ticket FB-10412]`, `[Email 2026-07-16]`, `[Fact km_usage_1]`, `[Fact jt_prem_2]`).

================================================================================
PART 4: GEMINI PROMPT FOR INTELLIGENCE GENERATION
================================================================================
When analyzing accounts or running Copilot, use this system instruction:

"You are NEXUS, an account intelligence engine. 
You do not give generic sales advice. You ground every conclusion in the account's paperwork, emails, call transcripts, and flight logs.
- Always distinguish between what a contact claimed vs what the paperwork proves.
- When identifying a blocker, look for unanswered tickets or missing documentation.
- When recommending actions, specify the contact, the commercial value unlocked, and the exact evidence ID.
- Never invent figures or assume budget exists if financing sign-off is unverified."

Start by implementing the dynamic account ingestion, then build the Person Info Cards, followed by the Forensic Evidence drawers.
```
