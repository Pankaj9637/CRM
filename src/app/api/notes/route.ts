import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { callMCP } from '@/lib/mcp';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const accountId = searchParams.get('account_id') || searchParams.get('account');

    let sql = 'SELECT * FROM notes ORDER BY created_at DESC';
    let args: any[] = [];

    if (accountId) {
      sql = 'SELECT * FROM notes WHERE account_id = ? ORDER BY created_at DESC';
      args = [accountId];
    }

    const res = await db.execute({ sql, args });
    return NextResponse.json({ success: true, notes: res.rows });
  } catch (error: any) {
    console.error('Notes fetch error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch notes' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { account_id, account, kind = 'note', title = '', text } = body;
    const targetAccount = account_id || account;

    if (!text || !targetAccount) {
      return NextResponse.json(
        { error: 'account and text are required fields' },
        { status: 400 }
      );
    }

    // Insert locally first
    const insertRes = await db.execute({
      sql: `INSERT INTO notes (account_id, kind, title, text, created_at, synced_to_mcp)
            VALUES (?, ?, ?, ?, datetime('now'), 0)`,
      args: [targetAccount, kind, title, text],
    });

    const noteId = insertRes.lastInsertRowid;
    let syncedToMcp = false;

    // Attempt MCP write_note
    try {
      const mcpResult = await callMCP('write_note', {
        account: targetAccount,
        kind,
        title,
        text,
      });

      if (mcpResult && !mcpResult.isError) {
        syncedToMcp = true;
        if (noteId) {
          await db.execute({
            sql: 'UPDATE notes SET synced_to_mcp = 1 WHERE id = ?',
            args: [noteId],
          });
        }
      }
    } catch (mcpErr) {
      console.warn('MCP write_note failed or rate limited:', mcpErr);
    }

    return NextResponse.json({
      success: true,
      noteId,
      syncedToMcp,
      message: 'Note saved successfully',
    });
  } catch (error: any) {
    console.error('Save note error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to save note' },
      { status: 500 }
    );
  }
}
