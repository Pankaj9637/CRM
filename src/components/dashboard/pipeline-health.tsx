'use client';

import React from 'react';
import { formatCurrency } from '@/lib/utils';
import { TrendingUp, AlertTriangle, CheckCircle, Award, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface PipelineSummary {
  total: number;
  blocked: number;
  agreed: number;
  won_offers: number;
}

interface AccountSummary {
  id: string;
  name: string;
  pipeline: number;
  dealsCount: number;
  contactsCount: number;
  blockedCount: number;
  health: string;
}

interface PipelineHealthProps {
  pipeline: PipelineSummary;
  accounts: AccountSummary[];
}

export function PipelineHealth({ pipeline, accounts }: PipelineHealthProps) {
  return (
    <div className="bg-[#242424] rounded-2xl border border-[#3D3D3D] shadow-lg shadow-black/20 p-5 space-y-5">
      <div className="flex items-center justify-between border-b border-[#3D3D3D] pb-3">
        <div>
          <h2 className="text-sm font-bold text-[#F0F0F0]">Portfolio Pipeline Health</h2>
          <p className="text-xs text-[#999999]">Cross-account commercial exposure</p>
        </div>
        <span className="text-[11px] font-mono font-bold text-[#D6D6D6] bg-[#1A1A1A] px-2.5 py-1 rounded border border-[#3D3D3D]">
          2 ENTERPRISE ACCOUNTS
        </span>
      </div>

      {/* Top 4 KPI metric cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-[#2E2E2E] border border-[#3D3D3D]">
          <div className="text-[11px] font-semibold text-[#999999] uppercase flex items-center gap-1.5">
            <TrendingUp className="h-3.5 w-3.5 text-[#EC7D42]" />
            <span>Total Pipeline</span>
          </div>
          <div className="text-xl font-bold font-mono text-[#F0F0F0] mt-1">
            {formatCurrency(pipeline.total)}
          </div>
          <div className="text-[11px] text-[#999999] mt-0.5">8 qualified deals</div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#F43F5E]/10 border border-[#F43F5E]/30">
          <div className="text-[11px] font-semibold text-[#fda4af] uppercase flex items-center gap-1.5">
            <AlertTriangle className="h-3.5 w-3.5 text-[#F43F5E]" />
            <span>Blocked Pipeline</span>
          </div>
          <div className="text-xl font-bold font-mono text-[#fda4af] mt-1">
            {formatCurrency(pipeline.blocked)}
          </div>
          <div className="text-[11px] text-[#fda4af]/80 mt-0.5">7 deals with blockers</div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#3A7A65]/10 border border-[#3A7A65]/30">
          <div className="text-[11px] font-semibold text-[#5eead4] uppercase flex items-center gap-1.5">
            <CheckCircle className="h-3.5 w-3.5 text-[#3A7A65]" />
            <span>Agreed Deals</span>
          </div>
          <div className="text-xl font-bold font-mono text-[#5eead4] mt-1">
            {formatCurrency(pipeline.agreed)}
          </div>
          <div className="text-[11px] text-[#5eead4]/80 mt-0.5">Insurance discount</div>
        </div>

        <div className="p-3.5 rounded-xl bg-[#3E6F9E]/10 border border-[#3E6F9E]/30">
          <div className="text-[11px] font-semibold text-[#7dd3fc] uppercase flex items-center gap-1.5">
            <Award className="h-3.5 w-3.5 text-[#3E6F9E]" />
            <span>Won Offers</span>
          </div>
          <div className="text-xl font-bold font-mono text-[#7dd3fc] mt-1">
            {formatCurrency(pipeline.won_offers)}
          </div>
          <div className="text-[11px] text-[#7dd3fc]/80 mt-0.5">4 closed offers</div>
        </div>
      </div>

      {/* Account breakdown split cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        {accounts.map((acc) => (
          <Link
            key={acc.id}
            href={`/accounts/${acc.id}`}
            className="group block p-4 rounded-xl border border-[#3D3D3D] hover:border-[#D95B28] bg-[#2E2E2E]/60 hover:bg-[#2E2E2E] transition-all shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded font-mono font-bold text-xs flex items-center justify-center bg-[#1A1A1A] text-[#EC7D42] border border-[#3D3D3D]">
                  {acc.id}
                </span>
                <span className="font-bold text-[#F0F0F0] text-sm group-hover:text-[#EC7D42] transition-colors">
                  {acc.name}
                </span>
              </div>
              <ArrowRight className="h-4 w-4 text-[#999999] group-hover:text-[#EC7D42] group-hover:translate-x-0.5 transition-all" />
            </div>

            <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-[#3D3D3D] text-center">
              <div>
                <div className="text-[10px] uppercase font-semibold text-[#999999]">Pipeline</div>
                <div className="font-mono font-bold text-[#F0F0F0] text-xs mt-0.5">
                  {formatCurrency(acc.pipeline)}
                </div>
              </div>
              <div>
                <div className="text-[10px] uppercase font-semibold text-[#999999]">Blocked</div>
                <div className="font-mono font-bold text-[#fda4af] text-xs mt-0.5">
                  {acc.blockedCount} deals
                </div>
              </div>
              <div>
                <div className="text-[10px] uppercase font-semibold text-[#999999]">Status</div>
                <div className="text-xs font-semibold text-[#D9A441] mt-0.5">
                  ⚠️ Action Req.
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
