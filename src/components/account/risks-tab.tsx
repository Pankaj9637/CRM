'use client';

import React from 'react';
import { Badge } from '@/components/badge';
import { formatCurrency } from '@/lib/utils';
import { ShieldAlert, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface RisksTabProps {
  risks: any[];
  deals: any[];
  onInspectEvidence?: (evidenceId: string) => void;
}

export function RisksTab({ risks, deals, onInspectEvidence }: RisksTabProps) {
  const dealsMap = new Map(deals.map((d) => [d.id, d.title]));

  return (
    <div className="space-y-4">
      {/* Question Header */}
      <div className="p-4 bg-indigo-50/70 border border-indigo-200/80 rounded-xl flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-indigo-950">Q4: What is at risk?</h3>
          <p className="text-xs text-indigo-800/80 mt-0.5">
            Vulnerabilities identified across stalled DPIAs, unverified ROI models, and key-person departures.
          </p>
        </div>
        <span className="text-xs font-mono font-bold bg-white px-2.5 py-1 rounded-lg text-rose-700 border border-rose-200 shadow-sm">
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
              className="p-5 rounded-xl bg-white border border-slate-200/90 shadow-sm space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1">
                  <div
                    className={`p-2 rounded-lg shrink-0 mt-0.5 ${
                      risk.severity === 'critical'
                        ? 'bg-rose-100 text-rose-700'
                        : risk.severity === 'high'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    <ShieldAlert className="h-4 w-4" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-bold text-slate-900">{risk.risk}</h4>
                      <Badge variant={risk.severity} size="sm">
                        {risk.severity.toUpperCase()}
                      </Badge>
                    </div>

                    <div className="text-xs text-slate-500 font-medium">
                      Affected Opportunity: <strong className="text-slate-800">{dealTitle}</strong>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-[10px] uppercase font-semibold text-slate-400">Exposure</div>
                  <div className="text-base font-mono font-bold text-rose-600">
                    {formatCurrency(risk.impact_value)}
                  </div>
                </div>
              </div>

              {/* Mitigation block */}
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200/80 text-xs text-slate-700 space-y-1">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Tactical Mitigation Action
                </div>
                <p className="font-medium text-slate-800 leading-relaxed">{risk.mitigation}</p>
              </div>

              {evidenceList.length > 0 && (
                <div className="flex items-center gap-1.5 text-xs text-slate-500 pt-1">
                  <span className="text-[10px] font-semibold uppercase text-slate-400">Cited Evidence:</span>
                  <div className="flex flex-wrap gap-1">
                    {evidenceList.map((evId) => (
                      <button
                        key={evId}
                        onClick={() => onInspectEvidence?.(evId)}
                        className="px-1.5 py-0.2 rounded font-mono font-semibold text-[10px] bg-slate-100 hover:bg-indigo-50 text-slate-600 hover:text-indigo-700 border border-slate-200 transition-colors"
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
