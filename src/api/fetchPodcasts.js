/**
 * @fileoverview API fetching utilities for the Podwave podcast discovery app.
 *
 * Provides a single async function to retrieve all podcast previews from
 * the remote API endpoint. All network error handling is centralised here.
 *
 * @module api/fetchPodcasts
 */

const API_URL = 'https://podcast-api.netlify.app/';

/**
 * Fetches the full list of podcast previews from the remote API.
 *
 * @async
 * @returns {Promise<Array<Object>>} Resolves with an array of podcast preview objects.
 * @throws {Error} Throws if the network request fails or the response is not OK.
 *
 * @example
 * const podcasts = await fetchPodcasts();
 * // → [{ id: '10716', title: 'Something True', seasons: 2, ... }, ...]
 */
export async function fetchPodcasts() {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch podcasts: ${response.status} ${response.statusText}`
    );
  }

  const data = await response.json();
  return data;
}
