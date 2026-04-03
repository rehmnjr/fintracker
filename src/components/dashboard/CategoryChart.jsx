import React, { useState } from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Sector,
} from 'recharts';
import Card from '../common/Card';
import { SkeletonChart } from '../common/Loader';
import { formatCurrency } from '../../utils/formatCurrency';

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div
      className="rounded-xl px-4 py-3 text-sm shadow-xl"
      style={{
        background: 'rgba(15,15,30,0.95)',
        border: '1px solid rgba(255,255,255,0.1)',
        backdropFilter: 'blur(12px)',
      }}
    >
      <p className="font-semibold text-foreground mb-1">{d.category}</p>
      <p className="text-muted-foreground text-xs">
        {formatCurrency(d.amount)}{' '}
        <span className="text-brand-400">({d.percentage}%)</span>
      </p>
    </div>
  );
};

const renderActiveShape = (props) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
  return (
    <g>
      <Sector
        cx={cx} cy={cy}
        innerRadius={innerRadius - 4}
        outerRadius={outerRadius + 6}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        opacity={0.9}
      />
    </g>
  );
};

export default function CategoryChart({ data, loading }) {
  const [activeIndex, setActiveIndex] = useState(null);

  if (loading) return <SkeletonChart />;
  if (!data?.length) return null;

  const total = data.reduce((s, d) => s + d.amount, 0);

  return (
    <Card className="animate-slide-up" style={{ animationDelay: '240ms' }}>
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-foreground">Spending by Category</h3>
        <p className="text-xs text-muted-foreground">Current month breakdown</p>
      </div>

      <div className="flex flex-col lg:flex-row items-center gap-6">
        {/* Donut */}
        <div className="relative flex-shrink-0">
          <ResponsiveContainer width={200} height={200}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={85}
                paddingAngle={3}
                dataKey="amount"
                activeIndex={activeIndex}
                activeShape={renderActiveShape}
                onMouseEnter={(_, index) => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                {data.map((entry, i) => (
                  <Cell
                    key={entry.category}
                    fill={entry.color}
                    opacity={activeIndex === null || activeIndex === i ? 1 : 0.5}
                    style={{ transition: 'opacity 0.2s ease', cursor: 'pointer' }}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          {/* Center label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <p className="text-xs text-muted-foreground">Total</p>
            <p className="text-sm font-bold text-foreground">{formatCurrency(total)}</p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 space-y-2 w-full">
          {data.slice(0, 7).map((entry, i) => (
            <div
              key={entry.category}
              className="flex items-center justify-between text-xs cursor-pointer rounded-lg px-2 py-1.5 transition-all"
              style={{
                background: activeIndex === i ? `${entry.color}12` : 'transparent',
              }}
              onMouseEnter={() => setActiveIndex(i)}
              onMouseLeave={() => setActiveIndex(null)}
            >
              <div className="flex items-center gap-2">
                <div
                  className="h-2.5 w-2.5 rounded-full flex-shrink-0"
                  style={{ background: entry.color }}
                />
                <span className="text-muted-foreground">{entry.category}</span>
              </div>
              <div className="flex items-center gap-2 text-right">
                <span className="text-foreground font-medium">{formatCurrency(entry.amount)}</span>
                <span
                  className="rounded-full px-1.5 py-0.5 text-[10px] font-medium"
                  style={{ background: `${entry.color}20`, color: entry.color }}
                >
                  {entry.percentage}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}
