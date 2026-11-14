'use client';

import React from 'react';
import { ForensicEvidenceRecord } from '@/lib/intelligence-data';
import { formatCurrency } from '@/lib/utils';
import { 
  FileText, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle, 
  Sparkles, 
  Send, 
  FileCheck
} from 'lucide-react';

interface ForensicDrawerProps {
  record: ForensicEvidenceRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onInspectEvidence?: (evidenceId: string) => void;
  onOpenNoteWriter?: () => void;
}

export function ForensicDrawer({
  record,
  isOpen,
  onClose,
  onInspectEvidence,
  onOpenNoteWriter,
}: ForensicDrawerProps) {
  if (!isOpen || !record) return null;

  const getIntegrityBadge = (status: 'verified' | 'told' | 'contradicted') => {
    switch (status) {
      case 'verified':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-none text-[10px] font-mono font-bold bg-[#3A7A65]/20 text-[#5eead4] border border-[#3A7A65]/40">
            <CheckCircle2 className="h-3 w-3" />
            [VERIFIED]
          </span>
        );
      case 'told':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-none text-[10px] font-mono font-bold bg-[#D9A441]/20 text-[#fde047] border border-[#D9A441]/40">
            <HelpCircle className="h-3 w-3" />
            [TOLD]
          </span>
        );
      case 'contradicted':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-none text-[10px] font-mono font-bold bg-[#F43F5E]/20 text-[#fda4af] border border-[#F43F5E]/40">
            <AlertTriangle className="h-3 w-3" />
            [CLAIM / CONTRADICTED]
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 animate-in fade-in duration-150">
      <div className="bg-[#242424] border border-[#3D3D3D] rounded-none w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Top Header */}
        <div className="p-5 border-b border-[#3D3D3D] flex items-start justify-between gap-3 bg-[#1E1E1E]">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 bg-[#D95B28]/20 text-[#EC7D42] border border-[#D95B28]/40 flex items-center justify-center font-bold text-sm shrink-0">
              <FileCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#EC7D42] bg-[#1A1A1A] px-2 py-0.5 border border-[#D95B28]/30">
                  Forensic Reality Check
                </span>
                {getIntegrityBadge(record.integrity)}
              </div>
              <h2 className="text-base font-bold text-[#F0F0F0] mt-1">
                {record.dealTitle}
              </h2>
              <p className="text-xs text-[#999999] mt-0.5 font-mono">
                Deal Potential: <strong className="text-[#EC7D42]">{formatCurrency(record.claimedValue)}</strong>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#999999] hover:text-[#F0F0F0] p-1 border border-transparent hover:border-[#3D3D3D] hover:bg-[#2E2E2E] transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1">
          {/* Contradiction Alert Banner */}
          {record.contradictionWarning && (
            <div className="p-3.5 bg-[#F43F5E]/10 border border-[#F43F5E]/40 text-[#fda4af] flex items-start gap-2.5">
              <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-[#F43F5E]" />
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#F43F5E]">
                  Integrity Discrepancy Alert
                </span>
                <p className="text-xs leading-relaxed font-semibold">
                  {record.contradictionWarning}
                </p>
              </div>
            </div>
          )}

          {/* Side-by-Side: Claim vs Reality */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            {/* The Verbal Claim */}
            <div className="p-4 bg-[#1A1A1A] border border-[#3D3D3D] space-y-2">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="font-bold text-[#8A8A8A] uppercase">What Was Claimed</span>
                <span className="text-[#EC7D42] font-semibold text-[10px]">VERBAL / TOLD</span>
              </div>
              <p className="text-xs text-[#F0F0F0] leading-relaxed italic">
                &ldquo;{record.claimText}&rdquo;
              </p>
              <div className="text-[10px] text-[#8A8A8A] pt-1 border-t border-[#3D3D3D] font-mono">
                Reported by: <strong className="text-[#D6D6D6]">{record.claimedBy}</strong>
              </div>
            </div>

            {/* The Physical Paperwork Reality */}
            <div className="p-4 bg-[#1A1A1A] border border-[#3A7A65]/40 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="font-bold text-[#5eead4] uppercase">What Paperwork Proves</span>
                <span className="text-[#5eead4] font-semibold text-[10px]">RECORD EVIDENCE</span>
              </div>
              <p className="text-xs text-[#D6D6D6] leading-relaxed">
                {record.realityText}
              </p>
              <div className="text-[10px] text-[#8A8A8A] pt-1 border-t border-[#3D3D3D] font-mono">
                Source: <strong className="text-[#5eead4]">{record.sourceDocId}</strong>
              </div>
            </div>
          </div>

          {/* Smoking Gun Verbatim Excerpt */}
          <div className="p-4 bg-[#1A1A1A] border border-[#3D3D3D] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#EC7D42] flex items-center gap-1.5">
                <FileText className="h-3.5 w-3.5 text-[#D95B28]" />
                <span>Smoking Gun Source Document Excerpt</span>
              </span>
              <span className="text-[10px] font-mono text-[#999999]">
                {record.sourceDocType.toUpperCase()} {record.sourceDate && `• ${record.sourceDate}`}
              </span>
            </div>
            <pre className="p-3 bg-black text-xs font-mono text-[#5eead4] border border-[#3D3D3D] whitespace-pre-wrap leading-relaxed overflow-x-auto">
              {record.verbatimExcerpt}
            </pre>
          </div>

          {/* Actionable Unlock Recommendation */}
          <div className="p-4 bg-[#242424] border border-[#D95B28]/50 border-l-4 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#EC7D42] flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-[#D95B28]" />
                <span>Actionable Commercial Unlock</span>
              </span>
              <span className="text-xs font-mono font-bold text-[#5eead4]">
                +{formatCurrency(record.unlockValue)}
              </span>
            </div>
            <p className="text-xs text-[#F0F0F0] font-medium leading-relaxed">
              {record.actionableUnlock}
            </p>
            <div className="text-[11px] text-[#999999] font-mono">
              Direct Contact: <strong className="text-[#D6D6D6]">{record.actionContact}</strong>
            </div>
          </div>

          {/* Grounding Evidence Traceability Tags */}
          <div className="space-y-1.5">
            <span className="text-[10px] font-mono font-bold text-[#8A8A8A] uppercase tracking-wider">
              Grounded Evidence Traceability:
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {record.evidenceIds.map((eid) => (
                <button
                  key={eid}
                  onClick={() => onInspectEvidence?.(eid)}
                  className="px-2 py-0.5 text-[10px] font-mono font-bold bg-[#1A1A1A] hover:bg-[#2E2E2E] text-[#EC7D42] hover:text-[#f97316] border border-[#3D3D3D] transition-colors"
                >
                  [{eid}]
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer CTAs */}
        <div className="p-4 bg-[#1E1E1E] border-t border-[#3D3D3D] flex items-center justify-between gap-3">
          <button
            onClick={() => {
              onClose();
              onOpenNoteWriter?.();
            }}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-mono font-bold uppercase tracking-wider bg-[#2E2E2E] hover:bg-[#3D3D3D] text-[#F0F0F0] border border-[#3D3D3D] transition-colors"
          >
            <Send className="h-3.5 w-3.5 text-[#EC7D42]" />
            <span>Log Write-Back on this Evidence</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider bg-[#D95B28] hover:bg-[#A33D14] text-white border border-[#A33D14] transition-all"
          >
            Close Reality Check
          </button>
        </div>
      </div>
    </div>
  );
}
