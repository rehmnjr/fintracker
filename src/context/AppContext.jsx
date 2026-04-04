import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ROLES } from '../constants/roles';
import { getTransactions } from '../services/transactionService';
import { addTransaction, updateTransaction, deleteTransaction } from '../services/transactionService';

const AppContext = createContext(null);

const LS_KEYS = {
  ROLE: 'fd_role',
  DARK_MODE: 'fd_dark_mode',
  TRANSACTIONS: 'fd_transactions_override',
};

export function AppProvider({ children }) {
  // ─── Role ───────────────────────────────────────────────────────
  const [role, setRole] = useState(
    () => localStorage.getItem(LS_KEYS.ROLE) || ROLES.VIEWER
  );

  // ─── Dark mode ──────────────────────────────────────────────────
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem(LS_KEYS.DARK_MODE) !== 'false'
  );

  // ─── Transactions ───────────────────────────────────────────────
  const [transactions, setTransactions] = useState([]);
  const [txLoading, setTxLoading] = useState(true);

  // ─── Filters ────────────────────────────────────────────────────
  const [filters, setFilters] = useState({
    search: '',
    category: 'all',
    type: 'all',
    sortBy: 'date',
    sortDir: 'desc',
    groupBy: 'none',
  });

  // ─── Persist role ───────────────────────────────────────────────
  useEffect(() => {
    localStorage.setItem(LS_KEYS.ROLE, role);
  }, [role]);

  // ─── Persist dark mode + apply class ────────────────────────────
  useEffect(() => {
    localStorage.setItem(LS_KEYS.DARK_MODE, darkMode);
    const root = document.documentElement;
    if (darkMode) {
      root.classList.remove('light');
    } else {
      root.classList.add('light');
    }
  }, [darkMode]);

  // ─── Load transactions on mount ─────────────────────────────────
  useEffect(() => {
    setTxLoading(true);
    getTransactions()
      .then(setTransactions)
      .finally(() => setTxLoading(false));
  }, []);

  // ─── CRUD helpers ───────────────────────────────────────────────
  const handleAddTransaction = useCallback(async (txn) => {
    const added = await addTransaction(txn);
    setTransactions((prev) => [added, ...prev]);
    return added;
  }, []);

  const handleUpdateTransaction = useCallback(async (id, updates) => {
    const updated = await updateTransaction(id, updates);
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
    return updated;
  }, []);

  const handleDeleteTransaction = useCallback(async (id) => {
    await deleteTransaction(id);
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // ─── Role toggle ─────────────────────────────────────────────────
  const toggleRole = useCallback(() => {
    setRole((r) => (r === ROLES.ADMIN ? ROLES.VIEWER : ROLES.ADMIN));
  }, []);

  const toggleDarkMode = useCallback(() => {
    setDarkMode((d) => !d);
  }, []);

  const updateFilters = useCallback((newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  const isAdmin = role === ROLES.ADMIN;

  return (
    <AppContext.Provider
      value={{
        role,
        isAdmin,
        toggleRole,
        darkMode,
        toggleDarkMode,
        transactions,
        txLoading,
        filters,
        updateFilters,
        handleAddTransaction,
        handleUpdateTransaction,
        handleDeleteTransaction,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
