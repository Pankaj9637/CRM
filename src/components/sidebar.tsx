'use client';

import React from 'react';
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
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  onOpenNoteWriter?: () => void;
  onOpenCopilot?: () => void;
}

export function Sidebar({ onOpenNoteWriter, onOpenCopilot }: SidebarProps) {
  const pathname = usePathname();
  const [seeding, setSeeding] = React.useState(false);

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

  const accounts = [
    {
      id: 'A',
      name: 'Eastern Counties Police',
      href: '/accounts/A',
      pipeline: '$2.30M',
      badgeColor: 'border-[#D95B28]/40 text-[#EC7D42] bg-[#D95B28]/10',
    },
    {
      id: 'B',
      name: 'Aldermoor Industrial',
      href: '/accounts/B',
      pipeline: '$1.61M',
      badgeColor: 'border-[#3E6F9E]/40 text-[#7dd3fc] bg-[#3E6F9E]/10',
    },
  ];

  return (
    <aside className="w-64 bg-[#1A1A1A] text-[#D6D6D6] border-r border-[#3D3D3D] flex flex-col h-screen sticky top-0 select-none z-30">
      {/* Brand Header */}
      <div className="p-5 border-b border-[#3D3D3D]">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-[#A33D14] via-[#D95B28] to-[#EC7D42] flex items-center justify-center shadow-lg shadow-[#D95B28]/25">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-lg tracking-wider text-[#F0F0F0]">NEXUS</span>
              <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-[#D95B28]/20 text-[#EC7D42] border border-[#D95B28]/40">
                EMBER
              </span>
            </div>
            <p className="text-xs text-[#999999] font-medium">Account Intelligence</p>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        <div>
          <div className="px-3 mb-2 text-[11px] font-semibold tracking-wider text-[#999999] uppercase">
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
                    'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    item.active
                      ? 'bg-[#2E2E2E] text-[#F0F0F0] border border-[#3D3D3D] shadow-sm'
                      : 'text-[#999999] hover:text-[#F0F0F0] hover:bg-[#242424]'
                  )}
                >
                  <Icon className={cn('h-4 w-4', item.active ? 'text-[#D95B28]' : 'text-[#999999]')} />
                  <span>{item.title}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Accounts deep dive links */}
        <div>
          <div className="px-3 mb-2 flex items-center justify-between text-[11px] font-semibold tracking-wider text-[#999999] uppercase">
            <span>Portfolio</span>
            <span className="text-[#999999] font-mono text-[10px]">2 ACCOUNTS</span>
          </div>
          <div className="space-y-1">
            {accounts.map((acc) => {
              const active = pathname === acc.href;
              return (
                <Link
                  key={acc.id}
                  href={acc.href}
                  className={cn(
                    'group flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all',
                    active
                      ? 'bg-[#2E2E2E] text-[#F0F0F0] border border-[#D95B28]/60 shadow-sm'
                      : 'text-[#999999] hover:text-[#F0F0F0] hover:bg-[#242424]'
                  )}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className={cn('w-5 h-5 rounded flex items-center justify-center font-mono font-bold text-[11px] border', acc.badgeColor)}>
                      {acc.id}
                    </span>
                    <span className="truncate">{acc.name}</span>
                  </div>
                  <span className="font-mono text-[11px] text-[#999999] group-hover:text-[#D6D6D6]">
                    {acc.pipeline}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Quick Tools */}
        <div>
          <div className="px-3 mb-2 text-[11px] font-semibold tracking-wider text-[#999999] uppercase">
            Actions
          </div>
          <div className="space-y-2 px-1">
            <button
              onClick={onOpenNoteWriter}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium bg-[#242424] hover:bg-[#2E2E2E] text-[#D6D6D6] hover:text-white border border-[#3D3D3D] transition-colors shadow-sm"
            >
              <PenLine className="h-3.5 w-3.5 text-[#D95B28]" />
              <span>Write Note (MCP Sync)</span>
            </button>
            <button
              onClick={onOpenCopilot}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold bg-gradient-to-r from-[#D95B28] to-[#EC7D42] hover:from-[#A33D14] hover:to-[#D95B28] text-white shadow-md shadow-[#D95B28]/20 transition-all"
            >
              <Sparkles className="h-3.5 w-3.5 text-white animate-pulse" />
              <span>Ask NEXUS Copilot</span>
            </button>
          </div>
        </div>
      </div>

      {/* System Status & Footer */}
      <div className="p-3 border-t border-[#3D3D3D] bg-[#1A1A1A] space-y-2">
        <div className="bg-[#242424] rounded-lg p-2.5 border border-[#3D3D3D] text-[11px] space-y-1.5">
          <div className="flex items-center justify-between text-[#D6D6D6]">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#3A7A65] animate-pulse" />
              <span>MCP Protocol</span>
            </span>
            <span className="font-mono text-[10px] text-[#5eead4]">ONLINE</span>
          </div>
          <div className="flex items-center justify-between text-[#D6D6D6]">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#D95B28]" />
              <span>Gemini 2.5 Flash</span>
            </span>
            <span className="font-mono text-[10px] text-[#EC7D42]">READY</span>
          </div>
          <div className="flex items-center justify-between text-[#D6D6D6]">
            <span className="flex items-center gap-1.5">
              <Database className="h-3 w-3 text-[#3E6F9E]" />
              <span>Turso/SQLite</span>
            </span>
            <span className="font-mono text-[10px] text-[#7dd3fc]">ACTIVE</span>
          </div>
        </div>

        <button
          onClick={handleSeed}
          disabled={seeding}
          className="w-full flex items-center justify-center gap-1.5 py-1.5 text-[11px] font-medium text-[#999999] hover:text-[#F0F0F0] transition-colors"
        >
          <RefreshCw className={cn('h-3 w-3', seeding && 'animate-spin text-[#D95B28]')} />
          <span>{seeding ? 'Seeding Database...' : 'Re-Seed Database'}</span>
        </button>
      </div>
    </aside>
  );
}
