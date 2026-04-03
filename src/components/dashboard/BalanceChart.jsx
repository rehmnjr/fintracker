import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import Card from '../common/Card';
import { SkeletonChart } from '../common/Loader';
import { formatCurrency } from '../../utils/formatCurrency';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-xl px-4 py-3 text-sm shadow-xl"
      style={{
        background: 'rgba(15,15,30,0.95)',
        border: '1px solid rgba(255,255,255,0.1)',
        backdropFilter: 'blur(12px)',
      }}
    >
      <p className="text-muted-foreground text-xs mb-2 font-medium">{label}</p>
      {payload.map((entry) => (
        <div key={entry.dataKey} className="flex items-center gap-2 mb-1">
          <div className="h-2 w-2 rounded-full" style={{ background: entry.color }} />
          <span className="text-muted-foreground capitalize text-xs">{entry.name}:</span>
          <span className="font-semibold text-foreground text-xs">
            {formatCurrency(entry.value)}
          </span>
        </div>
      ))}
    </div>
  );
};

const SERIES = [
  { key: 'balance', label: 'Balance', color: '#6366f1' },
  { key: 'income', label: 'Income', color: '#34d399' },
  { key: 'expenses', label: 'Expenses', color: '#fb7185' },
];

export default function BalanceChart({ data, loading }) {
  const [activeSeries, setActiveSeries] = useState(['balance', 'income', 'expenses']);

  const toggleSeries = (key) => {
    setActiveSeries((prev) =>
      prev.includes(key) ? prev.filter((s) => s !== key) : [...prev, key]
    );
  };

  if (loading) return <SkeletonChart />;

  return (
    <Card className="animate-slide-up" style={{ animationDelay: '160ms' }}>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Balance Trend</h3>
          <p className="text-xs text-muted-foreground">12-month overview</p>
        </div>
        {/* Series toggles */}
        <div className="flex items-center gap-2 flex-wrap">
          {SERIES.map(({ key, label, color }) => (
            <button
              key={key}
              onClick={() => toggleSeries(key)}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium border transition-all duration-200 ${activeSeries.includes(key) ? 'opacity-100' : 'opacity-30'
                }`}
              style={{
                borderColor: color + '40',
                background: activeSeries.includes(key) ? color + '18' : 'transparent',
                color,
              }}
            >
              <div className="h-2 w-2 rounded-full" style={{ background: color }} />
              {label}
            </button>
          ))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
          <defs>
            {SERIES.map(({ key, color }) => (
              <linearGradient key={key} id={`grad-${key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.25} />
                <stop offset="95%" stopColor={color} stopOpacity={0.01} />
              </linearGradient>
            ))}
          </defs>
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
            width={40}
          />
          <Tooltip content={<CustomTooltip />} />
          {SERIES.map(({ key, color }) =>
            activeSeries.includes(key) ? (
              <Area
                key={key}
                type="monotone"
                dataKey={key}
                name={key}
                stroke={color}
                strokeWidth={2}
                fill={`url(#grad-${key})`}
                dot={false}
                activeDot={{ r: 4, fill: color, strokeWidth: 0 }}
              />
            ) : null
          )}
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
}
