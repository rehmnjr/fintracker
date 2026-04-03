import React from 'react';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CATEGORIES, TRANSACTION_TYPES } from '../../constants/categories';

export default function FilterBar() {
  const { filters, updateFilters } = useApp();

  const hasActiveFilters =
    filters.search || filters.category !== 'all' || filters.type !== 'all';

  const clearFilters = () => {
    updateFilters({ search: '', category: 'all', type: 'all' });
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
