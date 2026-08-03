import React from "react";
import Icon from "../ui/Icon.jsx";

function NavRow({ icon, label, badge, active, onClick, trailing }) {
  return (
    <div
      className={"sv-nav-row" + (active ? " sv-nav-row--active" : "") + (onClick ? " sv-nav-row--clickable" : "")}
      onClick={onClick}
    >
      <Icon name={icon} size={16} color={active ? "var(--sa-primary-600)" : "var(--sa-grey-500)"} />
      <span className="sv-nav-row__label">{label}</span>
      {badge != null && (
        <span className="w-5 h-5 rounded-full bg-grey-100 flex items-center justify-center text-[11px] font-semibold">
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
      <div className="flex flex-col gap-6 self-stretch">
        <div className="relative h-[46px] shrink-0">
          <img
            src="assets/salmon-logo-colour.png"
            alt="Salmon"
            className="absolute left-0 top-0 w-[123px] h-[30px] object-contain object-left"
          />
          <span className="absolute left-[36px] top-[34px] w-[104px] text-center text-[10px] font-semibold tracking-[var(--sa-tracking-xs)] text-primary-600">
            TREASURER V6.0.0
          </span>
        </div>

        <div className="sv-nav-group">
          <NavRow icon="bell" label="Inbox" badge={4} />
          <NavRow icon="agents" label="Agents" />
          <div className="sv-nav-row">
            <Icon name="grid" size={16} color="var(--sa-grey-500)" />
            <button className="sv-nav-row__label text-left" onClick={onToggleDashOpen}>
              Dashboards
            </button>
            <button onClick={onToggleDashOpen} aria-label="Toggle dashboards" className="flex">
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
                    className={"sv-nav-row cursor-pointer" + (active ? " sv-nav-row--active" : "")}
                    onClick={() => onSelectDashboard(dash.id)}
                  >
                    <span className={"sv-nav-dash" + (active ? " sv-nav-dash--active" : "")}>–</span>
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

      <div className="sv-nav-group shrink-0">
        <div className="sv-rule mb-3" />
        <NavRow icon="gear" label="Settings" />
        <NavRow icon="lifebuoy" label="Support" />
        <NavRow icon="book" label="Documentation" />
      </div>
    </nav>
  );
}
