import { fetchMock } from './api';

export const getSummary = () =>
  fetchMock(() => import('../mock-api/dashboard/summary.json'));

export const getBalanceTrend = () =>
  fetchMock(() => import('../mock-api/dashboard/balanceTrend.json'));

export const getCategoryBreakdown = () =>
  fetchMock(() => import('../mock-api/dashboard/categoryBreakdown.json'));
