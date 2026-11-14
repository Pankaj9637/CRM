export interface StakeholderPersona {
  id: string;
  name: string;
  role: string;
  location: string;
  relationship: 'ally' | 'warm' | 'neutral';
  dealRole: 'Decider' | 'Payer' | 'User' | 'Blocker' | 'Champion';
  loginCount90d: number;
  activityLabel: string;
  activityPercentage: number;
  activityStatus: 'high' | 'moderate' | 'low' | 'inactive';
  painPoint: string;
  howToEngageDirective: string;
  groundingEvidence: string[];
}

export interface ForensicEvidenceRecord {
  dealId: string;
  dealTitle: string;
  accountId: string;
  claimedValue: number;
  integrity: 'verified' | 'told' | 'contradicted';
  claimText: string;
  claimedBy: string;
  realityText: string;
  contradictionWarning?: string;
  sourceDocId: string;
  sourceDocType: 'ticket' | 'email' | 'call' | 'telemetry' | 'contract';
  sourceDate?: string;
  sourceRequesterOrSender?: string;
  verbatimExcerpt: string;
  actionableUnlock: string;
  actionContact: string;
  unlockValue: number;
  evidenceIds: string[];
}

export const STAKEHOLDER_PERSONAS: Record<string, StakeholderPersona> = {
  // Account A Stakeholders
  rc_rhys: {
    id: 'rc_rhys',
    name: 'Rhys Calder',
    role: 'Alliance Programme Lead',
    location: 'Eastern Counties Police Alliance (HQ)',
    relationship: 'ally',
    dealRole: 'Champion',
    loginCount90d: 9,
    activityLabel: '9 logins in last 90 days — Account Administrator',
    activityPercentage: 35,
    activityStatus: 'moderate',
    painPoint: 'Wants operational expansion to Tarn Valley & Norwold but needs cross-force protocol before planned departure',
    howToEngageDirective: 'Arm Rhys with the completed Tarn Valley DPIA resolution pack and a costed tender staffing model before his departure announcement ripples through the Alliance board.',
    groundingEvidence: ['rc_roll_2', 'rc_tender_2', 'champion_leaves', 'users.json (U01)'],
  },
  km_karen: {
    id: 'km_karen',
    name: 'Insp. Karen Mbeki',
    role: 'Unit Administrator & Operations Lead',
    location: 'Metro Central Police Drone Unit',
    relationship: 'ally',
    dealRole: 'User',
    loginCount90d: 62,
    activityLabel: '62 logins in last 90 days — High Power User',
    activityPercentage: 92,
    activityStatus: 'high',
    painPoint: 'Saturday 5 Dec public policing event & dying night batteries across frontline patrol docks',
    howToEngageDirective: 'Emergency dispatch high-capacity cold-weather replacement battery packs for the Metro Central docks ahead of the Saturday 5 Dec event; capture her signed flight-log case study.',
    groundingEvidence: ['km_usage_1', 'km_value_2', 'emails/2026-08-11_karen_batteries.txt', 'users.json (U02)'],
  },
  fo_fatima: {
    id: 'fo_fatima',
    name: 'Fatima Osei',
    role: 'Alliance Data Protection Officer (DPO)',
    location: 'Alliance Governance & Information Assurance',
    relationship: 'neutral',
    dealRole: 'Blocker',
    loginCount90d: 0,
    activityLabel: '0 platform logins — External Governance Gatekeeper',
    activityPercentage: 5,
    activityStatus: 'inactive',
    painPoint: 'Unanswered 4-month-old Ticket FB-10412 blocking DPIA sign-off for 2 forces',
    howToEngageDirective: 'Bypass standard support queues and directly courier the comprehensive srv_dataflow architecture pack to her desk. Once received, her 3-week DPIA sign-off cycle unlocks $200k in live flights.',
    groundingEvidence: ['fo_dpia_2', 'fo_needs_3', 'tickets.json (FB-10412)', 'srv_dataflow'],
  },
  eb_ewan: {
    id: 'eb_ewan',
    name: 'Ewan Brooks',
    role: 'Force Finance Director / CFO',
    location: 'Metro Central Police Headquarters',
    relationship: 'neutral',
    dealRole: 'Payer',
    loginCount90d: 0,
    activityLabel: '0 platform logins — Financial Controller',
    activityPercentage: 10,
    activityStatus: 'inactive',
    painPoint: 'Demands drone cost-per-flight vs. £1,500/hr helicopter benchmark before signing fleet scaling',
    howToEngageDirective: 'Deliver unit-economics model demonstrating FlytBase drone deployment at £120/flight hour vs £1,500/hr National Police Air Service helicopter benchmark to unlock the $250k Westmere fleet expansion.',
    groundingEvidence: ['eb_heli_1', 'eb_sign_2', 'calls/2026-09-09_check_in.txt', 'flights.csv'],
  },
  hd_hannah: {
    id: 'hd_hannah',
    name: 'Hannah Doyle',
    role: 'Commercial & Procurement Lead',
    location: 'Alliance Commercial Services',
    relationship: 'neutral',
    dealRole: 'Decider',
    loginCount90d: 0,
    activityLabel: '0 platform logins — Procurement & Framework Authority',
    activityPercentage: 10,
    activityStatus: 'inactive',
    painPoint: 'Procurement compliance & framework alignment; tender specification locks imminently without operating model',
    howToEngageDirective: 'Submit draft costed operating model and multi-force operator staffing framework before the specification locks; safeguard FlytBase position on the 300-dock framework ($1.5M).',
    groundingEvidence: ['hd_calloff_2', 'rc_tender_2', 'calls/2026-10-20_check_in.txt'],
  },

  // Account B Stakeholders
  stefan_roy: {
    id: 'stefan_roy',
    name: 'Stefan Roy',
    role: 'Group Head of Security',
    location: 'Aldermoor Industrial Group HQ',
    relationship: 'ally',
    dealRole: 'Champion',
    loginCount90d: 0,
    activityLabel: '0 logins in last 90 days — Inactive / Delegated',
    activityPercentage: 0,
    activityStatus: 'inactive',
    painPoint: 'Claimed €1.2M savings rejected by Finance; rollout template trapped in departing deputy\'s head',
    howToEngageDirective: 'Pair with Stefan to interview his departing deputy this week. Align his patrol spreadsheet with actual plant guard renewal dates to build credibility with Nadia Rahman.',
    groundingEvidence: ['sr_roll_0', 'sr_roi_0', 'sr_repl_2', 'emails/2026-07-16_stefan_savings.txt', 'users.json (U01)'],
  },
  deputy_u02: {
    id: 'deputy_u02',
    name: 'Stefan Roy\'s Deputy (U02)',
    role: 'Security Deputy & Rollout Architect',
    location: 'Aldermoor Operational Security',
    relationship: 'ally',
    dealRole: 'User',
    loginCount90d: 38,
    activityLabel: '38 logins in last 90 days — Daily Operational Lead',
    activityPercentage: 70,
    activityStatus: 'high',
    painPoint: 'Departing company within days; unwritten rollout playbook threatens 11 idle plants',
    howToEngageDirective: 'Conduct structured exit interview and capture step-by-step dock installation and IT setup checklist into a formal Standard Operating Procedure before his last day.',
    groundingEvidence: ['sr_repl_2', 'ba_deputy_0', 'users.json (U02)'],
  },
  nadia_rahman: {
    id: 'nadia_rahman',
    name: 'Nadia Rahman',
    role: 'Group Finance Controller',
    location: 'Aldermoor Central Finance',
    relationship: 'warm',
    dealRole: 'Payer',
    loginCount90d: 0,
    activityLabel: '0 platform logins — Budget Approver',
    activityPercentage: 10,
    activityStatus: 'inactive',
    painPoint: 'Requires plant-by-plant quote; rejects unverified €1.2M savings without audited contract changes',
    howToEngageDirective: 'Stop sending high-level €1.2M claims. Deliver plant-by-plant itemized quote breakdown as requested in her 8 Oct email, accompanied by Julian Tate\'s verified €180,000 insurance rebate letter.',
    groundingEvidence: ['nr_cost_2', 'nr_evidence_2', 'emails/2026-10-08_finance_mailbox.txt'],
  },
  beatriz_alonso: {
    id: 'beatriz_alonso',
    name: 'Beatriz Alonso',
    role: 'Plant Manager, Plant 7',
    location: 'Aldermoor Manufacturing Plant 7',
    relationship: 'neutral',
    dealRole: 'User',
    loginCount90d: 46,
    activityLabel: '46 logins in last 90 days — Active Alert Monitor',
    activityPercentage: 75,
    activityStatus: 'high',
    painPoint: 'Woken up by night alerts; guard contractor refuses to respond under current contract terms',
    howToEngageDirective: 'Update guard contractor SLA or provide automated alert triage filtering so only verified intrusions trigger phone wake-ups. Introduce daytime patrol demos.',
    groundingEvidence: ['ba_use_2', 'ba_deputy_0', 'emails/2026-09-18_beatriz_alerts.txt', 'users.json (U03)'],
  },
  owen_fitch: {
    id: 'owen_fitch',
    name: 'Owen Fitch',
    role: 'Group IT Infrastructure Lead',
    location: 'Aldermoor Infrastructure & Networks',
    relationship: 'neutral',
    dealRole: 'Blocker',
    loginCount90d: 0,
    activityLabel: '0 platform logins — Excluded from Deployment',
    activityPercentage: 5,
    activityStatus: 'inactive',
    painPoint: 'Plants 11 to 14 have weak network links; was bypassed during initial installs and network project will cut docks off',
    howToEngageDirective: 'Formally consult Owen on network bandwidth specs for plants 11-14 and co-design a cellular/mesh fallback architecture to keep docks online during network upgrade.',
    groundingEvidence: ['of_weak_1', 'b_idle blocker', 'calls/2026-06-11_check_in.txt'],
  },
  julian_tate: {
    id: 'julian_tate',
    name: 'Julian Tate',
    role: 'Insurance and Risk Manager',
    location: 'Aldermoor Risk & Compliance',
    relationship: 'ally',
    dealRole: 'Champion',
    loginCount90d: 0,
    activityLabel: '0 platform logins — Risk Partner',
    activityPercentage: 15,
    activityStatus: 'inactive',
    painPoint: 'Upcoming 5-month insurance audit; needs flight logs to keep €180k premium discount',
    howToEngageDirective: 'Export automated monthly flight-log audit packs formatted specifically for the insurer\'s surveyor, locking in the 6% premium discount (€180k/yr).',
    groundingEvidence: ['jt_prem_2', 'jt_review_2', 'jt_intro_3', 'insurer_log_pack'],
  },

  // Account K Stakeholders (Kestrel Estates)
  k_dana_1g1: {
    id: 'k_dana_1g1',
    name: 'Dana Whitfield',
    role: 'Estate Manager',
    location: 'Kestrel Estates Gatehouse',
    relationship: 'warm',
    dealRole: 'Decider',
    loginCount90d: 0,
    activityLabel: '0 platform logins — Awaiting Initial Activation',
    activityPercentage: 0,
    activityStatus: 'inactive',
    painPoint: 'Gatehouse roof dock installed 5 weeks ago but unconfigured; reseller stopped answering',
    howToEngageDirective: 'Immediately dispatch field technician to perform remote activation and operator onboarding, unblocking the £14,000 annual subscription.',
    groundingEvidence: ['emails/2026-10-19_dana_when.txt', 'contract.txt (Kestrel)'],
  },
  k_graham_1g1: {
    id: 'k_graham_1g1',
    name: 'Graham Okafor',
    role: 'Head of Estate Security',
    location: 'Kestrel Grounds & Security',
    relationship: 'neutral',
    dealRole: 'User',
    loginCount90d: 0,
    activityLabel: '0 platform logins — Security Lead',
    activityPercentage: 0,
    activityStatus: 'inactive',
    painPoint: 'Perimeter blind spots at south entrance; waiting on operational proof from north dock',
    howToEngageDirective: 'Provide simulated automated patrol route demonstration for the north entrance and pitch the second south-entrance dock once north is flying.',
    groundingEvidence: ['profile.json (Kestrel)', 'requests.csv (Kestrel)'],
  },
  k_lucy_1g1: {
    id: 'k_lucy_1g1',
    name: 'Lucy Pratt',
    role: 'Operations & Facilities Director',
    location: 'Kestrel Administrative Offices',
    relationship: 'neutral',
    dealRole: 'Payer',
    loginCount90d: 0,
    activityLabel: '0 platform logins — Financial Sign-off',
    activityPercentage: 0,
    activityStatus: 'inactive',
    painPoint: 'Paid reseller upfront; seeking reassurance of operational delivery and SLA backing',
    howToEngageDirective: 'Provide direct FlytBase corporate warranty and direct customer support escalation channel to reassure executive management.',
    groundingEvidence: ['invoices.json (Kestrel)', 'contract.txt (Kestrel)'],
  },
};

export const FORENSIC_RECORDS: Record<string, ForensicEvidenceRecord> = {
  a_tarn: {
    dealId: 'a_tarn',
    dealTitle: 'Tarn Valley and Norwold go live',
    accountId: 'A',
    claimedValue: 200000,
    integrity: 'contradicted',
    claimText: 'Tarn Valley rollout is stalled due to complex inter-force police data governance and DPIA hesitation.',
    claimedBy: 'Rhys Calder (Alliance Call)',
    realityText: 'Ticket FB-10412 asking for standard data-flow documents was logged 4 months ago and never answered by FlytBase support desk. DPO Fatima Osei is ready to sign within 3 weeks of receiving the document.',
    contradictionWarning: 'The blocker is NOT police bureaucracy — it is FlytBase\'s own unassigned support ticket FB-10412.',
    sourceDocId: 'FB-10412',
    sourceDocType: 'ticket',
    sourceDate: '2026-06-29 (Chased 2026-08-14)',
    sourceRequesterOrSender: 'Alliance Programme Office (Fatima Osei)',
    verbatimExcerpt: `Ticket ID: FB-10412
Opened: 2026-06-29 | Status: Open | Assignee: Unassigned
Subject: Document request — DPIA data-flow architecture
Conversation:
[2026-06-29 Requester]: "Operator logins and data-flow documentation requested for Tarn Valley DPIA approval."
[2026-08-14 Requester]: "(Chased. No reply sent.)"
Note: The Tarn Valley ticket asking for data-flow documents was logged 4 months ago and never answered.`,
    actionableUnlock: 'Send data-flow pack (srv_dataflow) directly to Fatima Osei to unlock $200k in Tarn Valley / Norwold live flights.',
    actionContact: 'Fatima Osei',
    unlockValue: 200000,
    evidenceIds: ['fo_dpia_2', 'fo_needs_3', 'pj_ticket', 'srv_dataflow', 'FB-10412'],
  },

  b_renewal: {
    dealId: 'b_renewal',
    dealTitle: 'Renew the Aldermoor contract (14 docks)',
    accountId: 'B',
    claimedValue: 140000,
    integrity: 'contradicted',
    claimText: 'ROI is proven across 15 plants; €1.2M/year saved in guard patrol hours.',
    claimedBy: 'Stefan Roy (Email 16 July 2026)',
    realityText: 'Stefan Roy admitted the €1.2M is his own theoretical spreadsheet of potential hours replaced. Not a single guard contract was reduced, and finance booked zero savings. Group Finance formally requested a plant-by-plant quote which FlytBase ignored.',
    contradictionWarning: 'Stefan told FlytBase to ignore Finance. Finance controls the renewal and rejects the €1.2M claim.',
    sourceDocId: 'emails/2026-07-16_stefan_savings.txt & emails/2026-10-08_finance_mailbox.txt',
    sourceDocType: 'email',
    sourceDate: '16 July 2026 & 8 October 2026',
    sourceRequesterOrSender: 'Stefan Roy / Group Finance (Aldermoor)',
    verbatimExcerpt: `[Email 16 July 2026 - Stefan Roy]:
"As discussed: ROI is proven, about 1.2 million euros a year saved. Thirteen of fifteen plants are flying. Feel free to use that internally. I will send the detail when I have a moment.
[No detail received.]"

[Email 8 October 2026 - Group Finance]:
"We understand the dock contract renews at the end of January. Before a renewal is raised, please send the quote in a form that shows the cost for each plant.
Group Finance [Unsigned. No reply on file.]"`,
    actionableUnlock: 'Send plant-by-plant quote breakdown to Group Finance mailbox; cite Julian Tate\'s verified €180,000 insurance rebate letter (insurer_log_pack).',
    actionContact: 'Nadia Rahman',
    unlockValue: 140000,
    evidenceIds: ['sr_roll_0', 'sr_roi_2', 'nr_cost_2', 'nr_evidence_2', 'jt_prem_2', 'emails/2026-10-08_finance_mailbox.txt'],
  },

  b_sister: {
    dealId: 'b_sister',
    dealTitle: 'Case study for the 40-plant sister company',
    accountId: 'B',
    claimedValue: 1200000,
    integrity: 'contradicted',
    claimText: 'Aldermoor case study is ready to replicate across 40 sister company plants.',
    claimedBy: 'Stefan Roy (Email 22 Sept 2026)',
    realityText: 'The case study is built entirely on unverified €1.2M claims. Nadia Rahman explicitly stated she has no view on the sister company budget and will not validate the numbers without hard proof.',
    contradictionWarning: 'Pitching an unverified €1.2M case study will fail executive review and burn credibility with sister company management.',
    sourceDocId: 'emails/2026-09-22_stefan_case_study.txt',
    sourceDocType: 'email',
    sourceDate: '22 September 2026',
    sourceRequesterOrSender: 'Stefan Roy',
    verbatimExcerpt: `[Email 22 September 2026 - Stefan Roy]:
"Sister company security head has agreed in principle to review our rollout template for their 40 manufacturing sites.
[Note: Case study draft uses Stefan's unverified 1.2M savings figure which Group Finance explicitly disavowed.]"`,
    actionableUnlock: 'Pivot case study to audited 6% insurance premium reduction (€180k/yr across 9 plants) and actual incident prevention logs.',
    actionContact: 'Julian Tate',
    unlockValue: 1200000,
    evidenceIds: ['sr_roi_2', 'jt_prem_2', 'nr_evidence_2', 'nr_sister_1'],
  },

  b_idle: {
    dealId: 'b_idle',
    dealTitle: 'Bring the idle plants into regular patrol',
    accountId: 'B',
    claimedValue: 180000,
    integrity: 'contradicted',
    claimText: '13 of 15 plants are flying regularly.',
    claimedBy: 'Stefan Roy (Status update)',
    realityText: 'Telemetry flight logs (flight_log_by_plant) prove only 4 plants fly regularly. Nine plants log only occasional test flights. Plant 15 has no dock at all. Crucially, Stefan\'s deputy is leaving soon and all rollout know-how lives in his head.',
    contradictionWarning: 'Rollout playbook will be permanently lost when the deputy leaves unless codified immediately.',
    sourceDocId: 'flight_log_by_plant & users.json (U02)',
    sourceDocType: 'telemetry',
    sourceDate: 'Telemetry Q3/Q4 2026',
    sourceRequesterOrSender: 'Flight Logging System',
    verbatimExcerpt: `[flight_log_by_plant analysis]:
Active regular patrol docks: 4 (Plants 1, 3, 7, 9)
Test-flight only docks: 9 (Plants 2, 4, 5, 6, 8, 10, 11, 12, 13)
Uninstalled dock: 1 (Plant 15)
Operational dependency: Deputy (User U02) configured all 14 docks. Deputy departure scheduled. Nothing written down.`,
    actionableUnlock: 'Conduct structured knowledge capture interview with Stefan\'s deputy this week to produce written installation SOP before departure.',
    actionContact: 'Stefan Roy & Deputy',
    unlockValue: 180000,
    evidenceIds: ['sr_roll_2', 'sr_repl_2', 'ba_deputy_0', 'of_weak_1', 'flight_log_by_plant'],
  },

  a_westmere: {
    dealId: 'a_westmere',
    dealTitle: 'Scale Westmere\'s fleet',
    accountId: 'A',
    claimedValue: 250000,
    integrity: 'told',
    claimText: 'Westmere operations team wants 6 more docks immediately to cover coastal and rural zones.',
    claimedBy: 'Insp. Karen Mbeki',
    realityText: 'Metro Central CFO Ewan Brooks controls call-off approvals and refuses to sign without verified cost-per-flight economics benchmarked against £1,500/hr police helicopter costs.',
    contradictionWarning: 'Frontline operational demand will not translate into a signed contract without finance unit economics.',
    sourceDocId: 'calls/2026-09-09_check_in.txt',
    sourceDocType: 'call',
    sourceDate: '2026-09-09',
    sourceRequesterOrSender: 'Call with Ewan Brooks',
    verbatimExcerpt: `[Call 2026-09-09 - Ewan Brooks]:
"We are paying £1,500 an hour for the National Police Air Service helicopter. If your drones cost less per deployment, show me the flight logs and the hourly amortisation. Until then, Westmere will not get additional capital."`,
    actionableUnlock: 'Generate flight economics analysis using flights.csv proving £120/flight hour vs £1,500 helicopter benchmark.',
    actionContact: 'Ewan Brooks',
    unlockValue: 250000,
    evidenceIds: ['eb_heli_1', 'eb_sign_2', 'km_value_2', 'flights.csv'],
  },

  a_tender: {
    dealId: 'a_tender',
    dealTitle: 'Position for the 300-dock framework tender',
    accountId: 'A',
    claimedValue: 1500000,
    integrity: 'told',
    claimText: 'Alliance is drafting a framework for up to 300 automated drone docks across all member forces.',
    claimedBy: 'Rhys Calder',
    realityText: 'Hannah Doyle confirmed the tender specification freezes shortly, but currently lacks an operating budget, operator staffing framework, and multi-force protocol.',
    contradictionWarning: 'Without a concrete operating and staffing model, the tender may be deferred or won by traditional manned security contractors.',
    sourceDocId: 'emails/2026-07-09_rhys_tender.txt & calls/2026-10-20_check_in.txt',
    sourceDocType: 'email',
    sourceDate: '2026-07-09 & 2026-10-20',
    sourceRequesterOrSender: 'Hannah Doyle / Rhys Calder',
    verbatimExcerpt: `[Call 2026-10-20 - Hannah Doyle]:
"The 300-dock framework has procurement approval, but the technical specification requires a costed operating model. Who operates the drones when forces share airspace? We have no draft on file."`,
    actionableUnlock: 'Draft and submit multi-force drone operator staffing framework and SLA to Hannah Doyle before specification freeze.',
    actionContact: 'Hannah Doyle',
    unlockValue: 1500000,
    evidenceIds: ['rc_tender_2', 'hd_calloff_2', 'km_staff_2'],
  },

  // Account K Deal (Kestrel Estates)
  k_north_dock: {
    dealId: 'k_north_dock',
    dealTitle: 'Get the north-entrance dock flying night patrols',
    accountId: 'K',
    claimedValue: 140000,
    integrity: 'contradicted',
    claimText: 'Dock installed and paid through reseller; ready for operational patrol.',
    claimedBy: 'Reseller Order Form',
    realityText: 'Estate Manager Dana Whitfield sent an email 5 weeks after installation stating the dock has not flown, the reseller stopped answering, and FlytBase sent only an automated reply.',
    contradictionWarning: 'Customer is stranded after paying £14,000; risks chargeback or reputational loss if not remotely activated immediately.',
    sourceDocId: 'emails/2026-10-19_dana_when.txt',
    sourceDocType: 'email',
    sourceDate: '19 October 2026',
    sourceRequesterOrSender: 'Dana Whitfield, Estate Manager',
    verbatimExcerpt: `From: Dana Whitfield, Kestrel Estates
To: FlytBase (general address)
Date: 19 October 2026
Subject: Our dock

"Hello, We had a dock installed on the gatehouse roof five weeks ago. It has been paid for. It has not flown. The firm that installed it has stopped answering. Who do I speak to, and when does it start?"

[Automatic reply sent. No further reply on file.]`,
    actionableUnlock: 'Assign engineer to perform remote cloud provisioning and call Dana Whitfield to schedule first test flight.',
    actionContact: 'Dana Whitfield',
    unlockValue: 140000,
    evidenceIds: ['emails/2026-10-19_dana_when.txt', 'contract.txt', 'devices.json'],
  },
};
