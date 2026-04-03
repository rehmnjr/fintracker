import React from 'react';
import { TrendingUp, TrendingDown, Minus, Wallet, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';
import Card from '../common/Card';
import { SkeletonCard } from '../common/Loader';
import { formatCurrency, formatTrend } from '../../utils/formatCurrency';

const CARD_CONFIG = [
  {
    key: 'totalBalance',
    label: 'Total Balance',
    icon: Wallet,
    trendKey: 'balanceTrend',
    gradient: 'from-brand-600/20 to-brand-900/10',
    iconBg: 'rgba(99,102,241,0.2)',
    iconColor: '#818cf8',
    glowClass: 'glow-indigo',
  },
  {
    key: 'totalIncome',
    label: 'Total Income',
    icon: ArrowUpCircle,
    trendKey: 'incomeTrend',
    gradient: 'from-emerald-500/20 to-emerald-900/10',
    iconBg: 'rgba(16,185,129,0.2)',
    iconColor: '#34d399',
    glowClass: 'glow-emerald',
  },
  {
    key: 'totalExpenses',
    label: 'Total Expenses',
    icon: ArrowDownCircle,
    trendKey: 'expensesTrend',
    gradient: 'from-rose-500/20 to-rose-900/10',
    iconBg: 'rgba(244,63,94,0.2)',
    iconColor: '#fb7185',
    glowClass: 'glow-rose',
  },
];

function TrendBadge({ value }) {
  if (!value && value !== 0) return null;
  const positive = value > 0;
  const neutral = value === 0;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${neutral
        ? 'bg-white/10 text-muted-foreground'
        : positive
          ? 'bg-emerald-500/15 text-emerald-400'
          : 'bg-rose-500/15 text-rose-400'
        }`}
    >
      {neutral ? (
        <Minus className="h-2.5 w-2.5" />
      ) : positive ? (
        <TrendingUp className="h-2.5 w-2.5" />
      ) : (
        <TrendingDown className="h-2.5 w-2.5" />
      )}
      {formatTrend(value)}
    </span>
  );
}

export default function SummaryCards({ data, loading }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {CARD_CONFIG.map((c) => (
          <SkeletonCard key={c.key} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
      {CARD_CONFIG.map(({ key, label, icon: Icon, trendKey, iconBg, iconColor }, i) => (
        <Card
          key={key}
          className="animate-slide-up relative overflow-hidden"
          style={{ animationDelay: `${i * 80}ms` }}
        >
          {/* Subtle background glow */}
          <div
            className="absolute -top-8 -right-8 h-28 w-28 rounded-full opacity-20 blur-2xl pointer-events-none"
            style={{ background: iconColor }}
          />

          <div className="flex items-start justify-between mb-4">
            <div
              className="h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: iconBg }}
            >
              <Icon className="h-5 w-5" style={{ color: iconColor }} />
            </div>
            <TrendBadge value={data?.[trendKey]} />
          </div>

          <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest mb-1">
            {label}
          </p>
          <p className="text-2xl font-bold text-foreground tracking-tight">
            {formatCurrency(data?.[key] || 0)}
          </p>

          {key === 'totalBalance' && data?.savingsRate != null && (
            <p className="text-xs text-muted-foreground mt-2">
              Savings rate:{' '}
              <span className="text-emerald-400 font-medium">{data.savingsRate.toFixed(1)}%</span>
            </p>
          )}
        </Card>
      ))}
    </div>
  );
}
