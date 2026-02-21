# AGENTS.md - SubTracker

## Project Overview

SubTracker is a subscription and bill tracker focused on clear cost visibility. It is a
client-side React SPA with no backend -- all data is persisted in `localStorage`. The main
application code lives in the `app/` directory.

## Tech Stack

- **Language:** JavaScript (JSX) -- no TypeScript
- **Framework:** React 18
- **Bundler:** Vite 4
- **Styling:** Tailwind CSS 3 (with `class`-based dark mode)
- **Package manager:** npm
- **Icons:** Google Material Symbols Outlined (loaded via CDN in `index.html`)
- **Font:** Manrope (loaded via Google Fonts CDN in `index.html`)
- **Module system:** ES Modules (`"type": "module"`)

## Build / Dev / Preview Commands

All commands must be run from the `app/` directory:

```bash
# Install dependencies
cd app && npm install

# Start dev server with HMR
cd app && npm run dev

# Production build (outputs to app/dist/)
cd app && npm run build

# Preview the production build locally
cd app && npm run preview
```

There are **no lint, format, type-check, or test commands** configured. There is no ESLint,
Prettier, TypeScript, Jest, or Vitest setup. If you add any of these, register the commands
in `app/package.json` under `"scripts"`.

## Project Structure

```
subtracker/
  Readme.md                   # Product requirements / spec
  AGENTS.md                   # This file
  app/                        # Main application root
    index.html                # Vite HTML entry (loads Google Fonts + Material Symbols CDN)
    package.json              # Dependencies and scripts
    vite.config.js            # Vite config (React plugin only)
    tailwind.config.js        # Tailwind config (custom colors, Manrope font, dark mode)
    postcss.config.js         # PostCSS (tailwindcss + autoprefixer)
    src/
      main.jsx                # ReactDOM entry point (StrictMode)
      App.jsx                 # Root component -- screen routing via useState
      index.css               # Tailwind directives + global styles
      categories.js           # Category data array + getCategoryById helper
      components/             # Shared components (currently empty)
      context/
        AppContext.jsx         # Single React Context for all app state
      screens/
        Dashboard.jsx         # Home screen: cost cards, subscription list, next payment
        AddSubscription.jsx   # Form to add a new subscription
        Settings.jsx          # Settings: currency selector, notifications toggle, profile
    dist/                     # Production build output (generated)
  mvp/                        # Static HTML mockups used as design reference (read-only)
```

## Architecture & Data Flow

- **State management:** Single React Context (`AppContext`) holds all state: subscriptions
  array, currency selection, computed totals, and CRUD operations. No external state library.
- **Persistence:** `localStorage` with keys `subtracker_subs` (subscriptions array) and
  `subtracker_currency` (currency object). State syncs to localStorage via `useEffect`.
- **Routing:** No router library. `App.jsx` uses `useState('dashboard')` to switch between
  three screens: `dashboard`, `add`, `settings`. Navigation callbacks are passed as props
  (e.g., `onAdd`, `onBack`, `onSaved`).
- **Default data:** 5 sample subscriptions are seeded on first load when localStorage is empty.

## Code Style Guidelines

### File & Component Organization

- One default-exported screen component per file in `screens/`.
- Helper components used only in one screen can be defined in the same file (see
  `SubscriptionItem` in `Dashboard.jsx`, `ToggleSwitch` in `Settings.jsx`).
- Shared/reusable components go in `components/` (currently empty -- extract when reused).
- Data constants and helpers go in standalone `.js` files (see `categories.js`).
- Context providers go in `context/` with a corresponding custom hook export (e.g.,
  `useApp`).

### Imports

- React hooks imported as named imports: `import { useState, useEffect } from 'react'`
- Local imports use relative paths with explicit file extensions omitted:
  `import { useApp } from '../context/AppContext'`
- Import order: React/library imports first, then local context/utils, then local components.
- No aliased import paths are configured (no `@/` prefix).

### Naming Conventions

- **Components:** PascalCase for component names and filenames (`Dashboard.jsx`,
  `AddSubscription.jsx`, `SubscriptionItem`).
- **Non-component JS files:** camelCase (`categories.js`).
- **Constants:** UPPER_SNAKE_CASE for module-level constant arrays/objects (`CATEGORIES`,
  `CURRENCIES`, `DEFAULT_SUBS`).
- **Functions/variables:** camelCase (`addSubscription`, `totalMonthly`, `handleSave`).
- **Event handler props:** `on` + action (`onAdd`, `onBack`, `onSaved`, `onDelete`,
  `onDashboard`, `onSettings`).
- **Event handlers:** `handle` + action (`handleSave`).
- **Context hooks:** `use` + context name (`useApp`).
- **localStorage keys:** prefixed with `subtracker_` (`subtracker_subs`,
  `subtracker_currency`).

### Formatting

- **No semicolons** (except inside JSX expressions like `.toFixed(2)`).
- **Single quotes** for strings.
- **2-space indentation.**
- **Arrow functions** for inline callbacks and simple helpers. Named `function` declarations
  for React components.
- **Trailing commas** in multi-line objects/arrays.
- **Template literals** are not used; string concatenation with `+` or JSX interpolation.

### Styling

- **Tailwind CSS utility classes only** -- no CSS modules, no styled-components, no inline
  `style` props.
- Custom theme tokens defined in `tailwind.config.js`: `primary` (brand blue `#0b50da`),
  `background-light`, `background-dark`, `font-display` (Manrope).
- Use Tailwind's opacity modifier syntax (e.g., `bg-primary/10`, `shadow-primary/30`).
- Material Symbols icons via `<span className="material-symbols-outlined">icon_name</span>`.
  Use the `icon-filled` class for filled icon variant.
- Responsive container: `max-w-md` centered layout simulating a mobile app.

### Error Handling

- `localStorage` reads wrapped in `try/catch` with fallback to defaults.
- Form validation uses local state (`error` string) with inline error messages rendered
  conditionally.
- No global error boundary is configured.

### State Patterns

- `useState` with lazy initializer for localStorage hydration:
  `useState(() => { try { ... } catch { return DEFAULT } })`.
- Computed values (`totalMonthly`, `totalYearly`, `nextPayment`) derived inline in the
  context provider body -- not memoized.
- State updates use functional updater form: `setSubscriptions(prev => [...prev, newSub])`.

## Key Data Models

### Subscription
```js
{
  id: '1',              // string (Date.now().toString() for new items)
  name: 'Netflix',      // string
  cost: 15.99,          // number
  recurrence: 'Monthly', // 'Monthly' | 'Yearly'
  category: 'entertainment', // category id string
  notes: ''             // string
}
```

### Category
```js
{
  id: 'entertainment',  // string identifier
  label: 'Entertainment', // display name
  icon: 'movie',        // Material Symbols icon name
  bg: 'bg-red-100',     // Tailwind background class
  text: 'text-red-600'  // Tailwind text color class
}
```

### Currency
```js
{
  code: 'USD',          // ISO 4217 code
  symbol: '$',          // display symbol
  label: 'USD - US Dollar ($)' // full label for selector
}
```

## Design References

The `mvp/` directory contains static HTML prototypes and screenshots used as the original
design reference. These are read-only and should not be modified. When implementing new UI,
match the existing visual style (rounded corners, card-based layout, Tailwind utility
classes, Material Symbols icons).
