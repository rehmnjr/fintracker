import React, { useState } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
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
      <p className="text-muted-foreground text-xs mb-2 font-medium">Day {label}</p>
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
  { key: 'balance', label: 'Balance', color: '#6366f1', type: 'area' },
  { key: 'income', label: 'Income', color: '#34d399', type: 'bar' },
  { key: 'expenses', label: 'Expenses', color: '#fb7185', type: 'bar' },
];

export default function DailyTrendChart({ data, loading, monthLabel }) {
  const [activeSeries, setActiveSeries] = useState(['balance', 'income', 'expenses']);

  const toggleSeries = (key) => {
    setActiveSeries((prev) =>
      prev.includes(key) ? prev.filter((s) => s !== key) : [...prev, key]
    );
  };

  if (loading) return <SkeletonChart />;

  return (
    <Card className="animate-slide-up" style={{ animationDelay: '200ms' }}>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Daily Activity</h3>
          <p className="text-xs text-muted-foreground">{monthLabel} breakdown</p>
        </div>
        {/* Series toggles */}
        <div className="flex items-center gap-2 flex-wrap">
          {SERIES.map(({ key, label, color }) => (
            <button
              key={key}
              onClick={() => toggleSeries(key)}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium border transition-all duration-200 ${
                activeSeries.includes(key) ? 'opacity-100' : 'opacity-30'
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
        <ComposedChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="grad-balance-daily" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0.01} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" vertical={false} />
          <XAxis
            dataKey="day"
            tick={{ fontSize: 10, fill: 'rgba(148,163,184,0.6)' }}
            axisLine={false}
            tickLine={false}
            interval={2}
          />
          <YAxis
            tick={{ fontSize: 10, fill: 'rgba(148,163,184,0.6)' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v) => `₹${(v / 1000).toFixed(1)}k`}
            width={40}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
          
          {activeSeries.includes('income') && (
            <Bar dataKey="income" name="Income" fill="#34d399" radius={[2, 2, 0, 0]} barSize={8} />
          )}
          {activeSeries.includes('expenses') && (
            <Bar dataKey="expenses" name="Expenses" fill="#fb7185" radius={[2, 2, 0, 0]} barSize={8} />
          )}
          {activeSeries.includes('balance') && (
            <Area
              type="monotone"
              dataKey="balance"
              name="Balance"
              stroke="#6366f1"
              strokeWidth={2}
              fill="url(#grad-balance-daily)"
              dot={false}
              activeDot={{ r: 4, fill: '#6366f1', strokeWidth: 0 }}
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>
    </Card>
  );
}
