'use client';

import React, { useState } from 'react';
import './globals.css';
import { Sidebar } from '@/components/sidebar';
import { CopilotDrawer } from '@/components/copilot-drawer';
import { NoteWriterModal } from '@/components/note-writer-modal';
import { EvidenceInspectorModal, FactData } from '@/components/evidence-inspector';
import { Sparkles, PenLine, RefreshCw, Radio } from 'lucide-react';
import seedData from '@/data/seed.json';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [isNoteWriterOpen, setIsNoteWriterOpen] = useState(false);
  const [inspectFact, setInspectFact] = useState<FactData | null>(null);
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);

  // Flatten all facts from seed data for instant global lookup
  const allFacts: FactData[] = React.useMemo(() => {
    const list: FactData[] = [];
    for (const acc of seedData.accounts || []) {
      for (const f of acc.facts || []) {
        list.push({ ...f, account_id: acc.id });
      }
    }
    return list;
  }, []);

  const handleInspectEvidence = (evidenceId: string) => {
    const found = allFacts.find((f) => f.id === evidenceId);
    if (found) {
      setInspectFact(found);
      setIsInspectorOpen(true);
    } else {
      // Check if it's a file
      const foundFile = (seedData.files || []).find((file) => file.id === evidenceId);
      if (foundFile) {
        setInspectFact({
          id: foundFile.id,
          text: `File reference: ${foundFile.title} (Path: ${foundFile.path || 'internal/csv'})`,
          status: 'verified',
          said_by: 'System Log/File Record',
          verified_by: foundFile.id,
        });
        setIsInspectorOpen(true);
      } else {
        setInspectFact({
          id: evidenceId,
          text: 'External document or uncatalogued interview statement.',
          status: 'unknown',
          said_by: 'Stakeholder Record',
        });
        setIsInspectorOpen(true);
      }
    }
  };

  return (
    <html lang="en">
      <head>
        <title>NEXUS — AI Account Intelligence CRM</title>
        <meta name="description" content="AI-powered Account Intelligence CRM for enterprise deal execution" />
      </head>
      <body className="flex min-h-screen bg-slate-50 text-slate-900 antialiased font-sans">
        {/* Left Dark Navigation Sidebar */}
        <Sidebar
          onOpenNoteWriter={() => setIsNoteWriterOpen(true)}
          onOpenCopilot={() => setIsCopilotOpen(true)}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Bar */}
          <header className="h-14 border-b border-slate-200 bg-white/90 backdrop-blur sticky top-0 z-20 px-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-slate-500">Workspace:</span>
              <span className="text-xs font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                FlytBase Alliance Portfolio
              </span>
              <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Live Ingestion Active</span>
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setIsNoteWriterOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 shadow-xs transition-colors"
              >
                <PenLine className="h-3.5 w-3.5 text-indigo-600" />
                <span>Log Note (Write-Back)</span>
              </button>

              <button
                onClick={() => setIsCopilotOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-all"
              >
                <Sparkles className="h-3.5 w-3.5 text-indigo-200" />
                <span>NEXUS Copilot</span>
              </button>
            </div>
          </header>

          {/* Child Page Content */}
          <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto space-y-6">
            {children}
          </main>
        </div>

        {/* Global Floating Copilot Button (Bottom Right) */}
        <button
          onClick={() => setIsCopilotOpen(true)}
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 bg-slate-950 hover:bg-slate-900 text-white rounded-full shadow-2xl border border-indigo-500/40 hover:border-indigo-400 transition-all hover:scale-105 active:scale-95 group"
        >
          <div className="h-6 w-6 rounded-full bg-indigo-600 flex items-center justify-center">
            <Sparkles className="h-3.5 w-3.5 text-white animate-pulse" />
          </div>
          <span className="text-xs font-bold tracking-wide">Ask NEXUS Copilot</span>
        </button>

        {/* Slide-out Copilot Drawer */}
        <CopilotDrawer
          isOpen={isCopilotOpen}
          onClose={() => setIsCopilotOpen(false)}
          onInspectEvidence={handleInspectEvidence}
        />

        {/* Note Writer Modal */}
        <NoteWriterModal
          isOpen={isNoteWriterOpen}
          onClose={() => setIsNoteWriterOpen(false)}
        />

        {/* Evidence Inspector Modal */}
        <EvidenceInspectorModal
          fact={inspectFact}
          isOpen={isInspectorOpen}
          onClose={() => {
            setIsInspectorOpen(false);
            setInspectFact(null);
          }}
        />
      </body>
    </html>
  );
}
