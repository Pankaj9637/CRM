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
      const [
        accRes,
        contactsRes,
        factsRes,
        dealsRes,
        offersRes,
        filesRes,
        actionsRes,
        risksRes,
        unknownsRes,
        notesRes,
        paperworkRes,
      ] = await Promise.all([
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
        db.execute({
          sql: 'SELECT path, kind, title, substr(text, 1, 800) as excerpt FROM paperwork WHERE account_id = ? LIMIT 25',
          args: [accountId],
        }),
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
        paperworkExcerpts: paperworkRes.rows,
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

    const systemPrompt = `You are NEXUS, an account intelligence engine. 
You do not give generic sales advice. You ground every conclusion in the account's paperwork, emails, call transcripts, and flight logs.
- Always distinguish between what a contact claimed vs what the paperwork proves.
- When identifying a blocker, look for unanswered tickets or missing documentation.
- When recommending actions, specify the contact, the commercial value unlocked, and the exact evidence ID.
- Never invent figures or assume budget exists if financing sign-off is unverified.
- Always cite evidence IDs in brackets (e.g. [FB-10412], [Email 2026-07-16], [fo_dpia_2], [sr_roi_2], [km_usage_1]).

Account Under Analysis: ${accountName}

Context Data:
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
