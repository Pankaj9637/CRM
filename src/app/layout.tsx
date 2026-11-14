'use client';

import React, { useState } from 'react';
import './globals.css';
import { Sidebar } from '@/components/sidebar';
import { CopilotDrawer } from '@/components/copilot-drawer';
import { NoteWriterModal } from '@/components/note-writer-modal';
import { EvidenceInspectorModal, FactData } from '@/components/evidence-inspector';
import { Sparkles, PenLine } from 'lucide-react';
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
    <html lang="en" className="dark">
      <head>
        <title>NEXUS — AI Account Intelligence CRM (Ember Dark)</title>
        <meta name="description" content="Ember Dark theme AI-powered Account Intelligence CRM for enterprise deal execution" />
      </head>
      <body className="flex min-h-screen bg-[#1A1A1A] text-[#D6D6D6] antialiased selection:bg-[#D95B28] selection:text-white">
        {/* Left Dark Navigation Sidebar */}
        <Sidebar
          onOpenNoteWriter={() => setIsNoteWriterOpen(true)}
          onOpenCopilot={() => setIsCopilotOpen(true)}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#1A1A1A]">
          {/* Top Bar */}
          <header className="h-14 border-b border-[#3D3D3D] bg-[#1A1A1A] sticky top-0 z-20 px-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-[#999999]">Workspace:</span>
              <span className="text-xs font-bold text-[#F0F0F0] bg-[#242424] px-2 py-0.5 rounded-none border border-[#3D3D3D]">
                FlytBase Alliance Portfolio
              </span>
              <span className="hidden sm:inline-flex items-center gap-1.5 text-[11px] text-[#5eead4] font-semibold bg-[#3A7A65]/20 px-2.5 py-0.5 rounded-none border border-[#3A7A65]/40">
                <span className="w-1.5 h-1.5 rounded-none bg-[#3A7A65] animate-pulse" />
                <span>Live Ingestion Active</span>
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setIsNoteWriterOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-none text-xs font-semibold text-[#D6D6D6] bg-[#242424] hover:bg-[#2E2E2E] border border-[#3D3D3D] transition-colors"
              >
                <PenLine className="h-3.5 w-3.5 text-[#D95B28]" />
                <span>Log Note (Write-Back)</span>
              </button>

              <button
                onClick={() => setIsCopilotOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-none text-xs font-semibold text-white bg-[#D95B28] hover:bg-[#A33D14] border border-[#D95B28] transition-all"
              >
                <Sparkles className="h-3.5 w-3.5 text-white" />
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
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 px-4 py-3 bg-[#242424] hover:bg-[#2E2E2E] text-white rounded-none border border-[#D95B28] transition-all hover:scale-105 active:scale-95 group"
        >
          <div className="h-6 w-6 rounded-none bg-[#D95B28] flex items-center justify-center">
            <Sparkles className="h-3.5 w-3.5 text-white animate-pulse" />
          </div>
          <span className="text-xs font-bold tracking-wide text-[#F0F0F0]">Ask NEXUS Copilot</span>
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
