import React, { useState } from 'react';
import { ChevronUp, ChevronDown, ChevronsUpDown, Pencil, Trash2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useTransactions } from '../../hooks/useTransactions';
import { useRole } from '../../hooks/useRole';
import { formatCurrency, formatDate } from '../../utils/formatCurrency';
import { getCategoryMeta } from '../../constants/categories';
import EmptyState from '../common/EmptyState';
import { SkeletonRow } from '../common/Loader';

const COLUMNS = [
  { key: 'date',        label: 'Date',        sortable: true  },
  { key: 'description', label: 'Description', sortable: true  },
  { key: 'category',    label: 'Category',    sortable: true  },
  { key: 'type',        label: 'Type',        sortable: true  },
  { key: 'amount',      label: 'Amount',      sortable: true  },
  { key: 'actions',     label: '',            sortable: false },
];

const PAGE_SIZE = 10;

function SortIcon({ column, sortBy, sortDir }) {
  if (column !== sortBy) return <ChevronsUpDown className="h-3 w-3 opacity-30" />;
  return sortDir === 'asc'
    ? <ChevronUp className="h-3 w-3 text-brand-400" />
    : <ChevronDown className="h-3 w-3 text-brand-400" />;
}

export default function TransactionTable({ onEdit, loading }) {
  const { filters, updateFilters, handleDeleteTransaction } = useApp();
  const { filtered } = useTransactions();
  const { can } = useRole();
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleSort = (key) => {
    if (!key) return;
    if (filters.sortBy === key) {
      updateFilters({ sortDir: filters.sortDir === 'asc' ? 'desc' : 'asc' });
    } else {
      updateFilters({ sortBy: key, sortDir: 'desc' });
    }
    setPage(1);
  };

  const handleDelete = async (id) => {
    try {
      if (!window.confirm('Are you sure you want to delete this transaction?')) return;
      await handleDeleteTransaction(id);
    } catch (err) {
      console.error('Failed to delete transaction:', err);
      alert('Failed to delete transaction. Please try again.');
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Table */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.07)',
          backdropFilter: 'blur(20px)',
        }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                {COLUMNS.map((col) => (
                  <th
                    key={col.key}
                    className={`px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground ${
                      col.sortable ? 'cursor-pointer select-none hover:text-foreground' : ''
                    }`}
                    onClick={() => col.sortable && handleSort(col.key)}
                  >
                    <div className="flex items-center gap-1">
                      {col.label}
                      {col.sortable && (
                        <SortIcon column={col.key} sortBy={filters.sortBy} sortDir={filters.sortDir} />
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={6}><SkeletonRow /></td>
                  </tr>
                ))
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan={6}>
                    <EmptyState
                      title="No transactions found"
                      description="Try adjusting your search or filters to find what you're looking for."
                    />
                  </td>
                </tr>
              ) : (
                paginated.map((txn) => {
                  const cat = getCategoryMeta(txn.category);
                  const isIncome = txn.type === 'income';
                  return (
                    <tr
                      key={txn.id}
                      className="table-row-hover animate-fade-in"
                      style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                    >
                      {/* Date */}
                      <td className="px-5 py-3.5 text-muted-foreground text-xs whitespace-nowrap">
                        {formatDate(txn.date)}
                      </td>

                      {/* Description */}
                      <td className="px-5 py-3.5">
                        <div>
                          <p className="text-foreground font-medium">{txn.description}</p>
                          {txn.note && (
                            <p className="text-muted-foreground text-xs mt-0.5">{txn.note}</p>
                          )}
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-5 py-3.5">
                        <span
                          className="badge text-xs"
                          style={{
                            background: cat.bgColor,
                            color: cat.color,
                          }}
                        >
                          {txn.category}
                        </span>
                      </td>

                      {/* Type */}
                      <td className="px-5 py-3.5">
                        <span
                          className={`badge text-xs capitalize ${
                            isIncome
                              ? 'bg-emerald-500/15 text-emerald-400'
                              : 'bg-rose-500/15 text-rose-400'
                          }`}
                        >
                          {txn.type}
                        </span>
                      </td>

                      {/* Amount */}
                      <td className="px-5 py-3.5 font-semibold whitespace-nowrap">
                        <span className={isIncome ? 'text-emerald-400' : 'text-rose-400'}>
                          {isIncome ? '+' : '-'}{formatCurrency(txn.amount)}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3.5">
                        {can('edit') && (
                          <div className="flex items-center gap-1">
                            <button
                              id={`edit-${txn.id}`}
                              onClick={() => onEdit(txn)}
                              className="h-7 w-7 rounded-lg flex items-center justify-center transition-all hover:bg-brand-500/20 text-muted-foreground hover:text-brand-400"
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </button>
                            <button
                              id={`delete-${txn.id}`}
                              onClick={() => handleDelete(txn.id)}
                              className="h-7 w-7 rounded-lg flex items-center justify-center transition-all hover:bg-rose-500/20 text-muted-foreground hover:text-rose-400"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm">
          <p className="text-xs text-muted-foreground">
            Showing {Math.min((page - 1) * PAGE_SIZE + 1, filtered.length)}–
            {Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
          </p>
          <div className="flex items-center gap-1">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="btn-ghost py-1.5 px-3 text-xs disabled:opacity-30"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
              .map((p, idx, arr) => (
                <React.Fragment key={p}>
                  {idx > 0 && arr[idx - 1] !== p - 1 && (
                    <span className="text-muted-foreground px-1">…</span>
                  )}
                  <button
                    onClick={() => setPage(p)}
                    className={`h-8 w-8 rounded-lg text-xs font-medium transition-all ${
                      p === page
                        ? 'bg-brand-500/20 text-brand-300 border border-brand-500/30'
                        : 'btn-ghost py-1.5 px-2'
                    }`}
                  >
                    {p}
                  </button>
                </React.Fragment>
              ))}
            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="btn-ghost py-1.5 px-3 text-xs disabled:opacity-30"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
