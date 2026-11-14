import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { callMCP } from '@/lib/mcp';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    let mcpFetched = false;
    try {
      const mcpRes = await callMCP('get_signals');
      const signalsList = mcpRes?.signals || (Array.isArray(mcpRes) ? mcpRes : []);

      if (Array.isArray(signalsList) && signalsList.length > 0) {
        mcpFetched = true;
        for (const sig of signalsList) {
          const sigId = sig.id || `sig_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
          const summaryText = sig.summary || sig.title || sig.text || JSON.stringify(sig);
          await db.execute({
            sql: `INSERT INTO signals (id, account_id, text, raw_json, fetched_at)
                  VALUES (?, ?, ?, ?, datetime('now'))
                  ON CONFLICT(id) DO UPDATE SET
                    text = excluded.text,
                    raw_json = excluded.raw_json,
                    fetched_at = datetime('now')`,
            args: [sigId, sig.account || 'A', summaryText, JSON.stringify(sig)],
          });
        }
      }
    } catch (mcpErr) {
      console.warn('MCP get_signals call failed or rate limited:', mcpErr);
    }

    const allSignalsRes = await db.execute('SELECT * FROM signals ORDER BY fetched_at DESC');

    return NextResponse.json({
      success: true,
      mcpFetched,
      signals: allSignalsRes.rows,
    });
  } catch (error: any) {
    console.error('Signals API error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch signals' },
      { status: 500 }
    );
  }
}
