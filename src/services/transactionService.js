import { fetchApi } from './api';

export const getTransactions = async () => {
  return await fetchApi('/transactions');
};

export const addTransaction = async (transaction) => {
  return await fetchApi('/transactions', {
    method: 'POST',
    body: JSON.stringify(transaction),
  });
};

export const updateTransaction = async (id, updates) => {
  return await fetchApi(`/transactions/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  });
};

export const deleteTransaction = async (id) => {
  await fetchApi(`/transactions/${id}`, {
    method: 'DELETE',
  });
  return true;
};
