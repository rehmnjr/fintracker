import { useMemo } from 'react';
import { useApp } from '../context/AppContext';

/**
 * Get a grouping key for a transaction based on the selected groupBy field.
 */
const getGroupKey = (txn, groupBy) => {
  switch (groupBy) {
    case 'category':
      return txn.category;
    case 'type':
      return txn.type.charAt(0).toUpperCase() + txn.type.slice(1);
    case 'month': {
      const d = new Date(txn.date);
      return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
    }
    default:
      return null;
  }
};

export function useTransactions() {
  const { transactions, filters } = useApp();

  const filtered = useMemo(() => {
    let list = [...transactions];

    // Search
    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        (t) =>
          t.description.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q) ||
          (t.note || '').toLowerCase().includes(q)
      );
    }

    // Category filter
    if (filters.category !== 'all') {
      list = list.filter((t) => t.category === filters.category);
    }

    // Type filter
    if (filters.type !== 'all') {
      list = list.filter((t) => t.type === filters.type);
    }

    // Sort
    list.sort((a, b) => {
      let valA = a[filters.sortBy];
      let valB = b[filters.sortBy];

      if (filters.sortBy === 'date') {
        valA = new Date(valA);
        valB = new Date(valB);
      } else if (filters.sortBy === 'amount') {
        valA = Number(valA);
        valB = Number(valB);
      } else {
        valA = String(valA).toLowerCase();
        valB = String(valB).toLowerCase();
      }

      if (valA < valB) return filters.sortDir === 'asc' ? -1 : 1;
      if (valA > valB) return filters.sortDir === 'asc' ? 1 : -1;
      return 0;
    });

    return list;
  }, [transactions, filters]);

  // Group transactions by the selected field
  const grouped = useMemo(() => {
    if (!filters.groupBy || filters.groupBy === 'none') return null;

    const groups = {};
    filtered.forEach((txn) => {
      const key = getGroupKey(txn, filters.groupBy);
      if (!groups[key]) groups[key] = [];
      groups[key].push(txn);
    });

    // Sort groups alphabetically (or chronologically for months)
    const sortedEntries = Object.entries(groups).sort(([a], [b]) => {
      if (filters.groupBy === 'month') {
        return new Date(b) - new Date(a); // newest first
      }
      return a.localeCompare(b);
    });

    return sortedEntries;
  }, [filtered, filters.groupBy]);

  const totalIncome = useMemo(
    () => transactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0),
    [transactions]
  );

  const totalExpenses = useMemo(
    () => transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0),
    [transactions]
  );

  return { filtered, grouped, totalIncome, totalExpenses };
}
