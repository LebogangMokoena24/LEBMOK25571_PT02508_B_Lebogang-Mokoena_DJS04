/**
 * @fileoverview App — root component of the Podwave podcast discovery app.
 *
 * Responsibilities:
 * - Wrapping the full component tree in PodcastProvider (context + data fetching)
 * - Rendering the structural layout: Header, controls bar, main content, footer
 * - Conditionally rendering loading and error states sourced from context
 * - Composing SearchBar, GenreFilter, SortSelect, PodcastGrid, and Pagination
 *
 * AppShell is separated from PodcastProvider so that usePodcasts() hooks
 * can be called inside the same component tree that provides the context.
 *
 * @module App
 */

import React from 'react';
import { PodcastProvider, usePodcasts } from './context/PodcastContext.jsx';
import Header from './components/Header.jsx';
import SearchBar from './components/SearchBar.jsx';
import GenreFilter from './components/GenreFilter.jsx';
import SortSelect from './components/SortSelect.jsx';
import PodcastGrid from './components/PodcastGrid.jsx';
import Pagination from './components/Pagination.jsx';
import './App.css';

/**
 * Inner application shell that consumes PodcastContext.
 * Kept separate from the Provider so hooks work correctly inside the tree.
 *
 * @returns {JSX.Element}
 */
function AppShell() {
  const { loading, error } = usePodcasts();

  return (
    <>
      <Header />

      <main>
        {/* Controls bar — rendered even during load so state is never lost */}
        <section className="controls" aria-label="Search and filter controls">
          <SearchBar />
          <GenreFilter />
          <SortSelect />
        </section>

        {loading && (
          <div className="message-container" role="status" aria-live="polite">
            <div className="spinner" aria-hidden="true">
              <span /><span /><span />
            </div>
            <p className="message-container__text">Tuning in to the feed…</p>
          </div>
        )}

        {error && (
          <div
            className="message-container message-container--error"
            role="alert"
          >
            <span className="message-container__icon" aria-hidden="true">⚠</span>
            <p className="message-container__text">
              Error loading podcasts: {error}
            </p>
          </div>
        )}

        {!loading && !error && (
          <>
            <PodcastGrid />
            <Pagination />
          </>
        )}
      </main>

      <footer className="footer">
        <p>◈ Podwave — built with React</p>
      </footer>
    </>
  );
}

/**
 * Root application component.
 * Wraps the full tree in PodcastProvider to supply centralised state.
 *
 * @returns {JSX.Element}
 */
export default function App() {
  return (
    <PodcastProvider>
      <AppShell />
    </PodcastProvider>
  );
}
