'use client';

import React from 'react';
import { Badge } from '@/components/badge';
import { formatCurrency } from '@/lib/utils';
import { User } from 'lucide-react';

interface ActionsTabProps {
  actions: any[];
  onInspectEvidence?: (evidenceId: string) => void;
}

export function ActionsTab({ actions, onInspectEvidence }: ActionsTabProps) {
  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="p-4 bg-[#242424] border border-[#3D3D3D] border-l-4 border-l-[#D95B28] rounded-none flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <p className="text-xs text-[#D6D6D6] leading-relaxed">
          Recommended moves ranked by deal value at risk and stakeholder responsiveness.
        </p>
        <span className="text-xs font-mono font-bold bg-[#1A1A1A] px-2.5 py-1 text-[#EC7D42] border border-[#3D3D3D] rounded-none shrink-0 self-start sm:self-center">
          {actions.length} ACTIONS FOR THIS ACCOUNT
        </span>
      </div>

      <div className="space-y-3.5">
        {actions.map((act) => {
          const evidenceList: string[] = Array.isArray(act.evidence_ids) ? act.evidence_ids : [];

          return (
            <div
              key={act.id || act.priority}
              className="p-5 rounded-none bg-[#242424] border border-[#3D3D3D] space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1">
                  <span className="w-7 h-7 rounded-none bg-[#D95B28] text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                    {act.priority}
                  </span>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-bold text-[#F0F0F0]">{act.action}</h4>
                      <Badge variant={act.urgency} size="sm">
                        {act.urgency.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-xs text-[#D6D6D6] font-normal leading-relaxed">
                      {act.reason}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-[10px] uppercase font-semibold text-[#8A8A8A]">At Stake</div>
                  <div className="text-base font-mono font-bold text-[#5eead4]">
                    {formatCurrency(act.impact_value)}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs text-[#999999] pt-2 border-t border-[#3D3D3D]">
                <div className="flex items-center gap-1.5 font-medium text-[#D6D6D6]">
                  <User className="h-3.5 w-3.5 text-[#8A8A8A]" />
                  <span>Key Stakeholder: <strong className="text-[#F0F0F0]">{act.contact}</strong></span>
                </div>

                <span className="text-[#3D3D3D]">•</span>

                <div>
                  <span>Target Deal: <strong className="text-[#F0F0F0]">{act.deal_title}</strong></span>
                </div>

                {evidenceList.length > 0 && (
                  <>
                    <span className="text-[#3D3D3D]">•</span>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] font-semibold text-[#8A8A8A] uppercase">Evidence:</span>
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
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
