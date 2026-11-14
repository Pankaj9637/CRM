'use client';

import React from 'react';
import { Badge } from '@/components/badge';
import { FileCheck, CheckCircle2, AlertCircle, HelpCircle, X } from 'lucide-react';

export interface FactData {
  id: string;
  account_id?: string;
  text: string;
  said_by?: string | null;
  status: 'verified' | 'told' | 'claim' | string;
  verified_by?: string | null;
  learned_at_minute?: number | null;
}

interface EvidenceInspectorModalProps {
  fact: FactData | null;
  isOpen: boolean;
  onClose: () => void;
}

export function EvidenceInspectorModal({ fact, isOpen, onClose }: EvidenceInspectorModalProps) {
  if (!isOpen || !fact) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="w-full max-w-lg bg-[#242424] rounded-2xl shadow-2xl border border-[#3D3D3D] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#3D3D3D] bg-[#1A1A1A]">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-[#EC7D42] bg-[#D95B28]/15 border border-[#D95B28]/30 px-2 py-0.5 rounded">
              {fact.id}
            </span>
            <Badge variant={fact.status}>
              {fact.status.toUpperCase()}
            </Badge>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-[#999999] hover:text-[#F0F0F0] hover:bg-[#2E2E2E] transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div>
            <div className="text-[11px] font-semibold text-[#8A8A8A] uppercase tracking-wider mb-1.5">
              Evidence Record / Fact Text
            </div>
            <div className="p-4 bg-[#1A1A1A] rounded-xl border border-[#3D3D3D] text-[#F0F0F0] text-sm leading-relaxed font-medium">
              &ldquo;{fact.text}&rdquo;
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="p-3 rounded-xl border border-[#3D3D3D] bg-[#2E2E2E]">
              <div className="text-[11px] font-semibold text-[#8A8A8A] uppercase tracking-wider">
                Source Attribution
              </div>
              <div className="text-sm font-semibold text-[#F0F0F0] mt-0.5">
                {fact.said_by || 'Document Record'}
              </div>
            </div>

            <div className="p-3 rounded-xl border border-[#3D3D3D] bg-[#2E2E2E]">
              <div className="text-[11px] font-semibold text-[#8A8A8A] uppercase tracking-wider">
                Evidence Status
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                {fact.status === 'verified' && <CheckCircle2 className="h-4 w-4 text-[#3A7A65]" />}
                {fact.status === 'told' && <AlertCircle className="h-4 w-4 text-[#D9A441]" />}
                {fact.status === 'claim' && <HelpCircle className="h-4 w-4 text-[#EC7D42]" />}
                <span className="text-sm font-semibold capitalize text-[#F0F0F0]">
                  {fact.status}
                </span>
              </div>
            </div>
          </div>

          {fact.verified_by && (
            <div className="flex items-center gap-2 p-3 bg-[#3A7A65]/15 border border-[#3A7A65]/40 rounded-xl text-xs text-[#5eead4]">
              <FileCheck className="h-4 w-4 text-[#5eead4] shrink-0" />
              <div>
                <span className="font-semibold text-white">Substantiating File: </span>
                <span className="font-mono">{fact.verified_by}</span>
              </div>
            </div>
          )}

          {fact.learned_at_minute !== null && fact.learned_at_minute !== undefined && (
            <div className="text-[11px] text-[#8A8A8A] text-right font-mono">
              Discovered at interview minute {fact.learned_at_minute}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 border-t border-[#3D3D3D] bg-[#1A1A1A] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-[#D6D6D6] bg-[#2E2E2E] border border-[#3D3D3D] rounded-lg hover:bg-[#3D3D3D] transition-colors"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
}
