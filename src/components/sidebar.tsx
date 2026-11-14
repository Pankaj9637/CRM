'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Building2, 
  ShieldAlert, 
  Sparkles, 
  PenLine, 
  Database, 
  Cpu, 
  Activity, 
  RefreshCw,
  ChevronRight
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
      badgeColor: 'border-blue-500/30 text-blue-400 bg-blue-500/10',
    },
    {
      id: 'B',
      name: 'Aldermoor Industrial',
      href: '/accounts/B',
      pipeline: '$1.61M',
      badgeColor: 'border-purple-500/30 text-purple-400 bg-purple-500/10',
    },
  ];

  return (
    <aside className="w-64 bg-slate-950 text-slate-200 border-r border-slate-800 flex flex-col h-screen sticky top-0 select-none z-30">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800/80">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-lg tracking-wider text-white">NEXUS</span>
              <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                AI CRM
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">Account Intelligence</p>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        <div>
          <div className="px-3 mb-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
            Intelligence
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
                      ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900/80'
                  )}
                >
                  <Icon className={cn('h-4 w-4', item.active ? 'text-indigo-400' : 'text-slate-400')} />
                  <span>{item.title}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Accounts deep dive links */}
        <div>
          <div className="px-3 mb-2 flex items-center justify-between text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
            <span>Accounts</span>
            <span className="text-slate-400 font-mono text-[10px]">2 ACCOUNTS</span>
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
                      ? 'bg-slate-900 text-white border border-slate-700 shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-900/60'
                  )}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className={cn('w-5 h-5 rounded flex items-center justify-center font-mono font-bold text-[11px] border', acc.badgeColor)}>
                      {acc.id}
                    </span>
                    <span className="truncate">{acc.name}</span>
                  </div>
                  <span className="font-mono text-[11px] text-slate-400 group-hover:text-slate-200">
                    {acc.pipeline}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <div className="px-3 mb-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
            Quick Tools
          </div>
          <div className="space-y-2 px-1">
            <button
              onClick={onOpenNoteWriter}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 transition-colors shadow-sm"
            >
              <PenLine className="h-3.5 w-3.5 text-indigo-400" />
              <span>Write Note (MCP Sync)</span>
            </button>
            <button
              onClick={onOpenCopilot}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium bg-gradient-to-r from-indigo-950/80 to-slate-900 hover:from-indigo-900/90 text-indigo-200 border border-indigo-900/60 transition-all shadow-sm"
            >
              <Sparkles className="h-3.5 w-3.5 text-indigo-400 animate-pulse" />
              <span>Ask NEXUS Copilot</span>
            </button>
          </div>
        </div>
      </div>

      {/* System Status & Footer */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/90 space-y-2">
        <div className="bg-slate-900/90 rounded-lg p-2.5 border border-slate-800 text-[11px] space-y-1.5">
          <div className="flex items-center justify-between text-slate-300">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>MCP Connector</span>
            </span>
            <span className="font-mono text-[10px] text-emerald-400">ONLINE</span>
          </div>
          <div className="flex items-center justify-between text-slate-300">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-indigo-400" />
              <span>Gemini 2.5 Flash</span>
            </span>
            <span className="font-mono text-[10px] text-indigo-400">READY</span>
          </div>
          <div className="flex items-center justify-between text-slate-300">
            <span className="flex items-center gap-1.5">
              <Database className="h-3 w-3 text-cyan-400" />
              <span>Turso/libSQL</span>
            </span>
            <span className="font-mono text-[10px] text-cyan-400">ACTIVE</span>
          </div>
        </div>

        <button
          onClick={handleSeed}
          disabled={seeding}
          className="w-full flex items-center justify-center gap-1.5 py-1.5 text-[11px] font-medium text-slate-400 hover:text-white transition-colors"
        >
          <RefreshCw className={cn('h-3 w-3', seeding && 'animate-spin text-indigo-400')} />
          <span>{seeding ? 'Seeding Database...' : 'Re-Seed Database'}</span>
        </button>
      </div>
    </aside>
  );
}
