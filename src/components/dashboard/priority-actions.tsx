'use client';

import React from 'react';
import { Badge } from '@/components/badge';
import { formatCurrency } from '@/lib/utils';
import { ArrowUpRight, User } from 'lucide-react';
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
    <div className="bg-[#242424] rounded-2xl border border-[#3D3D3D] shadow-lg shadow-black/20 overflow-hidden">
      <div className="px-5 py-4 border-b border-[#3D3D3D] flex items-center justify-between bg-[#2E2E2E]/60">
        <div className="flex items-center gap-2.5">
          <div className="h-7 w-7 rounded-lg bg-[#D95B28]/20 text-[#EC7D42] border border-[#D95B28]/40 flex items-center justify-center font-bold text-xs">
            ⚡
          </div>
          <div>
            <h2 className="text-sm font-bold text-[#F0F0F0]">Priority Next Actions</h2>
            <p className="text-xs text-[#999999]">AI-ranked by commercial exposure and urgency</p>
          </div>
        </div>
        <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-[#1A1A1A] text-[#D6D6D6] border border-[#3D3D3D]">
          TOP 5 ACTIONS
        </span>
      </div>

      <div className="divide-y divide-[#3D3D3D]">
        {actions.map((act) => (
          <div
            key={act.id || act.priority}
            className="p-4 hover:bg-[#2E2E2E]/50 transition-colors group flex flex-col sm:flex-row sm:items-start justify-between gap-4"
          >
            <div className="flex items-start gap-3 flex-1">
              <span className="shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-[#1A1A1A] text-[#D6D6D6] font-mono font-bold text-xs border border-[#3D3D3D] group-hover:bg-[#D95B28] group-hover:text-white group-hover:border-[#D95B28] transition-colors">
                {act.priority}
              </span>

              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-bold text-[#F0F0F0] text-sm">{act.action}</span>
                  {getUrgencyBadge(act.urgency)}
                </div>

                <p className="text-xs text-[#D6D6D6] leading-relaxed font-normal">
                  {act.reason}
                </p>

                <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-[#999999] pt-1">
                  <div className="flex items-center gap-1 font-medium text-[#D6D6D6]">
                    <User className="h-3.5 w-3.5 text-[#999999]" />
                    <span>Engage: <strong className="text-[#F0F0F0]">{act.contact}</strong></span>
                  </div>

                  <span className="text-[#3D3D3D]">•</span>

                  <Link
                    href={`/accounts/${act.account_id}`}
                    className="text-[#EC7D42] hover:text-[#D95B28] font-semibold inline-flex items-center gap-0.5"
                  >
                    <span>{act.deal_title}</span>
                    <ArrowUpRight className="h-3 w-3" />
                  </Link>

                  <span className="text-[#3D3D3D]">•</span>

                  <span className="font-mono text-[#5eead4] font-bold bg-[#3A7A65]/20 px-2 py-0.5 rounded border border-[#3A7A65]/40">
                    {formatCurrency(act.impact_value)} at stake
                  </span>
                </div>

                {act.evidence_ids && act.evidence_ids.length > 0 && (
                  <div className="flex items-center gap-1.5 pt-1 text-[11px] text-[#999999]">
                    <span className="text-[10px] font-semibold uppercase text-[#8A8A8A]">Evidence:</span>
                    <div className="flex flex-wrap gap-1">
                      {act.evidence_ids.map((evId) => (
                        <button
                          key={evId}
                          onClick={() => onInspectEvidence?.(evId)}
                          className="px-1.5 py-0.2 rounded font-mono font-semibold text-[10px] bg-[#1A1A1A] hover:bg-[#D95B28]/20 text-[#D6D6D6] hover:text-[#EC7D42] border border-[#3D3D3D] transition-colors"
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
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#D95B28] hover:bg-[#A33D14] rounded-lg transition-colors border border-[#D95B28] shadow-sm shadow-[#D95B28]/20"
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
