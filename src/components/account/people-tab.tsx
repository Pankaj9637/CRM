'use client';

import React, { useState } from 'react';
import { PersonCard } from './person-card';
import { Sparkles, Users, Filter } from 'lucide-react';

interface PeopleTabProps {
  contacts: any[];
  deals: any[];
  dealContacts: any[];
  onInspectEvidence?: (evidenceId: string) => void;
  onOpenNoteWriter?: () => void;
}

export function PeopleTab({ contacts, deals, dealContacts, onInspectEvidence, onOpenNoteWriter }: PeopleTabProps) {
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const dealsMap = new Map(deals.map((d) => [d.id, d.title]));

  const filteredContacts = contacts.filter((c) => {
    if (roleFilter === 'all') return true;
    const dealRole = (c.deal_role || '').toLowerCase();
    const rel = (c.relationship || '').toLowerCase();
    if (roleFilter === 'champion') return dealRole === 'champion' || rel === 'ally';
    if (roleFilter === 'blocker') return dealRole === 'blocker';
    if (roleFilter === 'payer') return dealRole === 'payer';
    if (roleFilter === 'decider') return dealRole === 'decider';
    if (roleFilter === 'user') return dealRole === 'user';
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-4 bg-[#242424] border border-[#3D3D3D] border-l-4 border-l-[#D95B28] rounded-none flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <p className="text-xs text-[#D6D6D6] leading-relaxed">
          Stakeholder persona directory with platform telemetry, engagement meters, deal responsibilities, and hot-button pain points.
        </p>
        <span className="text-xs font-mono font-bold bg-[#1A1A1A] px-2.5 py-1 rounded-none text-[#EC7D42] border border-[#3D3D3D] flex items-center gap-1.5 self-start sm:self-center shrink-0">
          <Sparkles className="h-3 w-3 text-[#D95B28]" />
          <span>STAKEHOLDER POWER MAP</span>
        </span>
      </div>

      {/* Role Filter Pills */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-1.5 text-xs overflow-x-auto pb-1">
          <span className="text-[11px] font-semibold text-[#8A8A8A] uppercase mr-1 flex items-center gap-1">
            <Filter className="h-3 w-3" />
            <span>Filter:</span>
          </span>
          {[
            { id: 'all', label: `All (${contacts.length})` },
            { id: 'champion', label: 'Champions / Allies' },
            { id: 'decider', label: 'Deciders' },
            { id: 'payer', label: 'Payers' },
            { id: 'blocker', label: 'Blockers' },
            { id: 'user', label: 'Users' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setRoleFilter(item.id)}
              className={`px-3 py-1 rounded-none font-medium transition-colors whitespace-nowrap ${
                roleFilter === item.id
                  ? 'bg-[#D95B28] text-white'
                  : 'bg-[#242424] text-[#999999] hover:text-[#F0F0F0] border border-[#3D3D3D]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
        <span className="text-xs font-mono text-[#999999]">
          Showing {filteredContacts.length} of {contacts.length} stakeholders
        </span>
      </div>

      {/* Stakeholder Person Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredContacts.map((contact) => (
          <PersonCard
            key={contact.id}
            person={contact}
            onInspectEvidence={onInspectEvidence}
            onOpenNoteWriter={onOpenNoteWriter}
          />
        ))}
      </div>

      {/* Deal-by-Deal Power Breakdown Table */}
      <div className="bg-[#242424] rounded-none border border-[#3D3D3D] p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-[#3D3D3D] pb-3">
          <div>
            <h4 className="text-sm font-bold text-[#F0F0F0]">Decision Authority Matrix by Deal</h4>
            <p className="text-xs text-[#999999]">Decider, Payer, User, and Blocker mapped to individual opportunities</p>
          </div>
          <span className="text-xs text-[#EC7D42] font-semibold bg-[#D95B28]/15 px-2.5 py-0.5 rounded-none border border-[#D95B28]/40">
            AI Inferred
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#1A1A1A] border-b border-[#3D3D3D] text-[#8A8A8A] font-semibold uppercase text-[10px]">
              <tr>
                <th className="py-2.5 px-3">Deal Title</th>
                <th className="py-2.5 px-3">Decider (Approver)</th>
                <th className="py-2.5 px-3">Payer (Budget Owner)</th>
                <th className="py-2.5 px-3">User (End Operator)</th>
                <th className="py-2.5 px-3">Blocker (Risk Point)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#3D3D3D]">
              {dealContacts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-4 text-center text-[#8A8A8A]">
                    No deal authority mappings registered for this account.
                  </td>
                </tr>
              ) : (
                dealContacts.map((dc) => (
                  <tr key={dc.id || dc.deal_id} className="hover:bg-[#2E2E2E]/60 transition-colors">
                    <td className="py-3 px-3 font-semibold text-[#F0F0F0]">
                      {dealsMap.get(dc.deal_id) || dc.deal_id}
                    </td>
                    <td className="py-3 px-3 text-[#D6D6D6]">
                      <span className="font-medium">{dc.decider}</span>
                    </td>
                    <td className="py-3 px-3 text-[#D6D6D6]">
                      <span className="font-medium">{dc.payer}</span>
                    </td>
                    <td className="py-3 px-3 text-[#D6D6D6]">
                      <span className="font-medium">{dc.user}</span>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`font-semibold ${
                          dc.blocker && dc.blocker !== 'None' && !dc.blocker.includes('Cleared')
                            ? 'text-[#fda4af]'
                            : 'text-[#5eead4]'
                        }`}
                      >
                        {dc.blocker}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}