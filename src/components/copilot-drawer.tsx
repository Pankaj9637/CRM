'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, X, Bot, User, AlertCircle, ExternalLink, ShieldCheck } from 'lucide-react';
import { FactData } from './evidence-inspector';

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
        'Hello! I am **NEXUS Intelligence Copilot**. I analyze accounts strictly from verified customer data, interview statements, and flight logs.\n\nAsk me about blockers, financial exposure, stakeholder power dynamics, or evidence credibility.',
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
            className="inline-flex items-center gap-0.5 mx-1 px-1.5 py-0.5 rounded text-[11px] font-mono font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition-colors"
            title="Inspect cited evidence"
          >
            <span>[{evId}]</span>
            <ExternalLink className="h-2.5 w-2.5 opacity-60" />
          </button>
        );
      }
      return <span key={i} className="whitespace-pre-wrap">{part}</span>;
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/30 backdrop-blur-[2px] flex justify-end animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white h-full shadow-2xl border-l border-slate-200 flex flex-col animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-200 bg-slate-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center shadow">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm tracking-wide">NEXUS Copilot</span>
                <span className="text-[10px] bg-indigo-500/30 text-indigo-300 px-1.5 py-0.2 rounded border border-indigo-400/30">
                  AI Grounded
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Strictly cites verified records</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Account Context Selector */}
        <div className="px-4 py-2.5 bg-slate-100/90 border-b border-slate-200 flex items-center justify-between text-xs">
          <span className="text-slate-500 font-medium">Account Context:</span>
          <select
            value={selectedAccount}
            onChange={(e) => setSelectedAccount(e.target.value)}
            className="text-xs bg-white border border-slate-300 rounded px-2 py-1 font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          >
            <option value="ALL">All Accounts (Cross-Portfolio)</option>
            <option value="A">Account A: Eastern Counties Police</option>
            <option value="B">Account B: Aldermoor Industrial</option>
          </select>
        </div>

        {/* Message History */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/60">
          {messages.map((msg, index) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={index}
                className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="h-7 w-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    <Bot className="h-4 w-4" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-xl p-3.5 text-xs leading-relaxed shadow-sm ${
                    isUser
                      ? 'bg-slate-900 text-white rounded-br-none'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'
                  }`}
                >
                  <div className="font-sans leading-relaxed">
                    {renderMessageContent(msg.content)}
                  </div>
                  <div
                    className={`mt-1.5 text-[10px] ${
                      isUser ? 'text-slate-400 text-right' : 'text-slate-400'
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>
                {isUser && (
                  <div className="h-7 w-7 rounded-lg bg-slate-700 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </div>
            );
          })}

          {loading && (
            <div className="flex gap-2.5 justify-start">
              <div className="h-7 w-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm animate-pulse">
                <Sparkles className="h-4 w-4" />
              </div>
              <div className="bg-white border border-slate-200 rounded-xl rounded-bl-none p-3.5 shadow-sm">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" />
                  <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce delay-150" />
                  <div className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce delay-300" />
                  <span className="font-medium text-slate-600 ml-1">Analyzing account evidence...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts */}
        <div className="p-2.5 border-t border-slate-200 bg-white">
          <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5 px-1">
            Suggested Strategic Questions
          </div>
          <div className="flex flex-wrap gap-1.5">
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(prompt)}
                disabled={loading}
                className="text-[11px] text-left bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 px-2 py-1 rounded border border-slate-200 transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-3 border-t border-slate-200 bg-white flex items-center gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSendMessage();
            }}
            placeholder="Ask NEXUS (e.g. Why is the $1.5M tender at risk?)..."
            disabled={loading}
            className="flex-1 text-xs border border-slate-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-slate-800"
          />
          <button
            onClick={() => handleSendMessage()}
            disabled={!inputMessage.trim() || loading}
            className="p-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg disabled:opacity-50 transition-colors shadow-sm"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
