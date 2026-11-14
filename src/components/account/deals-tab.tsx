'use client';

import React, { useState } from 'react';
import { formatCurrency } from '@/lib/utils';
import { Badge } from '@/components/badge';
import { FactData } from '@/components/evidence-inspector';
import { AlertCircle, CheckCircle2, Clock, ChevronDown, ChevronUp, FileText, ExternalLink } from 'lucide-react';

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
      <div className="p-4 bg-indigo-50/70 border border-indigo-200/80 rounded-xl flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-indigo-950">Q1: What is the book worth?</h3>
          <p className="text-xs text-indigo-800/80 mt-0.5">
            Every deal value is tied strictly to its underlying evidence. Click any evidence badge to verify source records.
          </p>
        </div>
        <span className="text-xs font-mono font-bold bg-white px-2.5 py-1 rounded-lg text-indigo-700 border border-indigo-200 shadow-sm">
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
              className="bg-white rounded-xl border border-slate-200/90 shadow-sm overflow-hidden transition-all"
            >
              {/* Deal Card Header */}
              <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      {deal.id}
                    </span>
                    <h4 className="text-base font-bold text-slate-900">{deal.title}</h4>
                    <Badge variant={deal.stage === 'agreed' ? 'cleared' : 'default'} size="sm">
                      {deal.stage.toUpperCase()}
                    </Badge>
                  </div>

                  {/* Blocker info */}
                  {deal.blocker_text ? (
                    <div className="flex items-start gap-2 pt-1 text-xs">
                      {isBlocked ? (
                        <AlertCircle className="h-4 w-4 text-rose-600 shrink-0 mt-0.5" />
                      ) : (
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      )}
                      <div>
                        <span className="font-semibold text-slate-700">Blocker: </span>
                        <span className={isBlocked ? 'text-rose-700 font-medium' : 'text-slate-600'}>
                          {deal.blocker_text}
                        </span>
                        <Badge variant={deal.blocker_status} size="sm" className="ml-2">
                          {deal.blocker_status.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs text-emerald-700 flex items-center gap-1.5 pt-1">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      <span>No active blockers recorded</span>
                    </div>
                  )}

                  {/* Deadline info */}
                  {deal.deadline_text && (
                    <div className="flex items-center gap-1.5 text-xs text-amber-700 pt-0.5">
                      <Clock className="h-3.5 w-3.5 shrink-0" />
                      <span>
                        <strong>Deadline alert:</strong> {deal.deadline_text}
                      </span>
                    </div>
                  )}
                </div>

                {/* Deal Worth & Traceability CTA */}
                <div className="flex items-center justify-between md:flex-col md:items-end gap-2 shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-slate-100">
                  <div className="text-right">
                    <div className="text-[10px] uppercase font-semibold text-slate-400">worth_up_to</div>
                    <div className="text-xl font-bold font-mono text-slate-900">
                      {formatCurrency(deal.worth_up_to)}
                    </div>
                  </div>

                  <button
                    onClick={() => toggleExpand(deal.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 transition-colors"
                  >
                    <span>Evidence Traceability ({evidenceList.length})</span>
                    {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>

              {/* Evidence Traceability Dropdown / Tray */}
              {isExpanded && (
                <div className="px-5 pb-5 pt-2 border-t border-slate-100 bg-slate-50/70 space-y-3 animate-in fade-in duration-150">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700 uppercase tracking-wider text-[11px]">
                      Substantiating Evidence & Facts ({evidenceList.length} items)
                    </span>
                    <span className="text-[11px] text-slate-500">
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
                            className="p-3 rounded-lg bg-white border border-slate-200 flex items-center justify-between text-xs"
                          >
                            <span className="font-mono text-xs text-slate-500">[{evId}]</span>
                            <Badge variant="unknown" size="sm">UNREGISTERED FILE/EVIDENCE</Badge>
                          </div>
                        );
                      }

                      return (
                        <div
                          key={evId}
                          onClick={() => onInspectEvidence?.(evId)}
                          className="p-3.5 rounded-lg bg-white hover:bg-slate-50 border border-slate-200 hover:border-indigo-300 transition-all cursor-pointer shadow-xs space-y-1.5"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-bold text-slate-600 bg-slate-100 px-1.5 py-0.2 rounded">
                                {fact.id}
                              </span>
                              <Badge variant={fact.status} size="sm">
                                {fact.status.toUpperCase()}
                              </Badge>
                            </div>
                            <span className="text-[11px] text-slate-500 font-medium">
                              Source: <strong className="text-slate-800">{fact.said_by || 'Document'}</strong>
                            </span>
                          </div>

                          <p className="text-xs text-slate-800 font-medium leading-relaxed">
                            &ldquo;{fact.text}&rdquo;
                          </p>

                          {fact.verified_by && (
                            <div className="text-[11px] text-emerald-700 font-mono flex items-center gap-1 pt-0.5">
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
