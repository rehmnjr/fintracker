import React from 'react';
import { SearchX } from 'lucide-react';

export default function EmptyState({ title = 'No results', description = 'Try adjusting your filters.' }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-fade-in">
      <div className="rounded-2xl p-5 mb-4" style={{ background: 'rgba(99,102,241,0.1)' }}>
        <SearchX className="h-8 w-8 text-brand-400" />
      </div>
      <p className="text-base font-semibold text-foreground mb-1">{title}</p>
      <p className="text-sm text-muted-foreground max-w-xs">{description}</p>
    </div>
  );
}
