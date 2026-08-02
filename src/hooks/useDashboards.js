import { useCallback, useMemo, useState } from "react";
import { getWidgetType } from "../lib/widgetRegistry.js";

let seq = 0;
const uid = (prefix) => prefix + "-" + Date.now().toString(36) + "-" + (seq++).toString(36);

const COLS = 12;

function makeWidget(typeId, index = 0) {
  const type = getWidgetType(typeId);
  const base = type ? type.defaultLayout : { w: 4, h: 5, minW: 3, minH: 4 };
  const perRow = Math.max(1, Math.floor(COLS / base.w));
  return {
    i: uid(typeId),
    type: typeId,
    view: type ? type.defaultView : "default",
    refreshedAt: Date.now(),
    layout: {
      ...base,
      x: (index % perRow) * base.w,
      y: Math.floor(index / perRow) * base.h
    }
  };
}

function seedDashboards(startEmpty) {
  const overviewTypes = startEmpty ? [] : ["currentCash", "cashOverTime", "balanceByCurrency"];
  return [
    { id: "home", name: "Home", predefined: true, visible: true, widgets: [] },
    { id: "overview", name: "Overview", visible: true, widgets: overviewTypes.map(makeWidget) },
    { id: "cashPosition", name: "Cash Position", visible: true, widgets: [] }
  ];
}

/** Single source of truth for dashboards, their widgets, layout and view state. */
export default function useDashboards({ startEmpty = false } = {}) {
  const [dashboards, setDashboards] = useState(() => seedDashboards(startEmpty));
  const [activeId, setActiveId] = useState("overview");

  const active = useMemo(
    () => dashboards.find((d) => d.id === activeId) || dashboards.find((d) => !d.predefined && d.visible) || null,
    [dashboards, activeId]
  );

  const patchDashboard = useCallback((id, patch) => {
    setDashboards((prev) => prev.map((d) => (d.id === id ? { ...d, ...patch } : d)));
  }, []);

  const patchWidgets = useCallback(
    (updater) => {
      setDashboards((prev) => prev.map((d) => (d.id === activeId ? { ...d, widgets: updater(d.widgets) } : d)));
    },
    [activeId]
  );

  const addWidgets = useCallback(
    (typeIds, dashboardId = activeId) => {
      setDashboards((prev) =>
        prev.map((d) => {
          if (d.id !== dashboardId) return d;
          const created = typeIds.map((typeId, i) => makeWidget(typeId, d.widgets.length + i));
          return { ...d, widgets: [...d.widgets, ...created] };
        })
      );
    },
    [activeId]
  );

  const addWidgetAt = useCallback(
    (typeId, position, dashboardId = activeId) => {
      setDashboards((prev) =>
        prev.map((d) => {
          if (d.id !== dashboardId) return d;
          const widget = makeWidget(typeId, d.widgets.length);
          if (position) widget.layout = { ...widget.layout, x: position.x, y: position.y };
          return { ...d, widgets: [...d.widgets, widget] };
        })
      );
    },
    [activeId]
  );

  const removeWidget = useCallback(
    (widgetId) => patchWidgets((widgets) => widgets.filter((w) => w.i !== widgetId)),
    [patchWidgets]
  );

  const setWidgetView = useCallback(
    (widgetId, view) => patchWidgets((widgets) => widgets.map((w) => (w.i === widgetId ? { ...w, view } : w))),
    [patchWidgets]
  );

  const refreshWidget = useCallback(
    (widgetId) =>
      patchWidgets((widgets) => widgets.map((w) => (w.i === widgetId ? { ...w, refreshedAt: Date.now() } : w))),
    [patchWidgets]
  );

  const applyLayout = useCallback(
    (nextLayout) => {
      const byId = new Map(nextLayout.map((item) => [item.i, item]));
      patchWidgets((widgets) =>
        widgets.map((w) => {
          const item = byId.get(w.i);
          if (!item) return w;
          const { x, y, w: cw, h } = item;
          if (w.layout.x === x && w.layout.y === y && w.layout.w === cw && w.layout.h === h) return w;
          return { ...w, layout: { ...w.layout, x, y, w: cw, h } };
        })
      );
    },
    [patchWidgets]
  );

  const createDashboard = useCallback((name) => {
    const id = uid("dash");
    setDashboards((prev) => [...prev, { id, name, visible: true, widgets: [] }]);
    setActiveId(id);
    return id;
  }, []);

  const renameDashboard = useCallback((id, name) => patchDashboard(id, { name }), [patchDashboard]);

  const toggleVisible = useCallback((id) => {
    setDashboards((prev) => {
      const next = prev.map((d) => (d.id === id ? { ...d, visible: !d.visible } : d));
      setActiveId((current) => {
        const dash = next.find((d) => d.id === current);
        if (dash && dash.visible && !dash.predefined) return current;
        const first = next.find((d) => !d.predefined && d.visible);
        return first ? first.id : current;
      });
      return next;
    });
  }, []);

  const deleteDashboard = useCallback((id) => {
    setDashboards((prev) => {
      const next = prev.filter((d) => d.id !== id);
      setActiveId((current) => {
        if (current !== id) return current;
        const first = next.find((d) => !d.predefined && d.visible);
        return first ? first.id : "home";
      });
      return next;
    });
  }, []);

  const visibleDashboards = useMemo(() => dashboards.filter((d) => !d.predefined && d.visible), [dashboards]);

  const userDashboards = useMemo(() => dashboards.filter((d) => !d.predefined), [dashboards]);

  const homeDashboard = useMemo(() => dashboards.find((d) => d.id === "home"), [dashboards]);

  return {
    dashboards,
    userDashboards,
    visibleDashboards,
    homeDashboard,
    active,
    activeId,
    setActiveId,
    addWidgets,
    addWidgetAt,
    removeWidget,
    setWidgetView,
    refreshWidget,
    applyLayout,
    createDashboard,
    renameDashboard,
    toggleVisible,
    deleteDashboard
  };
}

export { COLS };
