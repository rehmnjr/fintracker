import React, { useState, useRef, useEffect } from 'react';
import { Plus, Download, ChevronDown } from 'lucide-react';
import FilterBar from '../../components/transactions/FilterBar';
import TransactionTable from '../../components/transactions/TransactionTable';
import TransactionForm from '../../components/transactions/TransactionForm';
import { useApp } from '../../context/AppContext';
import { useRole } from '../../hooks/useRole';
import { useTransactions } from '../../hooks/useTransactions';
import { exportToCSV, exportToJSON } from '../../utils/calculateInsights';
import { formatCurrency } from '../../utils/formatCurrency';

export default function TransactionsPage() {
  const { txLoading, transactions } = useApp();
  const { can } = useRole();
  const { filtered, totalIncome, totalExpenses } = useTransactions();

  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [exportOpen, setExportOpen] = useState(false);
  const exportRef = useRef(null);

  // Close export dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (exportRef.current && !exportRef.current.contains(e.target)) {
        setExportOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleEdit = (txn) => {
    setEditData(txn);
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
    setEditData(null);
  };

  return (
    <div className="p-6 space-y-5 animate-fade-in">
      {/* Page header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-widest mb-0.5">
            {filtered.length} Transactions
          </p>
          <h2 className="text-xl font-bold text-foreground">
            Transaction{' '}
            <span className="gradient-text">History</span>
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {/* Export dropdown */}
          <div className="relative" ref={exportRef}>
            <button
              id="export-dropdown-toggle"
              onClick={() => setExportOpen((o) => !o)}
              className="btn-ghost gap-2 text-xs border border-border/50 py-2"
            >
              <Download className="h-3.5 w-3.5" />
              Export
              <ChevronDown className={`h-3 w-3 transition-transform ${exportOpen ? 'rotate-180' : ''}`} />
            </button>

            {exportOpen && (
              <div
                className="absolute right-0 mt-1 w-40 z-30 rounded-xl overflow-hidden glass-card shadow-xl"
                style={{
                  background: 'hsl(var(--card) / 0.95)',
                  backdropFilter: 'blur(20px)',
                }}
              >
                <button
                  id="export-csv"
                  onClick={() => { exportToCSV(filtered); setExportOpen(false); }}
                  className="w-full text-left px-4 py-2.5 text-sm text-foreground hover:bg-foreground/5 transition-colors"
                >
                  📄 Export as CSV
                </button>
                <button
                  id="export-json"
                  onClick={() => { exportToJSON(filtered); setExportOpen(false); }}
                  className="w-full text-left px-4 py-2.5 text-sm text-foreground hover:bg-foreground/5 transition-colors border-t border-border/50"
                >
                  📋 Export as JSON
                </button>
              </div>
            )}
          </div>

          {/* Add transaction (admin only) */}
          {can('add') && (
            <button
              id="add-transaction"
              onClick={() => { setEditData(null); setModalOpen(true); }}
              className="btn-primary text-xs"
            >
              <Plus className="h-4 w-4" />
              Add Transaction
            </button>
          )}
        </div>
      </div>

      {/* Quick stats bar */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total Income', value: formatCurrency(totalIncome), color: '#34d399' },
          { label: 'Total Expenses', value: formatCurrency(totalExpenses), color: '#fb7185' },
          { label: 'Net', value: formatCurrency(totalIncome - totalExpenses), color: '#818cf8' },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl px-4 py-3"
            style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <p className="text-xs text-muted-foreground">{stat.label}</p>
            <p className="text-base font-bold mt-0.5" style={{ color: stat.color }}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Filter bar */}
      <FilterBar />

      {/* Table */}
      <TransactionTable onEdit={handleEdit} loading={txLoading} />

      {/* Modal */}
      <TransactionForm
        open={modalOpen}
        onClose={handleClose}
        editData={editData}
      />
    </div>
  );
}
