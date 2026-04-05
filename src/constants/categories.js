export const CATEGORIES = [
  { id: 'Housing',      label: 'Housing',      color: '#6366f1', bgColor: 'rgba(99,102,241,0.15)',  icon: 'home' },
  { id: 'Food & Drink', label: 'Food & Drink', color: '#34d399', bgColor: 'rgba(52,211,153,0.15)',  icon: 'utensils' },
  { id: 'Groceries',    label: 'Groceries',    color: '#fbbf24', bgColor: 'rgba(251,191,36,0.15)',  icon: 'shopping-basket' },
  { id: 'Shopping',     label: 'Shopping',     color: '#f472b6', bgColor: 'rgba(244,114,182,0.15)', icon: 'shopping-bag' },
  { id: 'Transport',    label: 'Transport',    color: '#60a5fa', bgColor: 'rgba(96,165,250,0.15)',  icon: 'car' },
  { id: 'Entertainment',label: 'Entertainment',color: '#a78bfa', bgColor: 'rgba(167,139,250,0.15)', icon: 'gamepad-2' },
  { id: 'Health',       label: 'Health',       color: '#fb7185', bgColor: 'rgba(251,113,133,0.15)', icon: 'heart-pulse' },
  { id: 'Utilities',    label: 'Utilities',    color: '#2dd4bf', bgColor: 'rgba(45,212,191,0.15)',  icon: 'zap' },
  { id: 'Investments',  label: 'Investments',  color: '#f59e0b', bgColor: 'rgba(245,158,11,0.15)',  icon: 'trending-up' },
  { id: 'Education',    label: 'Education',    color: '#8b5cf6', bgColor: 'rgba(139,92,246,0.15)',  icon: 'graduation-cap' },
  { id: 'Miscellaneous',label: 'Miscellaneous',color: '#94a3b8', bgColor: 'rgba(148,163,184,0.15)', icon: 'more-horizontal' },
  { id: 'Income',       label: 'Income',       color: '#34d399', bgColor: 'rgba(52,211,153,0.15)',  icon: 'wallet' },
  { id: 'Salary',       label: 'Salary',       color: '#10b981', bgColor: 'rgba(16,185,129,0.15)',  icon: 'banknote' },
];

export const getCategoryMeta = (categoryId) => {
  return CATEGORIES.find((c) => c.id === categoryId) || {
    id: categoryId,
    label: categoryId,
    color: '#94a3b8',
    bgColor: 'rgba(148,163,184,0.15)',
    icon: 'tag',
  };
};

export const TRANSACTION_TYPES = [
  { id: 'income',  label: 'Income',  color: '#34d399' },
  { id: 'expense', label: 'Expense', color: '#fb7185' },
];
