'use client';

import React from 'react';
import { formatCurrency } from '@/lib/utils';
import { Badge } from '@/components/badge';
import { TrendingUp, Award, AlertTriangle, Users, FileText, PenLine, CheckCircle2, Clock } from 'lucide-react';

interface OverviewTabProps {
  account: any;
  deals: any[];
  offers: any[];
  contacts: any[];
  risks: any[];
  notes?: any[];
  onOpenNoteWriter?: () => void;
}

export function OverviewTab({ account, deals, offers, contacts, risks, notes = [], onOpenNoteWriter }: OverviewTabProps) {
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

      {/* Field Intelligence & Notes (Live MCP Write-back) */}
      <div className="bg-[#242424] rounded-2xl border border-[#3D3D3D] shadow-lg shadow-black/20 p-5 space-y-3">
        <div className="flex items-center justify-between border-b border-[#3D3D3D] pb-3">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-lg bg-[#D95B28]/20 text-[#EC7D42] border border-[#D95B28]/40 flex items-center justify-center font-bold text-xs">
              <PenLine className="h-3.5 w-3.5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#F0F0F0]">Account Field Notes & Debriefs</h3>
              <p className="text-[11px] text-[#999999]">Synchronized to local intelligence & live MCP server</p>
            </div>
          </div>
          <button
            onClick={onOpenNoteWriter}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-[#2E2E2E] hover:bg-[#3D3D3D] text-[#F0F0F0] border border-[#3D3D3D] rounded-xl transition-colors"
          >
            <PenLine className="h-3 w-3 text-[#D95B28]" />
            <span>Add Note</span>
          </button>
        </div>

        {notes.length === 0 ? (
          <div className="py-6 text-center text-xs text-[#8A8A8A]">
            No field notes logged for this account yet. Click &quot;Add Note&quot; to log intel.
          </div>
        ) : (
          <div className="divide-y divide-[#3D3D3D]">
            {notes.map((note) => (
              <div key={note.id} className="py-3 space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[#8A8A8A] flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {note.created_at}
                    </span>
                    {Boolean(note.synced_to_mcp) && (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#3A7A65]/20 text-[#5eead4] border border-[#3A7A65]/40 text-[10px] font-medium">
                        <CheckCircle2 className="h-2.5 w-2.5" />
                        MCP Synced
                      </span>
                    )}
                  </div>
                  {note.title && (
                    <span className="font-semibold text-[#F0F0F0]">{note.title}</span>
                  )}
                </div>
                <p className="text-xs text-[#D6D6D6] leading-relaxed bg-[#1A1A1A] p-3 rounded-xl border border-[#3D3D3D]">
                  {note.text}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
