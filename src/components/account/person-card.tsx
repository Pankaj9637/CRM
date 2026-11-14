'use client';

import React, { useState } from 'react';
import { 
  User, 
  MapPin, 
  Activity, 
  Flame, 
  ChevronRight, 
  Sparkles, 
  ShieldCheck,
  Send
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface PersonCardData {
  id: string;
  account_id: string;
  name: string;
  role: string;
  relationship: 'ally' | 'warm' | 'neutral' | string;
  available?: boolean | number;
  location?: string;
  deal_role?: 'Decider' | 'Payer' | 'User' | 'Blocker' | 'Champion' | string;
  login_count?: number;
  activity_summary?: string;
  pain_point?: string;
  engagement_directive?: string;
  groundingEvidence?: string[];
}

interface PersonCardProps {
  person: PersonCardData;
  onInspectEvidence?: (evidenceId: string) => void;
  onOpenNoteWriter?: () => void;
}

export function PersonCard({ person, onInspectEvidence, onOpenNoteWriter }: PersonCardProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Derive relationship badge styling
  const relationshipBadge = () => {
    switch (person.relationship?.toLowerCase()) {
      case 'ally':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-none text-[10px] font-mono font-bold bg-[#3A7A65]/20 text-[#5eead4] border border-[#3A7A65]/40">
            <span className="w-1.5 h-1.5 bg-[#5eead4]" />
            ALLY
          </span>
        );
      case 'warm':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-none text-[10px] font-mono font-bold bg-[#3E6F9E]/20 text-[#7dd3fc] border border-[#3E6F9E]/40">
            <span className="w-1.5 h-1.5 bg-[#7dd3fc]" />
            WARM
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-none text-[10px] font-mono font-bold bg-[#D9A441]/20 text-[#fde047] border border-[#D9A441]/40">
            <span className="w-1.5 h-1.5 bg-[#fde047]" />
            NEUTRAL
          </span>
        );
    }
  };

  // Deal Role badge styling
  const roleBadge = () => {
    const role = person.deal_role || 'User';
    let colorClass = 'bg-[#2E2E2E] text-[#D6D6D6] border-[#3D3D3D]';
    if (role === 'Decider') colorClass = 'bg-[#8B5CF6]/20 text-[#c4b5fd] border-[#8B5CF6]/40';
    if (role === 'Payer') colorClass = 'bg-[#3E6F9E]/20 text-[#93c5fd] border-[#3E6F9E]/40';
    if (role === 'Blocker') colorClass = 'bg-[#F43F5E]/20 text-[#fda4af] border-[#F43F5E]/40';
    if (role === 'Champion') colorClass = 'bg-[#3A7A65]/20 text-[#6ee7b7] border-[#3A7A65]/40';
    if (role === 'User') colorClass = 'bg-[#D95B28]/20 text-[#fdba74] border-[#D95B28]/40';

    return (
      <span className={cn('px-2 py-0.5 rounded-none text-[10px] font-mono font-bold uppercase tracking-wider border', colorClass)}>
        [{role}]
      </span>
    );
  };

  const logins = person.login_count || 0;
  const activityPct = Math.min(100, Math.round((logins / 70) * 100));
  const activityColor =
    logins > 30 ? 'bg-[#3A7A65]' : logins > 0 ? 'bg-[#D9A441]' : 'bg-[#3D3D3D]';

  return (
    <>
      <div className="bg-[#242424] rounded-none border border-[#3D3D3D] hover:border-[#D95B28]/60 transition-all flex flex-col justify-between group">
        <div className="p-5 space-y-4">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 bg-[#1A1A1A] text-[#EC7D42] border border-[#3D3D3D] flex items-center justify-center font-mono font-bold text-sm shrink-0">
                {person.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm font-bold text-[#F0F0F0] group-hover:text-[#EC7D42] transition-colors">
                    {person.name}
                  </h3>
                  {roleBadge()}
                </div>
                <p className="text-xs text-[#999999] mt-0.5">{person.role}</p>
                {person.location && (
                  <p className="text-[11px] text-[#8A8A8A] flex items-center gap-1 mt-1 font-mono font-medium">
                    <MapPin className="h-3 w-3 text-[#999999]" />
                    <span>{person.location}</span>
                  </p>
                )}
              </div>
            </div>
            <div>{relationshipBadge()}</div>
          </div>

          {/* Activity & Engagement Meter */}
          <div className="p-3 bg-[#1A1A1A] border border-[#3D3D3D] space-y-2">
            <div className="flex items-center justify-between text-[11px] font-mono">
              <span className="text-[#8A8A8A] font-semibold uppercase flex items-center gap-1.5">
                <Activity className="h-3 w-3 text-[#EC7D42]" />
                <span>Telemetry & Logins</span>
              </span>
              <span className="text-xs font-bold text-[#F0F0F0]">
                {logins} logins
              </span>
            </div>
            {/* Progress bar */}
            <div className="w-full bg-[#2E2E2E] h-1.5 overflow-hidden">
              <div
                className={cn('h-full transition-all duration-300', activityColor)}
                style={{ width: `${Math.max(5, activityPct)}%` }}
              />
            </div>
            <p className="text-[11px] font-mono text-[#D6D6D6]">
              {person.activity_summary || `${logins} platform sign-ins recorded in last 90 days`}
            </p>
          </div>

          {/* Hot-Button / Pain Point Callout */}
          <div className="p-3 bg-[#2E2E2E] border border-[#D95B28]/40 border-l-2 space-y-1">
            <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-[#EC7D42]">
              <Flame className="h-3.5 w-3.5 text-[#D95B28]" />
              <span>Hot-Button / Critical Pain Point</span>
            </div>
            <p className="text-xs text-[#F0F0F0] leading-relaxed font-medium">
              &ldquo;{person.pain_point || 'Operational alignment and governance sign-off required.'}&rdquo;
            </p>
          </div>
        </div>

        {/* Actionable How to Engage CTA Footer */}
        <div className="p-3.5 bg-[#1E1E1E] border-t border-[#3D3D3D] flex items-center justify-between">
          <button
            onClick={() => setIsDrawerOpen(true)}
            className="w-full flex items-center justify-between px-3 py-2 text-xs font-mono font-bold uppercase tracking-wider text-[#F0F0F0] bg-[#2E2E2E] hover:bg-[#3D3D3D] hover:text-white border border-[#3D3D3D] transition-all"
          >
            <span className="flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-[#EC7D42]" />
              <span>How to Engage Directive</span>
            </span>
            <ChevronRight className="h-4 w-4 text-[#8A8A8A]" />
          </button>
        </div>
      </div>

      {/* How to Engage Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 animate-in fade-in duration-150">
          <div className="bg-[#242424] border border-[#3D3D3D] rounded-none w-full max-w-lg p-6 space-y-5 animate-in zoom-in-95 duration-200">
            {/* Drawer Header */}
            <div className="flex items-start justify-between border-b border-[#3D3D3D] pb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-[#D95B28]/20 text-[#EC7D42] border border-[#D95B28]/40 flex items-center justify-center font-bold text-sm">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#F0F0F0]">
                    Engagement Directive: {person.name}
                  </h3>
                  <p className="text-xs text-[#999999] font-mono">{person.role} • {roleBadge()}</p>
                </div>
              </div>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="text-[#999999] hover:text-[#F0F0F0] p-1 hover:bg-[#2E2E2E] transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Directive Content */}
            <div className="space-y-4">
              <div className="p-4 bg-[#1A1A1A] border border-[#3D3D3D] space-y-2">
                <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#EC7D42] flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-[#D95B28]" />
                  <span>Actionable Directive</span>
                </div>
                <p className="text-xs text-[#D6D6D6] leading-relaxed">
                  {person.engagement_directive ||
                    'Engage immediately with structured data and evidence to address operational blockers and secure commercial support.'}
                </p>
              </div>

              {/* Hot-Button reminder */}
              <div className="p-3.5 bg-[#2E2E2E] border border-[#D95B28]/40 border-l-2 space-y-1">
                <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#EC7D42] flex items-center gap-1">
                  <Flame className="h-3 w-3" />
                  <span>Key Stakeholder Leverage</span>
                </div>
                <p className="text-xs text-[#F0F0F0] font-medium leading-relaxed">
                  {person.pain_point}
                </p>
              </div>

              {/* Grounding Telemetry */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="p-3 bg-[#1A1A1A] border border-[#3D3D3D]">
                  <span className="text-[10px] font-bold text-[#8A8A8A] uppercase">90-Day Telemetry</span>
                  <p className="font-bold text-[#F0F0F0] mt-1">{person.login_count || 0} logins</p>
                  <p className="text-[10px] text-[#999999] mt-0.5">{person.activity_summary}</p>
                </div>
                <div className="p-3 bg-[#1A1A1A] border border-[#3D3D3D]">
                  <span className="text-[10px] font-bold text-[#8A8A8A] uppercase">Relationship Type</span>
                  <div className="mt-1">{relationshipBadge()}</div>
                  <p className="text-[10px] text-[#999999] mt-0.5">Role: {person.deal_role}</p>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[#3D3D3D]">
              <button
                onClick={() => {
                  setIsDrawerOpen(false);
                  onOpenNoteWriter?.();
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-mono font-bold uppercase tracking-wider bg-[#2E2E2E] hover:bg-[#3D3D3D] text-[#F0F0F0] border border-[#3D3D3D] transition-colors"
              >
                <Send className="h-3.5 w-3.5 text-[#EC7D42]" />
                <span>Log Note for {person.name.split(' ')[0]}</span>
              </button>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className="px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider bg-[#D95B28] hover:bg-[#A33D14] text-white border border-[#A33D14] transition-all"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
