'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';
import { Badge } from '@/components/badge';
import { ArrowRight, AlertTriangle, Users, Briefcase, Award, RefreshCw, RotateCw } from 'lucide-react';

export default function AccountsPage() {
  const [accounts, setAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  const fetchAccounts = () => {
    fetch('/api/accounts')
      .then((r) => r.json())
      .then((data) => {
        setAccounts(Array.isArray(data) ? data : data.accounts || []);
      })
      .catch((err) => console.error('Failed to load accounts:', err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleSync = async () => {
    try {
      setSyncing(true);
      const res = await fetch('/api/sync', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        fetchAccounts();
      } else {
        alert(`Sync error: ${data.error}`);
      }
    } catch (e: any) {
      alert(`Sync failed: ${e.message}`);
    } finally {
      setSyncing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-3">
        <RefreshCw className="h-8 w-8 text-[#D95B28] animate-spin" />
        <p className="text-sm font-semibold text-[#D6D6D6]">Loading Enterprise Accounts...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#F0F0F0]">Enterprise Accounts Portfolio</h1>
          <p className="text-sm text-[#999999] mt-0.5">
            Select an account to deep-dive into deal valuations, power dynamics, and evidentiary proof.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-center">
          <button
            onClick={handleSync}
            disabled={syncing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-none bg-[#242424] hover:bg-[#2E2E2E] text-xs font-semibold text-[#EC7D42] border border-[#D95B28]/40 transition-colors"
          >
            <RotateCw className={`h-3.5 w-3.5 text-[#D95B28] ${syncing ? 'animate-spin' : ''}`} />
            <span>{syncing ? 'Discovering...' : 'Dynamic Sync (MCP)'}</span>
          </button>
          <span className="text-xs font-mono font-bold bg-[#242424] px-3 py-1.5 rounded-none text-[#D6D6D6] border border-[#3D3D3D]">
            {accounts.length} ACTIVE CUSTOMERS
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {accounts.map((acc) => (
          <div
            key={acc.id}
            className="bg-[#242424] rounded-none border border-[#3D3D3D] hover:border-[#D95B28] transition-all overflow-hidden flex flex-col justify-between"
          >
            <div className="p-6 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-none bg-[#1A1A1A] text-[#EC7D42] border border-[#D95B28]/40 font-mono font-bold text-base flex items-center justify-center">
                    {acc.id}
                  </span>
                  <div>
                    <h2 className="text-base font-bold text-[#F0F0F0] leading-snug">{acc.name}</h2>
                    <p className="text-xs text-[#999999] font-mono">Account ID: {acc.id}</p>
                  </div>
                </div>

                <Badge variant={acc.health === 'warning' ? 'critical' : 'cleared'}>
                  {acc.blockedCount > 0 ? '⚠️ ACTION REQ.' : 'HEALTHY'}
                </Badge>
              </div>

              {/* Official Story quote */}
              <div className="p-3.5 bg-[#1A1A1A] rounded-none border border-[#3D3D3D] text-xs text-[#D6D6D6] leading-relaxed font-normal min-h-[4rem]">
                &ldquo;{acc.official_story}&rdquo;
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="p-2.5 rounded-none bg-[#2E2E2E] border border-[#3D3D3D]">
                  <div className="text-[10px] font-semibold text-[#8A8A8A] uppercase flex items-center gap-1">
                    <Briefcase className="h-3 w-3 text-[#EC7D42]" />
                    <span>Pipeline</span>
                  </div>
                  <div className="text-sm font-bold font-mono text-[#F0F0F0] mt-0.5">
                    {formatCurrency(acc.pipeline)}
                  </div>
                  <div className="text-[10px] text-[#999999]">{acc.dealsCount} deals</div>
                </div>

                <div className="p-2.5 rounded-none bg-[#3A7A65]/10 border border-[#3A7A65]/30">
                  <div className="text-[10px] font-semibold text-[#5eead4] uppercase flex items-center gap-1">
                    <Award className="h-3 w-3 text-[#3A7A65]" />
                    <span>Won Offers</span>
                  </div>
                  <div className="text-sm font-bold font-mono text-[#5eead4] mt-0.5">
                    {formatCurrency(acc.wonOffers)}
                  </div>
                  <div className="text-[10px] text-[#5eead4]/80">Closed wins</div>
                </div>

                <div className="p-2.5 rounded-none bg-[#F43F5E]/10 border border-[#F43F5E]/30">
                  <div className="text-[10px] font-semibold text-[#fda4af] uppercase flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3 text-[#F43F5E]" />
                    <span>Blocked Deals</span>
                  </div>
                  <div className="text-sm font-bold font-mono text-[#fda4af] mt-0.5">
                    {acc.blockedCount} / {acc.dealsCount}
                  </div>
                  <div className="text-[10px] text-[#fda4af]/80">Open blockers</div>
                </div>

                <div className="p-2.5 rounded-none bg-[#2E2E2E] border border-[#3D3D3D]">
                  <div className="text-[10px] font-semibold text-[#8A8A8A] uppercase flex items-center gap-1">
                    <Users className="h-3 w-3 text-[#999999]" />
                    <span>Contacts</span>
                  </div>
                  <div className="text-sm font-bold font-mono text-[#F0F0F0] mt-0.5">
                    {acc.contactsCount}
                  </div>
                  <div className="text-[10px] text-[#999999]">Key stakeholders</div>
                </div>
              </div>
            </div>

            {/* Action Footer */}
            <div className="px-6 py-3.5 bg-[#1A1A1A] border-t border-[#3D3D3D] flex items-center justify-between">
              <span className="text-[11px] text-[#8A8A8A]">
                Synced: {acc.synced_at ? new Date(acc.synced_at).toLocaleDateString() : 'Active'}
              </span>
              <Link
                href={`/accounts/${acc.id}`}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#D95B28] hover:bg-[#A33D14] text-white rounded-none text-xs font-semibold transition-all border border-[#D95B28]"
              >
                <span>Enter Deep Dive</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
