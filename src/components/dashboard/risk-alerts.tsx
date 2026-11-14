'use client';

import React from 'react';
import { Badge } from '@/components/badge';
import { formatCurrency } from '@/lib/utils';
import { ShieldAlert, AlertTriangle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface RiskAlertItem {
  id: number;
  severity: 'critical' | 'high' | 'medium' | string;
  risk: string;
  deal_id: string;
  account_id: string;
  account_name?: string;
  impact_value: number;
  mitigation: string;
  evidence_ids: string[];
}

interface RiskAlertsProps {
  risks: RiskAlertItem[];
  onInspectEvidence?: (id: string) => void;
}

export function RiskAlerts({ risks, onInspectEvidence }: RiskAlertsProps) {
  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-5 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-md bg-amber-100 text-amber-700 flex items-center justify-center font-bold text-xs">
            <ShieldAlert className="h-3.5 w-3.5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">Commercial Risk Radar</h2>
            <p className="text-xs text-slate-500">Blockers, deadlines & evidentiary discrepancies</p>
          </div>
        </div>
        <span className="text-[11px] font-mono font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
          {risks.filter((r) => r.severity === 'critical').length} CRITICAL RISKS
        </span>
      </div>

      <div className="space-y-3">
        {risks.map((item, idx) => (
          <div
            key={item.id || idx}
            className="p-3.5 rounded-lg border border-slate-100 hover:border-slate-200 bg-slate-50/40 hover:bg-white transition-all space-y-2"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5 flex-1">
                <AlertTriangle
                  className={`h-4 w-4 shrink-0 mt-0.5 ${
                    item.severity === 'critical'
                      ? 'text-rose-600'
                      : item.severity === 'high'
                      ? 'text-amber-600'
                      : 'text-yellow-600'
                  }`}
                />
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-slate-900">{item.risk}</span>
                    <Badge variant={item.severity} size="sm">
                      {item.severity.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500">
                    <span className="font-semibold text-slate-700">Account {item.account_id}</span>
                    <span>•</span>
                    <span className="font-mono font-bold text-rose-600">
                      {formatCurrency(item.impact_value)} at risk
                    </span>
                  </div>
                </div>
              </div>

              <Link
                href={`/accounts/${item.account_id}`}
                className="shrink-0 text-slate-400 hover:text-indigo-600 p-1"
                title="View Account Details"
              >
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {/* Mitigation */}
            <div className="ml-6 p-2 rounded bg-white border border-slate-200/70 text-xs text-slate-700">
              <strong className="text-slate-900 font-semibold">Mitigation Strategy: </strong>
              <span>{item.mitigation}</span>
            </div>

            {item.evidence_ids && item.evidence_ids.length > 0 && (
              <div className="ml-6 flex items-center gap-1.5 text-[11px] text-slate-400">
                <span className="text-[10px] font-semibold uppercase">Evidence:</span>
                <div className="flex flex-wrap gap-1">
                  {item.evidence_ids.map((evId) => (
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
        ))}
      </div>
    </div>
  );
}
