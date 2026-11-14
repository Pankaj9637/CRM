'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { OverviewTab } from '@/components/account/overview-tab';
import { DealsTab } from '@/components/account/deals-tab';
import { PeopleTab } from '@/components/account/people-tab';
import { ActionsTab } from '@/components/account/actions-tab';
import { RisksTab } from '@/components/account/risks-tab';
import { EvidenceTab } from '@/components/account/evidence-tab';
import { EvidenceInspectorModal, FactData } from '@/components/evidence-inspector';
import { NoteWriterModal } from '@/components/note-writer-modal';
import { CopilotDrawer } from '@/components/copilot-drawer';
import { formatCurrency } from '@/lib/utils';
import { Badge } from '@/components/badge';
import { 
  Building2, 
  ArrowLeft, 
  Sparkles, 
  PenLine, 
  RefreshCw, 
  Layers, 
  Users, 
  Zap, 
  ShieldAlert, 
  FileSearch,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import seedData from '@/data/seed.json';

type TabKey = 'overview' | 'deals' | 'people' | 'actions' | 'risks' | 'evidence';

export default function AccountDetailPage() {
  const params = useParams();
  const router = useRouter();
  const accountId = (params.id as string)?.toUpperCase() || 'A';

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabKey>('overview');

  const [inspectFact, setInspectFact] = useState<FactData | null>(null);
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);
  const [isNoteWriterOpen, setIsNoteWriterOpen] = useState(false);
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);

  const fetchAccountDetail = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/accounts/${accountId}`);
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error('Failed to load account detail:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccountDetail();
  }, [accountId]);

  // Handle evidence inspection
  const handleInspectEvidence = (evidenceId: string) => {
    const factsList: FactData[] = data?.facts || [];
    const found = factsList.find((f) => f.id === evidenceId);
    if (found) {
      setInspectFact(found);
      setIsInspectorOpen(true);
      return;
    }

    // Check files
    const filesList: any[] = data?.files || [];
    const foundFile = filesList.find((f) => f.id === evidenceId);
    if (foundFile) {
      setInspectFact({
        id: foundFile.id,
        text: `Substantiating file: ${foundFile.title} (Path: ${foundFile.path || 'files/csv'})`,
        status: 'verified',
        said_by: 'System Data File',
        verified_by: foundFile.id,
      });
      setIsInspectorOpen(true);
      return;
    }

    // Fallback
    setInspectFact({
      id: evidenceId,
      text: 'Referenced fact statement or external verification record.',
      status: 'told',
      said_by: 'Account Stakeholder',
    });
    setIsInspectorOpen(true);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-3">
        <RefreshCw className="h-8 w-8 text-indigo-600 animate-spin" />
        <p className="text-sm font-semibold text-slate-600">Loading Account Deep-Dive...</p>
      </div>
    );
  }

  if (!data || !data.account) {
    return (
      <div className="p-8 text-center bg-white rounded-xl border border-rose-200">
        <AlertTriangle className="h-8 w-8 text-rose-600 mx-auto mb-2" />
        <h3 className="text-base font-bold text-slate-900">Account Not Found</h3>
        <p className="text-xs text-slate-500 mt-1">
          Account ID &ldquo;{accountId}&rdquo; does not exist in the database.
        </p>
        <Link
          href="/accounts"
          className="mt-4 inline-block px-4 py-2 text-xs font-semibold bg-indigo-600 text-white rounded-lg"
        >
          Return to Accounts Portfolio
        </Link>
      </div>
    );
  }

  const { account, contacts, facts, deals, offers, actions, risks, unknowns, notes, deal_contacts } = data;

  const tabs: { key: TabKey; label: string; question: string; icon: any; count?: number }[] = [
    { key: 'overview', label: 'Overview', question: 'Executive Summary', icon: Layers },
    { key: 'deals', label: 'Deals', question: 'Q1: What is the book worth?', icon: Building2, count: deals.length },
    { key: 'people', label: 'People & Power', question: 'Q2: Who has the power?', icon: Users, count: contacts.length },
    { key: 'actions', label: 'Actions', question: 'Q3: What should happen next?', icon: Zap, count: actions.length },
    { key: 'risks', label: 'Risks', question: 'Q4: What is at risk?', icon: ShieldAlert, count: risks.length },
    { key: 'evidence', label: 'Evidence & Unknowns', question: 'Q5: What don\'t we know?', icon: FileSearch, count: unknowns.length },
  ];

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs">
          <Link href="/accounts" className="text-slate-500 hover:text-slate-900 font-medium flex items-center gap-1">
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Accounts Portfolio</span>
          </Link>
          <span className="text-slate-300">/</span>
          <span className="font-semibold text-slate-800">{account.name}</span>
        </div>

        {/* Quick Account Switcher Pill */}
        <div className="flex items-center gap-1.5 p-1 bg-white border border-slate-200 rounded-lg shadow-2xs self-start">
          <span className="text-[11px] font-semibold text-slate-400 px-2 uppercase">Switch:</span>
          <button
            onClick={() => router.push('/accounts/A')}
            className={`px-2.5 py-1 text-xs font-bold rounded ${
              accountId === 'A'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            A: Eastern Counties
          </button>
          <button
            onClick={() => router.push('/accounts/B')}
            className={`px-2.5 py-1 text-xs font-bold rounded ${
              accountId === 'B'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            B: Aldermoor Group
          </button>
        </div>
      </div>

      {/* Account Workspace Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <span className="w-12 h-12 rounded-xl bg-slate-950 text-white font-mono font-bold text-lg flex items-center justify-center shadow">
              {account.id}
            </span>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl font-bold text-slate-900">{account.name}</h1>
                <Badge variant="default" size="sm">
                  {deals.length} OPPORTUNITIES
                </Badge>
              </div>
              <p className="text-xs text-slate-500 mt-1 max-w-2xl leading-relaxed">
                {account.official_story}
              </p>
            </div>
          </div>

          {/* Quick CTAs */}
          <div className="flex items-center gap-2 self-start lg:self-center">
            <button
              onClick={() => setIsNoteWriterOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors"
            >
              <PenLine className="h-3.5 w-3.5 text-indigo-600" />
              <span>Log Note</span>
            </button>
            <button
              onClick={() => setIsCopilotOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-all"
            >
              <Sparkles className="h-3.5 w-3.5 text-indigo-200" />
              <span>Ask Copilot about Account {accountId}</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation Bar */}
        <div className="flex overflow-x-auto gap-2 border-t border-slate-100 pt-4 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`ml-1 text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                      isActive ? 'bg-slate-800 text-indigo-300' : 'bg-slate-200/80 text-slate-600'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Tab Workspace Content */}
      <div className="transition-all duration-150">
        {activeTab === 'overview' && (
          <OverviewTab
            account={account}
            deals={deals}
            offers={offers}
            contacts={contacts}
            risks={risks}
          />
        )}

        {activeTab === 'deals' && (
          <DealsTab
            deals={deals}
            facts={facts}
            onInspectEvidence={handleInspectEvidence}
          />
        )}

        {activeTab === 'people' && (
          <PeopleTab
            contacts={contacts}
            deals={deals}
            dealContacts={deal_contacts}
          />
        )}

        {activeTab === 'actions' && (
          <ActionsTab
            actions={actions}
            onInspectEvidence={handleInspectEvidence}
          />
        )}

        {activeTab === 'risks' && (
          <RisksTab
            risks={risks}
            deals={deals}
            onInspectEvidence={handleInspectEvidence}
          />
        )}

        {activeTab === 'evidence' && (
          <EvidenceTab
            facts={facts}
            unknowns={unknowns}
            deals={deals}
            onInspectEvidence={handleInspectEvidence}
          />
        )}
      </div>

      {/* Slide-out Copilot Drawer scoped to current account */}
      <CopilotDrawer
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
        currentAccountId={accountId}
        onInspectEvidence={handleInspectEvidence}
      />

      {/* Note Writer Modal */}
      <NoteWriterModal
        isOpen={isNoteWriterOpen}
        onClose={() => setIsNoteWriterOpen(false)}
        defaultAccountId={accountId}
        onNoteAdded={fetchAccountDetail}
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
    </div>
  );
}
