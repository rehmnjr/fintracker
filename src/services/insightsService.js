import { fetchMock } from './api';

export const getInsights = () =>
  fetchMock('mock-api/insights/insights.json');
