import React from 'react';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Home,
  Utensils,
  ShoppingBag,
  Wallet,
  Repeat,
  HeartPulse,
  PiggyBank,
  Tag,
} from 'lucide-react';
import Card from '../common/Card';

const ICON_MAP = {
  'home': Home,
  'trending-up': TrendingUp,
  'piggy-bank': PiggyBank,
  'repeat': Repeat,
  'wallet': Wallet,
  'utensils': Utensils,
  'shopping-bag': ShoppingBag,
  'heart-pulse': HeartPulse,
  'tag': Tag,
};

function TrendIcon({ trend }) {
  if (trend === 'up') return <TrendingUp className="h-4 w-4 text-emerald-400" />;
  if (trend === 'down') return <TrendingDown className="h-4 w-4 text-rose-400" />;
  return <Minus className="h-4 w-4 text-muted-foreground" />;
}

export default function InsightsCard({ insight, index = 0 }) {
  const Icon = ICON_MAP[insight.icon] || Tag;

  return (
    <Card
      className="animate-slide-up relative overflow-hidden"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Background glow */}
      <div
        className="absolute -top-6 -right-6 h-24 w-24 rounded-full opacity-15 blur-2xl pointer-events-none"
        style={{ background: insight.color }}
      />

      <div className="flex items-start gap-4">
        {/* Icon */}
        <div
          className="h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
          style={{ background: insight.color + '20' }}
        >
          <Icon className="h-5 w-5" style={{ color: insight.color }} />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-muted-foreground mb-0.5">{insight.title}</p>
          <div className="flex items-center gap-2 mb-1">
            <p className="text-xl font-bold text-foreground tracking-tight truncate">
              {insight.value}
            </p>
            <TrendIcon trend={insight.trend} />
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">{insight.detail}</p>
        </div>
      </div>
    </Card>
  );
}
