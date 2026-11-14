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
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-5 space-y-5">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h2 className="text-sm font-bold text-slate-900">Portfolio Pipeline Health</h2>
          <p className="text-xs text-slate-500">Cross-account commercial exposure</p>
        </div>
        <span className="text-[11px] font-mono font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
          2 ENTERPRISE ACCOUNTS
        </span>
      </div>

      {/* Top 4 KPI metric cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
          <div className="text-[11px] font-semibold text-slate-500 uppercase flex items-center gap-1.5">
            <TrendingUp className="h-3.5 w-3.5 text-indigo-600" />
            <span>Total Pipeline</span>
          </div>
          <div className="text-xl font-bold font-mono text-slate-900 mt-1">
            {formatCurrency(pipeline.total)}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">8 qualified deals</div>
        </div>

        <div className="p-3.5 rounded-xl bg-rose-50/60 border border-rose-200/70">
          <div className="text-[11px] font-semibold text-rose-700 uppercase flex items-center gap-1.5">
            <AlertTriangle className="h-3.5 w-3.5 text-rose-600" />
            <span>Blocked Pipeline</span>
          </div>
          <div className="text-xl font-bold font-mono text-rose-700 mt-1">
            {formatCurrency(pipeline.blocked)}
          </div>
          <div className="text-[11px] text-rose-600/80 mt-0.5">7 deals with blockers</div>
        </div>

        <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200/70">
          <div className="text-[11px] font-semibold text-emerald-700 uppercase flex items-center gap-1.5">
            <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />
            <span>Agreed Deals</span>
          </div>
          <div className="text-xl font-bold font-mono text-emerald-700 mt-1">
            {formatCurrency(pipeline.agreed)}
          </div>
          <div className="text-[11px] text-emerald-600/80 mt-0.5">Insurance discount</div>
        </div>

        <div className="p-3.5 rounded-xl bg-sky-50/60 border border-sky-200/70">
          <div className="text-[11px] font-semibold text-sky-700 uppercase flex items-center gap-1.5">
            <Award className="h-3.5 w-3.5 text-sky-600" />
            <span>Won Offers</span>
          </div>
          <div className="text-xl font-bold font-mono text-sky-700 mt-1">
            {formatCurrency(pipeline.won_offers)}
          </div>
          <div className="text-[11px] text-sky-600/80 mt-0.5">4 closed offers</div>
        </div>
      </div>

      {/* Account breakdown split cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
        {accounts.map((acc) => (
          <Link
            key={acc.id}
            href={`/accounts/${acc.id}`}
            className="group block p-4 rounded-xl border border-slate-200 hover:border-indigo-400 bg-white hover:bg-slate-50/70 transition-all shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded font-mono font-bold text-xs flex items-center justify-center bg-slate-900 text-white">
                  {acc.id}
                </span>
                <span className="font-bold text-slate-900 text-sm group-hover:text-indigo-600 transition-colors">
                  {acc.name}
                </span>
              </div>
              <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
            </div>

            <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-slate-100 text-center">
              <div>
                <div className="text-[10px] uppercase font-semibold text-slate-400">Pipeline</div>
                <div className="font-mono font-bold text-slate-900 text-xs mt-0.5">
                  {formatCurrency(acc.pipeline)}
                </div>
              </div>
              <div>
                <div className="text-[10px] uppercase font-semibold text-slate-400">Blocked</div>
                <div className="font-mono font-bold text-rose-600 text-xs mt-0.5">
                  {acc.blockedCount} deals
                </div>
              </div>
              <div>
                <div className="text-[10px] uppercase font-semibold text-slate-400">Status</div>
                <div className="text-xs font-semibold text-amber-600 mt-0.5">
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
