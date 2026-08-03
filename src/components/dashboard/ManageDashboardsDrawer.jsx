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
        <div className="h-14 shrink-0 flex items-center justify-between px-6 py-4 border-b border-[var(--sa-divider)]">
          <span className="text-base font-semibold">Manage dashboards</span>
          <button type="button" className="sv-kebab" onClick={onClose} aria-label="Close">
            <Icon name="close" size={16} color="var(--sa-fg-secondary)" />
          </button>
        </div>

        <div className="flex flex-col gap-5 p-6 overflow-y-auto">
          <section className="flex flex-col gap-2">
            <span className="text-xs font-semibold tracking-[var(--sa-tracking-lg)] text-grey-500">
              Predefined by Salmon
            </span>
            {homeDashboard && (
              <div className="flex items-center gap-3 py-2">
                <Toggle
                  on={homeDashboard.visible}
                  onChange={() => onToggleVisible(homeDashboard.id)}
                  label="Show Home"
                />
                <span className="text-sm font-medium">{homeDashboard.name}</span>
              </div>
            )}
          </section>

          <section className="flex flex-col gap-2">
            <span className="text-xs font-semibold tracking-[var(--sa-tracking-lg)] text-grey-500">Yours</span>
            {userDashboards.map((dash) => (
              <div key={dash.id} className="flex items-center gap-3 py-2">
                <Toggle on={dash.visible} onChange={() => onToggleVisible(dash.id)} label={"Show " + dash.name} />
                {renameId === dash.id ? (
                  <input
                    autoFocus
                    className="sv-field sv-field--rename"
                    value={renameValue}
                    onChange={(e) => setRenameValue(e.target.value)}
                    onBlur={commit}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") commit();
                      if (e.key === "Escape") setRenameId(null);
                    }}
                  />
                ) : (
                  <span className="flex-grow min-w-0 text-sm font-medium">{dash.name}</span>
                )}
                <div className="relative shrink-0">
                  <button
                    type="button"
                    className="sv-kebab"
                    onClick={() => setMenuFor(menuFor === dash.id ? null : dash.id)}
                    aria-label="Dashboard options"
                  >
                    <KebabIcon color="var(--sa-fg-secondary)" />
                  </button>
                  {menuFor === dash.id && (
                    <div className="sv-menu sv-menu--anchored">
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
