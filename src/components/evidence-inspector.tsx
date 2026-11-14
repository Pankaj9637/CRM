'use client';

import React from 'react';
import { Badge } from '@/components/badge';
import { FileCheck, ShieldAlert, CheckCircle2, AlertCircle, HelpCircle, X } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="w-full max-w-lg bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/70">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-slate-500 bg-slate-200/80 px-2 py-0.5 rounded">
              {fact.id}
            </span>
            <Badge variant={fact.status}>
              {fact.status.toUpperCase()}
            </Badge>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div>
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Evidence Record / Fact Text
            </div>
            <div className="p-3.5 bg-slate-50 rounded-lg border border-slate-200/70 text-slate-800 text-sm leading-relaxed font-medium">
              &ldquo;{fact.text}&rdquo;
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3 rounded-lg border border-slate-100 bg-slate-50/50">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Source Attribution
              </div>
              <div className="text-sm font-semibold text-slate-800 mt-0.5">
                {fact.said_by || 'Document Record'}
              </div>
            </div>

            <div className="p-3 rounded-lg border border-slate-100 bg-slate-50/50">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                Evidence Status
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                {fact.status === 'verified' && <CheckCircle2 className="h-4 w-4 text-emerald-600" />}
                {fact.status === 'told' && <AlertCircle className="h-4 w-4 text-amber-500" />}
                {fact.status === 'claim' && <HelpCircle className="h-4 w-4 text-orange-500" />}
                <span className="text-sm font-semibold capitalize text-slate-800">
                  {fact.status}
                </span>
              </div>
            </div>
          </div>

          {fact.verified_by && (
            <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800">
              <FileCheck className="h-4 w-4 text-emerald-600 shrink-0" />
              <div>
                <span className="font-semibold">Substantiating File: </span>
                <span className="font-mono">{fact.verified_by}</span>
              </div>
            </div>
          )}

          {fact.learned_at_minute !== null && fact.learned_at_minute !== undefined && (
            <div className="text-[11px] text-slate-400 text-right">
              Discovered at interview minute {fact.learned_at_minute}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 shadow-sm"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
}
