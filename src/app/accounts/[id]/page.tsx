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
  AlertTriangle
} from 'lucide-react';

type TabKey = 'overview' | 'deals' | 'people' | 'actions' | 'risks' | 'evidence';

export default function AccountDetailPage() {
  const params = useParams();
  const router = useRouter();
  const accountId = (params.id as string)?.toUpperCase() || 'A';

  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>('overview');

  const [inspectFact, setInspectFact] = useState<FactData | null>(null);
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);
  const [isNoteWriterOpen, setIsNoteWriterOpen] = useState(false);
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);

  const fetchAccountDetail = async () => {
    try {
      setLoading(true);
      setFetchError(null);
      const res = await fetch(`/api/accounts/${accountId}`);
      const json = await res.json();
      if (!res.ok || json.error) {
        setFetchError(json.error || `Server responded with status ${res.status}`);
      } else {
        setData(json);
      }
    } catch (err: any) {
      console.error('Failed to load account detail:', err);
      setFetchError(err.message || 'Network request failed');
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
        <RefreshCw className="h-8 w-8 text-[#D95B28] animate-spin" />
        <p className="text-sm font-semibold text-[#D6D6D6]">Loading Account Deep-Dive...</p>
      </div>
    );
  }

  if (fetchError || !data || !data.account) {
    return (
      <div className="p-8 text-center bg-[#242424] rounded-2xl border border-[#F43F5E]/40 space-y-3">
        <AlertTriangle className="h-8 w-8 text-[#F43F5E] mx-auto mb-2" />
        <h3 className="text-base font-bold text-[#F0F0F0]">
          {fetchError ? 'Error Loading Account Data' : 'Account Not Found'}
        </h3>
        <p className="text-xs text-[#999999]">
          {fetchError || `Account ID "${accountId}" does not exist in the database.`}
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={fetchAccountDetail}
            className="px-4 py-2 text-xs font-semibold bg-[#2E2E2E] hover:bg-[#3D3D3D] text-[#F0F0F0] rounded-xl border border-[#3D3D3D] transition-colors"
          >
            Retry Request
          </button>
          <Link
            href="/accounts"
            className="inline-block px-4 py-2 text-xs font-semibold bg-[#D95B28] hover:bg-[#A33D14] text-white rounded-xl shadow-md shadow-[#D95B28]/25 transition-all"
          >
            Return to Accounts Portfolio
          </Link>
        </div>
      </div>
    );
  }

  const { account, contacts, facts, deals, offers, actions, risks, unknowns, deal_contacts } = data;

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
          <Link href="/accounts" className="text-[#999999] hover:text-[#F0F0F0] font-medium flex items-center gap-1 transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Accounts Portfolio</span>
          </Link>
          <span className="text-[#3D3D3D]">/</span>
          <span className="font-semibold text-[#F0F0F0]">{account.name}</span>
        </div>

        {/* Quick Account Switcher Pill */}
        <div className="flex items-center gap-1.5 p-1 bg-[#242424] border border-[#3D3D3D] rounded-xl shadow-xs self-start">
          <span className="text-[11px] font-semibold text-[#8A8A8A] px-2 uppercase">Switch:</span>
          <button
            onClick={() => router.push('/accounts/A')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
              accountId === 'A'
                ? 'bg-[#D95B28] text-white shadow-sm'
                : 'text-[#D6D6D6] hover:bg-[#2E2E2E]'
            }`}
          >
            A: Eastern Counties
          </button>
          <button
            onClick={() => router.push('/accounts/B')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
              accountId === 'B'
                ? 'bg-[#D95B28] text-white shadow-sm'
                : 'text-[#D6D6D6] hover:bg-[#2E2E2E]'
            }`}
          >
            B: Aldermoor Group
          </button>
        </div>
      </div>

      {/* Account Workspace Header Banner */}
      <div className="bg-[#242424] rounded-2xl border border-[#3D3D3D] shadow-lg shadow-black/20 p-6 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <span className="w-12 h-12 rounded-xl bg-[#1A1A1A] text-[#EC7D42] border border-[#D95B28]/40 font-mono font-bold text-lg flex items-center justify-center shadow-md">
              {account.id}
            </span>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl font-bold text-[#F0F0F0]">{account.name}</h1>
                <Badge variant="default" size="sm">
                  {deals.length} OPPORTUNITIES
                </Badge>
              </div>
              <p className="text-xs text-[#999999] mt-1 max-w-2xl leading-relaxed">
                {account.official_story}
              </p>
            </div>
          </div>

          {/* Quick CTAs */}
          <div className="flex items-center gap-2 self-start lg:self-center">
            <button
              onClick={() => setIsNoteWriterOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#D6D6D6] bg-[#2E2E2E] hover:bg-[#3D3D3D] border border-[#3D3D3D] rounded-xl transition-colors"
            >
              <PenLine className="h-3.5 w-3.5 text-[#D95B28]" />
              <span>Log Note</span>
            </button>
            <button
              onClick={() => setIsCopilotOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#D95B28] hover:bg-[#A33D14] rounded-xl shadow-md shadow-[#D95B28]/25 transition-all"
            >
              <Sparkles className="h-3.5 w-3.5 text-white" />
              <span>Ask Copilot about Account {accountId}</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation Bar */}
        <div className="flex overflow-x-auto gap-2 border-t border-[#3D3D3D] pt-4 scrollbar-none">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-[#D95B28] text-white shadow-md shadow-[#D95B28]/20'
                    : 'text-[#999999] hover:text-[#F0F0F0] hover:bg-[#2E2E2E]'
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-white' : 'text-[#8A8A8A]'}`} />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`ml-1 text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                      isActive ? 'bg-black/30 text-white' : 'bg-[#1A1A1A] text-[#999999] border border-[#3D3D3D]'
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
            notes={data.notes || []}
            onOpenNoteWriter={() => setIsNoteWriterOpen(true)}
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
