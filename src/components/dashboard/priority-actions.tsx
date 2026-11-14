'use client';

import React from 'react';
import { Badge } from '@/components/badge';
import { formatCurrency } from '@/lib/utils';
import { ArrowUpRight, Clock, AlertCircle, User, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

interface PriorityActionItem {
  id: number;
  priority: number;
  action: string;
  reason: string;
  deal_id: string;
  deal_title: string;
  account_id: string;
  account_name?: string;
  contact: string;
  evidence_ids: string[];
  urgency: string;
  impact_value: number;
}

interface PriorityActionsProps {
  actions: PriorityActionItem[];
  onInspectEvidence?: (id: string) => void;
}

export function PriorityActions({ actions, onInspectEvidence }: PriorityActionsProps) {
  const getUrgencyBadge = (urgency: string) => {
    switch (urgency) {
      case 'immediate':
        return <Badge variant="critical">🔴 Immediate Action</Badge>;
      case 'this_week':
        return <Badge variant="high">🟠 This Week</Badge>;
      case 'this_month':
        return <Badge variant="medium">🟡 This Month</Badge>;
      default:
        return <Badge variant="default">{urgency}</Badge>;
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-md bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-xs">
            ⚡
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-800">Priority Next Actions</h2>
            <p className="text-xs text-slate-500">AI-ranked by commercial exposure and urgency</p>
          </div>
        </div>
        <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
          TOP 5 ACTIONS
        </span>
      </div>

      <div className="divide-y divide-slate-100">
        {actions.map((act) => (
          <div
            key={act.id || act.priority}
            className="p-4 hover:bg-slate-50/70 transition-colors group flex flex-col sm:flex-row sm:items-start justify-between gap-4"
          >
            <div className="flex items-start gap-3 flex-1">
              <span className="shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-700 font-mono font-bold text-xs border border-slate-200 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 transition-colors">
                {act.priority}
              </span>

              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-bold text-slate-900 text-sm">{act.action}</span>
                  {getUrgencyBadge(act.urgency)}
                </div>

                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  {act.reason}
                </p>

                <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-slate-500 pt-1">
                  <div className="flex items-center gap-1 font-medium text-slate-700">
                    <User className="h-3.5 w-3.5 text-slate-400" />
                    <span>Engage: <strong className="text-slate-900">{act.contact}</strong></span>
                  </div>

                  <span className="text-slate-300">•</span>

                  <Link
                    href={`/accounts/${act.account_id}`}
                    className="text-indigo-600 hover:text-indigo-800 font-semibold inline-flex items-center gap-0.5"
                  >
                    <span>{act.deal_title}</span>
                    <ArrowUpRight className="h-3 w-3" />
                  </Link>

                  <span className="text-slate-300">•</span>

                  <span className="font-mono text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200/60">
                    {formatCurrency(act.impact_value)} at stake
                  </span>
                </div>

                {act.evidence_ids && act.evidence_ids.length > 0 && (
                  <div className="flex items-center gap-1.5 pt-1 text-[11px] text-slate-500">
                    <span className="text-[10px] font-semibold uppercase text-slate-400">Evidence:</span>
                    <div className="flex flex-wrap gap-1">
                      {act.evidence_ids.map((evId) => (
                        <button
                          key={evId}
                          onClick={() => onInspectEvidence?.(evId)}
                          className="px-1.5 py-0.2 rounded font-mono font-semibold text-[10px] bg-slate-100 hover:bg-indigo-50 text-slate-600 hover:text-indigo-700 border border-slate-200 transition-colors"
                        >
                          [{evId}]
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="shrink-0 flex items-center self-end sm:self-center">
              <Link
                href={`/accounts/${act.account_id}`}
                className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-indigo-600 hover:text-white rounded-lg transition-colors border border-slate-200"
              >
                Execute Action →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
