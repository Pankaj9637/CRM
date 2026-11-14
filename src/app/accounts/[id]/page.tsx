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
import { ForensicDrawer } from '@/components/forensic-drawer';
import { NoteWriterModal } from '@/components/note-writer-modal';
import { CopilotDrawer } from '@/components/copilot-drawer';
import { Badge } from '@/components/badge';
import { FORENSIC_RECORDS, ForensicEvidenceRecord } from '@/lib/intelligence-data';
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
  AlertTriangle,
  RotateCw
} from 'lucide-react';

type TabKey = 'overview' | 'deals' | 'people' | 'actions' | 'risks' | 'evidence';

export default function AccountDetailPage() {
  const params = useParams();
  const router = useRouter();
  const accountId = (params.id as string)?.toUpperCase() || 'A';

  const [data, setData] = useState<any>(null);
  const [allAccounts, setAllAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>('overview');

  const [inspectFact, setInspectFact] = useState<FactData | null>(null);
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);
  const [selectedForensicRecord, setSelectedForensicRecord] = useState<ForensicEvidenceRecord | null>(null);
  const [isForensicOpen, setIsForensicOpen] = useState(false);
  const [isNoteWriterOpen, setIsNoteWriterOpen] = useState(false);
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);

  // Fetch all accounts dynamically for the switcher
  const fetchAllAccounts = async () => {
    try {
      const res = await fetch('/api/accounts');
      if (res.ok) {
        const json = await res.json();
        if (Array.isArray(json)) {
          setAllAccounts(json);
        } else if (Array.isArray(json.accounts)) {
          setAllAccounts(json.accounts);
        }
      }
    } catch (e) {
      console.warn('Failed to fetch accounts list:', e);
    }
  };

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

  const handleSyncAccount = async () => {
    try {
      setSyncing(true);
      const res = await fetch('/api/sync', { method: 'POST' });
      const json = await res.json();
      if (json.success) {
        await Promise.all([fetchAccountDetail(), fetchAllAccounts()]);
      }
    } catch (e) {
      console.warn('Sync failed:', e);
    } finally {
      setSyncing(false);
    }
  };

  useEffect(() => {
    fetchAllAccounts();
    fetchAccountDetail();
  }, [accountId]);

  // Handle forensic reality check drawer opening
  const handleOpenForensicDrawer = (dealId: string) => {
    const record = FORENSIC_RECORDS[dealId];
    if (record) {
      setSelectedForensicRecord(record);
      setIsForensicOpen(true);
    } else {
      const deal = data?.deals?.find((d: any) => d.id === dealId);
      if (deal) {
        setSelectedForensicRecord({
          dealId: deal.id,
          dealTitle: deal.title,
          accountId: deal.account_id || accountId,
          claimedValue: deal.worth_up_to || 0,
          integrity: deal.blocker_status === 'open' ? 'contradicted' : 'verified',
          claimText: deal.blocker_text ? `Claimed blocker: ${deal.blocker_text}` : 'Operational rollout progressing according to plan.',
          claimedBy: 'Account Lead',
          realityText: deal.blocker_text ? `Unresolved blocker identified: ${deal.blocker_text}` : 'Backed by recorded system files and logs.',
          sourceDocId: 'System File / Telemetry Log',
          sourceDocType: 'contract',
          verbatimExcerpt: `Opportunity: ${deal.title}\nBlocker: ${deal.blocker_text || 'None'}\nStage: ${deal.stage}\nValue: $${(deal.worth_up_to || 0).toLocaleString()}`,
          actionableUnlock: `Clear blocker to unblock ${deal.title} and secure $${(deal.worth_up_to || 0).toLocaleString()} pipeline value.`,
          actionContact: 'Account Lead',
          unlockValue: deal.worth_up_to || 0,
          evidenceIds: Array.isArray(deal.evidence_ids) ? deal.evidence_ids : [],
        });
        setIsForensicOpen(true);
      }
    }
  };

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
      <div className="p-8 text-center bg-[#242424] rounded-none border border-[#F43F5E]/40 space-y-3">
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
            className="px-4 py-2 text-xs font-semibold bg-[#2E2E2E] hover:bg-[#3D3D3D] text-[#F0F0F0] rounded-none border border-[#3D3D3D] transition-colors"
          >
            Retry Request
          </button>
          <button
            onClick={handleSyncAccount}
            disabled={syncing}
            className="px-4 py-2 text-xs font-semibold bg-[#2E2E2E] hover:bg-[#3D3D3D] text-[#EC7D42] rounded-none border border-[#D95B28]/40 transition-colors flex items-center gap-1.5"
          >
            <RotateCw className={`h-3 w-3 ${syncing ? 'animate-spin' : ''}`} />
            <span>Sync from MCP</span>
          </button>
          <Link
            href="/accounts"
            className="inline-block px-4 py-2 text-xs font-semibold bg-[#D95B28] hover:bg-[#A33D14] text-white rounded-none transition-all border border-[#D95B28]"
          >
            Return to Accounts Portfolio
          </Link>
        </div>
      </div>
    );
  }

  const { account, contacts, facts, deals, offers, actions, risks, unknowns, deal_contacts } = data;

  const tabs: { key: TabKey; label: string; icon: any; count?: number }[] = [
    { key: 'overview', label: 'Overview', icon: Layers },
    { key: 'deals', label: 'Deals', icon: Building2, count: deals.length },
    { key: 'people', label: 'People & Power', icon: Users, count: contacts.length },
    { key: 'actions', label: 'Actions', icon: Zap, count: actions.length },
    { key: 'risks', label: 'Risks', icon: ShieldAlert, count: risks.length },
    { key: 'evidence', label: 'Evidence & Forensic', icon: FileSearch, count: unknowns.length },
  ];

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Dynamic Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs">
          <Link href="/accounts" className="text-[#999999] hover:text-[#F0F0F0] font-medium flex items-center gap-1 transition-colors">
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Accounts Portfolio</span>
          </Link>
          <span className="text-[#3D3D3D]">/</span>
          <span className="font-semibold text-[#F0F0F0]">{account.name}</span>
        </div>

        {/* Dynamic Account Switcher Pill */}
        <div className="flex items-center gap-1.5 p-1 bg-[#242424] border border-[#3D3D3D] rounded-none self-start overflow-x-auto max-w-full">
          <span className="text-[11px] font-semibold text-[#8A8A8A] px-2 uppercase shrink-0">Switch:</span>
          {allAccounts.map((acc) => (
            <button
              key={acc.id}
              onClick={() => router.push(`/accounts/${acc.id}`)}
              className={`px-3 py-1 text-xs font-bold rounded-none transition-colors whitespace-nowrap ${
                accountId === acc.id
                  ? 'bg-[#D95B28] text-white'
                  : 'text-[#D6D6D6] hover:bg-[#2E2E2E]'
              }`}
            >
              {acc.id}: {acc.name}
            </button>
          ))}
        </div>
      </div>

      {/* Account Workspace Header Banner */}
      <div className="bg-[#242424] rounded-none border border-[#3D3D3D] p-6 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <span className="w-12 h-12 rounded-none bg-[#1A1A1A] text-[#EC7D42] border border-[#D95B28]/40 font-mono font-bold text-lg flex items-center justify-center">
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
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#D6D6D6] bg-[#2E2E2E] hover:bg-[#3D3D3D] border border-[#3D3D3D] rounded-none transition-colors"
            >
              <PenLine className="h-3.5 w-3.5 text-[#D95B28]" />
              <span>Log Note</span>
            </button>
            <button
              onClick={() => setIsCopilotOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#D95B28] hover:bg-[#A33D14] rounded-none transition-all border border-[#D95B28]"
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
                className={`flex items-center gap-2 px-3.5 py-2 rounded-none text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-[#D95B28] text-white'
                    : 'text-[#999999] hover:text-[#F0F0F0] hover:bg-[#2E2E2E]'
                }`}
              >
                <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-white' : 'text-[#8A8A8A]'}`} />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`ml-1 text-[10px] font-mono px-1.5 py-0.2 rounded-none ${
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
            onOpenForensicDrawer={handleOpenForensicDrawer}
          />
        )}

        {activeTab === 'people' && (
          <PeopleTab
            contacts={contacts}
            deals={deals}
            dealContacts={deal_contacts}
            onInspectEvidence={handleInspectEvidence}
            onOpenNoteWriter={() => setIsNoteWriterOpen(true)}
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
            onOpenForensicDrawer={handleOpenForensicDrawer}
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

      {/* Forensic Reality Check Drawer */}
      <ForensicDrawer
        record={selectedForensicRecord}
        isOpen={isForensicOpen}
        onClose={() => {
          setIsForensicOpen(false);
          setSelectedForensicRecord(null);
        }}
        onInspectEvidence={handleInspectEvidence}
        onOpenNoteWriter={() => setIsNoteWriterOpen(true)}
      />
    </div>
  );
}
