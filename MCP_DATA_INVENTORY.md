# NEXUS — Complete MCP Data Inventory & Intelligence Dossier

> **Source**: Questathon Live MCP & REST API (`https://questathon.aihackerscollective.com/api/public/`)  
> **Extracted at**: 2026-11-14  
> **Status**: Verified live against upstream service  
> **Rate Limit Note**: 1 upstream call per minute per token (HTTP 429 returns `retry_after_seconds`).

---

## 1. Upstream Service Architecture & Tool Capabilities

### Protocol & Endpoints
The service supports both **JSON-RPC 2.0 MCP** over HTTP and **REST API v1**:
- **MCP Endpoint**: `POST https://questathon.aihackerscollective.com/api/public/mcp`
- **REST Base**: `https://questathon.aihackerscollective.com/api/public/v1`
- **Auth**: `Authorization: Bearer <MCP_TOKEN>`

### Available Tools & Equivalent REST Routes
| Tool Name | REST Route | Description |
|-----------|------------|-------------|
| `whoami` | `GET /me` | Player status, game state, active packs, live signals count |
| `get_my_accounts` | `GET /export` | Core accounts, stakeholders, facts, deals, offers, deadlines |
| `get_all_paperwork` | `GET /pack/{A\|B}/all` | **Complete history pack** in 1 call (calls, emails, contracts, tickets, flights, devices, invoices) |
| `list_paperwork` | `GET /pack` / `GET /pack/{A\|B}` | Directory index of available paperwork records |
| `get_paperwork_record` | `GET /pack/{A\|B}/{path}` | Individual file/transcript retrieval |
| `search_paperwork` | `GET /pack/search?q={query}` | Global text search across all accounts' records |
| `get_file` | `GET /files/{id}` | Direct file download by file ID |
| `get_signals` | `GET /signals` | Live events that arrived post-handover |
| `list_notes` | `GET /notes` | Existing CRM notes/tasks/risks written back |
| `write_note` | `POST /notes` | Persist a note, task, risk, or next step |
| `get_flytbase_team` | `GET /pack/team` | Internal FlytBase colleagues and responsibilities |
| `get_feature_requests` | `GET /pack/feature-requests` | Feature request log across accounts |
| `get_release_notes` | `GET /pack/release-notes` | Overnight software updates pushed to docks |

---

## 2. Account A: Eastern Counties Police Alliance

### Profile & Contract
- **Type**: Public-sector joint policing alliance (4 member forces: Westmere, Metro Central, Tarn Valley, Norwold).
- **Existing Contract**: Signed 20 Jan 2026 by Alliance Office. **£350,000 / year**, 35 docks + aircraft, 1 Mar 2026 to 28 Feb 2027.
- **Invoicing**: Invoiced in 4 parts directly to member forces (no pooled alliance budget).
- **Operational Reality**: Only Westmere and Metro Central fly operationally. Norwold only trains; Tarn Valley has never flown a live mission.

### Stakeholders & Relationship Sentiment
| Name | Role | Stance | Key Intelligence |
|------|------|--------|------------------|
| **Rhys Calder** | Alliance drone programme lead | **Ally** *(Moving!)* | Program champion; single contact on all past calls; **leaves in January with no successor named**. |
| **Insp. Karen Mbeki** | Drone unit inspector, Westmere | **Ally** | Power user; runs 14 of 18 flying docks; desperate for more operator training before 5 Dec public event. |
| **Fatima Osei** | Data Protection Officer, Tarn Valley | **Neutral** *(Blocker)* | Blocks rollout across Tarn Valley & Norwold; needs data-flow & retention docs requested 4 months ago. |
| **Ewan Brooks** | Finance business partner, Metro Central | **Neutral** *(Payer)* | Will only sign off call-offs if drone cost per flight is quantitatively lower than £1,500/hr helicopter cost. |
| **Hannah Doyle** | Alliance procurement lead | **Neutral** *(Decider)* | Manages the upcoming 300-dock framework tender; alliance cannot commit individual forces' budgets. |

### Commercial Opportunities (Deals)
| ID | Deal Title | Stage | Worth Up To | Blocker Status & Root Cause | Key Evidence & Files |
|----|------------|-------|-------------|-----------------------------|----------------------|
| `a_renewal` | Renew the alliance contract (35 docks) | Qualified | **$350,000** | **OPEN**: Nobody can demonstrate which forces actually use the docks. | `rc_appetite_0`, `rc_appetite_2`, `km_usage_1`, `km_value_2`, `flight_log_force_month.csv` |
| `a_tarn` | Tarn Valley and Norwold go live | Qualified | **$200,000** | **OPEN**: DPIA cannot be signed without data-flow docs FlytBase support failed to send. | `fo_dpia_2`, `pj_ticket` (Ticket `FB-10412`), `fo_needs_3`, `srv_dataflow.csv` |
| `a_westmere` | Scale Westmere's fleet | Qualified | **$250,000** | **OPEN**: No cost per flight calculated to compete against £1,500/hr helicopter hours. | `km_staff_2`, `eb_heli_1`, `eb_sign_2`, `helicopter_cost_overtime.csv` |
| `a_tender` | Position for 300-dock framework tender | Qualified | **$1,500,000** | **OPEN**: Tender spec locks soon; currently lacks any costed operating model or operator staffing plan. | `rc_tender_2`, `hd_calloff_2`, `rc_funding_2`, `km_staff_2` |

**Total Pipeline**: **$2,300,000**

### Contracted Offers & Up-sells
- **Priority support for drone units**: $60,000 (Status: **WON**, pitched to Karen Mbeki)
- **Operator training for new pilots**: $45,000 (Status: **WON**, pitched to Karen Mbeki)
- **Extra docks for Metro Central**: $180,000 (Status: **OPEN**, pitched to Ewan Brooks)

### Paperwork & Forensic Evidence (35 Files on Record)
- **Calls (15 Transcripts/Notes)**:
  - `calls/2025-06-24_enquiry_call.txt` to `calls/2026-10-20_check_in.txt`: Traces pilot scoping, installation of 35 docks, and growing operational divergence between forces.
- **Support Tickets (`tickets.json`)**:
  - **Ticket `FB-10412` (Opened 2026-06-29)**: Document request from force contact. **Status: OPEN / UNASSIGNED**. Chased 2026-08-14 with zero reply. This is the exact root cause blocking Fatima Osei's DPIA and the $200k Tarn Valley go-live!
- **Flight & Device Telemetry**:
  - `flights.csv` & `usage_weekly.csv`: Confirms 14/18 active docks fly regularly; mostly Westmere.

---

## 3. Account B: Aldermoor Industrial Group

### Profile & Contract
- **Type**: Heavy industrial manufacturing conglomerate (15 production plants).
- **Existing Contract**: Signed 15 Jan 2026 by Stefan Roy. **€140,000 / year**, 14 docks installed, 1 Feb 2026 to 31 Jan 2027. No auto-renewal.
- **Current Deployment**: 14 docks installed, 13 claimed flying. In reality: **only 4 plants fly regularly**, 9 only run test flights, Plant 15 has no dock installed.

### Stakeholders & Relationship Sentiment
| Name | Role | Stance | Key Intelligence |
|------|------|--------|------------------|
| **Stefan Roy** | Group head of security | **Ally** *(Vulnerable)* | Championed rollout; claims €1.2M savings based on unverified theoretical guard hours; rollout details reside in his deputy's head. |
| **Beatriz Alonso** | Plant manager, Plant 7 | **Neutral** | Night dock flies, but third-party guard contractor ignores drone alerts (alerts dumped to her mobile); deputy configured dock. |
| **Nadia Rahman** | Group finance controller | **Warm** *(Payer)* | Controls renewal; rejects Stefan's €1.2M claim; will approve contract if backed by verified guard contract renewals & insurance savings. |
| **Owen Fitch** | Group IT infrastructure lead | **Neutral** *(Blocker)* | Plant 11-14 have weak network links; upcoming group network revamp will cut docks off unless coordinated. |
| **Julian Tate** | Insurance & risk manager | **Ally** | Secured **6% insurance premium cut (€180k/yr)** across 9 plants due to drone patrols; review in 5 months requires verified flight logs. |

### Commercial Opportunities (Deals)
| ID | Deal Title | Stage | Worth Up To | Blocker Status & Root Cause | Key Evidence & Files |
|----|------------|-------|-------------|-----------------------------|----------------------|
| `b_renewal` | Renew Aldermoor contract (14 docks) | Qualified | **$140,000** | **OPEN**: Finance cannot verify claimed savings; needs plant-by-plant pricing and guard contract offsets. | `sr_roll_0`, `sr_roll_2`, `ba_use_2`, `nr_cost_2`, `jt_prem_2`, `nr_evidence_2` |
| `b_idle` | Bring idle plants into regular patrol | Qualified | **$180,000** | **OPEN**: Network overhaul risks cutting docks off; Stefan's deputy leaves soon with undocumented rollout knowledge. | `sr_roll_2`, `of_weak_1`, `ba_use_2`, `sr_plants_2`, `sr_repl_2` |
| `b_insurance` | Protect & extend insurance discount | **Agreed** | **$90,000** | **CLEARED**: Ready to expand; requires consistent flight logs by plant for insurer review. | `jt_prem_2`, `jt_review_2`, `jt_intro_3`, `flight_log_by_plant.csv`, `insurance_pack_template` |
| `b_sister` | Case study for 40-plant sister company | Qualified | **$1,200,000** | **OPEN**: Sister company pitch relies entirely on Stefan's unverified €1.2M spreadsheet. | `sr_roi_2`, `jt_prem_2`, `nr_evidence_2`, `allocation_guard_summary.csv` |

**Total Pipeline**: **$1,610,000**

### Contracted Offers & Up-sells
- **Flight-log reporting by plant for finance & insurer**: $70,000 (Status: **WON**, pitched to Nadia Rahman)
- **Docks for Plant 15 and two idle plants**: $160,000 (Status: **WON**, pitched to Stefan Roy)
- **Night-time priority support for Plant 7**: $50,000 (Status: **DECLINED**, pitched to Beatriz Alonso)

### Paperwork & Forensic Evidence (29 Files on Record)
- **Emails**:
  - `emails/2026-07-16_stefan_savings.txt`: Stefan admits the €1.2M figure is an estimate; promised detail was never sent (`[No detail received]`).
  - `emails/2026-10-08_finance_mailbox.txt`: Group Finance demands plant-by-plant cost breakdown before renewal. **Unanswered on file**.
- **Crucial Deadline**: Stefan's deputy leaves imminent; without formal handover, rollout knowledge for Plants 8-15 is permanently lost.

---

## 4. Live Signals (Breaking Events)

The upstream endpoint `GET /api/public/v1/signals` returns **2 active live signals**:

### Signal 1: `champion_leaves` (Account A)
- **Date**: 2026-11-17
- **Title**: *Eastern Counties: Rhys Calder is moving on*
- **Summary**: Rhys Calder emailed stating he leaves the drone programme in January. No successor has been named. Every past alliance call was with him alone.
- **Commercial Impact**: Critical threat to the **$1.5M Framework Tender** and **$350k Alliance Renewal**.
- **Action Required**: Immediately schedule an executive handover with Rhys and engage Hannah Doyle (Procurement) directly.

### Signal 2: `urgent_request` (Account A)
- **Date**: 2026-11-18
- **Title**: *Eastern Counties: Westmere needs an answer before a public event*
- **Summary**: Insp. Karen Mbeki logged ticket **`FB-11206`** regarding a major public policing event on Saturday 5 December. Demands written confirmation of operator training dates and guaranteed SLA response for dock failures.
- **Commercial Impact**: Decides whether Westmere expands fleet ($250k) or disengages.
- **Action Required**: Confirm training schedule and assign designated standby engineer before 5 Dec.

---

## 5. Summary of Data Assets Available for the Build

| Data Asset | Account A | Account B | Global / System |
|------------|-----------|-----------|-----------------|
| **Stakeholders** | 5 | 5 | FlytBase Team (`/pack/team`) |
| **Deals / Opportunities** | 4 ($2.3M) | 4 ($1.61M) | Total Book: **$3.91M** |
| **Won Contract Offers** | $105,000 | $230,000 | Total Won: **$335,000** |
| **Logged Facts** | 22 (Claims, Told, Verified) | 16 (Claims, Told, Verified) | 38 Total Evidence Points |
| **Paperwork Records** | 35 files (Calls, Mails, Tickets) | 29 files (Calls, Mails, Invoices) | 64 Complete Archival Files |
| **Live Signals** | 2 breaking events | 0 | Dynamic live feed |
| **Notes / Write-backs** | Initial CRM note (#146132) | Ready for write-back | Live persistent write-back |
