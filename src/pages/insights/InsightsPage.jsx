import React, { useEffect, useState } from 'react';
import InsightsCard from '../../components/insights/InsightsCard';
import { SkeletonCard } from '../../components/common/Loader';
import { getInsights } from '../../services/insightsService';
import { useApp } from '../../context/AppContext';
import { useTransactions } from '../../hooks/useTransactions';
import { formatCurrency } from '../../utils/formatCurrency';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import Card from '../../components/common/Card';

const CustomBarTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-xl px-3 py-2 text-xs"
      style={{
        background: 'rgba(15,15,30,0.97)',
        border: '1px solid rgba(255,255,255,0.1)',
      }}
    >
      <p className="text-muted-foreground mb-1">{label}</p>
      {payload.map((p) => (
        <div key={p.dataKey} className="flex items-center gap-1.5">
          <div className="h-2 w-2 rounded-full" style={{ background: p.color }} />
          <span className="text-foreground font-medium">{formatCurrency(p.value)}</span>
        </div>
      ))}
    </div>
  );
};

export default function InsightsPage() {
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const { transactions } = useApp();
  const { totalIncome, totalExpenses } = useTransactions();

  useEffect(() => {
    getInsights()
      .then(setInsights)
      .finally(() => setLoading(false));
  }, []);

  // Build monthly comparison data from last 6 months (simulated from transactions)
  const monthlyData = [
    { month: 'Oct', income: 7800, expenses: 2950 },
    { month: 'Nov', income: 7500, expenses: 3600 },
    { month: 'Dec', income: 8200, expenses: 3100 },
    { month: 'Jan', income: 7900, expenses: 3300 },
    { month: 'Feb', income: 8000, expenses: 3050 },
    { month: 'Mar', income: 7892, expenses: 3418 },
  ];

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <p className="text-xs text-muted-foreground uppercase tracking-widest mb-0.5">

        </p>
        <h2 className="text-xl font-bold text-foreground">
          Financial{' '}
          <span className="gradient-text">Insights</span>
        </h2>
      </div>

      {/* Insight cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
        {loading
          ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
          : insights.map((insight, i) => (
            <InsightsCard key={insight.id} insight={insight} index={i} />
          ))}
      </div>

      {/* Monthly comparison chart */}
      <Card className="animate-slide-up" style={{ animationDelay: '300ms' }}>
        <div className="mb-5">
          <h3 className="text-sm font-semibold text-foreground">Monthly Comparison</h3>
          <p className="text-xs text-muted-foreground">Income vs Expenses over 6 months</p>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={monthlyData} barGap={4} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11, fill: 'rgba(148,163,184,0.8)' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 10, fill: 'rgba(148,163,184,0.8)' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
              width={38}
            />
            <Tooltip content={<CustomBarTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
            <Bar dataKey="income" fill="#34d399" radius={[4, 4, 0, 0]} maxBarSize={28} name="Income" />
            <Bar dataKey="expenses" fill="#fb7185" radius={[4, 4, 0, 0]} maxBarSize={28} name="Expenses" />
          </BarChart>
        </ResponsiveContainer>
        <div className="flex items-center gap-4 mt-4 justify-center">
          {[
            { color: '#34d399', label: 'Income' },
            { color: '#fb7185', label: 'Expenses' },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <div className="h-2.5 w-2.5 rounded-sm" style={{ background: s.color }} />
              {s.label}
            </div>
          ))}
        </div>
      </Card>

      {/* Savings summary */}
      <div
        className="rounded-2xl p-5 animate-slide-up"
        style={{
          animationDelay: '400ms',
          background: 'linear-gradient(135deg, rgba(99,102,241,0.12) 0%, rgba(139,92,246,0.08) 100%)',
          border: '1px solid rgba(99,102,241,0.2)',
        }}
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Monthly Net Savings</p>
            <p className="text-3xl font-bold gradient-text">
              {formatCurrency(totalIncome - totalExpenses)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {totalIncome > 0
                ? `${(((totalIncome - totalExpenses) / totalIncome) * 100).toFixed(1)}% savings rate`
                : 'No income recorded yet'}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted-foreground mb-1">Transactions tracked</p>
            <p className="text-2xl font-bold text-foreground">{transactions.length}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
