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
  if (!transactions || !monthYear) return null;

  // Monthly stats for the current month
  const currentMonthTxns = transactions.filter((t) => t.date.startsWith(monthYear));
  const monthStats = calculateSummary(currentMonthTxns);

  // Previous month data for trends
  const [year, month] = monthYear.split('-').map(Number);
  let prevMonth = month - 1;
  let prevYear = year;
  if (prevMonth === 0) {
    prevMonth = 12;
    prevYear -= 1;
  }
  const prevMonthYear = `${prevYear}-${String(prevMonth).padStart(2, '0')}`;
  const prevMonthTxns = transactions.filter((t) => t.date.startsWith(prevMonthYear));
  const prevStats = calculateSummary(prevMonthTxns);

  const calcTrend = (curr, old) => {
    if (old === 0 && curr === 0) return 0;
    if (old === 0) return 100;
    return ((curr - old) / Math.abs(old)) * 100;
  };

  return {
    totalBalance: monthStats.balance, // Monthly Net (Income - Expense)
    totalIncome: monthStats.income,
    totalExpenses: monthStats.expenses,
    savingsRate: monthStats.savingsRate,
    balanceTrend: calcTrend(monthStats.balance, prevStats.balance),
    incomeTrend: calcTrend(monthStats.income, prevStats.income),
    expensesTrend: calcTrend(monthStats.expenses, prevStats.expenses),
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
  if (!transactions || !targetMonthYear) return [];

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
    const loopMonthYear = `${loopYear}-${loopMonthStr}`;
    
    const monthTxns = transactions.filter((t) => t.date.startsWith(loopMonthYear));
    const stats = calculateSummary(monthTxns);
    
    result.push({
      month: monthNames[loopMonth - 1],
      balance: stats.balance, // Monthly Net
      income: stats.income,
      expenses: stats.expenses,
    });
  }

  return result;
};

/**
 * Generates dynamic insight items based on the transaction history for a specific month.
 */
export const generateDynamicInsights = (transactions, monthYear) => {
  if (!transactions || transactions.length === 0 || !monthYear) return [];

  const [year, month] = monthYear.split('-').map(Number);
  const currentSummary = getMonthlySummary(transactions, monthYear);
  const monthStats = calculateSummary(transactions.filter(t => t.date.startsWith(monthYear)));
  const topCategory = getTopCategory(transactions.filter(t => t.date.startsWith(monthYear)));
  
  const insights = [];

  // 1. Highest Spending Category
  if (topCategory) {
    const meta = getCategoryMeta(topCategory.category);
    const percentage = monthStats.expenses > 0 ? ((topCategory.amount / monthStats.expenses) * 100).toFixed(1) : 0;
    
    insights.push({
      id: 'insight_dyn_cat',
      type: 'top_category',
      title: 'Highest Spending Category',
      value: topCategory.category,
      detail: `₹${topCategory.amount.toLocaleString()} — ${percentage}% of monthly spending`,
      trend: currentSummary.expensesTrend > 10 ? 'up' : currentSummary.expensesTrend < -10 ? 'down' : 'stable',
      icon: meta.icon || 'home',
      color: meta.color || '#6366f1'
    });
  }

  // 2. Savings Rate Insight
  insights.push({
    id: 'insight_dyn_savings',
    type: 'savings_rate',
    title: 'Savings Ratio',
    value: `${currentSummary.savingsRate.toFixed(1)}%`,
    detail: currentSummary.savingsRate > 25 
      ? "Excellent! You're building a strong financial cushion." 
      : currentSummary.savingsRate > 0 
      ? "Good stability, but try to aim for 20% savings." 
      : "Caution: You spent more than you earned this month.",
    trend: currentSummary.savingsRate > 20 ? 'up' : 'down',
    icon: 'piggy-bank',
    color: currentSummary.savingsRate > 15 ? '#34d399' : '#fb7185'
  });

  // 3. Monthly Change
  insights.push({
    id: 'insight_dyn_trend',
    type: 'monthly_comparison',
    title: 'Spending vs Last Month',
    value: `${currentSummary.expensesTrend > 0 ? '+' : ''}${currentSummary.expensesTrend.toFixed(1)}%`,
    detail: currentSummary.expensesTrend > 0 
      ? 'Your spending has increased compared to last month.' 
      : 'Great job! You reduced your spending this month.',
    trend: currentSummary.expensesTrend > 5 ? 'up' : currentSummary.expensesTrend < -5 ? 'down' : 'stable',
    icon: 'trending-up',
    color: currentSummary.expensesTrend > 0 ? '#fb7185' : '#34d399'
  });

  // 4. Net Position
  insights.push({
    id: 'insight_dyn_net',
    type: 'net_worth',
    title: 'Monthly Net Position',
    value: `₹${currentSummary.totalBalance.toLocaleString()}`,
    detail: `Total profit/loss captured for ${new Date(year, month - 1).toLocaleString('default', { month: 'long' })}.`,
    trend: currentSummary.totalBalance > 0 ? 'up' : 'down',
    icon: 'wallet',
    color: '#6366f1'
  });

  return insights;
};

/**
 * Provides a daily breakdown of income, expenses, and balance for a specific month.
 */
export const getDailyTrendForMonth = (transactions, monthYear) => {
  if (!transactions || !monthYear) return [];

  const [year, month] = monthYear.split('-').map(Number);
  const daysInMonth = new Date(year, month, 0).getDate();
  const monthPrefix = monthYear + '-';

  // Start with 0 balance for the month to show monthly net performance
  let currentBalance = 0;

  // Filter and group current month's transactions by day
  const monthTxns = transactions.filter((t) => t.date.startsWith(monthPrefix));
  const dailyMap = {};

  monthTxns.forEach((t) => {
    const day = parseInt(t.date.split('-')[2], 10);
    if (!dailyMap[day]) dailyMap[day] = { income: 0, expenses: 0 };
    if (t.type === 'income') dailyMap[day].income += t.amount;
    else dailyMap[day].expenses += t.amount;
  });

  // Assemble the daily series
  const series = [];
  for (let d = 1; d <= daysInMonth; d++) {
    const stats = dailyMap[d] || { income: 0, expenses: 0 };
    currentBalance += stats.income - stats.expenses;

    series.push({
      day: String(d).padStart(2, '0'),
      income: stats.income,
      expenses: stats.expenses,
      balance: currentBalance,
    });
  }

  return series;
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
