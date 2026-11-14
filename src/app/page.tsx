'use client';

import React, { useEffect, useState } from 'react';
import { PriorityActions } from '@/components/dashboard/priority-actions';
import { PipelineHealth } from '@/components/dashboard/pipeline-health';
import { PeopleSentiment } from '@/components/dashboard/people-sentiment';
import { RiskAlerts } from '@/components/dashboard/risk-alerts';
import { SignalFeed } from '@/components/dashboard/signal-feed';
import { EvidenceInspectorModal, FactData } from '@/components/evidence-inspector';
import { RefreshCw, AlertCircle } from 'lucide-react';
import seedData from '@/data/seed.json';

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [inspectFact, setInspectFact] = useState<FactData | null>(null);
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const res = await fetch('/api/dashboard');
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Evidence lookup
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
          text: `File Record: ${foundFile.title} (Path: ${foundFile.path || 'files/csv'})`,
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
          said_by: 'Stakeholder Statement',
        });
        setIsInspectorOpen(true);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-3">
        <RefreshCw className="h-8 w-8 text-[#D95B28] animate-spin" />
        <p className="text-sm font-semibold text-[#D6D6D6]">Loading NEXUS Account Intelligence...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-8 text-center bg-[#242424] rounded-none border border-[#F43F5E]/40">
        <AlertCircle className="h-8 w-8 text-[#F43F5E] mx-auto mb-2" />
        <h3 className="text-base font-bold text-[#F0F0F0]">Failed to load dashboard data</h3>
        <p className="text-xs text-[#999999] mt-1">Check database connection or seed status.</p>
        <button
          onClick={() => {
            setLoading(true);
            fetchDashboardData();
          }}
          className="mt-4 px-4 py-2 text-xs font-semibold bg-[#D95B28] hover:bg-[#A33D14] text-white rounded-none transition-colors border border-[#D95B28]"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-[#F0F0F0]">Intelligence Command Center</h1>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-none bg-[#D95B28]/20 text-[#EC7D42] border border-[#D95B28]/40">
              Cross-Portfolio
            </span>
          </div>
          <p className="text-sm text-[#999999] mt-0.5">
            Real-time synthesis across Eastern Counties Police &amp; Aldermoor Industrial Group
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setLoading(true);
              fetchDashboardData();
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-[#D6D6D6] bg-[#242424] hover:bg-[#2E2E2E] border border-[#3D3D3D] rounded-none transition-colors"
          >
            <RefreshCw className="h-3.5 w-3.5 text-[#D95B28]" />
            <span>Sync Views</span>
          </button>
        </div>
      </div>

      {/* 1. Priority Actions (Top 5 cross-account ranked by commercial exposure) */}
      <PriorityActions
        actions={data.priorityActions || []}
        onInspectEvidence={handleInspectEvidence}
      />

      {/* 2. Middle Row: Pipeline Health + People Sentiment Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PipelineHealth
          pipeline={data.pipeline}
          accounts={data.accounts || []}
        />
        <PeopleSentiment
          people={data.people || []}
        />
      </div>

      {/* 3. Bottom Row: Risk Alerts + Live MCP Signal Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RiskAlerts
          risks={data.risks || []}
          onInspectEvidence={handleInspectEvidence}
        />
        <SignalFeed
          initialSignals={data.signals || []}
          onSignalRefreshed={fetchDashboardData}
        />
      </div>

      {/* Evidence Inspector Modal for Dashboard */}
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
