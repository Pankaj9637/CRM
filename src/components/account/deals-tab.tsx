'use client';

import React, { useState } from 'react';
import { formatCurrency } from '@/lib/utils';
import { Badge } from '@/components/badge';
import { FactData } from '@/components/evidence-inspector';
import { AlertCircle, CheckCircle2, Clock, ChevronDown, ChevronUp } from 'lucide-react';

interface DealsTabProps {
  deals: any[];
  facts: FactData[];
  onInspectEvidence?: (evidenceId: string) => void;
}

export function DealsTab({ deals, facts, onInspectEvidence }: DealsTabProps) {
  const [expandedDealId, setExpandedDealId] = useState<string | null>(null);

  const factsMap = new Map<string, FactData>(facts.map((f) => [f.id, f]));

  const toggleExpand = (dealId: string) => {
    setExpandedDealId((prev) => (prev === dealId ? null : dealId));
  };

  return (
    <div className="space-y-4">
      <div className="p-4 bg-[#242424] border border-[#D95B28]/40 rounded-2xl flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-[#F0F0F0]">Q1: What is the book worth?</h3>
          <p className="text-xs text-[#999999] mt-0.5">
            Every deal value is tied strictly to underlying evidence. Click any evidence badge to verify source records.
          </p>
        </div>
        <span className="text-xs font-mono font-bold bg-[#1A1A1A] px-2.5 py-1 rounded-lg text-[#EC7D42] border border-[#D95B28]/40 shadow-xs">
          {deals.length} OPPORTUNITIES
        </span>
      </div>

      <div className="space-y-3.5">
        {deals.map((deal) => {
          const isExpanded = expandedDealId === deal.id;
          const evidenceList: string[] = Array.isArray(deal.evidence_ids) ? deal.evidence_ids : [];
          const isBlocked = deal.blocker_status === 'open';

          return (
            <div
              key={deal.id}
              className="bg-[#242424] rounded-2xl border border-[#3D3D3D] shadow-lg shadow-black/20 overflow-hidden transition-all"
            >
              {/* Deal Card Header */}
              <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#EC7D42] bg-[#1A1A1A] px-2 py-0.5 rounded border border-[#3D3D3D]">
                      {deal.id}
                    </span>
                    <h4 className="text-base font-bold text-[#F0F0F0]">{deal.title}</h4>
                    <Badge variant={deal.stage === 'agreed' ? 'cleared' : 'default'} size="sm">
                      {deal.stage.toUpperCase()}
                    </Badge>
                  </div>

                  {/* Blocker info */}
                  {deal.blocker_text ? (
                    <div className="flex items-start gap-2 pt-1 text-xs">
                      {isBlocked ? (
                        <AlertCircle className="h-4 w-4 text-[#F43F5E] shrink-0 mt-0.5" />
                      ) : (
                        <CheckCircle2 className="h-4 w-4 text-[#3A7A65] shrink-0 mt-0.5" />
                      )}
                      <div>
                        <span className="font-semibold text-[#D6D6D6]">Blocker: </span>
                        <span className={isBlocked ? 'text-[#fda4af] font-medium' : 'text-[#D6D6D6]'}>
                          {deal.blocker_text}
                        </span>
                        <Badge variant={deal.blocker_status} size="sm" className="ml-2">
                          {deal.blocker_status.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs text-[#5eead4] flex items-center gap-1.5 pt-1">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>No active blockers recorded</span>
                    </div>
                  )}

                  {/* Deadline info */}
                  {deal.deadline_text && (
                    <div className="flex items-center gap-1.5 text-xs text-[#fde047] pt-0.5">
                      <Clock className="h-3.5 w-3.5 shrink-0" />
                      <span>
                        <strong>Deadline alert:</strong> {deal.deadline_text}
                      </span>
                    </div>
                  )}
                </div>

                {/* Deal Worth & Traceability CTA */}
                <div className="flex items-center justify-between md:flex-col md:items-end gap-2 shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-[#3D3D3D]">
                  <div className="text-right">
                    <div className="text-[10px] uppercase font-semibold text-[#8A8A8A]">worth_up_to</div>
                    <div className="text-xl font-bold font-mono text-[#F0F0F0]">
                      {formatCurrency(deal.worth_up_to)}
                    </div>
                  </div>

                  <button
                    onClick={() => toggleExpand(deal.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#EC7D42] bg-[#D95B28]/15 hover:bg-[#D95B28]/25 border border-[#D95B28]/40 transition-colors"
                  >
                    <span>Evidence Traceability ({evidenceList.length})</span>
                    {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>

              {/* Evidence Traceability Dropdown / Tray */}
              {isExpanded && (
                <div className="px-5 pb-5 pt-3 border-t border-[#3D3D3D] bg-[#1A1A1A] space-y-3 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-[#D6D6D6] uppercase tracking-wider text-[11px]">
                      Substantiating Evidence & Facts ({evidenceList.length} items)
                    </span>
                    <span className="text-[11px] text-[#8A8A8A]">
                      Click any fact to inspect credibility details
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-2">
                    {evidenceList.map((evId) => {
                      const fact = factsMap.get(evId);

                      if (!fact) {
                        return (
                          <div
                            key={evId}
                            className="p-3 rounded-xl bg-[#242424] border border-[#3D3D3D] flex items-center justify-between text-xs"
                          >
                            <span className="font-mono text-xs text-[#999999]">[{evId}]</span>
                            <Badge variant="unknown" size="sm">UNREGISTERED FILE/EVIDENCE</Badge>
                          </div>
                        );
                      }

                      return (
                        <div
                          key={evId}
                          onClick={() => onInspectEvidence?.(evId)}
                          className="p-3.5 rounded-xl bg-[#242424] hover:bg-[#2E2E2E] border border-[#3D3D3D] hover:border-[#D95B28]/60 transition-all cursor-pointer shadow-xs space-y-1.5"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-bold text-[#EC7D42] bg-[#1A1A1A] px-1.5 py-0.2 rounded border border-[#3D3D3D]">
                                {fact.id}
                              </span>
                              <Badge variant={fact.status} size="sm">
                                {fact.status.toUpperCase()}
                              </Badge>
                            </div>
                            <span className="text-[11px] text-[#999999] font-medium">
                              Source: <strong className="text-[#F0F0F0]">{fact.said_by || 'Document'}</strong>
                            </span>
                          </div>

                          <p className="text-xs text-[#D6D6D6] font-medium leading-relaxed">
                            &ldquo;{fact.text}&rdquo;
                          </p>

                          {fact.verified_by && (
                            <div className="text-[11px] text-[#5eead4] font-mono flex items-center gap-1 pt-0.5">
                              <span>✓ Verified by file: {fact.verified_by}</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
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
