import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { callMCP } from '@/lib/mcp';
import fs from 'fs';
import path from 'path';
import { STAKEHOLDER_PERSONAS, FORENSIC_RECORDS } from '@/lib/intelligence-data';

export const dynamic = 'force-dynamic';

function cleanJson(str: string): any {
  try {
    return JSON.parse(str.replace(/^\uFEFF/, ''));
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  return handleSync();
}

export async function POST(req: NextRequest) {
  return handleSync();
}

async function handleSync() {
  try {
    // 1. Ensure schema exists
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
        available INTEGER DEFAULT 1,
        location TEXT,
        deal_role TEXT,
        login_count INTEGER DEFAULT 0,
        activity_summary TEXT,
        pain_point TEXT,
        engagement_directive TEXT
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
        deadline_passed INTEGER DEFAULT 0,
        integrity_status TEXT DEFAULT 'verified'
      );
    `);

    try {
      await db.execute("ALTER TABLE deals ADD COLUMN integrity_status TEXT DEFAULT 'verified'");
    } catch {
      // Column may already exist
    }

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
      CREATE TABLE IF NOT EXISTS paperwork (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        account_id TEXT NOT NULL,
        path TEXT NOT NULL,
        kind TEXT,
        title TEXT,
        text TEXT,
        data TEXT,
        created_at TEXT DEFAULT (datetime('now')),
        UNIQUE(account_id, path)
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

    // 2. Discover accounts dynamically
    const discoveredAccounts: any[] = [];

    // Attempt MCP get_my_accounts
    try {
      const myAccRes = await callMCP('get_my_accounts', {}, { noWait: true, timeoutMs: 3000 });
      if (myAccRes && myAccRes.accounts && Array.isArray(myAccRes.accounts)) {
        discoveredAccounts.push(...myAccRes.accounts);
      }
    } catch (e) {
      console.warn('MCP get_my_accounts failed or rate-limited, checking local cache:', e);
    }

    // Check whoami for new_accounts
    try {
      const whoamiRes = await callMCP('whoami', {}, { noWait: true, timeoutMs: 3000 });
      if (whoamiRes && whoamiRes.new_accounts && Array.isArray(whoamiRes.new_accounts)) {
        for (const newAcc of whoamiRes.new_accounts) {
          if (!discoveredAccounts.some((a) => a.id === newAcc.id)) {
            // Attempt to fetch new account data
            try {
              const newAccData = await callMCP('get_new_account', { account: newAcc.id }, { noWait: true, timeoutMs: 3000 });
              if (newAccData && newAccData.accounts?.[0]) {
                discoveredAccounts.push(newAccData.accounts[0]);
              }
            } catch (e) {
              console.warn(`Failed to fetch new account ${newAcc.id} via MCP:`, e);
            }
          }
        }
      }
    } catch (e) {
      console.warn('MCP whoami failed:', e);
    }

    // If discoveredAccounts is empty or missing accounts, load from local fallback files
    const cwd = process.cwd();
    if (discoveredAccounts.length === 0) {
      const rawPath = path.join(cwd, 'mcp_accounts_raw.json');
      if (fs.existsSync(rawPath)) {
        const raw = cleanJson(fs.readFileSync(rawPath, 'utf8'));
        if (Array.isArray(raw?.accounts)) {
          discoveredAccounts.push(...raw.accounts);
        } else if (raw?.result?.content?.[0]?.text) {
          try {
            const inner = JSON.parse(raw.result.content[0].text);
            if (Array.isArray(inner?.accounts)) discoveredAccounts.push(...inner.accounts);
          } catch {}
        }
      }
    }

    // Check if account K file exists and load it
    const kPath = path.join(cwd, 'mcp_account_K_raw.json');
    if (fs.existsSync(kPath)) {
      const rawK = cleanJson(fs.readFileSync(kPath, 'utf8'));
      let kAccs = Array.isArray(rawK?.accounts) ? rawK.accounts : null;
      if (!kAccs && rawK?.result?.content?.[0]?.text) {
        try {
          const innerK = JSON.parse(rawK.result.content[0].text);
          if (Array.isArray(innerK?.accounts)) kAccs = innerK.accounts;
        } catch {}
      }
      if (kAccs?.[0] && !discoveredAccounts.some((a) => a.id === 'K')) {
        discoveredAccounts.push(kAccs[0]);
      }
    }

    const syncedAccountIds: string[] = [];
    let totalPaperworkSaved = 0;

    // 3. Dynamic iteration over discovered accounts
    for (const acc of discoveredAccounts) {
      syncedAccountIds.push(acc.id);

      // Upsert account
      await db.execute({
        sql: `INSERT INTO accounts (id, name, official_story, raw_json, synced_at)
              VALUES (?, ?, ?, ?, datetime('now'))
              ON CONFLICT(id) DO UPDATE SET 
                name = excluded.name, 
                official_story = excluded.official_story, 
                raw_json = excluded.raw_json, 
                synced_at = datetime('now')`,
        args: [acc.id, acc.name, acc.official_story, JSON.stringify(acc)],
      });

      // Auto-fetch paperwork pack dynamically for each discovered account
      let packRecords: any[] = [];
      try {
        const packRes = await callMCP('get_all_paperwork', { account: acc.id }, { noWait: true, timeoutMs: 3000 });
        if (packRes && Array.isArray(packRes.records)) {
          packRecords = packRes.records;
        }
      } catch (e) {
        console.warn(`No live paperwork pack found for account ${acc.id}, checking local pack`);
      }

      // Fallback to local pack file if live call failed
      if (packRecords.length === 0) {
        const packFile = path.join(cwd, `mcp_pack_${acc.id}_all.json`);
        if (fs.existsSync(packFile)) {
          const packData = cleanJson(fs.readFileSync(packFile, 'utf8'));
          if (packData?.records) {
            packRecords = packData.records;
          }
        }
      }

      // Store records into paperwork table
      for (const rec of packRecords) {
        totalPaperworkSaved++;
        const textContent = typeof rec.text === 'string' ? rec.text : typeof rec.data === 'string' ? rec.data : null;
        const dataJson = typeof rec.data === 'object' ? JSON.stringify(rec.data) : null;
        await db.execute({
          sql: `INSERT INTO paperwork (account_id, path, kind, title, text, data)
                VALUES (?, ?, ?, ?, ?, ?)
                ON CONFLICT(account_id, path) DO UPDATE SET 
                  kind = excluded.kind, 
                  title = excluded.title, 
                  text = excluded.text, 
                  data = excluded.data`,
          args: [
            acc.id,
            rec.path,
            rec.kind || 'document',
            rec.title || path.basename(rec.path),
            textContent,
            dataJson,
          ],
        });
      }

      // Extract users.json telemetry if available
      const usersRecord = packRecords.find((r) => r.path === 'users.json');
      const usersData: any[] = usersRecord?.data?.users || [];

      // Upsert Stakeholders / Contacts
      for (const st of acc.stakeholders || []) {
        const persona = STAKEHOLDER_PERSONAS[st.id] || null;

        // Match user telemetry from users.json if present
        let matchedUser = usersData.find(
          (u) => u.name && u.name.toLowerCase() === st.name.toLowerCase()
        );

        const location = persona?.location || `${acc.name} Operations`;
        const dealRole = persona?.dealRole || (st.relationship === 'ally' ? 'Champion' : 'User');
        const loginCount = matchedUser ? matchedUser.sign_ins_last_90_days : persona?.loginCount90d || 0;
        const activitySummary = persona?.activityLabel || (loginCount > 20 ? `${loginCount} logins in last 90 days — High Power User` : `${loginCount} logins in last 90 days`);
        const painPoint = persona?.painPoint || 'Awaiting formal operational deployment briefing';
        const directive = persona?.howToEngageDirective || 'Engage directly to align operational objectives and document workflow requirements.';

        await db.execute({
          sql: `INSERT INTO contacts (id, account_id, name, role, relationship, available, location, deal_role, login_count, activity_summary, pain_point, engagement_directive)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON CONFLICT(id) DO UPDATE SET 
                  account_id = excluded.account_id,
                  name = excluded.name,
                  role = excluded.role,
                  relationship = excluded.relationship,
                  available = excluded.available,
                  location = excluded.location,
                  deal_role = excluded.deal_role,
                  login_count = excluded.login_count,
                  activity_summary = excluded.activity_summary,
                  pain_point = excluded.pain_point,
                  engagement_directive = excluded.engagement_directive`,
          args: [
            st.id,
            acc.id,
            st.name,
            st.role,
            st.relationship,
            st.available ? 1 : 0,
            location,
            dealRole,
            loginCount,
            activitySummary,
            painPoint,
            directive,
          ],
        });
      }

      // Upsert Facts
      for (const f of acc.facts || []) {
        await db.execute({
          sql: `INSERT INTO facts (id, account_id, text, said_by, status, verified_by, learned_at_minute)
                VALUES (?, ?, ?, ?, ?, ?, ?)
                ON CONFLICT(id) DO UPDATE SET 
                  text = excluded.text, 
                  said_by = excluded.said_by, 
                  status = excluded.status, 
                  verified_by = excluded.verified_by`,
          args: [
            f.id,
            acc.id,
            f.text,
            f.said_by || null,
            f.status,
            f.verified_by || null,
            f.learned_at_minute ?? null,
          ],
        });
      }

      // Upsert Opportunities / Deals
      for (const opp of acc.opportunities || []) {
        const forensic = FORENSIC_RECORDS[opp.id];
        const integrityStatus = forensic ? forensic.integrity : 'verified';
        const blockerText = opp.blocker ? opp.blocker.text : null;
        const blockerStatus = opp.blocker ? opp.blocker.status : 'cleared';
        const deadlineText = opp.deadline ? opp.deadline.text : null;
        const deadlinePassed = opp.deadline?.passed ? 1 : 0;

        await db.execute({
          sql: `INSERT INTO deals (id, account_id, title, stage, worth_up_to, size, blocker_text, blocker_status, evidence_ids, deadline_text, deadline_passed, integrity_status)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                ON CONFLICT(id) DO UPDATE SET 
                  title = excluded.title, 
                  stage = excluded.stage, 
                  worth_up_to = excluded.worth_up_to, 
                  size = excluded.size, 
                  blocker_text = excluded.blocker_text, 
                  blocker_status = excluded.blocker_status, 
                  evidence_ids = excluded.evidence_ids, 
                  deadline_text = excluded.deadline_text, 
                  deadline_passed = excluded.deadline_passed, 
                  integrity_status = excluded.integrity_status`,
          args: [
            opp.id,
            acc.id,
            opp.title,
            opp.stage || 'qualified',
            opp.worth_up_to || 0,
            opp.size || null,
            blockerText,
            blockerStatus,
            JSON.stringify(opp.evidence || []),
            deadlineText,
            deadlinePassed,
            integrityStatus,
          ],
        });
      }

      // Upsert Offers
      for (const off of acc.offers || []) {
        await db.execute({
          sql: `INSERT INTO offers (id, account_id, title, value, pitch_to, status)
                VALUES (?, ?, ?, ?, ?, ?)
                ON CONFLICT(id) DO UPDATE SET 
                  title = excluded.title, 
                  value = excluded.value, 
                  pitch_to = excluded.pitch_to, 
                  status = excluded.status`,
          args: [
            off.id,
            acc.id,
            off.title,
            off.value || 0,
            off.pitch_to || null,
            off.status || 'open',
          ],
        });
      }
    }

    // Log to sync_log
    await db.execute(
      `INSERT INTO sync_log (tool_name, status, timestamp) VALUES ('dynamic_account_sync', 'success', datetime('now'))`
    );

    return NextResponse.json({
      success: true,
      message: `Zero-code sync completed successfully. Ingested ${syncedAccountIds.length} accounts dynamically.`,
      syncedAccounts: syncedAccountIds,
      totalPaperworkSaved,
    });
  } catch (error: any) {
    console.error('Dynamic sync error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Sync failed' },
      { status: 500 }
    );
  }
}
