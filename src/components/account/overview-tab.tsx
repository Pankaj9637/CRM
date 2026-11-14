'use client';

import React from 'react';
import { formatCurrency } from '@/lib/utils';
import { Badge } from '@/components/badge';
import { TrendingUp, Award, AlertTriangle, Users, FileText } from 'lucide-react';

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
      {/* Official Story banner */}
      <div className="p-5 rounded-2xl bg-[#242424] border border-[#D95B28]/40 shadow-lg shadow-black/20 text-[#D6D6D6] flex items-start gap-3.5">
        <div className="p-2.5 rounded-xl bg-[#D95B28]/20 text-[#EC7D42] border border-[#D95B28]/40 shrink-0 mt-0.5">
          <FileText className="h-5 w-5" />
        </div>
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-[#EC7D42]">
            Account Official Story
          </div>
          <p className="text-sm font-medium mt-1 text-[#F0F0F0] leading-relaxed">
            &ldquo;{account.official_story || 'No official brief registered.'}&rdquo;
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-[#242424] border border-[#3D3D3D] shadow-sm">
          <div className="text-[11px] font-semibold text-[#999999] uppercase flex items-center gap-1.5">
            <TrendingUp className="h-3.5 w-3.5 text-[#EC7D42]" />
            <span>Pipeline Value</span>
          </div>
          <div className="text-xl font-bold font-mono text-[#F0F0F0] mt-1">
            {formatCurrency(pipelineTotal)}
          </div>
          <div className="text-[11px] text-[#999999] mt-0.5">{deals.length} active opportunities</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#242424] border border-[#3D3D3D] shadow-sm">
          <div className="text-[11px] font-semibold text-[#5eead4] uppercase flex items-center gap-1.5">
            <Award className="h-3.5 w-3.5 text-[#3A7A65]" />
            <span>Won Offers</span>
          </div>
          <div className="text-xl font-bold font-mono text-[#5eead4] mt-1">
            {formatCurrency(wonOffersTotal)}
          </div>
          <div className="text-[11px] text-[#999999] mt-0.5">
            {offers.filter((o) => o.status === 'won').length} contracts won
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#242424] border border-[#3D3D3D] shadow-sm">
          <div className="text-[11px] font-semibold text-[#fda4af] uppercase flex items-center gap-1.5">
            <AlertTriangle className="h-3.5 w-3.5 text-[#F43F5E]" />
            <span>Open Blockers</span>
          </div>
          <div className="text-xl font-bold font-mono text-[#fda4af] mt-1">
            {openBlockersCount} / {deals.length}
          </div>
          <div className="text-[11px] text-[#fda4af]/80 mt-0.5">{criticalRisksCount} critical risks</div>
        </div>

        <div className="p-4 rounded-2xl bg-[#242424] border border-[#3D3D3D] shadow-sm">
          <div className="text-[11px] font-semibold text-[#D6D6D6] uppercase flex items-center gap-1.5">
            <Users className="h-3.5 w-3.5 text-[#999999]" />
            <span>Stakeholders</span>
          </div>
          <div className="text-xl font-bold font-mono text-[#F0F0F0] mt-1">
            {contacts.length} Contacts
          </div>
          <div className="text-[11px] text-[#999999] mt-0.5">
            {contacts.filter((c) => c.relationship === 'ally').length} Allies,{' '}
            {contacts.filter((c) => c.relationship === 'neutral').length} Neutral
          </div>
        </div>
      </div>

      {/* Offers breakdown */}
      <div className="bg-[#242424] rounded-2xl border border-[#3D3D3D] shadow-lg shadow-black/20 p-5 space-y-3">
        <div className="flex items-center justify-between border-b border-[#3D3D3D] pb-3">
          <h3 className="text-sm font-bold text-[#F0F0F0]">Commercial Offers & Pitches</h3>
          <span className="text-xs font-mono font-semibold text-[#999999]">
            {offers.length} OFFERS
          </span>
        </div>

        <div className="divide-y divide-[#3D3D3D]">
          {offers.map((offer) => (
            <div key={offer.id} className="py-3.5 flex items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-[#F0F0F0]">{offer.title}</span>
                  <Badge variant={offer.status} size="sm">
                    {offer.status.toUpperCase()}
                  </Badge>
                </div>
                {offer.pitch_to && (
                  <p className="text-[11px] text-[#999999] mt-0.5">
                    Pitched to: <strong className="text-[#D6D6D6]">{offer.pitch_to}</strong>
                  </p>
                )}
              </div>
              <div className="text-sm font-mono font-bold text-[#F0F0F0]">
                {formatCurrency(offer.value)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
