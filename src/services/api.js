/**
 * Base API utility — simulates async fetch with configurable delay.
 */

const SIMULATED_DELAY = 600; // ms

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const BASE_URL = 'http://localhost:3001/api';

/**
 * Simulate a fetch from a JSON module.
 * param {() => Promise<any>} importFn  Dynamic import promise factory
 */
export const fetchMock = async (importFn) => {
  await sleep(SIMULATED_DELAY);
  const module = await importFn();
  return module.default ?? module;
};

/**
 * Real fetch from our mock API server.
 */
export const fetchApi = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};
