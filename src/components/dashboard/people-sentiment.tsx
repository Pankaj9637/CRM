'use client';

import React from 'react';
import { Badge } from '@/components/badge';
import { Users } from 'lucide-react';

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
    <div className="bg-[#242424] rounded-2xl border border-[#3D3D3D] shadow-lg shadow-black/20 p-5 space-y-4">
      <div className="flex items-center justify-between border-b border-[#3D3D3D] pb-3">
        <div className="flex items-center gap-2.5">
          <div className="h-7 w-7 rounded-lg bg-[#D95B28]/20 text-[#EC7D42] border border-[#D95B28]/40 flex items-center justify-center font-bold text-xs">
            <Users className="h-3.5 w-3.5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-[#F0F0F0]">Stakeholder Sentiment Matrix</h2>
            <p className="text-xs text-[#999999]">10 total decision makers & champions</p>
          </div>
        </div>

        {neutralCount > 0 && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#F43F5E]/15 border border-[#F43F5E]/40 text-[#fda4af] text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-[#F43F5E] animate-pulse" />
            <span>{neutralCount} Neutral (Risk)</span>
          </div>
        )}
      </div>

      {/* Summary Chips */}
      <div className="flex items-center gap-2 text-xs">
        <span className="px-2.5 py-0.5 rounded-md bg-[#3A7A65]/20 text-[#5eead4] border border-[#3A7A65]/40 font-semibold">
          {allyCount} Allies
        </span>
        <span className="px-2.5 py-0.5 rounded-md bg-[#3E6F9E]/20 text-[#7dd3fc] border border-[#3E6F9E]/40 font-semibold">
          {warmCount} Warm
        </span>
        <span className="px-2.5 py-0.5 rounded-md bg-[#2E2E2E] text-[#D6D6D6] border border-[#3D3D3D] font-semibold">
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
              className="p-3 rounded-xl border border-[#3D3D3D] hover:border-[#D95B28]/60 bg-[#2E2E2E]/60 hover:bg-[#2E2E2E] transition-all flex items-start justify-between gap-3"
            >
              <div className="flex items-start gap-2.5 flex-1 min-w-0">
                <span className="text-lg shrink-0 mt-0.5" role="img" aria-label={person.relationship}>
                  {emoji}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-xs font-bold text-[#F0F0F0] truncate">{person.name}</span>
                    <span className="text-[10px] font-mono px-1 rounded bg-[#1A1A1A] text-[#999999] border border-[#3D3D3D]">
                      {person.accountId}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#999999] truncate mt-0.5">{person.role}</p>

                  {person.linkedDeals && person.linkedDeals.length > 0 && (
                    <div className="mt-1 flex items-center gap-1 text-[10px] text-[#EC7D42] font-medium truncate">
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
