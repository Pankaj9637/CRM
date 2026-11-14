'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';
import { Badge } from '@/components/badge';
import { Building2, ArrowRight, AlertTriangle, Users, Briefcase, Award, RefreshCw } from 'lucide-react';

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/accounts')
      .then((r) => r.json())
      .then((data) => {
        setAccounts(Array.isArray(data) ? data : []);
      })
      .catch((err) => console.error('Failed to load accounts:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-3">
        <RefreshCw className="h-8 w-8 text-indigo-600 animate-spin" />
        <p className="text-sm font-semibold text-slate-600">Loading Enterprise Accounts...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Enterprise Accounts Portfolio</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Select an account to deep-dive into deal valuations, power dynamics, and evidentiary proof.
          </p>
        </div>
        <span className="text-xs font-mono font-bold bg-white px-3 py-1.5 rounded-lg text-slate-700 border border-slate-200 shadow-xs">
          {accounts.length} ACTIVE CUSTOMERS
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {accounts.map((acc) => (
          <div
            key={acc.id}
            className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md hover:border-indigo-400 transition-all overflow-hidden flex flex-col justify-between"
          >
            <div className="p-6 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-xl bg-slate-900 text-white font-mono font-bold text-base flex items-center justify-center shadow-sm">
                    {acc.id}
                  </span>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">{acc.name}</h2>
                    <p className="text-xs text-slate-500 font-mono">Account ID: {acc.id}</p>
                  </div>
                </div>

                <Badge variant={acc.health === 'warning' ? 'critical' : 'cleared'}>
                  {acc.blockedCount > 0 ? '⚠️ ACTION REQ.' : 'HEALTHY'}
                </Badge>
              </div>

              {/* Official Story quote */}
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700 leading-relaxed font-medium">
                &ldquo;{acc.official_story}&rdquo;
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="text-[10px] font-semibold text-slate-500 uppercase flex items-center gap-1">
                    <Briefcase className="h-3 w-3 text-indigo-600" />
                    <span>Pipeline</span>
                  </div>
                  <div className="text-base font-bold font-mono text-slate-900 mt-1">
                    {formatCurrency(acc.pipeline)}
                  </div>
                  <div className="text-[10px] text-slate-500">{acc.dealsCount} deals</div>
                </div>

                <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-100">
                  <div className="text-[10px] font-semibold text-emerald-800 uppercase flex items-center gap-1">
                    <Award className="h-3 w-3 text-emerald-600" />
                    <span>Won Offers</span>
                  </div>
                  <div className="text-base font-bold font-mono text-emerald-700 mt-1">
                    {formatCurrency(acc.wonOffers)}
                  </div>
                  <div className="text-[10px] text-emerald-600">Closed wins</div>
                </div>

                <div className="p-3 rounded-xl bg-rose-50/70 border border-rose-100">
                  <div className="text-[10px] font-semibold text-rose-800 uppercase flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3 text-rose-600" />
                    <span>Blocked Deals</span>
                  </div>
                  <div className="text-base font-bold font-mono text-rose-600 mt-1">
                    {acc.blockedCount} / {acc.dealsCount}
                  </div>
                  <div className="text-[10px] text-rose-600">Open blockers</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="text-[10px] font-semibold text-slate-500 uppercase flex items-center gap-1">
                    <Users className="h-3 w-3 text-slate-600" />
                    <span>Contacts</span>
                  </div>
                  <div className="text-base font-bold font-mono text-slate-900 mt-1">
                    {acc.contactsCount}
                  </div>
                  <div className="text-[10px] text-slate-500">Key people</div>
                </div>
              </div>
            </div>

            {/* Action Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs text-slate-500">
                Last synced: {acc.synced_at ? new Date(acc.synced_at).toLocaleDateString() : 'Active'}
              </span>
              <Link
                href={`/accounts/${acc.id}`}
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
              >
                <span>Enter Workspace</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
