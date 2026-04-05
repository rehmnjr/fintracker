import React, { useMemo, useState } from 'react';
import SummaryCards from '../../components/dashboard/SummaryCards';
import BalanceChart from '../../components/dashboard/BalanceChart';
import DailyTrendChart from '../../components/dashboard/DailyTrendChart';
import CategoryChart from '../../components/dashboard/CategoryChart';
import { useApp } from '../../context/AppContext';
import {
  getMonthlySummary,
  getCategoryBreakdownForMonth,
  build12MonthTrend,
  getDailyTrendForMonth,
} from '../../utils/calculateInsights';

export default function DashboardPage() {
  const { transactions, txLoading } = useApp();

  const getCurrentMonth = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    return `${year}-${month}`;
  };

  const getMinMonth = () => {
    if (!transactions || transactions.length === 0) return '2025-05';
    const earliest = transactions.reduce((min, t) => (t.date < min ? t.date : min), transactions[0].date);
    return earliest.substring(0, 7); // Returns "YYYY-MM"
  };

  const [monthYear, setMonthYear] = useState(getCurrentMonth);

  const summary = useMemo(() => {
    if (!transactions || transactions.length === 0) return null;
    return getMonthlySummary(transactions, monthYear);
  }, [transactions, monthYear]);

  const dailyTrend = useMemo(() => {
    if (!transactions || transactions.length === 0) return [];
    return getDailyTrendForMonth(transactions, monthYear);
  }, [transactions, monthYear]);

  const trend = useMemo(() => {
    if (!transactions || transactions.length === 0) return [];
    return build12MonthTrend(transactions, monthYear);
  }, [transactions, monthYear]);

  const categories = useMemo(() => {
    if (!transactions || transactions.length === 0) return [];
    return getCategoryBreakdownForMonth(transactions, monthYear);
  }, [transactions, monthYear]);

  const formattedMonth = useMemo(() => {
    if (!monthYear) return '';
    const [y, m] = monthYear.split('-');
    const date = new Date(Number(y), Number(m) - 1);
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  }, [monthYear]);

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-widest">
            {formattedMonth}
          </p>
          <h2 className="text-xl font-bold text-foreground mt-0.5">
            Financial{' '}
            <span className="gradient-text">Overview</span>
          </h2>
        </div>

        <div className="flex items-center w-full sm:w-auto">
          <input
            type="month"
            name="monthYear"
            value={monthYear}
            min={getMinMonth()}
            max={getCurrentMonth()}
            onChange={(e) => setMonthYear(e.target.value)}
            className="glass-input flex-1 sm:flex-none text-sm h-[38px] py-1 text-muted-foreground"
          />
        </div>
      </div>

      {/* Summary Cards */}
      <SummaryCards data={summary} loading={txLoading} />

      {/* Daily Breakdown & Categories */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">
        <div className="xl:col-span-3">
          <DailyTrendChart data={dailyTrend} loading={txLoading} monthLabel={formattedMonth} />
        </div>
        <div className="xl:col-span-2">
          <CategoryChart data={categories} loading={txLoading} />
        </div>
      </div>

      {/* Long-term Trends */}
      <div className="grid grid-cols-1 gap-5">
        <BalanceChart data={trend} loading={txLoading} />
      </div>
    </div>
  );
}

