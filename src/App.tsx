import React, { useCallback, useRef, useState } from "react";
import Sidebar from "./components/layout/Sidebar";
import TopBar from "./components/layout/TopBar";
import DashboardTabs from "./components/layout/DashboardTabs";
import WidgetGrid, { GRID_COLS, GRID_MARGIN, GRID_ROW_HEIGHT } from "./components/dashboard/WidgetGrid";
import EmptyState from "./components/dashboard/EmptyState";
import AddWidgetPanel from "./components/dashboard/AddWidgetPanel";
import ManageDashboardsDrawer from "./components/dashboard/ManageDashboardsDrawer";
import { ConfirmDeleteModal, NewDashboardModal } from "./components/modals/Modals";
import CashPositionScreen from "./screens/CashPositionScreen";
import Icon from "./components/ui/Icon";
import useDashboards from "./hooks/useDashboards";
import type { Crumb, GridPosition } from "./types";

export interface AppProps {
  startEmpty?: boolean;
  drilldownEnabled?: boolean;
}

type View = "dashboard" | "module";
type ModalKind = "newDashboard" | "delete" | null;

export default function App({ startEmpty = false, drilldownEnabled = false }: AppProps) {
  const dash = useDashboards({ startEmpty });
  const [view, setView] = useState<View>("dashboard");
  const [navCollapsed, setNavCollapsed] = useState(false);
  const [dashOpen, setDashOpen] = useState(true);
  const [editing, setEditing] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  const [panelDocked, setPanelDocked] = useState(false);
  const [manageOpen, setManageOpen] = useState(false);
  const [modal, setModal] = useState<ModalKind>(null);
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);
  const [dropActive, setDropActive] = useState(false);
  const dragTypeRef = useRef<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const widgets = dash.active ? dash.active.widgets : [];
  const onDashboardView = view === "dashboard";

  const openPanel = useCallback(() => {
    setEditing(true);
    setPanelOpen(true);
  }, []);

  const toggleEdit = useCallback(() => {
    setEditing((on) => {
      if (on) setPanelOpen(false);
      return !on;
    });
  }, []);

  const handleCanvasDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      const typeId = e.dataTransfer.getData("text/plain") || dragTypeRef.current;
      dragTypeRef.current = null;
      setDropActive(false);
      if (!typeId) return;
      const box = canvasRef.current ? canvasRef.current.getBoundingClientRect() : null;
      let position: GridPosition | null = null;
      if (box && canvasRef.current) {
        const colWidth = (box.width - GRID_MARGIN[0] * (GRID_COLS - 1)) / GRID_COLS;
        const x = Math.max(0, Math.min(GRID_COLS - 4, Math.round((e.clientX - box.left) / (colWidth + GRID_MARGIN[0]))));
        const y = Math.max(0, Math.round((e.clientY - box.top + canvasRef.current.scrollTop) / (GRID_ROW_HEIGHT + GRID_MARGIN[1])));
        position = { x, y };
      }
      dash.addWidgetAt(typeId, position);
    },
    [dash]
  );

  const crumbs: Crumb[] = onDashboardView
    ? [{ label: "Home" }, { label: "Dashboard" }, { label: dash.active ? dash.active.name : "" }]
    : [
        { label: "Home", onClick: () => setView("dashboard") },
        { label: "Cash management", onClick: () => setView("dashboard") },
        { label: "Cash Position" }
      ];

  return (
    <div className="sv-viewport">
      <div className="sv-frame">
        {!navCollapsed && (
          <Sidebar
            dashboards={dash.visibleDashboards}
            activeDashboardId={dash.activeId}
            view={view}
            dashOpen={dashOpen}
            onToggleDashOpen={() => setDashOpen((v) => !v)}
            onSelectDashboard={(id) => {
              dash.setActiveId(id);
              setView("dashboard");
            }}
            onOpenManage={() => setManageOpen(true)}
            onOpenModule={() => setView("module")}
          />
        )}

        <div className={"sv-main" + (navCollapsed ? " sv-main--nav-collapsed" : "")}>
          <TopBar
            crumbs={crumbs}
            onToggleNav={() => setNavCollapsed((v) => !v)}
            onOpenManage={() => setManageOpen(true)}
            actions={
              onDashboardView && widgets.length > 0 ? (
                <button
                  type="button"
                  className={"sv-btn" + (editing ? " sv-btn--primary" : "")}
                  onClick={toggleEdit}
                >
                  {editing ? "Done" : "Edit Dashboard"}
                </button>
              ) : null
            }
          />

          <main className="sv-surface">
            {onDashboardView ? (
              <>
                <DashboardTabs
                  dashboards={dash.visibleDashboards}
                  activeId={dash.activeId}
                  onSelect={(id) => dash.setActiveId(id)}
                  onCreate={() => setModal("newDashboard")}
                />

                <div
                  ref={canvasRef}
                  className={
                    "sv-canvas" +
                    (editing ? " sv-canvas--editing" : "") +
                    (dropActive ? " sv-canvas--drop" : "") +
                    (panelOpen && panelDocked ? " sv-canvas--docked" : "")
                  }
                  onDragOver={(e) => {
                    if (!dragTypeRef.current) return;
                    e.preventDefault();
                    if (!dropActive) setDropActive(true);
                  }}
                  onDragLeave={() => setDropActive(false)}
                  onDrop={handleCanvasDrop}
                >
                  {widgets.length ? (
                    <WidgetGrid
                      widgets={widgets}
                      editing={editing}
                      scrollRef={canvasRef}
                      onLayoutChange={dash.applyLayout}
                      onSetView={dash.setWidgetView}
                      onRefresh={dash.refreshWidget}
                      onRemove={dash.removeWidget}
                      onOpenDetail={drilldownEnabled ? () => setView("module") : null}
                    />
                  ) : (
                    <EmptyState onAdd={openPanel} />
                  )}
                </div>
              </>
            ) : (
              <CashPositionScreen />
            )}
          </main>
        </div>

        {onDashboardView && editing && !panelOpen && (
          <button type="button" className={"sv-fab" + (dropActive ? " sv-fab--hidden" : "")} onClick={openPanel}>
            <Icon name="plus" size={18} color="var(--sa-white)" strokeWidth={2.2} />
            Add Widgets
          </button>
        )}

        {panelOpen && (
          <AddWidgetPanel
            docked={panelDocked}
            onToggleDock={() => setPanelDocked((v) => !v)}
            onClose={() => setPanelOpen(false)}
            onApply={(typeIds) => dash.addWidgets(typeIds)}
            onTileDragStart={(typeId) => {
              dragTypeRef.current = typeId;
              setDropActive(true);
            }}
            onTileDragEnd={() => {
              dragTypeRef.current = null;
              setDropActive(false);
            }}
          />
        )}

        {manageOpen && (
          <ManageDashboardsDrawer
            homeDashboard={dash.homeDashboard}
            userDashboards={dash.userDashboards}
            onToggleVisible={dash.toggleVisible}
            onRename={dash.renameDashboard}
            onAskDelete={(id) => {
              setPendingDelete(id);
              setModal("delete");
            }}
            onClose={() => setManageOpen(false)}
          />
        )}

        {modal === "newDashboard" && (
          <NewDashboardModal
            onCancel={() => setModal(null)}
            onCreate={(name) => {
              dash.createDashboard(name);
              setView("dashboard");
              setModal(null);
            }}
          />
        )}

        {modal === "delete" && (
          <ConfirmDeleteModal
            dashboardName={dash.dashboards.find((d) => d.id === pendingDelete)?.name || ""}
            onCancel={() => {
              setModal(null);
              setPendingDelete(null);
            }}
            onConfirm={() => {
              if (pendingDelete) dash.deleteDashboard(pendingDelete);
              setModal(null);
              setPendingDelete(null);
            }}
          />
        )}
      </div>
    </div>
  );
}
