import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const accountId = params.id;
    if (!accountId) {
      return NextResponse.json({ error: 'Missing account id' }, { status: 400 });
    }

    const accountRes = await db.execute({
      sql: 'SELECT * FROM accounts WHERE id = ?',
      args: [accountId],
    });

    if (accountRes.rows.length === 0) {
      return NextResponse.json({ error: 'Account not found' }, { status: 404 });
    }

    const account = accountRes.rows[0];

    const [
      contactsRes,
      factsRes,
      dealsRes,
      offersRes,
      filesRes,
      actionsRes,
      risksRes,
      unknownsRes,
      notesRes,
      dealContactsRes,
    ] = await Promise.all([
      db.execute({ sql: 'SELECT * FROM contacts WHERE account_id = ?', args: [accountId] }),
      db.execute({ sql: 'SELECT * FROM facts WHERE account_id = ?', args: [accountId] }),
      db.execute({ sql: 'SELECT * FROM deals WHERE account_id = ?', args: [accountId] }),
      db.execute({ sql: 'SELECT * FROM offers WHERE account_id = ?', args: [accountId] }),
      db.execute({ sql: 'SELECT * FROM files WHERE account_id = ?', args: [accountId] }),
      db.execute({ sql: 'SELECT * FROM actions WHERE account_id = ? ORDER BY priority ASC', args: [accountId] }),
      db.execute({ sql: "SELECT * FROM risks WHERE account_id = ? ORDER BY CASE severity WHEN 'critical' THEN 1 WHEN 'high' THEN 2 ELSE 3 END", args: [accountId] }),
      db.execute({ sql: 'SELECT * FROM unknowns WHERE account_id = ?', args: [accountId] }),
      db.execute({ sql: 'SELECT * FROM notes WHERE account_id = ? ORDER BY created_at DESC', args: [accountId] }),
      db.execute({ sql: 'SELECT * FROM deal_contacts WHERE account_id = ?', args: [accountId] }),
    ]);

    const deals = dealsRes.rows.map(d => ({
      ...d,
      evidence_ids: typeof d.evidence_ids === 'string' ? JSON.parse(d.evidence_ids || '[]') : d.evidence_ids,
    }));

    const actions = actionsRes.rows.map(a => ({
      ...a,
      evidence_ids: typeof a.evidence_ids === 'string' ? JSON.parse(a.evidence_ids || '[]') : a.evidence_ids,
    }));

    const risks = risksRes.rows.map(r => ({
      ...r,
      evidence_ids: typeof r.evidence_ids === 'string' ? JSON.parse(r.evidence_ids || '[]') : r.evidence_ids,
    }));

    return NextResponse.json({
      account,
      contacts: contactsRes.rows,
      facts: factsRes.rows,
      deals,
      offers: offersRes.rows,
      files: filesRes.rows,
      actions,
      risks,
      unknowns: unknownsRes.rows,
      notes: notesRes.rows,
      deal_contacts: dealContactsRes.rows,
    });
  } catch (error: any) {
    console.error('Account detail error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch account detail' },
      { status: 500 }
    );
  }
}
