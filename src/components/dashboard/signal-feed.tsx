'use client';

import React, { useState } from 'react';
import { Radio, RefreshCw, CheckCircle2, Clock } from 'lucide-react';
import { Badge } from '@/components/badge';

interface SignalItem {
  id: string;
  account_id: string;
  text: string;
  raw_json?: string;
  fetched_at: string;
}

interface SignalFeedProps {
  initialSignals: SignalItem[];
  onSignalRefreshed?: () => void;
}

export function SignalFeed({ initialSignals, onSignalRefreshed }: SignalFeedProps) {
  const [signals, setSignals] = useState<SignalItem[]>(initialSignals);
  const [refreshing, setRefreshing] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleRefresh = async () => {
    setRefreshing(true);
    setStatusMessage(null);
    try {
      const res = await fetch('/api/signals');
      const data = await res.json();
      if (data.success && data.signals) {
        setSignals(data.signals);
        setStatusMessage(
          data.mcpFetched
            ? '✓ Fetched live signals directly from MCP!'
            : '✓ Signals up to date (cached per rate limiter).'
        );
        onSignalRefreshed?.();
      }
    } catch (err: any) {
      setStatusMessage(`Failed: ${err.message}`);
    } finally {
      setRefreshing(false);
      setTimeout(() => setStatusMessage(null), 3000);
    }
  };

  return (
    <div className="bg-[#242424] rounded-2xl border border-[#3D3D3D] shadow-lg shadow-black/20 p-5 space-y-4">
      <div className="flex items-center justify-between border-b border-[#3D3D3D] pb-3">
        <div className="flex items-center gap-2.5">
          <div className="h-7 w-7 rounded-lg bg-[#3A7A65]/20 text-[#5eead4] border border-[#3A7A65]/40 flex items-center justify-center font-bold text-xs">
            <Radio className="h-3.5 w-3.5 animate-pulse text-[#3A7A65]" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-[#F0F0F0]">Live MCP Signal Feed</h2>
            <p className="text-xs text-[#999999]">Real-time alerts via MCP get_signals</p>
          </div>
        </div>

        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#F0F0F0] bg-[#2E2E2E] hover:bg-[#3D3D3D] rounded-lg transition-colors border border-[#3D3D3D] shadow-xs"
        >
          <RefreshCw className={`h-3 w-3 ${refreshing ? 'animate-spin text-[#D95B28]' : ''}`} />
          <span>{refreshing ? 'Calling MCP...' : 'Refresh Signals'}</span>
        </button>
      </div>

      {statusMessage && (
        <div className="p-2 rounded-lg bg-[#3A7A65]/20 border border-[#3A7A65]/40 text-[#5eead4] text-xs font-medium flex items-center gap-1.5">
          <CheckCircle2 className="h-3.5 w-3.5 text-[#5eead4] shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {signals.length === 0 ? (
        <div className="p-6 text-center text-xs text-[#999999] bg-[#1A1A1A] rounded-xl border border-dashed border-[#3D3D3D]">
          No live signals detected yet. Click &ldquo;Refresh Signals&rdquo; to poll MCP.
        </div>
      ) : (
        <div className="space-y-2.5">
          {signals.map((sig) => (
            <div
              key={sig.id}
              className="p-3 rounded-xl border border-[#3D3D3D] bg-[#2E2E2E]/60 hover:bg-[#2E2E2E] transition-colors flex items-start gap-3"
            >
              <span className="w-6 h-6 rounded flex items-center justify-center font-mono font-bold text-[10px] bg-[#1A1A1A] text-[#EC7D42] border border-[#3D3D3D] shrink-0 mt-0.5">
                {sig.account_id || 'A'}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[10px] text-[#999999] font-semibold">{sig.id}</span>
                  <div className="flex items-center gap-1 text-[10px] text-[#999999] font-mono">
                    <Clock className="h-2.5 w-2.5" />
                    <span>{new Date(sig.fetched_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
                <p className="text-xs text-[#D6D6D6] font-medium mt-1 leading-relaxed">
                  {sig.text}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
