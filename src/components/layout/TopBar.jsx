import React from "react";
import Icon from "../ui/Icon.jsx";

export default function TopBar({ crumbs, onToggleNav, onOpenManage, actions }) {
  return (
    <header className="sv-header">
      <button type="button" onClick={onToggleNav} title="Collapse navigation" style={{ display: "flex" }}>
        <Icon name="menu" size={20} color="var(--sa-fg-secondary)" />
      </button>

      <div className="sv-crumbs">
        {crumbs.map((crumb, i) => (
          <React.Fragment key={crumb.label}>
            {i > 0 && <Icon name="chevronRight" size={14} color="var(--sa-fg-tertiary)" />}
            {crumb.onClick ? (
              <button type="button" onClick={crumb.onClick} style={{ fontSize: 12, color: "var(--sa-fg-tertiary)" }}>
                {crumb.label}
              </button>
            ) : (
              <span className={i === crumbs.length - 1 ? "sv-crumbs__current" : undefined}>{crumb.label}</span>
            )}
          </React.Fragment>
        ))}
      </div>

      {actions}

      <button type="button" className="sv-btn sv-btn--icon" onClick={onOpenManage} title="Manage dashboards">
        <Icon name="sliders" size={16} color="var(--sa-fg-secondary)" />
      </button>
    </header>
  );
}
