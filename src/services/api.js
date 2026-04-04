/**
 * Base API utility — simulates async fetch with configurable delay.
 * For GitHub Pages deployment, all data operations are client-side only.
 */

const SIMULATED_DELAY = 600; // ms

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Simulate a fetch from a JSON file in public/mock-api.
 * @param {string} url The relative URL to the mock JSON.
 */
export const fetchMock = async (url) => {
  await sleep(SIMULATED_DELAY);
  try {
    const response = await fetch(import.meta.env.BASE_URL + url);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Mock fetch failed:', error);
    throw error;
  }
};
