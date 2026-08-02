# Salmon Vision — Treasurer V6 dashboard shell

React app for the Salmon Treasurer V6 home/dashboard experience: configurable dashboards,
a resizable widget grid, and the Cash Position drill-down.

Built against the **Salmon Design System** (Inter, purple `#9E4AA2`, 4px spacing scale);
tokens live in `src/styles/tokens.css`.

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build
```

## Stack

- **React 18** + **Vite**
- **[react-grid-layout](https://github.com/react-grid-layout/react-grid-layout)** for the widget canvas —
  12-column grid, 40px rows, 24px gutters, collision-free placement, vertical compaction,
  CSS-transform drag/resize (`useCSSTransforms`).
- No component library: chrome is plain CSS driven by design-system tokens.

## Structure

```
src/
  App.jsx                       shell: view state, edit mode, panels, modals
  main.jsx                      entry (imports RGL + token CSS)
  hooks/
    useDashboards.js            dashboards, widgets, layout, views  (single source of truth)
    useScrollWindow.js          scroll band used to virtualize widget bodies
  lib/widgetRegistry.js         widget types: title, icon, views, component, default layout
  components/
    layout/    Sidebar, TopBar, DashboardTabs
    dashboard/ WidgetGrid, WidgetFrame, WidgetMenu, AddWidgetPanel,
               ManageDashboardsDrawer, EmptyState
    widgets/   widget bodies (index.jsx) + shared chart/table parts (parts.jsx)
    modals/    NewDashboardModal, ConfirmDeleteModal
    ui/        Icon (Lucide-derived paths)
  screens/CashPositionScreen.jsx
  data/mockData.js              mock treasury data + money formatting
```

## Scaling to hundreds of widgets

1. `WidgetFrame` is `memo`ised and receives stable callbacks (`useCallback` in `useDashboards`).
2. `WidgetGrid` computes each widget's pixel band from its grid row and only passes
   `active` to widgets inside the scrolled viewport (+600px buffer) — off-screen widgets
   keep their frame but skip rendering charts/tables.
3. `useCSSTransforms` + `measureBeforeMount={false}` keep drag/resize on the compositor.
4. Layout writes are diffed in `applyLayout`, so a drag that changes one widget does not
   allocate new objects for the rest.

## Interaction model

- **Edit Dashboard** (top right) toggles edit mode — the only mode where widgets can be
  dragged (by their header) or resized (bottom-right handle).
- In edit mode a floating **Add Widgets** panel can be dragged by its header or docked to
  the right; catalogue tiles can be selected + applied, or dragged straight onto the canvas.
- Every widget has an **ellipsis menu**: a `VIEW` section (e.g. By Currency / By Country /
  By Bank / Top Accounts / Accounts table), **Refresh data**, and **Remove widget**.
- **Manage dashboards** (drawer, right) toggles visibility, renames and deletes dashboards.

## Known gaps (not invented)

- `bankAccounts`, `paymentQueue`, `fxRates`, `forecast` have no designed body — they render
  an explicit "gap" placeholder.
- Data is mock; there is no API layer yet.
- Widget layouts are in-memory only (no persistence endpoint).

## Preview shim

`preview.html` runs the same `src/` modules straight in a browser (Babel + import maps, no
build step) for design review. It is a review aid only — `index.html` + Vite is the app.
