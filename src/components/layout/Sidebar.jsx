import React from "react";
import Icon from "../ui/Icon.jsx";

function NavRow({ icon, label, badge, active, onClick, trailing }) {
  return (
    <div className={"sv-nav-row" + (active ? " sv-nav-row--active" : "")} onClick={onClick} style={{ cursor: onClick ? "pointer" : "default" }}>
      <Icon name={icon} size={16} color={active ? "var(--sa-primary-600)" : "var(--sa-grey-500)"} />
      <span className="sv-nav-row__label">{label}</span>
      {badge != null && (
        <span
          style={{
            width: 20,
            height: 20,
            borderRadius: "var(--sa-radius-full)",
            background: "var(--sa-bg-muted)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 11,
            fontWeight: 600
          }}
        >
          {badge}
        </span>
      )}
      {trailing}
    </div>
  );
}

export default function Sidebar({
  dashboards,
  activeDashboardId,
  view,
  dashOpen,
  onToggleDashOpen,
  onSelectDashboard,
  onOpenManage,
  onOpenModule
}) {
  const onDashboard = view === "dashboard";
  return (
    <nav className="sv-sidebar">
      <div style={{ display: "flex", flexDirection: "column", gap: 24, alignSelf: "stretch" }}>
        <div style={{ position: "relative", height: 46, flexShrink: 0 }}>
          <img
            src="assets/salmon-logo-colour.png"
            alt="Salmon"
            style={{ position: "absolute", left: 0, top: 0, width: 123, height: 30, objectFit: "contain", objectPosition: "left center" }}
          />
          <span
            style={{
              position: "absolute",
              left: 36,
              top: 34,
              width: 104,
              textAlign: "center",
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: "0.04em",
              color: "var(--sa-primary-600)"
            }}
          >
            TREASURER V6.0.0
          </span>
        </div>

        <div className="sv-nav-group">
          <NavRow icon="bell" label="Inbox" badge={4} />
          <NavRow icon="agents" label="Agents" />
          <div className="sv-nav-row">
            <Icon name="grid" size={16} color="var(--sa-grey-500)" />
            <button className="sv-nav-row__label" style={{ textAlign: "left" }} onClick={onToggleDashOpen}>
              Dashboards
            </button>
            <button onClick={onToggleDashOpen} aria-label="Toggle dashboards" style={{ display: "flex" }}>
              <Icon name={dashOpen ? "chevronUp" : "chevronDown"} size={12} color="var(--sa-grey-500)" />
            </button>
            <button className="sv-kebab" onClick={onOpenManage} title="Manage dashboards">
              <Icon name="sliders" size={14} color="var(--sa-grey-500)" />
            </button>
          </div>

          {dashOpen && (
            <div className="sv-nav-tree">
              {dashboards.map((dash) => {
                const active = onDashboard && dash.id === activeDashboardId;
                return (
                  <div
                    key={dash.id}
                    className={"sv-nav-row" + (active ? " sv-nav-row--active" : "")}
                    style={{ cursor: "pointer" }}
                    onClick={() => onSelectDashboard(dash.id)}
                  >
                    <span className="sv-nav-dash" style={{ color: active ? "var(--sa-primary-600)" : "inherit" }}>
                      –
                    </span>
                    <span className="sv-nav-row__label">{dash.name}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="sv-rule" />

        <div className="sv-nav-group">
          <div className="sv-eyebrow">Apps</div>
          <NavRow icon="landmark" label="Cash Management" />
          <NavRow icon="pie" label="Cash Postion" active={view === "module"} onClick={onOpenModule} />
          <NavRow icon="file" label="Statements" />
          <NavRow icon="trending" label="Forecast" />
          <NavRow icon="exchange" label="Payments" />
        </div>
      </div>

      <div className="sv-nav-group" style={{ flexShrink: 0 }}>
        <div className="sv-rule" style={{ marginBottom: 12 }} />
        <NavRow icon="gear" label="Settings" />
        <NavRow icon="lifebuoy" label="Support" />
        <NavRow icon="book" label="Documentation" />
      </div>
    </nav>
  );
}
