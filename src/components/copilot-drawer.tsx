'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, X, Bot, User, ExternalLink } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface CopilotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentAccountId?: string;
  onInspectEvidence?: (evidenceId: string) => void;
}

export function CopilotDrawer({
  isOpen,
  onClose,
  currentAccountId = 'ALL',
  onInspectEvidence,
}: CopilotDrawerProps) {
  const [selectedAccount, setSelectedAccount] = useState<string>(currentAccountId);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        'Hello! I am **NEXUS Intelligence Copilot**.\n\nI analyze commercial priorities, stakeholder power maps, and risks strictly using customer facts and flight log records.\n\nAsk me about blockers, financial exposure, stakeholder power dynamics, or evidence credibility.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (currentAccountId) {
      setSelectedAccount(currentAccountId);
    }
  }, [currentAccountId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSendMessage = async (customText?: string) => {
    const textToSend = customText || inputMessage;
    if (!textToSend.trim() || loading) return;

    const userMsg: Message = {
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setLoading(true);

    try {
      const res = await fetch('/api/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accountId: selectedAccount,
          message: textToSend,
        }),
      });

      const data = await res.json();
      if (data.success && data.response) {
        const aiMsg: Message = {
          role: 'assistant',
          content: data.response,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, aiMsg]);
      } else {
        const errMsg: Message = {
          role: 'assistant',
          content: `⚠️ Error from AI engine: ${data.error || 'Failed to generate response'}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, errMsg]);
      }
    } catch (err: any) {
      const errMsg: Message = {
        role: 'assistant',
        content: `⚠️ Connection error: ${err.message}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setLoading(false);
    }
  };

  const quickPrompts = [
    'What is our single biggest commercial risk right now?',
    'Why is the $200,000 Tarn Valley deal blocked?',
    'Who has the real power on the 35-dock renewal?',
    'What evidence supports the £1.2M ROI claim?',
  ];

  // Helper to render text with clickable evidence pills e.g. [fo_dpia_2]
  const renderMessageContent = (content: string) => {
    const parts = content.split(/(\[[a-zA-Z0-9_-]+\])/g);
    return parts.map((part, i) => {
      const match = part.match(/^\[([a-zA-Z0-9_-]+)\]$/);
      if (match) {
        const evId = match[1];
        return (
          <button
            key={i}
            onClick={() => onInspectEvidence?.(evId)}
            className="inline-flex items-center gap-0.5 mx-1 px-1.5 py-0.2 rounded text-[11px] font-mono font-semibold bg-[#D95B28]/20 hover:bg-[#D95B28]/35 text-[#EC7D42] border border-[#D95B28]/50 transition-colors"
            title="Inspect cited evidence"
          >
            <span>[{evId}]</span>
            <ExternalLink className="h-2.5 w-2.5 opacity-80" />
          </button>
        );
      }
      return <span key={i} className="whitespace-pre-wrap">{part}</span>;
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/75 backdrop-blur-[2px] flex justify-end animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-[#1A1A1A] h-full shadow-2xl border-l border-[#3D3D3D] flex flex-col animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-[#3D3D3D] bg-[#242424] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-[#D95B28] flex items-center justify-center shadow-md shadow-[#D95B28]/30">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm tracking-wide text-[#F0F0F0]">NEXUS Copilot</span>
                <span className="text-[10px] bg-[#D95B28]/20 text-[#EC7D42] px-1.5 py-0.2 rounded border border-[#D95B28]/40 font-semibold">
                  Grounded
                </span>
              </div>
              <p className="text-[11px] text-[#999999]">Strictly cites verified records</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#999999] hover:text-[#F0F0F0] rounded-lg hover:bg-[#2E2E2E] transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Account Context Selector */}
        <div className="px-4 py-2.5 bg-[#242424]/70 border-b border-[#3D3D3D] flex items-center justify-between text-xs">
          <span className="text-[#999999] font-medium">Context:</span>
          <select
            value={selectedAccount}
            onChange={(e) => setSelectedAccount(e.target.value)}
            className="text-xs bg-[#1A1A1A] border border-[#3D3D3D] rounded-md px-2 py-1 font-semibold text-[#F0F0F0] focus:outline-none focus:border-[#D95B28]"
          >
            <option value="ALL">All Accounts (Portfolio)</option>
            <option value="A">Account A: Eastern Counties</option>
            <option value="B">Account B: Aldermoor Group</option>
          </select>
        </div>

        {/* Message History */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#1A1A1A]">
          {messages.map((msg, index) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={index}
                className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="h-7 w-7 rounded-lg bg-[#242424] border border-[#3D3D3D] text-[#EC7D42] flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    <Bot className="h-4 w-4" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed shadow-sm ${
                    isUser
                      ? 'bg-[#D95B28] text-white rounded-br-none shadow-md shadow-[#D95B28]/20'
                      : 'bg-[#242424] text-[#D6D6D6] border border-[#3D3D3D] rounded-bl-none'
                  }`}
                >
                  <div className="font-sans leading-relaxed">
                    {renderMessageContent(msg.content)}
                  </div>
                  <div
                    className={`mt-1.5 text-[10px] ${
                      isUser ? 'text-white/70 text-right' : 'text-[#8A8A8A]'
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>
                {isUser && (
                  <div className="h-7 w-7 rounded-lg bg-[#2E2E2E] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm border border-[#3D3D3D]">
                    <User className="h-4 w-4 text-[#D6D6D6]" />
                  </div>
                )}
              </div>
            );
          })}

          {loading && (
            <div className="flex gap-2.5 justify-start">
              <div className="h-7 w-7 rounded-lg bg-[#D95B28] text-white flex items-center justify-center shrink-0 shadow-sm animate-pulse">
                <Sparkles className="h-4 w-4" />
              </div>
              <div className="bg-[#242424] border border-[#3D3D3D] rounded-2xl rounded-bl-none p-3.5 shadow-sm">
                <div className="flex items-center gap-2 text-xs text-[#999999]">
                  <div className="w-2 h-2 rounded-full bg-[#D95B28] animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-[#D95B28] animate-bounce delay-150" />
                  <div className="w-2 h-2 rounded-full bg-[#D95B28] animate-bounce delay-300" />
                  <span className="font-medium text-[#D6D6D6] ml-1">Analyzing account evidence...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts */}
        <div className="p-3 border-t border-[#3D3D3D] bg-[#242424]">
          <div className="text-[10px] font-semibold text-[#8A8A8A] uppercase tracking-wider mb-2 px-1">
            Suggested Strategic Questions
          </div>
          <div className="flex flex-wrap gap-1.5">
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(prompt)}
                disabled={loading}
                className="text-[11px] text-left bg-[#1A1A1A] hover:bg-[#2E2E2E] hover:border-[#D95B28]/60 hover:text-[#EC7D42] text-[#D6D6D6] px-2.5 py-1 rounded-lg border border-[#3D3D3D] transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-[#3D3D3D] bg-[#1A1A1A] flex items-center gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSendMessage();
            }}
            placeholder="Ask NEXUS (e.g. Why is the $1.5M tender at risk?)..."
            disabled={loading}
            className="flex-1 text-xs bg-[#242424] border border-[#3D3D3D] rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-[#D95B28] text-[#F0F0F0] placeholder-[#8A8A8A]"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={!inputMessage.trim() || loading}
            className="p-2.5 bg-[#D95B28] hover:bg-[#A33D14] text-white rounded-xl disabled:opacity-40 transition-colors shadow-md shadow-[#D95B28]/25"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
