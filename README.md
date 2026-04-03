# FinanceIQ — Personal Finance Dashboard

> A modern, responsive personal finance dashboard built with React, featuring a stunning "liquid glass" dark UI, role-based access control, interactive data visualizations, and full transaction management.

![Tech Stack](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3-06B6D4?style=flat-square&logo=tailwindcss)
![Recharts](https://img.shields.io/badge/Recharts-3-FF6384?style=flat-square)
![React Router](https://img.shields.io/badge/React_Router-7-CA4245?style=flat-square&logo=reactrouter)

---

## Table of Contents

- [Overview](#-overview)
- [Live Features](#-live-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Pages & Components](#-pages--components)
  - [Dashboard](#-dashboard-page)
  - [Transactions](#-transactions-page)
  - [Insights](#-insights-page)
- [Architecture](#-architecture)
  - [State Management](#state-management--appcontext)
  - [Mock API Layer](#mock-api-layer)
  - [Role-Based Access Control](#role-based-access-control-rbac)
  - [Custom Hooks](#custom-hooks)
  - [Utility Functions](#utility-functions)
- [Layout & Navigation](#-layout--navigation)
- [Design System](#-design-system)
- [Responsiveness](#-responsiveness)
- [Getting Started](#-getting-started)

---

## 🌟 Overview

FinanceIQ is a full-featured, single-page personal finance application. It simulates a real-world dashboard experience — with async data loading, optimistic UI updates, client-side filtering and sorting, and a polished visual design — all without a backend. Data is served from a structured mock API layer and persisted to `localStorage`.

The app is designed to demonstrate production-level React patterns including Context API for global state, custom hooks for derived data, a service layer for async data fetching, and role-based permissions that gate UI features.

---

## ✨ Live Features

| Feature | Description |
|---|---|
| 📊 Dashboard overview | KPI cards with trend indicators, balance timeline chart, category breakdown donut chart |
| 💳 Transaction management | Full CRUD — add, edit, delete transactions (Admin only) |
| 🔍 Search & filter | Real-time search by description/category/note, filter by type and category |
| ↕️ Sortable table | Click any column header to sort ascending/descending |
| 📥 CSV export | Download filtered transactions as a `.csv` file |
| 🔐 Role-based access | Admin can add/edit/delete; Viewer gets read-only mode |
| 🌙 Dark / Light mode | Toggle with persistence via `localStorage` |
| 📱 Fully responsive | Desktop sidebar, tablet/mobile hamburger drawer |
| ⚡ Shimmer skeletons | Loading states for all async data sections |
| 💡 AI-style Insights | Automated spending analysis cards with 6-month bar chart |

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [React 19](https://react.dev) |
| **Build tool** | [Vite 8](https://vitejs.dev) |
| **Routing** | [React Router v7](https://reactrouter.com) |
| **Styling** | [Tailwind CSS v3](https://tailwindcss.com) + custom CSS |
| **Charts** | [Recharts v3](https://recharts.org) |
| **Icons** | [Lucide React](https://lucide.dev) |
| **UI Primitives** | [Radix UI](https://radix-ui.com) (Dialog, Select, Dropdown, Tooltip, Label) |
| **Fonts** | [Inter](https://fonts.google.com/specimen/Inter) via Google Fonts |
| **Persistence** | Browser `localStorage` |

---

## 📁 Project Structure

```
finance-dashboard/
├── public/
├── src/
│   ├── app/
│   │   ├── layout.jsx          # Root layout — sidebar + navbar + outlet
│   │   └── router.jsx          # Route definitions
│   ├── components/
│   │   ├── common/
│   │   │   ├── Card.jsx        # Glass-morphism card wrapper
│   │   │   ├── EmptyState.jsx  # Empty state illustration + message
│   │   │   └── Loader.jsx      # Shimmer skeleton components
│   │   ├── dashboard/
│   │   │   ├── SummaryCards.jsx   # 4 KPI metric cards
│   │   │   ├── BalanceChart.jsx   # Area chart — balance over time
│   │   │   └── CategoryChart.jsx  # Donut chart — spending by category
│   │   ├── transactions/
│   │   │   ├── TransactionTable.jsx  # Sortable table with edit/delete
│   │   │   ├── TransactionForm.jsx   # Add/Edit modal form (Radix Dialog)
│   │   │   └── FilterBar.jsx         # Search + filter controls
│   │   ├── insights/
│   │   │   └── InsightsCard.jsx  # Individual insight card
│   │   └── layout/
│   │       ├── Sidebar.jsx    # Responsive sidebar (desktop + mobile drawer)
│   │       └── Navbar.jsx     # Top navbar with hamburger, theme toggle, user
│   ├── context/
│   │   └── AppContext.jsx     # Global state — role, dark mode, transactions, filters
│   ├── constants/
│   │   └── roles.js           # ROLES enum: ADMIN | VIEWER
│   ├── hooks/
│   │   ├── useTransactions.js # Derived filtered/sorted transactions + totals
│   │   └── useRole.js         # Permission check helper — can('add'), can('delete')
│   ├── mock-api/
│   │   ├── transactions/      # JSON data for 30 seed transactions
│   │   ├── dashboard/         # JSON data for summary KPIs + balance trend
│   │   └── insights/          # JSON data for AI insight cards
│   ├── services/
│   │   ├── api.js               # Base async mock with configurable delay (600ms)
│   │   ├── transactionService.js # CRUD ops — get/add/update/delete
│   │   ├── dashboardService.js   # getSummary, getBalanceTrend, getCategoryBreakdown
│   │   └── insightsService.js    # getInsights
│   ├── pages/
│   │   ├── dashboard/DashboardPage.jsx
│   │   ├── transactions/TransactionsPage.jsx
│   │   └── insights/InsightsPage.jsx
│   ├── utils/
│   │   ├── formatCurrency.js   # Intl currency, compact format, date, trend %
│   │   └── calculateInsights.js # Summary calc, category totals, CSV export
│   ├── styles/
│   │   └── globals.css         # Design tokens, glass-card, animations, scrollbar
│   └── main.jsx                # App entry — wraps in AppProvider + BrowserRouter
├── tailwind.config.js
├── vite.config.js
└── package.json
```

---

## 📄 Pages & Components

### 🏠 Dashboard Page

**Route:** `/dashboard`

The main overview screen. Loads three datasets in parallel on mount using `Promise.all`, with a manual **Refresh** button for re-fetching.

#### Summary Cards (`SummaryCards.jsx`)
Four KPI cards at the top of the page:

| Card | Data |
|---|---|
| 💰 Total Balance | Net of all income minus expenses |
| 📈 Monthly Income | Total income for the period |
| 📉 Monthly Expenses | Total expenses for the period |
| 💾 Savings Rate | `(income - expenses) / income × 100` |

Each card shows a **trend indicator** (↑ / ↓) with a coloured percentage. Cards use the `glass-card` style with a glow effect and a `skeleton` shimmer while loading.

#### Balance Chart (`BalanceChart.jsx`)
- **Chart type:** Recharts `AreaChart`
- **Data:** 12-month balance trend (from `dashboardService.getBalanceTrend`)
- **Features:** Gradient fill under the line, custom branded tooltip, animated entry, responsive container
- Shows a shimmer skeleton while loading

#### Category Chart (`CategoryChart.jsx`)
- **Chart type:** Recharts `PieChart` (donut variant)
- **Data:** Spending broken down by category (from `dashboardService.getCategoryBreakdown`)
- **Features:** Custom legend with colour swatches and amounts, branded tooltip, centre label showing total
- Shows a shimmer skeleton while loading

---

### 💳 Transactions Page

**Route:** `/transactions`

The core data-management page. Loads all transactions from the mock API on mount (via `AppContext`), then performs all filtering/sorting **client-side** in real time using the `useTransactions` hook.

#### Quick Stats Bar
A 3-column stat row showing total income, total expenses, and net balance derived from the **full** (unfiltered) transaction list.

#### Filter Bar (`FilterBar.jsx`)
Three real-time controls wired to `AppContext.filters`:

| Control | Function |
|---|---|
| 🔍 Search input | Fuzzy match on description, category, and note |
| 📂 Category dropdown | Filter to a single category (Groceries, Transport, Entertainment, etc.) |
| 🔀 Type dropdown | Filter to Income or Expense only |

#### Transaction Table (`TransactionTable.jsx`)
A full-featured sortable data table:

- **Columns:** Date, Description + note, Category badge, Type badge, Amount, Actions
- **Sorting:** Click any column header to sort; click again to reverse direction. Arrow indicators show active sort and direction.
- **Colours:** Income amounts shown in green, expense amounts in red/pink
- **Actions (Admin only):**
  - ✏️ **Edit** — opens `TransactionForm` modal pre-filled with the transaction data
  - 🗑️ **Delete** — removes with optimistic UI update
- Shows a spinner skeleton while loading
- Shows `EmptyState` when no results match the filters

#### Transaction Form (`TransactionForm.jsx`)
A **Radix UI Dialog** modal that handles both Add and Edit modes:

- **Fields:** Description, Amount, Date, Category (select), Type (income/expense), Note (optional textarea)
- **Validation:** Required fields highlighted, amount must be a positive number
- **Behaviour:** On submit, calls `handleAddTransaction` or `handleUpdateTransaction` from context, then closes
- Only accessible to **Admin** role users

#### CSV Export
The **Export CSV** button calls `exportToCSV(filtered)` — it exports only the currently **filtered** set of transactions (not all), so what you see is what you get in the downloaded file.

---

### 💡 Insights Page

**Route:** `/insights`

An analytics and intelligence page that gives a high-level understanding of spending habits.

#### Insight Cards (`InsightsCard.jsx`)
A responsive grid (1 col → 2 col → 3 col) of AI-style analysis cards. Each card contains:
- An **icon** with a coloured glow background
- A **title** (e.g. "Top Spending Category", "Budget Health")
- A **description** paragraph
- A **trend indicator** badge showing percentage change
- **Severity level** (good / warning / alert) that controls border and glow colour

6 insight cards are served from `mock-api/insights/` and load asynchronously with shimmer skeletons.

#### Monthly Comparison Bar Chart
A 6-month side-by-side `BarChart` (Recharts) comparing:
- 🟢 **Income** (green bars)
- 🔴 **Expenses** (red/pink bars)
- Custom tooltip, no grid lines on the Y-axis, compact `₹Xk` tick labels

#### Savings Summary Banner
A gradient card at the bottom showing:
- **Monthly Net Savings** in large gradient text (live from `useTransactions`)
- **Savings Rate %** — calculated as `(income - expenses) / income`
- **Total transactions tracked** count

---

## 🏗 Architecture

### State Management — `AppContext`

All global application state lives in a single React Context (`src/context/AppContext.jsx`). This avoids prop-drilling and allows any component in the tree to read or mutate state via the `useApp()` hook.

**State managed:**

| State | Type | Persisted |
|---|---|---|
| `role` | `'admin' \| 'viewer'` | `localStorage` |
| `darkMode` | `boolean` | `localStorage` |
| `transactions` | `Transaction[]` | In-memory (seeded from mock API) |
| `txLoading` | `boolean` | — |
| `filters` | `{ search, category, type, sortBy, sortDir }` | In-memory |

**Actions exposed:**

| Action | Description |
|---|---|
| `toggleRole()` | Switches between Admin and Viewer |
| `toggleDarkMode()` | Toggles dark/light theme and applies `light` class to `<html>` |
| `updateFilters(patch)` | Merges partial filter updates |
| `handleAddTransaction(data)` | Calls service, prepends to state |
| `handleUpdateTransaction(id, updates)` | Calls service, patches in state |
| `handleDeleteTransaction(id)` | Calls service, removes from state |

---

### Mock API Layer

The app has no real backend. All data lives in `src/mock-api/` as JSON files, served via dynamic imports with a simulated 600ms network delay (`src/services/api.js`).

```
fetchMock(importFn)
  └── await sleep(600ms)          # simulates network latency
  └── dynamic import of JSON file # returns module.default
```

**Service functions:**

| Service | Functions |
|---|---|
| `transactionService.js` | `getTransactions()`, `addTransaction()`, `updateTransaction()`, `deleteTransaction()` |
| `dashboardService.js` | `getSummary()`, `getBalanceTrend()`, `getCategoryBreakdown()` |
| `insightsService.js` | `getInsights()` |

Mutations (add/update/delete) operate on an in-memory array that is initialised from the JSON seed on first load — **data resets on page refresh**, which is the expected behaviour for a mock API.

---

### Role-Based Access Control (RBAC)

Two roles are defined in `src/constants/roles.js`:

| Role | Permissions |
|---|---|
| `admin` | `view`, `add`, `edit`, `delete`, `export` |
| `viewer` | `view`, `export` |

The `useRole()` hook exposes a `can(action)` function that components use to conditionally render:

```jsx
const { can } = useRole();

// Add transaction button — only visible to admin
{can('add') && <button>Add Transaction</button>}

// Delete icon — only visible to admin
{can('delete') && <button onClick={handleDelete}>Delete</button>}
```

The active role is shown as a badge in both the Navbar and the Sidebar, and can be toggled at any time via the **role switcher** card in the sidebar (or sidebar role toggle area). The selection is persisted in `localStorage`.

---

### Custom Hooks

#### `useTransactions()`
Subscribes to `transactions` and `filters` from context, and returns derived data via `useMemo`:

| Return value | Description |
|---|---|
| `filtered` | Transactions after applying search, category, type filters and sort |
| `totalIncome` | Sum of all income transactions (unfiltered) |
| `totalExpenses` | Sum of all expense transactions (unfiltered) |

All computations are memoized — they only recompute when `transactions` or `filters` actually change.

#### `useRole()`
A thin convenience hook over `useApp()` that also provides the `can(action)` permission checker. Keeps permission logic out of components.

---

### Utility Functions

#### `formatCurrency.js`
| Function | Example Output |
|---|---|
| `formatCurrency(1234.5)` | `₹1,234.50` |
| `formatCompactCurrency(24600)` | `₹24.6K` |
| `formatDate('2024-03-28')` | `Mar 28, 2024` |
| `formatTrend(5.3)` | `+5.3%` |

#### `calculateInsights.js`
| Function | Description |
|---|---|
| `calculateSummary(transactions)` | Returns `{ income, expenses, balance, savingsRate }` |
| `getCategoryTotals(transactions)` | Returns `{ category: totalAmount }` map |
| `getTopCategory(transactions)` | Returns the highest-spending category and its total |
| `exportToCSV(transactions)` | Generates and triggers a `.csv` file download in the browser |

---

## 🗺 Layout & Navigation

### App Shell (`src/app/layout.jsx`)
The root layout wraps every page. It manages the mobile `mobileOpen` state and passes it down to both `<Sidebar>` and `<Navbar>`:

```
Layout
├── <Sidebar mobileOpen onMobileClose />   ← handles both desktop + mobile
├── <backdrop overlay />                   ← mobile only, closes drawer on click
└── <div flex-col flex-1>
    ├── <Navbar onMenuClick />             ← hamburger wired here
    └── <main> <Outlet /> </main>          ← page content renders here
```

### Routes (`src/app/router.jsx`)

| Path | Component |
|---|---|
| `/` | Redirects to `/dashboard` |
| `/dashboard` | `DashboardPage` |
| `/transactions` | `TransactionsPage` |
| `/insights` | `InsightsPage` |

---

## 🎨 Design System

All design tokens and component classes are defined in `src/styles/globals.css`.

### Color Palette

| Token | Value | Usage |
|---|---|---|
| `--background` | `hsl(224 71% 4%)` | Page background (dark navy) |
| `--foreground` | `hsl(213 31% 91%)` | Primary text |
| `--muted-foreground` | `hsl(215 20% 55%)` | Secondary text, labels |
| `brand-500` | `#6366f1` | Indigo accent — buttons, active states, glows |
| `brand-300` | `#a5b4fc` | Light indigo — active nav text |
| Emerald `400` | `#34d399` | Income / positive values |
| Rose `400` | `#fb7185` | Expense / negative values |

### Component Classes

| Class | Description |
|---|---|
| `.glass-card` | Frosted glass panel — `backdrop-filter: blur(20px)` + translucent border + shadow |
| `.nav-active` | Active nav link — indigo gradient background + border |
| `.btn-primary` | Indigo gradient button with box-shadow glow |
| `.btn-ghost` | Transparent button with hover background |
| `.glass-input` | Translucent input field with focus ring |
| `.badge` | Pill-shaped label for categories and types |
| `.skeleton` | Animated shimmer loading placeholder |
| `.gradient-text` | Indigo-to-violet gradient applied to text |
| `.glow-indigo` | Indigo drop-shadow glow |
| `.glow-emerald` | Green drop-shadow glow |
| `.glow-rose` | Red drop-shadow glow |

### Animations

| Name | Description |
|---|---|
| `animate-fade-in` | Fade from opacity 0 → 1 over 400ms |
| `animate-slide-up` | Slide up 16px + fade in over 400ms |
| `animate-slide-in-left` | Slide right 16px + fade in |
| `animate-pulse-slow` | Slow pulse for notification badges |
| `animate-shimmer` | Horizontal sweep for skeleton loaders |

---

## 📱 Responsiveness

The layout uses a **1024px (`lg`) breakpoint** to switch between desktop and mobile modes.

| Viewport | Sidebar | Hamburger |
|---|---|---|
| ≥ 1024px (Desktop) | Persistent collapsible sidebar on the left | Hidden |
| < 1024px (Mobile/Tablet) | Hidden; slides in as a fixed drawer on demand | Visible in Navbar |

### Desktop Sidebar
- Always visible on the left
- Collapses to an icon-only rail (64px) using the `◀` toggle button that sits centered on the right border
- Width transitions smoothly via CSS `transition: width 0.3s ease`

### Mobile Drawer
- Off-screen by default (`translateX(-100%)`)
- Slides in over the content at `z-index: 50` when the hamburger is tapped
- A dark semi-transparent backdrop (`rgba(0,0,0,0.6)`) covers the content — clicking it closes the drawer
- An `×` close button is in the top-right corner of the drawer
- Clicking any nav link automatically closes the drawer

### Page Content
- All pages use `p-4 sm:p-6` padding (tighter on mobile)
- Charts use `<ResponsiveContainer width="100%">` — they scale to fill their parent
- Stat cards and grids use responsive column counts (`grid-cols-1 sm:grid-cols-2 xl:grid-cols-4`)
- Transaction table preserves horizontal scroll on narrow viewports

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm

### Installation

```bash
# Clone the project
git clone <repo-url>
cd finance-dashboard

# Install dependencies
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

---

## 🔑 Default State

| Setting | Default |
|---|---|
| Role | `viewer` |
| Dark mode | `on` |
| Transactions | 30 pre-seeded mock transactions |

Switch to **Admin** role using the role toggle card at the bottom of the sidebar to unlock add/edit/delete features.

---

## 📝 Notes

- **No backend required** — all data is mocked. The app works fully offline after initial load.
- **Data resets on refresh** — mutations are in-memory only. Role and dark mode preference persist via `localStorage`.
- **Mock delay** — every API call has a simulated 600ms delay (`src/services/api.js`) to realistically demonstrate loading states and skeletons.
- **Radix UI** primitives are used for accessible modals (Dialog), dropdowns (Select, DropdownMenu), and tooltips — ensuring keyboard navigation and screen reader support.
