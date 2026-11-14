'use client';

import React, { useState } from 'react';
import { formatCurrency } from '@/lib/utils';
import { Badge } from '@/components/badge';
import { FactData } from '@/components/evidence-inspector';
import { FORENSIC_RECORDS } from '@/lib/intelligence-data';
import { 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  ChevronDown, 
  ChevronUp, 
  Flame, 
  HelpCircle, 
  Sparkles,
  FileSearch,
  ExternalLink
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface DealsTabProps {
  deals: any[];
  facts: FactData[];
  onInspectEvidence?: (evidenceId: string) => void;
  onOpenForensicDrawer?: (dealId: string) => void;
}

export function DealsTab({
  deals,
  facts,
  onInspectEvidence,
  onOpenForensicDrawer,
}: DealsTabProps) {
  const [expandedDealId, setExpandedDealId] = useState<string | null>(null);

  const factsMap = new Map<string, FactData>(facts.map((f) => [f.id, f]));

  const toggleExpand = (dealId: string) => {
    setExpandedDealId((prev) => (prev === dealId ? null : dealId));
  };

  const getIntegrityBadge = (dealId: string, status?: string) => {
    const forensic = FORENSIC_RECORDS[dealId];
    const integrity = forensic?.integrity || status || 'verified';

    if (integrity === 'contradicted') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#F43F5E]/20 text-[#fda4af] border border-[#F43F5E]/40 shadow-xs">
          <AlertCircle className="h-3 w-3" />
          [CLAIM / CONTRADICTED]
        </span>
      );
    }
    if (integrity === 'told') {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#D9A441]/20 text-[#fde047] border border-[#D9A441]/40 shadow-xs">
          <HelpCircle className="h-3 w-3" />
          [TOLD]
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#3A7A65]/20 text-[#5eead4] border border-[#3A7A65]/40 shadow-xs">
        <CheckCircle2 className="h-3 w-3" />
        [VERIFIED]
      </span>
    );
  };

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="p-4 bg-[#242424] border border-[#D95B28]/40 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-[#F0F0F0]">Q1: What is the book worth?</h3>
          <p className="text-xs text-[#999999] mt-0.5">
            Triangulating commercial deal potential against physical evidence, paperwork, and telemetry. Click any blocker for Forensic Reality Check.
          </p>
        </div>
        <span className="text-xs font-mono font-bold bg-[#1A1A1A] px-2.5 py-1 rounded-lg text-[#EC7D42] border border-[#D95B28]/40 shadow-xs self-start sm:self-center">
          {deals.length} OPPORTUNITIES
        </span>
      </div>

      <div className="space-y-3.5">
        {deals.map((deal) => {
          const isExpanded = expandedDealId === deal.id;
          const evidenceList: string[] = Array.isArray(deal.evidence_ids) ? deal.evidence_ids : [];
          const isBlocked = deal.blocker_status === 'open';
          const forensic = FORENSIC_RECORDS[deal.id];

          return (
            <div
              key={deal.id}
              className={cn(
                'bg-[#242424] rounded-2xl border shadow-lg shadow-black/20 overflow-hidden transition-all',
                forensic?.integrity === 'contradicted'
                  ? 'border-[#F43F5E]/30 hover:border-[#F43F5E]/60'
                  : 'border-[#3D3D3D] hover:border-[#D95B28]/50'
              )}
            >
              {/* Deal Card Header */}
              <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#EC7D42] bg-[#1A1A1A] px-2 py-0.5 rounded border border-[#3D3D3D]">
                      {deal.id}
                    </span>
                    <h4 className="text-base font-bold text-[#F0F0F0]">{deal.title}</h4>
                    <Badge variant={deal.stage === 'agreed' ? 'cleared' : 'default'} size="sm">
                      {deal.stage.toUpperCase()}
                    </Badge>
                    {getIntegrityBadge(deal.id, deal.integrity_status)}
                  </div>

                  {/* Blocker & Smoking Gun Callout */}
                  {deal.blocker_text ? (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 rounded-xl bg-[#1A1A1A] border border-[#3D3D3D]">
                      <div className="flex items-start gap-2 text-xs">
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
                        </div>
                      </div>

                      {forensic && (
                        <button
                          onClick={() => onOpenForensicDrawer?.(deal.id)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-[#F43F5E]/15 hover:bg-[#F43F5E]/25 text-[#fda4af] border border-[#F43F5E]/40 transition-colors shrink-0 shadow-xs"
                        >
                          <Flame className="h-3 w-3 text-[#F43F5E]" />
                          <span>Smoking Gun Evidence</span>
                          <ExternalLink className="h-2.5 w-2.5" />
                        </button>
                      )}
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

                {/* Deal Worth & Actions */}
                <div className="flex items-center justify-between md:flex-col md:items-end gap-2.5 shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-[#3D3D3D]">
                  <div className="text-right">
                    <div className="text-[10px] uppercase font-semibold text-[#8A8A8A]">worth_up_to</div>
                    <div className="text-xl font-bold font-mono text-[#F0F0F0]">
                      {formatCurrency(deal.worth_up_to)}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {forensic && (
                      <button
                        onClick={() => onOpenForensicDrawer?.(deal.id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-[#EC7D42] bg-[#D95B28]/15 hover:bg-[#D95B28]/25 border border-[#D95B28]/40 transition-colors"
                      >
                        <FileSearch className="h-3.5 w-3.5" />
                        <span>Forensic Reality Check</span>
                      </button>
                    )}
                    <button
                      onClick={() => toggleExpand(deal.id)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#D6D6D6] bg-[#2E2E2E] hover:bg-[#3D3D3D] border border-[#3D3D3D] transition-colors"
                    >
                      <span>Evidence ({evidenceList.length})</span>
                      {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                    </button>
                  </div>
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
                            onClick={() => onInspectEvidence?.(evId)}
                            className="p-3 rounded-xl bg-[#242424] hover:bg-[#2E2E2E] border border-[#3D3D3D] flex items-center justify-between text-xs cursor-pointer"
                          >
                            <span className="font-mono text-xs text-[#EC7D42]">[{evId}]</span>
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
