import { useMemo } from 'react';
import { useApp } from '../context/AppContext';

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

  const totalIncome = useMemo(
    () => transactions.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0),
    [transactions]
  );

  const totalExpenses = useMemo(
    () => transactions.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0),
    [transactions]
  );

  return { filtered, totalIncome, totalExpenses };
}
