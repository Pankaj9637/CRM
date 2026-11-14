'use client';

import React from 'react';
import { Badge } from '@/components/badge';
import { formatCurrency } from '@/lib/utils';
import { ShieldAlert } from 'lucide-react';

interface RisksTabProps {
  risks: any[];
  deals: any[];
  onInspectEvidence?: (evidenceId: string) => void;
}

export function RisksTab({ risks, deals, onInspectEvidence }: RisksTabProps) {
  const dealsMap = new Map(deals.map((d) => [d.id, d.title]));

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="p-4 bg-[#242424] border border-[#3D3D3D] border-l-4 border-l-[#D95B28] rounded-none flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <p className="text-xs text-[#D6D6D6] leading-relaxed">
          Vulnerabilities identified across stalled DPIAs, unverified ROI models, and key-person departures.
        </p>
        <span className="text-xs font-mono font-bold bg-[#1A1A1A] px-2.5 py-1 rounded-none text-[#fda4af] border border-[#F43F5E]/40 shrink-0 self-start sm:self-center">
          {risks.length} IDENTIFIED THREATS
        </span>
      </div>

      <div className="space-y-3.5">
        {risks.map((risk) => {
          const evidenceList: string[] = Array.isArray(risk.evidence_ids) ? risk.evidence_ids : [];
          const dealTitle = dealsMap.get(risk.deal_id) || risk.deal_id;

          return (
            <div
              key={risk.id}
              className="p-5 rounded-none bg-[#242424] border border-[#3D3D3D] space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1">
                  <div
                    className={`p-2 rounded-none shrink-0 mt-0.5 ${
                      risk.severity === 'critical'
                        ? 'bg-[#F43F5E]/20 text-[#fda4af] border border-[#F43F5E]/40'
                        : risk.severity === 'high'
                        ? 'bg-[#D95B28]/20 text-[#EC7D42] border border-[#D95B28]/40'
                        : 'bg-[#D9A441]/20 text-[#fde047] border border-[#D9A441]/40'
                    }`}
                  >
                    <ShieldAlert className="h-4 w-4" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-bold text-[#F0F0F0]">{risk.risk}</h4>
                      <Badge variant={risk.severity} size="sm">
                        {risk.severity.toUpperCase()}
                      </Badge>
                    </div>

                    <div className="text-xs text-[#999999] font-medium">
                      Affected Opportunity: <strong className="text-[#D6D6D6]">{dealTitle}</strong>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-[10px] uppercase font-semibold text-[#8A8A8A]">Exposure</div>
                  <div className="text-base font-mono font-bold text-[#fda4af]">
                    {formatCurrency(risk.impact_value)}
                  </div>
                </div>
              </div>

              {/* Mitigation block */}
              <div className="p-3 bg-[#1A1A1A] rounded-none border border-[#3D3D3D] text-xs text-[#D6D6D6] space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#8A8A8A]">
                  Tactical Mitigation Action
                </div>
                <p className="font-medium text-[#F0F0F0] leading-relaxed">{risk.mitigation}</p>
              </div>

              {evidenceList.length > 0 && (
                <div className="flex items-center gap-1.5 text-xs text-[#999999] pt-1">
                  <span className="text-[10px] font-semibold uppercase text-[#8A8A8A]">Cited Evidence:</span>
                  <div className="flex flex-wrap gap-1">
                    {evidenceList.map((evId) => (
                      <button
                        key={evId}
                        onClick={() => onInspectEvidence?.(evId)}
                        className="px-1.5 py-0.2 rounded-none font-mono font-semibold text-[10px] bg-[#1A1A1A] hover:bg-[#D95B28]/20 text-[#D6D6D6] hover:text-[#EC7D42] border border-[#3D3D3D] transition-colors"
                      >
                        [{evId}]
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
