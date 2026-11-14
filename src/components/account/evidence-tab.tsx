'use client';

import React, { useState } from 'react';
import { Badge } from '@/components/badge';
import { FactData } from '@/components/evidence-inspector';
import { HelpCircle, CheckCircle2, FileSearch, User } from 'lucide-react';

interface EvidenceTabProps {
  facts: FactData[];
  unknowns: any[];
  deals: any[];
  onInspectEvidence?: (evidenceId: string) => void;
}

export function EvidenceTab({ facts, unknowns, deals, onInspectEvidence }: EvidenceTabProps) {
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const dealsMap = new Map(deals.map((d) => [d.id, d.title]));

  const verifiedFacts = facts.filter((f) => f.status === 'verified');
  const toldFacts = facts.filter((f) => f.status === 'told');
  const claimFacts = facts.filter((f) => f.status === 'claim');

  const filteredFacts = facts.filter((f) => {
    if (filterStatus === 'all') return true;
    return f.status === filterStatus;
  });

  return (
    <div className="space-y-6">
      {/* Question Header */}
      <div className="p-4 bg-[#242424] border border-[#D95B28]/40 rounded-2xl flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-[#F0F0F0]">Q5: What don&apos;t we know?</h3>
          <p className="text-xs text-[#999999] mt-0.5">
            Differentiates hard verified facts from verbal statements, claims, and critical missing blindspots.
          </p>
        </div>
        <span className="text-xs font-mono font-bold bg-[#1A1A1A] px-2.5 py-1 rounded-lg text-[#EC7D42] border border-[#D95B28]/40 shadow-xs">
          {facts.length} FACTS • {unknowns.length} UNKNOWNS
        </span>
      </div>

      {/* Unknowns Register Section (Crucial!) */}
      <div className="bg-[#242424] rounded-2xl border border-[#3D3D3D] shadow-lg shadow-black/20 p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-[#3D3D3D] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-lg bg-[#D9A441]/20 text-[#fde047] border border-[#D9A441]/40 flex items-center justify-center font-bold text-xs">
              <HelpCircle className="h-3.5 w-3.5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#F0F0F0]">Unknowns Register (Critical Missing Information)</h4>
              <p className="text-xs text-[#999999]">Unresolved evidentiary gaps requiring immediate discovery</p>
            </div>
          </div>
          <span className="text-[11px] font-mono font-bold text-[#fde047] bg-[#D9A441]/15 px-2.5 py-1 rounded border border-[#D9A441]/40">
            {unknowns.length} ACTIVE BLINDSPOTS
          </span>
        </div>

        <div className="space-y-3">
          {unknowns.map((u) => {
            const dealTitle = dealsMap.get(u.deal_id) || u.deal_id;
            return (
              <div
                key={u.id}
                className="p-4 rounded-xl border border-[#3D3D3D] bg-[#1A1A1A] space-y-2.5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <span className="px-1.5 py-0.5 rounded bg-[#D9A441]/20 text-[#fde047] border border-[#D9A441]/40 text-[10px] font-bold font-mono shrink-0 mt-0.5">
                      GAP
                    </span>
                    <div>
                      <h5 className="text-xs font-bold text-[#F0F0F0]">{u.what_missing}</h5>
                      <p className="text-xs text-[#D6D6D6] mt-0.5 leading-relaxed">
                        <strong className="text-[#8A8A8A]">Why it matters: </strong>
                        {u.why_matters}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs pt-1">
                  <div className="p-2.5 rounded-lg bg-[#242424] border border-[#3D3D3D]">
                    <div className="text-[10px] font-semibold text-[#8A8A8A] uppercase">Who Can Provide</div>
                    <div className="font-semibold text-[#F0F0F0] mt-0.5 flex items-center gap-1.5">
                      <User className="h-3 w-3 text-[#999999]" />
                      <span>{u.who_can_provide}</span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-[#242424] border border-[#3D3D3D]">
                    <div className="text-[10px] font-semibold text-[#8A8A8A] uppercase">Suggested Resolution</div>
                    <div className="font-semibold text-[#EC7D42] mt-0.5">{u.suggested_action}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Known Evidence Repository Section */}
      <div className="bg-[#242424] rounded-2xl border border-[#3D3D3D] shadow-lg shadow-black/20 p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#3D3D3D] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="h-7 w-7 rounded-lg bg-[#3A7A65]/20 text-[#5eead4] border border-[#3A7A65]/40 flex items-center justify-center font-bold text-xs">
              <FileSearch className="h-3.5 w-3.5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#F0F0F0]">Known Facts & Evidence Repository</h4>
              <p className="text-xs text-[#999999]">Graded by verification level</p>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 text-xs">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                filterStatus === 'all'
                  ? 'bg-[#D95B28] text-white shadow-sm shadow-[#D95B28]/25'
                  : 'bg-[#1A1A1A] text-[#999999] hover:text-[#F0F0F0] border border-[#3D3D3D]'
              }`}
            >
              All ({facts.length})
            </button>
            <button
              onClick={() => setFilterStatus('verified')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                filterStatus === 'verified'
                  ? 'bg-[#3A7A65] text-white'
                  : 'bg-[#1A1A1A] text-[#5eead4] border border-[#3A7A65]/40'
              }`}
            >
              Verified ({verifiedFacts.length})
            </button>
            <button
              onClick={() => setFilterStatus('told')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                filterStatus === 'told'
                  ? 'bg-[#D9A441] text-black font-semibold'
                  : 'bg-[#1A1A1A] text-[#fde047] border border-[#D9A441]/40'
              }`}
            >
              Told ({toldFacts.length})
            </button>
            <button
              onClick={() => setFilterStatus('claim')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                filterStatus === 'claim'
                  ? 'bg-[#EC7D42] text-white'
                  : 'bg-[#1A1A1A] text-[#fdba74] border border-[#EC7D42]/40'
              }`}
            >
              Claim ({claimFacts.length})
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-2.5">
          {filteredFacts.map((fact) => (
            <div
              key={fact.id}
              onClick={() => onInspectEvidence?.(fact.id)}
              className="p-3.5 rounded-xl border border-[#3D3D3D] hover:border-[#D95B28]/60 bg-[#1A1A1A] hover:bg-[#2E2E2E] transition-all cursor-pointer space-y-1.5"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#EC7D42] bg-[#242424] px-2 py-0.5 rounded border border-[#3D3D3D]">
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
                <div className="text-[11px] font-mono text-[#5eead4] flex items-center gap-1 pt-0.5">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Substantiating log: {fact.verified_by}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
