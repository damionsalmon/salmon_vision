import { useCallback, useMemo, useState } from "react";
import { getWidgetType } from "../lib/widgetRegistry";
import type { Dashboard, GridPosition, Widget, WidgetLayout } from "../types";

let seq = 0;
const uid = (prefix: string): string => prefix + "-" + Date.now().toString(36) + "-" + (seq++).toString(36);

const COLS = 12;

function makeWidget(typeId: string, index = 0): Widget {
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

function seedDashboards(startEmpty: boolean): Dashboard[] {
  const overviewTypes = startEmpty ? [] : ["currentCash", "cashOverTime", "balanceByCurrency"];
  return [
    // Home is the permanent default tab — always visible, never deletable
    // (enforced in toggleVisible/deleteDashboard below), guaranteeing the
    // tab bar can never end up with zero tabs.
    { id: "home", name: "Home", predefined: true, visible: true, widgets: overviewTypes.map((t, i) => makeWidget(t, i)) },
    { id: "overview", name: "Overview", visible: true, widgets: [] }
  ];
}

export interface LayoutItem {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface UseDashboardsOptions {
  startEmpty?: boolean;
}

export interface UseDashboardsResult {
  dashboards: Dashboard[];
  userDashboards: Dashboard[];
  visibleDashboards: Dashboard[];
  homeDashboard: Dashboard | undefined;
  active: Dashboard | null;
  activeId: string;
  setActiveId: (id: string) => void;
  addWidgets: (typeIds: string[], dashboardId?: string) => void;
  addWidgetAt: (typeId: string, position: GridPosition | null, dashboardId?: string) => void;
  removeWidget: (widgetId: string) => void;
  setWidgetView: (widgetId: string, view: string) => void;
  refreshWidget: (widgetId: string) => void;
  applyLayout: (nextLayout: LayoutItem[]) => void;
  createDashboard: (name: string) => string;
  renameDashboard: (id: string, name: string) => void;
  toggleVisible: (id: string) => void;
  deleteDashboard: (id: string) => void;
}

/** Single source of truth for dashboards, their widgets, layout and view state. */
export default function useDashboards({ startEmpty = false }: UseDashboardsOptions = {}): UseDashboardsResult {
  const [dashboards, setDashboards] = useState<Dashboard[]>(() => seedDashboards(startEmpty));
  const [activeId, setActiveId] = useState("home");

  const active = useMemo(
    () => dashboards.find((d) => d.id === activeId) || dashboards.find((d) => d.visible) || null,
    [dashboards, activeId]
  );

  const patchDashboard = useCallback((id: string, patch: Partial<Dashboard>) => {
    setDashboards((prev) => prev.map((d) => (d.id === id ? { ...d, ...patch } : d)));
  }, []);

  const patchWidgets = useCallback(
    (updater: (widgets: Widget[]) => Widget[]) => {
      setDashboards((prev) => prev.map((d) => (d.id === activeId ? { ...d, widgets: updater(d.widgets) } : d)));
    },
    [activeId]
  );

  const addWidgets = useCallback(
    (typeIds: string[], dashboardId: string = activeId) => {
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
    (typeId: string, position: GridPosition | null, dashboardId: string = activeId) => {
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
    (widgetId: string) => patchWidgets((widgets) => widgets.filter((w) => w.i !== widgetId)),
    [patchWidgets]
  );

  const setWidgetView = useCallback(
    (widgetId: string, view: string) =>
      patchWidgets((widgets) => widgets.map((w) => (w.i === widgetId ? { ...w, view } : w))),
    [patchWidgets]
  );

  const refreshWidget = useCallback(
    (widgetId: string) =>
      patchWidgets((widgets) => widgets.map((w) => (w.i === widgetId ? { ...w, refreshedAt: Date.now() } : w))),
    [patchWidgets]
  );

  const applyLayout = useCallback(
    (nextLayout: LayoutItem[]) => {
      const byId = new Map(nextLayout.map((item) => [item.i, item]));
      patchWidgets((widgets) =>
        widgets.map((w) => {
          const item = byId.get(w.i);
          if (!item) return w;
          const { x, y, w: cw, h } = item;
          if (w.layout.x === x && w.layout.y === y && w.layout.w === cw && w.layout.h === h) return w;
          const layout: WidgetLayout = { ...w.layout, x, y, w: cw, h };
          return { ...w, layout };
        })
      );
    },
    [patchWidgets]
  );

  const createDashboard = useCallback((name: string) => {
    const id = uid("dash");
    setDashboards((prev) => [...prev, { id, name, visible: true, widgets: [] }]);
    setActiveId(id);
    return id;
  }, []);

  const renameDashboard = useCallback((id: string, name: string) => patchDashboard(id, { name }), [patchDashboard]);

  const toggleVisible = useCallback((id: string) => {
    setDashboards((prev) => {
      const target = prev.find((d) => d.id === id);
      // Predefined dashboards (Home) must always stay visible — they're the
      // guaranteed tab, so hiding them could leave zero tabs.
      if (!target || target.predefined) return prev;
      const next = prev.map((d) => (d.id === id ? { ...d, visible: !d.visible } : d));
      setActiveId((current) => {
        const dash = next.find((d) => d.id === current);
        if (dash && dash.visible) return current;
        const first = next.find((d) => d.visible);
        return first ? first.id : current;
      });
      return next;
    });
  }, []);

  const deleteDashboard = useCallback((id: string) => {
    setDashboards((prev) => {
      const target = prev.find((d) => d.id === id);
      // Predefined dashboards (Home) can't be deleted.
      if (!target || target.predefined) return prev;
      const next = prev.filter((d) => d.id !== id);
      setActiveId((current) => {
        if (current !== id) return current;
        const first = next.find((d) => d.visible);
        return first ? first.id : "home";
      });
      return next;
    });
  }, []);

  const visibleDashboards = useMemo(() => dashboards.filter((d) => d.visible), [dashboards]);

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
