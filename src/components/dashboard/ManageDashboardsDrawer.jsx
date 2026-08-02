import React, { useState } from "react";
import Icon, { KebabIcon } from "../ui/Icon.jsx";

function Toggle({ on, onChange, label }) {
  return (
    <button
      type="button"
      className={"sv-toggle" + (on ? " sv-toggle--on" : "")}
      onClick={onChange}
      role="switch"
      aria-checked={on}
      aria-label={label}
    >
      <span className="sv-toggle__knob" />
    </button>
  );
}

/** Right-hand drawer: show/hide, rename and delete dashboards. */
export default function ManageDashboardsDrawer({
  homeDashboard,
  userDashboards,
  onToggleVisible,
  onRename,
  onAskDelete,
  onClose
}) {
  const [menuFor, setMenuFor] = useState(null);
  const [renameId, setRenameId] = useState(null);
  const [renameValue, setRenameValue] = useState("");

  const commit = () => {
    if (renameId && renameValue.trim()) onRename(renameId, renameValue.trim());
    setRenameId(null);
  };

  return (
    <>
      <div className="sv-scrim" onClick={onClose} />
      <aside className="sv-drawer" onClick={(e) => e.stopPropagation()}>
        <div
          style={{
            height: 56,
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 24px",
            borderBottom: "1px solid var(--sa-divider)"
          }}
        >
          <span style={{ fontSize: 16, fontWeight: 600 }}>Manage dashboards</span>
          <button type="button" className="sv-kebab" onClick={onClose} aria-label="Close">
            <Icon name="close" size={16} color="var(--sa-fg-secondary)" />
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20, padding: 24, overflowY: "auto" }}>
          <section style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.5px", color: "var(--sa-fg-tertiary)" }}>
              Predefined by Salmon
            </span>
            {homeDashboard && (
              <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0" }}>
                <Toggle
                  on={homeDashboard.visible}
                  onChange={() => onToggleVisible(homeDashboard.id)}
                  label="Show Home"
                />
                <span style={{ fontSize: 14, fontWeight: 500 }}>{homeDashboard.name}</span>
              </div>
            )}
          </section>

          <section style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: "0.5px", color: "var(--sa-fg-tertiary)" }}>
              Yours
            </span>
            {userDashboards.map((dash) => (
              <div key={dash.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0" }}>
                <Toggle on={dash.visible} onChange={() => onToggleVisible(dash.id)} label={"Show " + dash.name} />
                {renameId === dash.id ? (
                  <input
                    autoFocus
                    className="sv-field"
                    style={{ height: 30, flexGrow: 1, minWidth: 0, boxShadow: "inset 0 0 0 1px var(--sa-primary-600)" }}
                    value={renameValue}
                    onChange={(e) => setRenameValue(e.target.value)}
                    onBlur={commit}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") commit();
                      if (e.key === "Escape") setRenameId(null);
                    }}
                  />
                ) : (
                  <span style={{ flexGrow: 1, minWidth: 0, fontSize: 14, fontWeight: 500 }}>{dash.name}</span>
                )}
                <div style={{ position: "relative", flexShrink: 0 }}>
                  <button
                    type="button"
                    className="sv-kebab"
                    onClick={() => setMenuFor(menuFor === dash.id ? null : dash.id)}
                    aria-label="Dashboard options"
                  >
                    <KebabIcon color="var(--sa-fg-secondary)" />
                  </button>
                  {menuFor === dash.id && (
                    <div
                      className="sv-menu"
                      style={{ position: "absolute", right: 0, top: 26, left: "auto", minWidth: 160 }}
                    >
                      <button
                        type="button"
                        className="sv-menu__item"
                        onClick={() => {
                          setRenameId(dash.id);
                          setRenameValue(dash.name);
                          setMenuFor(null);
                        }}
                      >
                        <Icon name="pencil" size={14} color="var(--sa-fg-secondary)" />
                        Rename
                      </button>
                      <button
                        type="button"
                        className="sv-menu__item sv-menu__item--danger"
                        onClick={() => {
                          onAskDelete(dash.id);
                          setMenuFor(null);
                        }}
                      >
                        <Icon name="trash" size={14} color="var(--sa-error-600)" />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </section>
        </div>
      </aside>
    </>
  );
}
