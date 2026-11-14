'use client';

import React from 'react';
import { Badge } from '@/components/badge';
import { Sparkles } from 'lucide-react';

interface PeopleTabProps {
  contacts: any[];
  deals: any[];
  dealContacts: any[];
}

export function PeopleTab({ contacts, deals, dealContacts }: PeopleTabProps) {
  const dealsMap = new Map(deals.map((d) => [d.id, d.title]));

  return (
    <div className="space-y-6">
      {/* Question Header */}
      <div className="p-4 bg-[#242424] border border-[#D95B28]/40 rounded-2xl flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-[#F0F0F0]">Q2: Who has the power?</h3>
          <p className="text-xs text-[#999999] mt-0.5">
            Stakeholder relationship map combined with AI-inferred decision rights (Decider, Payer, User, Blocker).
          </p>
        </div>
        <span className="text-xs font-mono font-bold bg-[#1A1A1A] px-2.5 py-1 rounded-lg text-[#EC7D42] border border-[#D95B28]/40 shadow-xs flex items-center gap-1.5">
          <Sparkles className="h-3 w-3 text-[#D95B28]" />
          <span>AI INFERRED POWER MAP</span>
        </span>
      </div>

      {/* Stakeholders Card Grid */}
      <div>
        <div className="text-xs font-bold text-[#F0F0F0] uppercase tracking-wider mb-3">
          Stakeholder Directory ({contacts.length} Key Contacts)
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {contacts.map((contact) => {
            const rolesForContact = dealContacts.filter(
              (dc) =>
                dc.decider?.toLowerCase().includes(contact.name.toLowerCase()) ||
                dc.payer?.toLowerCase().includes(contact.name.toLowerCase()) ||
                dc.user?.toLowerCase().includes(contact.name.toLowerCase()) ||
                dc.blocker?.toLowerCase().includes(contact.name.toLowerCase())
            );

            return (
              <div
                key={contact.id}
                className="p-4 rounded-2xl bg-[#242424] border border-[#3D3D3D] shadow-sm space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#F0F0F0] text-sm">{contact.name}</span>
                      <Badge variant={contact.relationship} size="sm">
                        {contact.relationship.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-xs text-[#999999] mt-0.5">{contact.role}</p>
                  </div>

                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                      contact.available
                        ? 'bg-[#3A7A65]/20 text-[#5eead4] border border-[#3A7A65]/40'
                        : 'bg-[#2E2E2E] text-[#999999] border border-[#3D3D3D]'
                    }`}
                  >
                    {contact.available ? 'AVAILABLE' : 'UNAVAILABLE'}
                  </span>
                </div>

                {/* AI Inferred Role Pills */}
                {rolesForContact.length > 0 && (
                  <div className="p-3 bg-[#1A1A1A] rounded-xl border border-[#3D3D3D] space-y-2">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-semibold text-[#8A8A8A] uppercase tracking-wider">
                        Assigned Deal Responsibilities
                      </span>
                      <span className="text-[10px] bg-[#D95B28]/20 text-[#EC7D42] font-semibold px-1.5 py-0.2 rounded border border-[#D95B28]/40">
                        AI Inferred
                      </span>
                    </div>

                    <div className="space-y-1">
                      {rolesForContact.map((r, i) => {
                        const dealTitle = dealsMap.get(r.deal_id) || r.deal_id;
                        let matchedRole = '';
                        if (r.decider?.toLowerCase().includes(contact.name.toLowerCase())) matchedRole = 'Decider';
                        else if (r.payer?.toLowerCase().includes(contact.name.toLowerCase())) matchedRole = 'Payer';
                        else if (r.user?.toLowerCase().includes(contact.name.toLowerCase())) matchedRole = 'User';
                        else if (r.blocker?.toLowerCase().includes(contact.name.toLowerCase())) matchedRole = 'Blocker';

                        return (
                          <div key={i} className="flex items-center justify-between text-xs text-[#D6D6D6]">
                            <span className="font-medium text-[#999999] truncate">{dealTitle}:</span>
                            <span className="font-bold text-[#F0F0F0] ml-2 shrink-0">{matchedRole}</span>
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

      {/* Deal-by-Deal Power Breakdown Table */}
      <div className="bg-[#242424] rounded-2xl border border-[#3D3D3D] shadow-lg shadow-black/20 p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-[#3D3D3D] pb-3">
          <div>
            <h4 className="text-sm font-bold text-[#F0F0F0]">Decision Authority Matrix by Deal</h4>
            <p className="text-xs text-[#999999]">Decider, Payer, User and Blocker roles mapped per opportunity</p>
          </div>
          <span className="text-xs text-[#EC7D42] font-semibold bg-[#D95B28]/15 px-2.5 py-0.5 rounded-lg border border-[#D95B28]/40">
            AI Inferred
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#1A1A1A] border-b border-[#3D3D3D] text-[#8A8A8A] font-semibold uppercase text-[10px]">
              <tr>
                <th className="py-2.5 px-3">Deal</th>
                <th className="py-2.5 px-3">Decider (Approver)</th>
                <th className="py-2.5 px-3">Payer (Budget Owner)</th>
                <th className="py-2.5 px-3">User (End Operator)</th>
                <th className="py-2.5 px-3">Blocker (Risk Point)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#3D3D3D]">
              {dealContacts.map((dc) => (
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
