'use client';

import React, { useState } from 'react';
import { Badge } from '@/components/badge';
import { FactData } from '@/components/evidence-inspector';
import { HelpCircle, CheckCircle2, AlertCircle, FileSearch, ArrowRight, User } from 'lucide-react';

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
      <div className="p-4 bg-indigo-50/70 border border-indigo-200/80 rounded-xl flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-indigo-950">Q5: What don&apos;t we know?</h3>
          <p className="text-xs text-indigo-800/80 mt-0.5">
            Differentiates hard verified facts from verbal statements, claims, and critical missing blindspots.
          </p>
        </div>
        <span className="text-xs font-mono font-bold bg-white px-2.5 py-1 rounded-lg text-indigo-700 border border-indigo-200 shadow-sm">
          {facts.length} FACTS • {unknowns.length} UNKNOWNS
        </span>
      </div>

      {/* Unknowns Register Section (Crucial!) */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-md bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs">
              <HelpCircle className="h-3.5 w-3.5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Unknowns Register (Critical Missing Information)</h4>
              <p className="text-xs text-slate-500">Unresolved evidentiary gaps requiring immediate discovery</p>
            </div>
          </div>
          <span className="text-[11px] font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
            {unknowns.length} ACTIVE BLINDSPOTS
          </span>
        </div>

        <div className="space-y-3">
          {unknowns.map((u) => {
            const dealTitle = dealsMap.get(u.deal_id) || u.deal_id;
            return (
              <div
                key={u.id}
                className="p-4 rounded-xl border border-amber-200/70 bg-amber-50/30 space-y-2.5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <span className="p-1 rounded bg-amber-100 text-amber-800 text-[10px] font-bold font-mono shrink-0 mt-0.5">
                      GAP
                    </span>
                    <div>
                      <h5 className="text-xs font-bold text-slate-900">{u.what_missing}</h5>
                      <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                        <strong className="text-slate-800">Why it matters: </strong>
                        {u.why_matters}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs pt-1">
                  <div className="p-2.5 rounded-lg bg-white border border-slate-200/80">
                    <div className="text-[10px] font-semibold text-slate-400 uppercase">Who Can Provide</div>
                    <div className="font-semibold text-slate-800 mt-0.5 flex items-center gap-1">
                      <User className="h-3 w-3 text-slate-400" />
                      <span>{u.who_can_provide}</span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-white border border-slate-200/80">
                    <div className="text-[10px] font-semibold text-slate-400 uppercase">Suggested Resolution</div>
                    <div className="font-semibold text-indigo-700 mt-0.5">{u.suggested_action}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Known Evidence Repository Section */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-md bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
              <FileSearch className="h-3.5 w-3.5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900">Known Facts & Evidence Repository</h4>
              <p className="text-xs text-slate-500">Graded by verification level</p>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 text-xs">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                filterStatus === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All ({facts.length})
            </button>
            <button
              onClick={() => setFilterStatus('verified')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                filterStatus === 'verified'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200'
              }`}
            >
              Verified ({verifiedFacts.length})
            </button>
            <button
              onClick={() => setFilterStatus('told')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                filterStatus === 'told'
                  ? 'bg-amber-600 text-white'
                  : 'bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200'
              }`}
            >
              Told ({toldFacts.length})
            </button>
            <button
              onClick={() => setFilterStatus('claim')}
              className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                filterStatus === 'claim'
                  ? 'bg-orange-600 text-white'
                  : 'bg-orange-50 text-orange-700 hover:bg-orange-100 border border-orange-200'
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
              className="p-3.5 rounded-lg border border-slate-200 hover:border-indigo-400 bg-slate-50/50 hover:bg-white transition-all cursor-pointer space-y-1.5"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
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
                <div className="text-[11px] font-mono text-emerald-700 flex items-center gap-1 pt-0.5">
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
