import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const accountsRes = await db.execute('SELECT * FROM accounts');
    const dealsRes = await db.execute('SELECT * FROM deals');
    const contactsRes = await db.execute('SELECT * FROM contacts');
    const offersRes = await db.execute('SELECT * FROM offers');

    const accounts = accountsRes.rows as any[];
    const deals = dealsRes.rows as any[];
    const contacts = contactsRes.rows as any[];
    const offers = offersRes.rows as any[];

    const result = accounts.map(a => {
      const accDeals = deals.filter(d => d.account_id === a.id);
      const accContacts = contacts.filter(c => c.account_id === a.id);
      const accOffers = offers.filter(o => o.account_id === a.id);
      const pipeline = accDeals.reduce((sum, d) => sum + (Number(d.worth_up_to) || 0), 0);
      const wonOffers = accOffers.filter(o => o.status === 'won').reduce((sum, o) => sum + (Number(o.value) || 0), 0);
      const openBlockers = accDeals.filter(d => d.blocker_status === 'open').length;

      return {
        id: a.id,
        name: a.name,
        official_story: a.official_story,
        pipeline,
        wonOffers,
        dealsCount: accDeals.length,
        contactsCount: accContacts.length,
        blockedCount: openBlockers,
        health: openBlockers > 0 ? 'warning' : 'good',
        synced_at: a.synced_at,
      };
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Accounts list error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch accounts' },
      { status: 500 }
    );
  }
}
