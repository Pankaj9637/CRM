import { createClient } from '@libsql/client';
import fs from 'fs';

const db = createClient({
  url: 'file:nexus.db',
});

async function main() {
  console.log('Seeding SQLite database nexus.db directly...');
  const seedData = JSON.parse(fs.readFileSync('src/data/seed.json', 'utf8'));

  // 1. Create tables
  await db.execute(`
    CREATE TABLE IF NOT EXISTS accounts (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      official_story TEXT,
      raw_json TEXT NOT NULL,
      synced_at TEXT DEFAULT (datetime('now'))
    );
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS contacts (
      id TEXT PRIMARY KEY,
      account_id TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT,
      relationship TEXT,
      available INTEGER DEFAULT 1
    );
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS facts (
      id TEXT PRIMARY KEY,
      account_id TEXT NOT NULL,
      text TEXT NOT NULL,
      said_by TEXT,
      status TEXT,
      verified_by TEXT,
      learned_at_minute INTEGER
    );
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS deals (
      id TEXT PRIMARY KEY,
      account_id TEXT NOT NULL,
      title TEXT NOT NULL,
      stage TEXT,
      worth_up_to INTEGER,
      size TEXT,
      blocker_text TEXT,
      blocker_status TEXT,
      evidence_ids TEXT,
      deadline_text TEXT,
      deadline_passed INTEGER DEFAULT 0
    );
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS offers (
      id TEXT PRIMARY KEY,
      account_id TEXT NOT NULL,
      title TEXT NOT NULL,
      value INTEGER,
      pitch_to TEXT,
      status TEXT
    );
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS files (
      id TEXT PRIMARY KEY,
      account_id TEXT NOT NULL,
      title TEXT,
      path TEXT,
      content TEXT
    );
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS signals (
      id TEXT PRIMARY KEY,
      account_id TEXT,
      text TEXT,
      raw_json TEXT,
      fetched_at TEXT DEFAULT (datetime('now'))
    );
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      account_id TEXT,
      kind TEXT DEFAULT 'note',
      title TEXT,
      text TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      synced_to_mcp INTEGER DEFAULT 0
    );
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS sync_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tool_name TEXT,
      status TEXT,
      timestamp TEXT DEFAULT (datetime('now'))
    );
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS actions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      priority INTEGER,
      action TEXT NOT NULL,
      reason TEXT,
      deal_id TEXT,
      deal_title TEXT,
      account_id TEXT,
      contact TEXT,
      evidence_ids TEXT,
      urgency TEXT,
      impact_value INTEGER
    );
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS risks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      severity TEXT,
      risk TEXT NOT NULL,
      deal_id TEXT,
      account_id TEXT,
      impact_value INTEGER,
      mitigation TEXT,
      evidence_ids TEXT
    );
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS unknowns (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      what_missing TEXT NOT NULL,
      why_matters TEXT,
      deal_id TEXT,
      account_id TEXT,
      who_can_provide TEXT,
      suggested_action TEXT
    );
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS deal_contacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      deal_id TEXT NOT NULL,
      account_id TEXT NOT NULL,
      decider TEXT,
      payer TEXT,
      user TEXT,
      blocker TEXT,
      confidence TEXT DEFAULT 'inferred'
    );
  `);

  // Clear existing
  await db.execute('DELETE FROM accounts;');
  await db.execute('DELETE FROM contacts;');
  await db.execute('DELETE FROM facts;');
  await db.execute('DELETE FROM deals;');
  await db.execute('DELETE FROM offers;');
  await db.execute('DELETE FROM files;');
  await db.execute('DELETE FROM actions;');
  await db.execute('DELETE FROM risks;');
  await db.execute('DELETE FROM unknowns;');
  await db.execute('DELETE FROM deal_contacts;');

  // Populate Accounts
  for (const acc of seedData.accounts) {
    await db.execute({
      sql: `INSERT INTO accounts (id, name, official_story, raw_json) VALUES (?, ?, ?, ?)`,
      args: [acc.id, acc.name, acc.official_story, JSON.stringify(acc)],
    });

    for (const st of acc.stakeholders || []) {
      await db.execute({
        sql: `INSERT INTO contacts (id, account_id, name, role, relationship, available) VALUES (?, ?, ?, ?, ?, ?)`,
        args: [st.id, acc.id, st.name, st.role, st.relationship, st.available ? 1 : 0],
      });
    }

    for (const f of acc.facts || []) {
      await db.execute({
        sql: `INSERT INTO facts (id, account_id, text, said_by, status, verified_by, learned_at_minute) VALUES (?, ?, ?, ?, ?, ?, ?)`,
        args: [f.id, acc.id, f.text, f.said_by || null, f.status, f.verified_by || null, f.learned_at_minute ?? null],
      });
    }

    for (const opp of acc.opportunities || []) {
      await db.execute({
        sql: `INSERT INTO deals (id, account_id, title, stage, worth_up_to, size, blocker_text, blocker_status, evidence_ids, deadline_text, deadline_passed) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [
          opp.id,
          acc.id,
          opp.title,
          opp.stage || 'qualified',
          opp.worth_up_to || 0,
          opp.size || null,
          opp.blocker?.text || null,
          opp.blocker?.status || 'cleared',
          JSON.stringify(opp.evidence || []),
          opp.deadline?.text || null,
          opp.deadline?.passed ? 1 : 0,
        ],
      });
    }

    for (const off of acc.offers || []) {
      await db.execute({
        sql: `INSERT INTO offers (id, account_id, title, value, pitch_to, status) VALUES (?, ?, ?, ?, ?, ?)`,
        args: [off.id, acc.id, off.title, off.value || 0, off.pitch_to || null, off.status || 'open'],
      });
    }
  }

  for (const file of seedData.files || []) {
    await db.execute({
      sql: `INSERT INTO files (id, account_id, title, path, content) VALUES (?, ?, ?, ?, ?)`,
      args: [file.id, file.account || 'A', file.title, file.path || null, null],
    });
  }

  // Pre-generate Gemini calibrated actions
  const priorityActions = [
    {
      priority: 1,
      action: "Send Tarn Valley data-flow pack directly to Fatima Osei",
      reason: "DPIA stalled 4 months due to unassigned support ticket; DPO can complete in 3 weeks once received, unblocking $200K expansion",
      deal_id: "a_tarn",
      deal_title: "Tarn Valley and Norwold go live",
      account_id: "A",
      contact: "Fatima Osei",
      evidence_ids: ["fo_dpia_2", "fo_needs_3", "pj_ticket", "srv_dataflow"],
      urgency: "immediate",
      impact_value: 200000,
    },
    {
      priority: 2,
      action: "Document rollout operating playbook from Stefan Roy's deputy before departure",
      reason: "Deputy holds complete rollout template in his head and leaves imminently; without documentation, idle plants cannot be integrated",
      deal_id: "b_idle",
      deal_title: "Bring the idle plants into regular patrol",
      account_id: "B",
      contact: "Stefan Roy",
      evidence_ids: ["sr_repl_2", "ba_deputy_0"],
      urgency: "immediate",
      impact_value: 180000,
    },
    {
      priority: 3,
      action: "Assemble comparative cost-per-flight vs £1,500/hr helicopter benchmark for Ewan Brooks",
      reason: "Metro Central CFO will sign off fleet expansion only with unit economics comparing drone flights to helicopter hours",
      deal_id: "a_westmere",
      deal_title: "Scale Westmere's fleet",
      account_id: "A",
      contact: "Ewan Brooks",
      evidence_ids: ["eb_heli_1", "eb_sign_2", "km_value_2"],
      urgency: "this_week",
      impact_value: 250000,
    },
    {
      priority: 4,
      action: "Present verified insurer €180,000 premium discount letter to Nadia Rahman",
      reason: "Finance resents unverified £1.2M spreadsheet claims; 6% insurance rebate is hard proof of ROI required for contract renewal",
      deal_id: "b_renewal",
      deal_title: "Renew the Aldermoor contract (14 docks)",
      account_id: "B",
      contact: "Nadia Rahman",
      evidence_ids: ["jt_prem_2", "nr_evidence_2", "sr_roi_2"],
      urgency: "this_week",
      impact_value: 140000,
    },
    {
      priority: 5,
      action: "Formulate costed operating model & staffing plan for Alliance 300-dock tender",
      reason: "Tender spec locks imminently; specification currently lacks operating budget and staffing model, risking exclusion",
      deal_id: "a_tender",
      deal_title: "Position for the 300-dock framework tender",
      account_id: "A",
      contact: "Hannah Doyle",
      evidence_ids: ["rc_tender_2", "hd_calloff_2", "km_staff_2"],
      urgency: "this_month",
      impact_value: 1500000,
    },
  ];

  for (const act of priorityActions) {
    await db.execute({
      sql: `INSERT INTO actions (priority, action, reason, deal_id, deal_title, account_id, contact, evidence_ids, urgency, impact_value) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      args: [act.priority, act.action, act.reason, act.deal_id, act.deal_title, act.account_id, act.contact, JSON.stringify(act.evidence_ids), act.urgency, act.impact_value],
    });
  }

  // Risks
  const risks = [
    {
      severity: "critical",
      risk: "Framework tender specification locks soon with no costed operating model or operator agreement",
      deal_id: "a_tender",
      account_id: "A",
      impact_value: 1500000,
      mitigation: "Submit draft costed operating model and multi-force staffing framework before spec deadline locks",
      evidence_ids: ["rc_tender_2", "km_staff_2", "hd_calloff_2"],
    },
    {
      severity: "critical",
      risk: "Rollout know-how lost when Stefan's deputy leaves; no written documentation exists",
      deal_id: "b_idle",
      account_id: "B",
      impact_value: 180000,
      mitigation: "Conduct structured knowledge capture sessions with deputy and Beatriz Alonso this week",
      evidence_ids: ["sr_repl_2", "ba_deputy_0"],
    },
    {
      severity: "high",
      risk: "DPIA uncompleted after 4-month unanswered support ticket; 2 of 4 forces blocked from flying",
      deal_id: "a_tarn",
      account_id: "A",
      impact_value: 200000,
      mitigation: "Have CSM escalate engineering data-flow pack directly to Fatima Osei immediately",
      evidence_ids: ["fo_dpia_2", "pj_ticket", "srv_dataflow"],
    },
    {
      severity: "high",
      risk: "Aldermoor €1.2M claimed savings unverified in finance; plant managers resent cost allocations",
      deal_id: "b_renewal",
      account_id: "B",
      impact_value: 140000,
      mitigation: "Pivot ROI justification to hard €180,000 insurance savings and measured guard contract renewals",
      evidence_ids: ["sr_roi_2", "nr_cost_2", "jt_prem_2", "nr_evidence_2"],
    },
    {
      severity: "medium",
      risk: "No pooled alliance budget; each individual force CFO must approve call-offs independently",
      deal_id: "a_renewal",
      account_id: "A",
      impact_value: 350000,
      mitigation: "Engage Ewan Brooks and individual force finance leads with customized per-force utilization business cases",
      evidence_ids: ["rc_funding_2", "hd_calloff_2"],
    },
  ];

  for (const r of risks) {
    await db.execute({
      sql: `INSERT INTO risks (severity, risk, deal_id, account_id, impact_value, mitigation, evidence_ids) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      args: [r.severity, r.risk, r.deal_id, r.account_id, r.impact_value, r.mitigation, JSON.stringify(r.evidence_ids)],
    });
  }

  // Unknowns
  const unknowns = [
    {
      what_missing: "Comparative cost-per-flight data benchmarked against helicopter hours",
      why_matters: "Metro Central CFO refuses to sign off fleet expansion without quantified unit economics",
      deal_id: "a_westmere",
      account_id: "A",
      who_can_provide: "Ewan Brooks & Insp. Karen Mbeki",
      suggested_action: "Calculate cost per flight using monthly flight logs and helicopter overtime logs",
    },
    {
      what_missing: "Event-day policing operational plan and funding source for Westmere Stadium 30 docks",
      why_matters: "Opportunity is based on informal conversation; lack of funding/plan could stall framework inclusion",
      deal_id: "a_tender",
      account_id: "A",
      who_can_provide: "Westmere Superintendent & Rhys Calder",
      suggested_action: "Request formal operational briefing before framework tender specification freezes",
    },
    {
      what_missing: "Written Standard Operating Procedure for plant dock installations",
      why_matters: "All procedural knowledge is currently retained solely by Stefan's departing deputy",
      deal_id: "b_idle",
      account_id: "B",
      who_can_provide: "Stefan Roy's Deputy & Beatriz Alonso",
      suggested_action: "Schedule formal exit interview and codify the installation checklist",
    },
    {
      what_missing: "Formal confirmation of guard patrol hour reductions from Plant managers",
      why_matters: "Group Finance Controller will not accept claimed €1.2M savings without audited contract changes",
      deal_id: "b_renewal",
      account_id: "B",
      who_can_provide: "Nadia Rahman & Beatriz Alonso",
      suggested_action: "Audit the three upcoming guard contract renewals over the next 4 months",
    },
  ];

  for (const u of unknowns) {
    await db.execute({
      sql: `INSERT INTO unknowns (what_missing, why_matters, deal_id, account_id, who_can_provide, suggested_action) VALUES (?, ?, ?, ?, ?, ?)`,
      args: [u.what_missing, u.why_matters, u.deal_id, u.account_id, u.who_can_provide, u.suggested_action],
    });
  }

  // Deal Contacts (Power Map)
  const powerMap = [
    { deal_id: "a_renewal", account_id: "A", decider: "Rhys Calder / Alliance Board", payer: "Ewan Brooks / Force CFOs", user: "Insp. Karen Mbeki", blocker: "Force Chief Constables (Cautious)" },
    { deal_id: "a_tarn", account_id: "A", decider: "Tarn Valley Chief Constable", payer: "Tarn Valley Finance", user: "Tarn Valley & Norwold Officers", blocker: "Fatima Osei (DPO)" },
    { deal_id: "a_westmere", account_id: "A", decider: "Metro Central CFO", payer: "Ewan Brooks", user: "Insp. Karen Mbeki", blocker: "Ewan Brooks (Needs cost analysis)" },
    { deal_id: "a_tender", account_id: "A", decider: "Hannah Doyle / Procurement Lead", payer: "Four Alliance Force CFOs", user: "Alliance Drone Unit Operators", blocker: "Alliance Lead (No operating model)" },
    { deal_id: "b_renewal", account_id: "B", decider: "Stefan Roy / Executive Board", payer: "Nadia Rahman", user: "Beatriz Alonso / Plant Managers", blocker: "Nadia Rahman (Awaiting verified ROI)" },
    { deal_id: "b_idle", account_id: "B", decider: "Stefan Roy", payer: "Plant Managers (Allocations)", user: "Beatriz Alonso & Site Security", blocker: "Owen Fitch (IT) & Departing Deputy" },
    { deal_id: "b_insurance", account_id: "B", decider: "Julian Tate", payer: "Insurance Underwriters", user: "Julian Tate & Surveyor", blocker: "Cleared (Logs needed for renewal)" },
    { deal_id: "b_sister", account_id: "B", decider: "Sister Company Management", payer: "Sister Company Budget", user: "Sister Co Security Leads", blocker: "Nadia Rahman (No view/advocacy)" },
  ];

  for (const pm of powerMap) {
    await db.execute({
      sql: `INSERT INTO deal_contacts (deal_id, account_id, decider, payer, user, blocker, confidence) VALUES (?, ?, ?, ?, ?, ?, 'inferred')`,
      args: [pm.deal_id, pm.account_id, pm.decider, pm.payer, pm.user, pm.blocker],
    });
  }

  // Signals
  await db.execute({
    sql: `INSERT OR REPLACE INTO signals (id, account_id, text, raw_json, fetched_at) VALUES (?, ?, ?, ?, datetime('now'))`,
    args: [
      'champion_leaves',
      'A',
      'Eastern Counties: Rhys Calder has announced he will be leaving the alliance drone programme',
      JSON.stringify({
        id: 'champion_leaves',
        account: 'A',
        dated: '2026-11-17',
        title: 'Rhys Calder departure warning',
        summary: 'Rhys Calder has emailed to indicate he is transitioning out of the lead role in the coming weeks.',
      }),
    ],
  });

  await db.execute({
    sql: `INSERT INTO sync_log (tool_name, status, timestamp) VALUES ('initial_seed', 'success', datetime('now'))`,
  });

  console.log('Database seeded successfully!');
}

main().catch(console.error);
