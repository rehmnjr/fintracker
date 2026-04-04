import { fetchMock } from './api';

const LS_KEY = 'fd_transactions';

/**
 * Load transactions: first check localStorage for persisted changes,
 * otherwise fall back to the bundled mock data.
 */
const loadTransactions = async () => {
  const stored = localStorage.getItem(LS_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // Corrupted data — fall back to defaults
      localStorage.removeItem(LS_KEY);
    }
  }
  // Load from public JSON
  return fetchMock('mock-api/transactions/transactions.json');
};

/**
 * Persist current transactions list to localStorage.
 */
const persist = (transactions) => {
  localStorage.setItem(LS_KEY, JSON.stringify(transactions));
};

/**
 * Get all transactions.
 */
export const getTransactions = async () => {
  return await loadTransactions();
};

/**
 * Add a new transaction.
 */
export const addTransaction = async (transaction) => {
  const transactions = await loadTransactions();
  const newTxn = {
    ...transaction,
    id: transaction.id || `txn_${Date.now()}`,
    date: transaction.date || new Date().toISOString().slice(0, 10),
  };
  transactions.unshift(newTxn);
  persist(transactions);
  return newTxn;
};

/**
 * Update a transaction by ID.
 */
export const updateTransaction = async (id, updates) => {
  const transactions = await loadTransactions();
  let updated = null;
  const newList = transactions.map((t) => {
    if (t.id === id) {
      updated = { ...t, ...updates };
      return updated;
    }
    return t;
  });
  if (!updated) throw new Error('Transaction not found');
  persist(newList);
  return updated;
};

/**
 * Delete a transaction by ID.
 */
export const deleteTransaction = async (id) => {
  const transactions = await loadTransactions();
  const filtered = transactions.filter((t) => t.id !== id);
  persist(filtered);
  return true;
};
