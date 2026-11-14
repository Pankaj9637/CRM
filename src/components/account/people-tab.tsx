'use client';

import React from 'react';
import { Badge } from '@/components/badge';
import { Users, Shield, Sparkles, UserCheck, AlertCircle } from 'lucide-react';

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
      <div className="p-4 bg-indigo-50/70 border border-indigo-200/80 rounded-xl flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-indigo-950">Q2: Who has the power?</h3>
          <p className="text-xs text-indigo-800/80 mt-0.5">
            Stakeholder relationship map combined with AI-inferred decision rights (Decider, Payer, User, Blocker).
          </p>
        </div>
        <span className="text-xs font-mono font-bold bg-white px-2.5 py-1 rounded-lg text-indigo-700 border border-indigo-200 shadow-sm flex items-center gap-1.5">
          <Sparkles className="h-3 w-3 text-indigo-500" />
          <span>AI INFERRED POWER MAP</span>
        </span>
      </div>

      {/* Stakeholders Card Grid */}
      <div>
        <div className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
          Stakeholder Directory ({contacts.length} Key Contacts)
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {contacts.map((contact) => {
            // Find roles where this contact is named in dealContacts
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
                className="p-4 rounded-xl bg-white border border-slate-200/90 shadow-sm space-y-3"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{contact.name}</span>
                      <Badge variant={contact.relationship} size="sm">
                        {contact.relationship.toUpperCase()}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{contact.role}</p>
                  </div>

                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                      contact.available
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-slate-100 text-slate-500 border border-slate-200'
                    }`}
                  >
                    {contact.available ? 'AVAILABLE' : 'UNAVAILABLE'}
                  </span>
                </div>

                {/* AI Inferred Role Pills */}
                {rolesForContact.length > 0 && (
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 space-y-1.5">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-semibold text-slate-500 uppercase tracking-wider">
                        Assigned Deal Responsibilities
                      </span>
                      <span className="text-[10px] bg-indigo-50 text-indigo-700 font-semibold px-1.5 py-0.2 rounded border border-indigo-200">
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
                          <div key={i} className="flex items-center justify-between text-xs text-slate-700">
                            <span className="font-medium text-slate-600 truncate">{dealTitle}:</span>
                            <span className="font-bold text-slate-900 ml-2 shrink-0">{matchedRole}</span>
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
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h4 className="text-sm font-bold text-slate-900">Decision Authority Matrix by Deal</h4>
            <p className="text-xs text-slate-500">Decider, Payer, User and Blocker roles mapped per opportunity</p>
          </div>
          <span className="text-xs text-indigo-700 font-semibold bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
            AI Inferred
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px]">
              <tr>
                <th className="py-2.5 px-3">Deal</th>
                <th className="py-2.5 px-3">Decider (Approver)</th>
                <th className="py-2.5 px-3">Payer (Budget Owner)</th>
                <th className="py-2.5 px-3">User (End Operator)</th>
                <th className="py-2.5 px-3">Blocker (Risk Point)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {dealContacts.map((dc) => (
                <tr key={dc.id || dc.deal_id} className="hover:bg-slate-50/60">
                  <td className="py-3 px-3 font-semibold text-slate-900">
                    {dealsMap.get(dc.deal_id) || dc.deal_id}
                  </td>
                  <td className="py-3 px-3 text-slate-700">
                    <span className="font-medium">{dc.decider}</span>
                  </td>
                  <td className="py-3 px-3 text-slate-700">
                    <span className="font-medium">{dc.payer}</span>
                  </td>
                  <td className="py-3 px-3 text-slate-700">
                    <span className="font-medium">{dc.user}</span>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`font-semibold ${
                        dc.blocker && dc.blocker !== 'None' && !dc.blocker.includes('Cleared')
                          ? 'text-rose-600'
                          : 'text-emerald-600'
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
