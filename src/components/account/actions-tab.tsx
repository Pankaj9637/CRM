'use client';

import React from 'react';
import { Badge } from '@/components/badge';
import { formatCurrency } from '@/lib/utils';
import { CheckCircle2, User, Clock, ArrowRight } from 'lucide-react';

interface ActionsTabProps {
  actions: any[];
  onInspectEvidence?: (evidenceId: string) => void;
}

export function ActionsTab({ actions, onInspectEvidence }: ActionsTabProps) {
  return (
    <div className="space-y-4">
      {/* Question Header */}
      <div className="p-4 bg-indigo-50/70 border border-indigo-200/80 rounded-xl flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-indigo-950">Q3: What should happen next?</h3>
          <p className="text-xs text-indigo-800/80 mt-0.5">
            Recommended moves ranked by deal value at risk and stakeholder responsiveness.
          </p>
        </div>
        <span className="text-xs font-mono font-bold bg-white px-2.5 py-1 rounded-lg text-indigo-700 border border-indigo-200 shadow-sm">
          {actions.length} ACTIONS FOR THIS ACCOUNT
        </span>
      </div>

      <div className="space-y-3.5">
        {actions.map((act) => {
          const evidenceList: string[] = Array.isArray(act.evidence_ids) ? act.evidence_ids : [];

          return (
            <div
              key={act.id || act.priority}
              className="p-5 rounded-xl bg-white border border-slate-200/90 shadow-sm space-y-3"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1">
                  <span className="w-7 h-7 rounded-full bg-indigo-600 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    {act.priority}
                  </span>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="text-sm font-bold text-slate-900">{act.action}</h4>
                      <Badge variant={act.urgency} size="sm">
                        {act.urgency.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-600 font-medium leading-relaxed">
                      {act.reason}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-[10px] uppercase font-semibold text-slate-400">At Stake</div>
                  <div className="text-base font-mono font-bold text-emerald-700">
                    {formatCurrency(act.impact_value)}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 pt-2 border-t border-slate-100">
                <div className="flex items-center gap-1.5 font-medium">
                  <User className="h-3.5 w-3.5 text-slate-400" />
                  <span>Key Stakeholder: <strong className="text-slate-900">{act.contact}</strong></span>
                </div>

                <span className="text-slate-300">•</span>

                <div>
                  <span>Target Deal: <strong className="text-slate-900">{act.deal_title}</strong></span>
                </div>

                {evidenceList.length > 0 && (
                  <>
                    <span className="text-slate-300">•</span>
                    <div className="flex items-center gap-1">
                      <span className="text-[10px] font-semibold text-slate-400 uppercase">Evidence:</span>
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
