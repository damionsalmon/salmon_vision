import React, { useState } from "react";

export function NewDashboardModal({ onCancel, onCreate }) {
  const [name, setName] = useState("");
  const submit = () => {
    if (name.trim()) onCreate(name.trim());
  };
  return (
    <>
      <div className="sv-scrim" onClick={onCancel} />
      <div className="sv-modal">
        <div className="sv-modal__card">
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span style={{ fontSize: 18, fontWeight: 700 }}>New Dashboard</span>
            <span style={{ fontSize: 12, color: "var(--sa-fg-tertiary)" }}>
              Create a customized space to monitor specific key performance indicators.
            </span>
          </div>
          <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: "var(--sa-fg-secondary)" }}>
              Dashboard name <span style={{ color: "var(--sa-primary-600)" }}>*</span>
            </span>
            <input
              autoFocus
              className="sv-field"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              placeholder="e.g. Daily Cash Overview"
            />
          </label>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
            <button type="button" className="sv-btn" onClick={onCancel}>
              Cancel
            </button>
            <button
              type="button"
              className="sv-btn sv-btn--primary"
              onClick={submit}
              style={{ opacity: name.trim() ? 1 : 0.4 }}
            >
              Create
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export function ConfirmDeleteModal({ dashboardName, onCancel, onConfirm }) {
  return (
    <>
      <div className="sv-scrim" onClick={onCancel} />
      <div className="sv-modal">
        <div className="sv-modal__card">
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span style={{ fontSize: 18, fontWeight: 700 }}>Delete dashboard</span>
            <span style={{ fontSize: 12, lineHeight: "18px", color: "var(--sa-fg-tertiary)" }}>
              Delete “{dashboardName}”? This removes the dashboard and its widgets.
            </span>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 12 }}>
            <button type="button" className="sv-btn" onClick={onCancel}>
              Cancel
            </button>
            <button type="button" className="sv-btn sv-btn--danger" onClick={onConfirm}>
              Delete
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
