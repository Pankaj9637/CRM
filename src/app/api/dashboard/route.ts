import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const accountsRes = await db.execute('SELECT * FROM accounts');
    const dealsRes = await db.execute('SELECT * FROM deals');
    const contactsRes = await db.execute('SELECT * FROM contacts');
    const factsRes = await db.execute('SELECT * FROM facts');
    const offersRes = await db.execute('SELECT * FROM offers');
    const actionsRes = await db.execute('SELECT * FROM actions ORDER BY priority ASC LIMIT 5');
    const risksRes = await db.execute("SELECT * FROM risks ORDER BY CASE severity WHEN 'critical' THEN 1 WHEN 'high' THEN 2 ELSE 3 END LIMIT 10");
    const signalsRes = await db.execute('SELECT * FROM signals ORDER BY fetched_at DESC LIMIT 10');
    const syncRes = await db.execute('SELECT * FROM sync_log ORDER BY id DESC LIMIT 1');

    const accounts = accountsRes.rows as any[];
    const deals = dealsRes.rows as any[];
    const contacts = contactsRes.rows as any[];
    const facts = factsRes.rows as any[];
    const offers = offersRes.rows as any[];
    const actions = actionsRes.rows as any[];
    const risks = risksRes.rows as any[];
    const signals = signalsRes.rows as any[];
    const lastSync = syncRes.rows[0]?.timestamp || new Date().toISOString();

    const accountMap = new Map(accounts.map(a => [a.id, a.name]));

    // Pipeline calculations
    const totalPipeline = deals.reduce((sum, d) => sum + (Number(d.worth_up_to) || 0), 0);
    const blockedPipeline = deals
      .filter(d => d.blocker_status === 'open')
      .reduce((sum, d) => sum + (Number(d.worth_up_to) || 0), 0);
    const agreedPipeline = deals
      .filter(d => d.stage === 'agreed')
      .reduce((sum, d) => sum + (Number(d.worth_up_to) || 0), 0);
    const wonOffersTotal = offers
      .filter(o => o.status === 'won')
      .reduce((sum, o) => sum + (Number(o.value) || 0), 0);

    // Linked deals for contacts
    const people = contacts.map(c => {
      // Find deals where contact is mentioned in said_by of facts cited in deal
      const relevantDeals = deals.filter(d => {
        let evIds: string[] = [];
        try {
          evIds = JSON.parse(d.evidence_ids || '[]');
        } catch {
          evIds = [];
        }
        const relevantFacts = facts.filter(f => evIds.includes(f.id));
        const citedByContact = relevantFacts.some(f => f.said_by && f.said_by.toLowerCase().includes(c.name.toLowerCase()));
        return citedByContact && d.account_id === c.account_id;
      });

      return {
        id: c.id,
        accountId: c.account_id,
        accountName: accountMap.get(c.account_id) || c.account_id,
        name: c.name,
        role: c.role,
        relationship: c.relationship,
        available: Boolean(c.available),
        linkedDeals: relevantDeals.map(d => ({ id: d.id, title: d.title, worth_up_to: d.worth_up_to })),
      };
    });

    const parsedActions = actions.map(a => ({
      ...a,
      evidence_ids: typeof a.evidence_ids === 'string' ? JSON.parse(a.evidence_ids || '[]') : a.evidence_ids,
      account_name: accountMap.get(a.account_id) || a.account_id,
    }));

    const parsedRisks = risks.map(r => ({
      ...r,
      evidence_ids: typeof r.evidence_ids === 'string' ? JSON.parse(r.evidence_ids || '[]') : r.evidence_ids,
      account_name: accountMap.get(r.account_id) || r.account_id,
    }));

    const accountSummaries = accounts.map(a => {
      const accDeals = deals.filter(d => d.account_id === a.id);
      const accContacts = contacts.filter(c => c.account_id === a.id);
      const accBlocked = accDeals.filter(d => d.blocker_status === 'open');
      const pipelineVal = accDeals.reduce((sum, d) => sum + (Number(d.worth_up_to) || 0), 0);

      return {
        id: a.id,
        name: a.name,
        official_story: a.official_story,
        pipeline: pipelineVal,
        dealsCount: accDeals.length,
        contactsCount: accContacts.length,
        blockedCount: accBlocked.length,
        health: accBlocked.length > 2 ? 'warning' : 'healthy',
      };
    });

    return NextResponse.json({
      pipeline: {
        total: totalPipeline,
        blocked: blockedPipeline,
        agreed: agreedPipeline,
        won_offers: wonOffersTotal,
      },
      people,
      priorityActions: parsedActions,
      risks: parsedRisks,
      signals,
      accounts: accountSummaries,
      lastSync,
    });
  } catch (error: any) {
    console.error('Dashboard API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
}
