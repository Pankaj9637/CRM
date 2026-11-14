import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { askGemini } from '@/lib/gemini';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { accountId, message } = await req.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    let accountName = 'All Accounts Portfolio';
    let contextData: any = {};

    if (accountId && accountId !== 'ALL') {
      const [accRes, contactsRes, factsRes, dealsRes, offersRes, filesRes, actionsRes, risksRes, unknownsRes, notesRes] = await Promise.all([
        db.execute({ sql: 'SELECT * FROM accounts WHERE id = ?', args: [accountId] }),
        db.execute({ sql: 'SELECT * FROM contacts WHERE account_id = ?', args: [accountId] }),
        db.execute({ sql: 'SELECT * FROM facts WHERE account_id = ?', args: [accountId] }),
        db.execute({ sql: 'SELECT * FROM deals WHERE account_id = ?', args: [accountId] }),
        db.execute({ sql: 'SELECT * FROM offers WHERE account_id = ?', args: [accountId] }),
        db.execute({ sql: 'SELECT * FROM files WHERE account_id = ?', args: [accountId] }),
        db.execute({ sql: 'SELECT * FROM actions WHERE account_id = ?', args: [accountId] }),
        db.execute({ sql: 'SELECT * FROM risks WHERE account_id = ?', args: [accountId] }),
        db.execute({ sql: 'SELECT * FROM unknowns WHERE account_id = ?', args: [accountId] }),
        db.execute({ sql: 'SELECT * FROM notes WHERE account_id = ?', args: [accountId] }),
      ]);

      if (accRes.rows.length > 0) {
        accountName = (accRes.rows[0].name as string) || accountId;
      }

      contextData = {
        account: accRes.rows[0],
        contacts: contactsRes.rows,
        facts: factsRes.rows,
        deals: dealsRes.rows,
        offers: offersRes.rows,
        files: filesRes.rows,
        actions: actionsRes.rows,
        risks: risksRes.rows,
        unknowns: unknownsRes.rows,
        notes: notesRes.rows,
      };
    } else {
      const [accountsRes, dealsRes, contactsRes, factsRes, risksRes, actionsRes] = await Promise.all([
        db.execute('SELECT id, name, official_story FROM accounts'),
        db.execute('SELECT * FROM deals'),
        db.execute('SELECT * FROM contacts'),
        db.execute('SELECT * FROM facts'),
        db.execute('SELECT * FROM risks'),
        db.execute('SELECT * FROM actions'),
      ]);

      contextData = {
        accounts: accountsRes.rows,
        deals: dealsRes.rows,
        contacts: contactsRes.rows,
        facts: factsRes.rows,
        risks: risksRes.rows,
        actions: actionsRes.rows,
      };
    }

    const systemPrompt = `You are NEXUS, an elite AI account intelligence copilot for a high-stakes enterprise CRM.

You are analyzing: ${accountName}

STRICT OPERATIONAL RULES:
1. Only use the data provided in the context below. NEVER invent numbers, revenue figures, people, dates, or documents.
2. ALWAYS cite evidence IDs in brackets (e.g. [km_usage_1], [fo_dpia_2], [sr_roi_2]) whenever making statements, findings, or recommendations.
3. Explicitly distinguish between evidence credibility:
   - "verified" (substantiated by files or flight logs)
   - "told" (stated by a stakeholder during interviews)
   - "claim" (unsubstantiated assertion)
4. Clearly identify blockers and commercial stakes ($ amounts from worth_up_to).
5. If something is unknown or missing in the records, state clearly: "We do not have evidence for this."
6. Be concise, strategic, and direct. Format with clean markdown headers and bullet points.

ACCOUNT CONTEXT DATA:
${JSON.stringify(contextData, null, 2)}
`;

    const aiResponse = await askGemini(systemPrompt, message);

    return NextResponse.json({
      success: true,
      response: aiResponse,
      accountAnalyzed: accountName,
    });
  } catch (error: any) {
    console.error('Copilot API error:', error);
    return NextResponse.json(
      { error: error.message || 'Copilot failed to generate a response' },
      { status: 500 }
    );
  }
}
