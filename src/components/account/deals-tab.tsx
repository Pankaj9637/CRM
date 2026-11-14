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
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-none text-[10px] font-mono font-bold bg-[#F43F5E]/20 text-[#fda4af] border border-[#F43F5E]/40">
          <AlertCircle className="h-3 w-3" />
          [CLAIM / CONTRADICTED]
        </span>
      );
    }
    if (integrity === 'told') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-none text-[10px] font-mono font-bold bg-[#D9A441]/20 text-[#fde047] border border-[#D9A441]/40">
          <HelpCircle className="h-3 w-3" />
          [TOLD]
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-none text-[10px] font-mono font-bold bg-[#3A7A65]/20 text-[#5eead4] border border-[#3A7A65]/40">
        <CheckCircle2 className="h-3 w-3" />
        [VERIFIED]
      </span>
    );
  };

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="p-4 bg-[#242424] border border-[#3D3D3D] border-l-4 border-l-[#D95B28] rounded-none flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <p className="text-xs text-[#D6D6D6] font-mono leading-relaxed">
          Triangulating commercial deal potential against physical evidence, paperwork, and telemetry. Click any blocker for Forensic Reality Check.
        </p>
        <span className="text-xs font-mono font-bold bg-[#1A1A1A] px-2.5 py-1 text-[#EC7D42] border border-[#3D3D3D] rounded-none self-start sm:self-center shrink-0">
          {deals.length} OPPORTUNITIES
        </span>
      </div>

      <div className="space-y-3">
        {deals.map((deal) => {
          const isExpanded = expandedDealId === deal.id;
          const evidenceList: string[] = Array.isArray(deal.evidence_ids) ? deal.evidence_ids : [];
          const isBlocked = deal.blocker_status === 'open';
          const forensic = FORENSIC_RECORDS[deal.id];

          return (
            <div
              key={deal.id}
              className={cn(
                'bg-[#242424] rounded-none border transition-all',
                forensic?.integrity === 'contradicted'
                  ? 'border-[#F43F5E]/40 hover:border-[#F43F5E]'
                  : 'border-[#3D3D3D] hover:border-[#D95B28]'
              )}
            >
              {/* Deal Card Header */}
              <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#EC7D42] bg-[#1A1A1A] px-2 py-0.5 border border-[#3D3D3D] rounded-none">
                      {deal.id}
                    </span>
                    <h4 className="text-sm font-bold text-[#F0F0F0] uppercase font-mono tracking-wide">{deal.title}</h4>
                    <Badge variant={deal.stage === 'agreed' ? 'cleared' : 'default'} size="sm">
                      {deal.stage.toUpperCase()}
                    </Badge>
                    {getIntegrityBadge(deal.id, deal.integrity_status)}
                  </div>

                  {/* Blocker & Smoking Gun Callout */}
                  {deal.blocker_text ? (
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 bg-[#1A1A1A] border border-[#3D3D3D] rounded-none">
                      <div className="flex items-start gap-2 text-xs">
                        {isBlocked ? (
                          <AlertCircle className="h-4 w-4 text-[#F43F5E] shrink-0 mt-0.5" />
                        ) : (
                          <CheckCircle2 className="h-4 w-4 text-[#3A7A65] shrink-0 mt-0.5" />
                        )}
                        <div>
                          <span className="font-semibold text-[#D6D6D6] font-mono">Blocker: </span>
                          <span className={isBlocked ? 'text-[#fda4af] font-medium' : 'text-[#D6D6D6]'}>
                            {deal.blocker_text}
                          </span>
                        </div>
                      </div>

                      {forensic && (
                        <button
                          onClick={() => onOpenForensicDrawer?.(deal.id)}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-mono font-bold uppercase tracking-wider bg-[#F43F5E]/15 hover:bg-[#F43F5E]/25 text-[#fda4af] border border-[#F43F5E]/40 transition-colors shrink-0 rounded-none"
                        >
                          <Flame className="h-3 w-3 text-[#F43F5E]" />
                          <span>Smoking Gun Evidence</span>
                          <ExternalLink className="h-2.5 w-2.5" />
                        </button>
                      )}
                    </div>
                  ) : (
                    <div className="text-xs text-[#5eead4] flex items-center gap-1.5 pt-1 font-mono">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>No active blockers recorded</span>
                    </div>
                  )}

                  {/* Deadline info */}
                  {deal.deadline_text && (
                    <div className="flex items-center gap-1.5 text-xs text-[#fde047] pt-0.5 font-mono">
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
                    <div className="text-[10px] uppercase font-mono font-semibold text-[#8A8A8A]">worth_up_to</div>
                    <div className="text-xl font-bold font-mono text-[#F0F0F0]">
                      {formatCurrency(deal.worth_up_to)}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {forensic && (
                      <button
                        onClick={() => onOpenForensicDrawer?.(deal.id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-mono font-bold uppercase tracking-wider text-[#EC7D42] bg-[#1A1A1A] hover:bg-[#2E2E2E] border border-[#D95B28]/40 transition-colors rounded-none"
                      >
                        <FileSearch className="h-3.5 w-3.5" />
                        <span>Forensic Reality Check</span>
                      </button>
                    )}
                    <button
                      onClick={() => toggleExpand(deal.id)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-mono font-bold uppercase tracking-wider text-[#D6D6D6] bg-[#2E2E2E] hover:bg-[#3D3D3D] border border-[#3D3D3D] transition-colors rounded-none"
                    >
                      <span>Evidence ({evidenceList.length})</span>
                      {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Evidence Traceability Dropdown / Tray */}
              {isExpanded && (
                <div className="px-5 pb-5 pt-3 border-t border-[#3D3D3D] bg-[#1A1A1A] space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-bold text-[#D6D6D6] uppercase tracking-wider text-[10px]">
                      Substantiating Evidence & Facts ({evidenceList.length} items)
                    </span>
                    <span className="text-[10px] text-[#8A8A8A]">
                      Click fact to inspect credibility details
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
                            className="p-3 bg-[#242424] hover:bg-[#2E2E2E] border border-[#3D3D3D] flex items-center justify-between text-xs cursor-pointer rounded-none font-mono"
                          >
                            <span className="text-xs text-[#EC7D42]">[{evId}]</span>
                            <Badge variant="unknown" size="sm">UNREGISTERED FILE/EVIDENCE</Badge>
                          </div>
                        );
                      }

                      return (
                        <div
                          key={evId}
                          onClick={() => onInspectEvidence?.(evId)}
                          className="p-3 bg-[#242424] hover:bg-[#2E2E2E] border border-[#3D3D3D] hover:border-[#D95B28]/60 transition-all cursor-pointer rounded-none space-y-1.5"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-bold text-[#EC7D42] bg-[#1A1A1A] px-1.5 py-0.2 border border-[#3D3D3D] rounded-none">
                                {fact.id}
                              </span>
                              <Badge variant={fact.status} size="sm">
                                {fact.status.toUpperCase()}
                              </Badge>
                            </div>
                            <span className="text-[11px] text-[#999999] font-mono">
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
