'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Building2, 
  Sparkles, 
  PenLine, 
  Database, 
  Activity, 
  RefreshCw,
  RotateCw
} from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';

interface SidebarProps {
  onOpenNoteWriter?: () => void;
  onOpenCopilot?: () => void;
}

export function Sidebar({ onOpenNoteWriter, onOpenCopilot }: SidebarProps) {
  const pathname = usePathname();
  const [seeding, setSeeding] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [dynamicAccounts, setDynamicAccounts] = useState<any[]>([]);

  const fetchAccounts = async () => {
    try {
      const res = await fetch('/api/accounts');
      if (res.ok) {
        const json = await res.json();
        const list = Array.isArray(json) ? json : json.accounts || [];
        setDynamicAccounts(list);
      }
    } catch (e) {
      console.warn('Sidebar failed to fetch accounts:', e);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, [pathname]);

  const handleSync = async () => {
    try {
      setSyncing(true);
      const res = await fetch('/api/sync', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        await fetchAccounts();
        alert(`Zero-code sync complete: ${data.message}`);
        window.location.reload();
      } else {
        alert(`Sync error: ${data.error}`);
      }
    } catch (e: any) {
      alert(`Sync failed: ${e.message}`);
    } finally {
      setSyncing(false);
    }
  };

  const handleSeed = async () => {
    try {
      setSeeding(true);
      const res = await fetch('/api/seed', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        alert('Database successfully re-seeded with fresh MCP data & AI analysis!');
        window.location.reload();
      } else {
        alert(`Seed error: ${data.error}`);
      }
    } catch (e: any) {
      alert(`Seed failed: ${e.message}`);
    } finally {
      setSeeding(false);
    }
  };

  const navItems = [
    {
      title: 'Command Center',
      href: '/',
      icon: LayoutDashboard,
      active: pathname === '/',
    },
    {
      title: 'Accounts Portfolio',
      href: '/accounts',
      icon: Building2,
      active: pathname === '/accounts',
    },
  ];

  return (
    <aside className="w-64 bg-[#1A1A1A] text-[#D6D6D6] border-r border-[#3D3D3D] flex flex-col h-screen sticky top-0 select-none z-30">
      {/* Brand Header */}
      <div className="p-5 border-b border-[#3D3D3D]">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 bg-[#D95B28] flex items-center justify-center border border-[#A33D14] text-white">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-lg tracking-wider text-[#F0F0F0]">NEXUS</span>
              <span className="text-[10px] uppercase font-mono font-bold px-1.5 py-0.5 bg-[#D95B28]/20 text-[#EC7D42] border border-[#D95B28]/40">
                TERMINAL
              </span>
            </div>
            <p className="text-xs text-[#999999] font-medium font-mono">Account Intelligence</p>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        <div>
          <div className="px-3 mb-2 text-[10px] font-mono font-bold tracking-wider text-[#999999] uppercase">
            Intelligence Hub
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2 text-xs font-semibold uppercase tracking-wider transition-colors border',
                    item.active
                      ? 'bg-[#2E2E2E] text-[#F0F0F0] border-[#D95B28] border-l-2'
                      : 'border-transparent text-[#999999] hover:text-[#F0F0F0] hover:bg-[#242424]'
                  )}
                >
                  <Icon className={cn('h-4 w-4', item.active ? 'text-[#D95B28]' : 'text-[#999999]')} />
                  <span>{item.title}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Dynamic Accounts deep dive links */}
        <div>
          <div className="px-3 mb-2 flex items-center justify-between text-[10px] font-mono font-bold tracking-wider text-[#999999] uppercase">
            <span>Portfolio</span>
            <span className="text-[#999999] font-mono text-[10px]">
              {dynamicAccounts.length} ACCOUNTS
            </span>
          </div>
          <div className="space-y-1">
            {dynamicAccounts.map((acc, idx) => {
              const href = `/accounts/${acc.id}`;
              const active = pathname === href;
              const colorSchemes = [
                'border-[#D95B28]/40 text-[#EC7D42] bg-[#D95B28]/10',
                'border-[#3E6F9E]/40 text-[#7dd3fc] bg-[#3E6F9E]/10',
                'border-[#3A7A65]/40 text-[#5eead4] bg-[#3A7A65]/10',
              ];
              const badgeColor = colorSchemes[idx % colorSchemes.length];

              return (
                <Link
                  key={acc.id}
                  href={href}
                  className={cn(
                    'group flex items-center justify-between px-3 py-2 text-xs font-medium transition-all border',
                    active
                      ? 'bg-[#2E2E2E] text-[#F0F0F0] border-[#D95B28] border-l-2'
                      : 'border-transparent text-[#999999] hover:text-[#F0F0F0] hover:bg-[#242424]'
                  )}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className={cn('w-5 h-5 flex items-center justify-center font-mono font-bold text-[11px] border shrink-0', badgeColor)}>
                      {acc.id}
                    </span>
                    <span className="truncate">{acc.name}</span>
                  </div>
                  <span className="font-mono text-[11px] text-[#999999] group-hover:text-[#D6D6D6]">
                    {formatCurrency(acc.pipeline)}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Quick Tools */}
        <div>
          <div className="px-3 mb-2 text-[10px] font-mono font-bold tracking-wider text-[#999999] uppercase">
            Actions
          </div>
          <div className="space-y-2 px-1">
            <button
              onClick={handleSync}
              disabled={syncing}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold uppercase tracking-wider bg-[#242424] hover:bg-[#2E2E2E] text-[#EC7D42] hover:text-white border border-[#D95B28]/40 transition-colors"
            >
              <RotateCw className={cn('h-3.5 w-3.5 text-[#D95B28]', syncing && 'animate-spin')} />
              <span>{syncing ? 'Discovering...' : 'Dynamic Sync (MCP)'}</span>
            </button>
            <button
              onClick={onOpenNoteWriter}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold uppercase tracking-wider bg-[#242424] hover:bg-[#2E2E2E] text-[#D6D6D6] hover:text-white border border-[#3D3D3D] transition-colors"
            >
              <PenLine className="h-3.5 w-3.5 text-[#D95B28]" />
              <span>Write Note (MCP Sync)</span>
            </button>
            <button
              onClick={onOpenCopilot}
              className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold uppercase tracking-wider bg-[#D95B28] hover:bg-[#A33D14] text-white border border-[#A33D14] transition-all"
            >
              <Sparkles className="h-3.5 w-3.5 text-white" />
              <span>Ask NEXUS Copilot</span>
            </button>
          </div>
        </div>
      </div>

      {/* System Status & Footer */}
      <div className="p-3 border-t border-[#3D3D3D] bg-[#1A1A1A] space-y-2">
        <div className="bg-[#242424] p-2.5 border border-[#3D3D3D] text-[11px] space-y-1.5 font-mono">
          <div className="flex items-center justify-between text-[#D6D6D6]">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 bg-[#3A7A65]" />
              <span>MCP Protocol</span>
            </span>
            <span className="text-[10px] text-[#5eead4] font-bold">ONLINE</span>
          </div>
          <div className="flex items-center justify-between text-[#D6D6D6]">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 bg-[#D95B28]" />
              <span>Gemini 2.5 Flash</span>
            </span>
            <span className="text-[10px] text-[#EC7D42] font-bold">READY</span>
          </div>
          <div className="flex items-center justify-between text-[#D6D6D6]">
            <span className="flex items-center gap-1.5">
              <Database className="h-3 w-3 text-[#3E6F9E]" />
              <span>Turso/SQLite</span>
            </span>
            <span className="text-[10px] text-[#7dd3fc] font-bold">ACTIVE</span>
          </div>
        </div>

        <button
          onClick={handleSeed}
          disabled={seeding}
          className="w-full flex items-center justify-center gap-1.5 py-1.5 text-[11px] font-mono text-[#999999] hover:text-[#F0F0F0] border border-[#3D3D3D] bg-[#242424] hover:bg-[#2E2E2E] transition-colors"
        >
          <RefreshCw className={cn('h-3 w-3', seeding && 'animate-spin text-[#D95B28]')} />
          <span>{seeding ? 'Seeding Database...' : 'Re-Seed Database'}</span>
        </button>
      </div>
    </aside>
  );
}
