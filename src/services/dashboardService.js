import { fetchMock } from './api';

export const getSummary = () =>
  fetchMock('mock-api/dashboard/summary.json');

export const getBalanceTrend = () =>
  fetchMock('mock-api/dashboard/balanceTrend.json');

export const getCategoryBreakdown = () =>
  fetchMock('mock-api/dashboard/categoryBreakdown.json');
