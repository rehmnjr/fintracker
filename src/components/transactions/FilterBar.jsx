import React from 'react';
import { Search, SlidersHorizontal, Layers, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CATEGORIES, TRANSACTION_TYPES } from '../../constants/categories';

const GROUP_OPTIONS = [
  { id: 'none', label: 'No Grouping' },
  { id: 'category', label: 'Category' },
  { id: 'type', label: 'Type' },
  { id: 'month', label: 'Month' },
];

export default function FilterBar() {
  const { filters, updateFilters } = useApp();

  const hasActiveFilters =
    filters.search || filters.category !== 'all' || filters.type !== 'all' || filters.groupBy !== 'none';

  const clearFilters = () => {
    updateFilters({ search: '', category: 'all', type: 'all', groupBy: 'none' });
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Search */}
      <div className="relative flex-1 min-w-48">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <input
          id="search-transactions"
          type="text"
          placeholder="Search transactions..."
          value={filters.search}
          onChange={(e) => updateFilters({ search: e.target.value })}
          className="glass-input w-full pl-9"
        />
      </div>

      {/* Category filter */}
      <div className="relative">
        <select
          id="filter-category"
          value={filters.category}
          onChange={(e) => updateFilters({ category: e.target.value })}
          className="glass-input appearance-none pr-8 cursor-pointer"
        >
          <option value="all">All Categories</option>
          {CATEGORIES.filter((c) => c.id !== 'Income').map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.label}
            </option>
          ))}
        </select>
        <SlidersHorizontal className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
      </div>

      {/* Type filter */}
      <div className="relative">
        <select
          id="filter-type"
          value={filters.type}
          onChange={(e) => updateFilters({ type: e.target.value })}
          className="glass-input appearance-none pr-8 cursor-pointer"
        >
          <option value="all">All Types</option>
          {TRANSACTION_TYPES.map((t) => (
            <option key={t.id} value={t.id}>
              {t.label}
            </option>
          ))}
        </select>
        <SlidersHorizontal className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
      </div>

      {/* Group by */}
      <div className="relative">
        <select
          id="filter-group-by"
          value={filters.groupBy}
          onChange={(e) => updateFilters({ groupBy: e.target.value })}
          className="glass-input appearance-none pr-8 cursor-pointer"
        >
          {GROUP_OPTIONS.map((opt) => (
            <option key={opt.id} value={opt.id}>
              {opt.label}
            </option>
          ))}
        </select>
        <Layers className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
      </div>

      {/* Clear filters */}
      {hasActiveFilters && (
        <button
          id="clear-filters"
          onClick={clearFilters}
          className="btn-ghost gap-1.5 text-xs py-2"
        >
          <X className="h-3.5 w-3.5" />
          Clear
        </button>
      )}
    </div>
  );
}

