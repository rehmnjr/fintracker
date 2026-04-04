import { getCategoryMeta } from '../constants/categories';

/**
 * Calculate insights from raw transaction data.
 */

export const calculateSummary = (transactions) => {
  const income = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const expenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = income - expenses;
  const savingsRate = income > 0 ? ((income - expenses) / income) * 100 : 0;

  return { income, expenses, balance, savingsRate };
};

export const getCategoryTotals = (transactions) => {
  const map = {};
  transactions
    .filter((t) => t.type === 'expense')
    .forEach((t) => {
      map[t.category] = (map[t.category] || 0) + t.amount;
    });
  return map;
};

export const getTopCategory = (transactions) => {
  const totals = getCategoryTotals(transactions);
  const sorted = Object.entries(totals).sort((a, b) => b[1] - a[1]);
  if (!sorted.length) return null;
  const [category, amount] = sorted[0];
  return { category, amount };
};

export const getMonthlySummary = (transactions, monthYear) => {
  const currentMonthTxns = transactions.filter(t => t.date.startsWith(monthYear));
  const current = calculateSummary(currentMonthTxns);

  const [year, month] = monthYear.split('-').map(Number);
  let prevMonth = month - 1;
  let prevYear = year;
  if (prevMonth === 0) {
    prevMonth = 12;
    prevYear -= 1;
  }
  const prevMonthYear = `${prevYear}-${String(prevMonth).padStart(2, '0')}`;
  
  const prevMonthTxns = transactions.filter(t => t.date.startsWith(prevMonthYear));
  const prev = calculateSummary(prevMonthTxns);

  const calcTrend = (curr, old) => {
    if (old === 0 && curr === 0) return 0;
    if (old === 0) return 100;
    return ((curr - old) / Math.abs(old)) * 100;
  };

  return {
    totalBalance: current.balance,
    totalIncome: current.income,
    totalExpenses: current.expenses,
    savingsRate: current.savingsRate,
    balanceTrend: calcTrend(current.balance, prev.balance),
    incomeTrend: calcTrend(current.income, prev.income),
    expensesTrend: calcTrend(current.expenses, prev.expenses),
  };
};

export const getCategoryBreakdownForMonth = (transactions, monthYear) => {
  const currentMonthTxns = transactions.filter(t => t.date.startsWith(monthYear));
  const totals = getCategoryTotals(currentMonthTxns);
  
  const totalExpenses = Object.values(totals).reduce((a, b) => a + b, 0);
  
  const breakdown = Object.entries(totals).map(([category, amount]) => {
    const meta = getCategoryMeta(category);
    return {
      category,
      amount,
      percentage: totalExpenses > 0 ? parseFloat(((amount / totalExpenses) * 100).toFixed(1)) : 0,
      color: meta.color,
    };
  });
  
  return breakdown.sort((a, b) => b.amount - a.amount);
};

export const build12MonthTrend = (transactions, targetMonthYear) => {
  const [y, m] = targetMonthYear.split('-').map(Number);
  const result = [];
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  
  for (let i = 11; i >= 0; i--) {
    let loopMonth = m - i;
    let loopYear = y;
    if (loopMonth <= 0) {
      loopMonth += 12;
      loopYear -= 1;
    }
    const loopMonthStr = String(loopMonth).padStart(2, '0');
    const loopDatePrefix = `${loopYear}-${loopMonthStr}`;
    
    const monthTxns = transactions.filter(t => t.date.startsWith(loopDatePrefix));
    const stats = calculateSummary(monthTxns);
    
    result.push({
      month: monthNames[loopMonth - 1],
      balance: stats.balance,
      income: stats.income,
      expenses: stats.expenses,
    });
  }
  
  return result;
};

export const exportToCSV = (transactions) => {
  const headers = ['Date', 'Description', 'Category', 'Type', 'Amount'];
  const rows = transactions.map((t) => [
    t.date,
    `"${t.description}"`,
    t.category,
    t.type,
    t.type === 'expense' ? `-${t.amount}` : t.amount,
  ]);

  const csvContent = [headers, ...rows].map((r) => r.join(',')).join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `transactions_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const exportToJSON = (transactions) => {
  const data = transactions.map((t) => ({
    date: t.date,
    description: t.description,
    category: t.category,
    type: t.type,
    amount: t.amount,
    note: t.note || '',
  }));

  const jsonContent = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `transactions_${new Date().toISOString().slice(0, 10)}.json`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
