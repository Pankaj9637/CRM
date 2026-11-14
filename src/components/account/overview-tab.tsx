'use client';

import React from 'react';
import { formatCurrency } from '@/lib/utils';
import { Badge } from '@/components/badge';
import { TrendingUp, Award, AlertTriangle, Users, FileText, CheckCircle2 } from 'lucide-react';

interface OverviewTabProps {
  account: any;
  deals: any[];
  offers: any[];
  contacts: any[];
  risks: any[];
}

export function OverviewTab({ account, deals, offers, contacts, risks }: OverviewTabProps) {
  const pipelineTotal = deals.reduce((sum, d) => sum + (Number(d.worth_up_to) || 0), 0);
  const wonOffersTotal = offers
    .filter((o) => o.status === 'won')
    .reduce((sum, o) => sum + (Number(o.value) || 0), 0);
  const openBlockersCount = deals.filter((d) => d.blocker_status === 'open').length;
  const criticalRisksCount = risks.filter((r) => r.severity === 'critical').length;

  return (
    <div className="space-y-6">
      {/* Official Story / Mission statement banner */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white shadow-sm flex items-start gap-3">
        <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 shrink-0 mt-0.5">
          <FileText className="h-4 w-4" />
        </div>
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-wider text-indigo-300">
            Account Official Story
          </div>
          <p className="text-sm font-medium mt-0.5 text-slate-200 leading-relaxed">
            &ldquo;{account.official_story || 'No official brief registered.'}&rdquo;
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-sm">
          <div className="text-[11px] font-semibold text-slate-500 uppercase flex items-center gap-1.5">
            <TrendingUp className="h-3.5 w-3.5 text-indigo-600" />
            <span>Pipeline Value</span>
          </div>
          <div className="text-xl font-bold font-mono text-slate-900 mt-1">
            {formatCurrency(pipelineTotal)}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">{deals.length} active opportunities</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-sm">
          <div className="text-[11px] font-semibold text-emerald-700 uppercase flex items-center gap-1.5">
            <Award className="h-3.5 w-3.5 text-emerald-600" />
            <span>Won Offers</span>
          </div>
          <div className="text-xl font-bold font-mono text-emerald-700 mt-1">
            {formatCurrency(wonOffersTotal)}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            {offers.filter((o) => o.status === 'won').length} contracts won
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-sm">
          <div className="text-[11px] font-semibold text-rose-700 uppercase flex items-center gap-1.5">
            <AlertTriangle className="h-3.5 w-3.5 text-rose-600" />
            <span>Deals with Open Blockers</span>
          </div>
          <div className="text-xl font-bold font-mono text-rose-600 mt-1">
            {openBlockersCount} / {deals.length}
          </div>
          <div className="text-[11px] text-rose-600/80 mt-0.5">{criticalRisksCount} critical risks</div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-sm">
          <div className="text-[11px] font-semibold text-slate-700 uppercase flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5 text-slate-600" />
            <span>Stakeholders</span>
          </div>
          <div className="text-xl font-bold font-mono text-slate-900 mt-1">
            {contacts.length} Contacts
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            {contacts.filter((c) => c.relationship === 'ally').length} Allies,{' '}
            {contacts.filter((c) => c.relationship === 'neutral').length} Neutral
          </div>
        </div>
      </div>

      {/* Offers breakdown */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-5 space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-sm font-bold text-slate-900">Commercial Offers & Pitches</h3>
          <span className="text-xs font-mono font-semibold text-slate-500">
            {offers.length} OFFERS
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {offers.map((offer) => (
            <div key={offer.id} className="py-3 flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-900">{offer.title}</span>
                  <Badge variant={offer.status} size="sm">
                    {offer.status.toUpperCase()}
                  </Badge>
                </div>
                {offer.pitch_to && (
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Pitched to: <strong className="text-slate-700">{offer.pitch_to}</strong>
                  </p>
                )}
              </div>
              <div className="text-sm font-mono font-bold text-slate-900">
                {formatCurrency(offer.value)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
