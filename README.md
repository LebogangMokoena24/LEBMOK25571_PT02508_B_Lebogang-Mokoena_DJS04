# LEBMOK25571_PT02508_B_Lebogang-Mokoena_DJS04
# Podwave — DJS04 React Podcast App

**Project:** DJS04 — Filtering, Sorting, Searching & Pagination

---

## Overview

Podwave is an advanced podcast browsing experience built with React and Vite.
It fetches a live catalogue of podcast shows from the CodeSpace API and allows
users to search, sort, filter by genre, and paginate through results — all in
real time, with all controls kept fully synchronised through a central context.

DJS04 extends the DJS03 landing page with a Context API state layer, four
interactive controls, and a pagination system that respects every active filter.

---

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm run dev

# 3. Build for production
npm run build
```

Requires Node 18+. 

---

## Features

### Search (P3.53–P3.55)
- Live filtering on every keystroke — matches any substring of the podcast title
- Case-insensitive; no full title required
- A ✕ clear button resets only the query, leaving genre and sort unchanged
- Results update immediately without resetting pagination or filters

### Sorting (P3.56–P3.58)
- **Newest first** — sorted by `updated` ISO date, descending
- **Title A–Z** — locale-aware alphabetical
- **Title Z–A** — reverse alphabetical
- Applied after genre and search filters, without resetting them

### Genre Filter (P3.59–P3.61)
- Dropdown populated from the local `data.js` genre map
- "All genres" resets to null, showing the full catalogue
- Persists when navigating between pages or changing sort/search

### Pagination (P3.62–P3.65)
- 12 podcasts per page
- Numbered buttons with smart ellipsis truncation for large page counts
- Previous / Next with disabled state at boundaries
- Resets automatically to page 1 when search, genre, or sort changes
- Hidden when results fit on a single page
- Live summary: "Page X of Y — Z results"

### State Synchronisation (P3.66–P3.69)
- All state lives in `PodcastContext` — one source of truth
- Any combination of search + genre + sort + page produces a consistent result
- User selections persist immediately and survive page navigation
- Context is lifted above all controls; components only read and write via hooks

---

## File Structure

src/

├── api/

│   └── fetchPodcasts.js          # API fetch with error handling

├── components/

│   ├── Header.jsx                # Brand + hero, reads totalAll from context

│   ├── Header.module.css

│   ├── SearchBar.jsx             # Live search input with clear button

│   ├── SearchBar.module.css

│   ├── GenreFilter.jsx           # Genre dropdown

│   ├── GenreFilter.module.css

│   ├── SortSelect.jsx            # Sort order dropdown

│   ├── SortSelect.module.css

│   ├── PodcastCard.jsx           # Individual podcast card

│   ├── PodcastCard.module.css

│   ├── PodcastGrid.jsx           # Responsive card grid + empty state

│   ├── PodcastGrid.module.css

│   ├── Pagination.jsx            # Page navigation with ellipsis

│   └── Pagination.module.css

├── context/

│   └── PodcastContext.jsx        # Central state, derived values, handlers

├── utils/

│   ├── DateUtils.js              # Date formatting helpers

│   ├── FilterUtils.js            # applyFilters and sortPodcasts pure functions

│   └── GenreService.js           # Genre ID → title resolution

├── App.jsx                       # PodcastProvider + AppShell composition

├── App.css                       # Layout, controls bar, spinner, footer

├── data.js                       # Genre definitions from CodeSpace

├── index.css                     # CSS custom properties + reset

└── main.jsx                      # React entry point

