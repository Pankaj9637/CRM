'use client';

import React from 'react';
import { Badge } from '@/components/badge';
import { formatCurrency } from '@/lib/utils';
import { ShieldAlert, AlertTriangle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface RiskAlertItem {
  id: number;
  severity: 'critical' | 'high' | 'medium' | string;
  risk: string;
  deal_id: string;
  account_id: string;
  account_name?: string;
  impact_value: number;
  mitigation: string;
  evidence_ids: string[];
}

interface RiskAlertsProps {
  risks: RiskAlertItem[];
  onInspectEvidence?: (id: string) => void;
}

export function RiskAlerts({ risks, onInspectEvidence }: RiskAlertsProps) {
  return (
    <div className="bg-[#242424] rounded-2xl border border-[#3D3D3D] shadow-lg shadow-black/20 p-5 space-y-4">
      <div className="flex items-center justify-between border-b border-[#3D3D3D] pb-3">
        <div className="flex items-center gap-2.5">
          <div className="h-7 w-7 rounded-lg bg-[#D9A441]/20 text-[#fde047] border border-[#D9A441]/40 flex items-center justify-center font-bold text-xs">
            <ShieldAlert className="h-3.5 w-3.5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-[#F0F0F0]">Commercial Risk Radar</h2>
            <p className="text-xs text-[#999999]">Blockers, deadlines & evidentiary discrepancies</p>
          </div>
        </div>
        <span className="text-[11px] font-mono font-bold text-[#fda4af] bg-[#F43F5E]/15 px-2.5 py-1 rounded border border-[#F43F5E]/40">
          {risks.filter((r) => r.severity === 'critical').length} CRITICAL RISKS
        </span>
      </div>

      <div className="space-y-3">
        {risks.map((item, idx) => (
          <div
            key={item.id || idx}
            className="p-3.5 rounded-xl border border-[#3D3D3D] hover:border-[#D95B28]/60 bg-[#2E2E2E]/60 hover:bg-[#2E2E2E] transition-all space-y-2.5"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5 flex-1">
                <AlertTriangle
                  className={`h-4 w-4 shrink-0 mt-0.5 ${
                    item.severity === 'critical'
                      ? 'text-[#F43F5E]'
                      : item.severity === 'high'
                      ? 'text-[#D95B28]'
                      : 'text-[#D9A441]'
                  }`}
                />
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-[#F0F0F0]">{item.risk}</span>
                    <Badge variant={item.severity} size="sm">
                      {item.severity.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-[#999999]">
                    <span className="font-semibold text-[#D6D6D6]">Account {item.account_id}</span>
                    <span>•</span>
                    <span className="font-mono font-bold text-[#fda4af]">
                      {formatCurrency(item.impact_value)} at risk
                    </span>
                  </div>
                </div>
              </div>

              <Link
                href={`/accounts/${item.account_id}`}
                className="shrink-0 text-[#999999] hover:text-[#EC7D42] p-1 transition-colors"
                title="View Account Details"
              >
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Mitigation */}
            <div className="p-2.5 rounded-lg bg-[#1A1A1A] border border-[#3D3D3D] text-xs text-[#D6D6D6]">
              <strong className="text-[#F0F0F0] font-semibold">Mitigation Strategy: </strong>
              <span>{item.mitigation}</span>
            </div>

            {item.evidence_ids && item.evidence_ids.length > 0 && (
              <div className="flex items-center gap-1.5 text-[11px] text-[#999999]">
                <span className="text-[10px] font-semibold uppercase text-[#8A8A8A]">Evidence:</span>
                <div className="flex flex-wrap gap-1">
                  {item.evidence_ids.map((evId) => (
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
        ))}
      </div>
    </div>
  );
}
