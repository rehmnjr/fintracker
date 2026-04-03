import { fetchMock } from './api';

export const getInsights = () =>
  fetchMock(() => import('../mock-api/insights/insights.json'));
