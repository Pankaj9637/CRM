'use client';

import React from 'react';
import { Badge } from '@/components/badge';
import { UserCheck, ShieldAlert, Users, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

interface PersonSentimentItem {
  id: string;
  accountId: string;
  accountName: string;
  name: string;
  role: string;
  relationship: string;
  available: boolean;
  linkedDeals: { id: string; title: string; worth_up_to: number }[];
}

interface PeopleSentimentProps {
  people: PersonSentimentItem[];
}

export function PeopleSentiment({ people }: PeopleSentimentProps) {
  const neutralCount = people.filter((p) => p.relationship.toLowerCase() === 'neutral').length;
  const allyCount = people.filter((p) => p.relationship.toLowerCase() === 'ally').length;
  const warmCount = people.filter((p) => p.relationship.toLowerCase() === 'warm').length;

  const getSentimentIcon = (rel: string) => {
    switch (rel.toLowerCase()) {
      case 'ally':
        return '😊';
      case 'warm':
        return '🙂';
      case 'neutral':
      default:
        return '😐';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-sm p-5 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-md bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
            <Users className="h-3.5 w-3.5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">Stakeholder Sentiment Matrix</h2>
            <p className="text-xs text-slate-500">10 total decision makers & champions</p>
          </div>
        </div>

        {neutralCount > 0 && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <span>{neutralCount} Neutral (Stakeholder Risk)</span>
          </div>
        )}
      </div>

      {/* Summary Chips */}
      <div className="flex items-center gap-2 text-xs">
        <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold">
          {allyCount} Allies
        </span>
        <span className="px-2 py-0.5 rounded-md bg-sky-50 text-sky-700 border border-sky-200 font-semibold">
          {warmCount} Warm
        </span>
        <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 font-semibold">
          {neutralCount} Neutral
        </span>
      </div>

      {/* 10 People List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {people.map((person) => {
          const emoji = getSentimentIcon(person.relationship);
          return (
            <div
              key={person.id}
              className="p-3 rounded-lg border border-slate-100 hover:border-slate-200 bg-slate-50/50 hover:bg-white transition-all flex items-start justify-between gap-3"
            >
              <div className="flex items-start gap-2.5 flex-1 min-w-0">
                <span className="text-lg shrink-0 mt-0.5" role="img" aria-label={person.relationship}>
                  {emoji}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs font-bold text-slate-900 truncate">{person.name}</span>
                    <span className="text-[10px] font-mono px-1 rounded bg-slate-200/80 text-slate-600">
                      {person.accountId}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 truncate">{person.role}</p>

                  {person.linkedDeals && person.linkedDeals.length > 0 && (
                    <div className="mt-1 flex items-center gap-1 text-[10px] text-indigo-600 font-medium truncate">
                      <span>Deals: {person.linkedDeals.map((d) => d.title).join(', ')}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="shrink-0">
                <Badge variant={person.relationship} size="sm">
                  {person.relationship.toUpperCase()}
                </Badge>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
