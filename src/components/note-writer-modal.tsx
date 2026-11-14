'use client';

import React, { useState } from 'react';
import { PenLine, X, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';

interface NoteWriterModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultAccountId?: string;
  onNoteAdded?: () => void;
}

export function NoteWriterModal({
  isOpen,
  onClose,
  defaultAccountId = 'A',
  onNoteAdded,
}: NoteWriterModalProps) {
  const [account, setAccount] = useState<string>(defaultAccountId);
  const [kind, setKind] = useState<string>('note');
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) {
      setStatusMessage({ type: 'error', text: 'Note content is required.' });
      return;
    }

    setSubmitting(true);
    setStatusMessage(null);

    try {
      const res = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          account,
          kind,
          title,
          text,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setStatusMessage({
          type: 'success',
          text: data.syncedToMcp
            ? '✓ Note saved to DB and synced directly to MCP write_note!'
            : '✓ Note saved to DB (queued for MCP sync).',
        });
        setTitle('');
        setText('');
        onNoteAdded?.();
        setTimeout(() => {
          onClose();
          setStatusMessage(null);
        }, 1200);
      } else {
        setStatusMessage({ type: 'error', text: data.error || 'Failed to save note' });
      }
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Network error' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 animate-in fade-in duration-150">
      <div 
        className="w-full max-w-lg bg-[#242424] rounded-none border border-[#3D3D3D] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#3D3D3D] bg-[#1A1A1A]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-none bg-[#D95B28]/20 text-[#EC7D42] border border-[#D95B28]/40">
              <PenLine className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#F0F0F0]">Add Account Intelligence Note</h3>
              <p className="text-[11px] text-[#999999]">Writes to DB & pushes write_back to MCP connector</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-none text-[#999999] hover:text-[#F0F0F0] hover:bg-[#2E2E2E] transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {statusMessage && (
            <div
              className={`p-3 rounded-none text-xs flex items-center gap-2 ${
                statusMessage.type === 'success'
                  ? 'bg-[#3A7A65]/20 text-[#5eead4] border border-[#3A7A65]/40'
                  : 'bg-[#F43F5E]/20 text-[#fda4af] border border-[#F43F5E]/40'
              }`}
            >
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="h-4 w-4 text-[#5eead4] shrink-0" />
              ) : (
                <AlertCircle className="h-4 w-4 text-[#F43F5E] shrink-0" />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#D6D6D6] mb-1.5">
                Target Account
              </label>
              <select
                value={account}
                onChange={(e) => setAccount(e.target.value)}
                className="w-full text-xs bg-[#1A1A1A] border border-[#3D3D3D] rounded-none px-3 py-2 font-medium text-[#F0F0F0] focus:outline-none focus:border-[#D95B28]"
              >
                <option value="A">Account A: Eastern Counties Police</option>
                <option value="B">Account B: Aldermoor Industrial Group</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#D6D6D6] mb-1.5">
                Classification / Kind
              </label>
              <select
                value={kind}
                onChange={(e) => setKind(e.target.value)}
                className="w-full text-xs bg-[#1A1A1A] border border-[#3D3D3D] rounded-none px-3 py-2 font-medium text-[#F0F0F0] focus:outline-none focus:border-[#D95B28]"
              >
                <option value="note">Note</option>
                <option value="task">Task</option>
                <option value="risk">Risk</option>
                <option value="next_step">Next Step</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#D6D6D6] mb-1.5">
              Title / Subject
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Sent data-flow pack to Fatima Osei"
              className="w-full text-xs bg-[#1A1A1A] border border-[#3D3D3D] rounded-none px-3.5 py-2.5 text-[#F0F0F0] placeholder-[#8A8A8A] focus:outline-none focus:border-[#D95B28]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#D6D6D6] mb-1.5">
              Note Details <span className="text-[#F43F5E]">*</span>
            </label>
            <textarea
              rows={4}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Log key meeting takeaway, evidence citation, or blocker update..."
              required
              className="w-full text-xs bg-[#1A1A1A] border border-[#3D3D3D] rounded-none p-3 text-[#F0F0F0] placeholder-[#8A8A8A] focus:outline-none focus:border-[#D95B28]"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#3D3D3D]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[#D6D6D6] hover:text-[#F0F0F0] hover:bg-[#2E2E2E] rounded-none transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#D95B28] hover:bg-[#A33D14] rounded-none disabled:opacity-50 transition-colors"
            >
              {submitting && <RefreshCw className="h-3.5 w-3.5 animate-spin" />}
              <span>{submitting ? 'Writing to MCP...' : 'Save & Sync Note'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
