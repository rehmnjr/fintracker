import React, { useEffect, useState } from 'react';
import SummaryCards from '../../components/dashboard/SummaryCards';
import BalanceChart from '../../components/dashboard/BalanceChart';
import CategoryChart from '../../components/dashboard/CategoryChart';
import { getSummary, getBalanceTrend, getCategoryBreakdown } from '../../services/dashboardService';
import { RefreshCw } from 'lucide-react';

export default function DashboardPage() {
  const [summary, setSummary] = useState(null);
  const [trend, setTrend] = useState(null);
  const [categories, setCategories] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    try {
      const [s, t, c] = await Promise.all([
        getSummary(),
        getBalanceTrend(),
        getCategoryBreakdown(),
      ]);
      setSummary(s);
      setTrend(t);
      setCategories(c);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-widest">
            March 2026
          </p>
          <h2 className="text-xl font-bold text-foreground mt-0.5">
            Financial{' '}
            <span className="gradient-text">Overview</span>
          </h2>
        </div>
        <button
          id="refresh-dashboard"
          onClick={() => load(true)}
          disabled={refreshing}
          className="btn-ghost gap-2 text-xs"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Summary Cards */}
      <SummaryCards data={summary} loading={loading} />

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">
        <div className="xl:col-span-3">
          <BalanceChart data={trend} loading={loading} />
        </div>
        <div className="xl:col-span-2">
          <CategoryChart data={categories} loading={loading} />
        </div>
      </div>
    </div>
  );
}
