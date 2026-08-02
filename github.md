repo: damionsalmon/salmon_vision
branch: main

## Last sync

date: 2026-08-02T00:00:00Z

### Updated in this project

- Rebuilt the Treasurer V6 dashboard prototype as a structured React + Vite app.
- Widget canvas moved onto react-grid-layout (12 cols, 24px gutters, drag + resize).
- Added per-widget ellipsis menu: view switcher, refresh data, remove widget.
- Virtualized widget bodies via a scroll-band hook for hundred-widget dashboards.

## Screen map

| Screen | Built from |
| --- | --- |
| Dashboard shell | src/App.jsx, src/components/layout/* |
| Widget canvas | src/components/dashboard/WidgetGrid.jsx, WidgetFrame.jsx, WidgetMenu.jsx |
| Add widgets | src/components/dashboard/AddWidgetPanel.jsx, src/lib/widgetRegistry.js |
| Manage dashboards | src/components/dashboard/ManageDashboardsDrawer.jsx |
| Cash Position | src/screens/CashPositionScreen.jsx |
