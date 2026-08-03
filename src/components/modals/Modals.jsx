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
          <div className="flex flex-col gap-1">
            <span className="text-lg font-bold">New Dashboard</span>
            <span className="text-xs text-grey-500">
              Create a customized space to monitor specific key performance indicators.
            </span>
          </div>
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-semibold text-grey-700">
              Dashboard name <span className="text-primary-600">*</span>
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
          <div className="flex justify-end gap-3">
            <button type="button" className="sv-btn" onClick={onCancel}>
              Cancel
            </button>
            <button type="button" className="sv-btn sv-btn--primary" onClick={submit} disabled={!name.trim()}>
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
          <div className="flex flex-col gap-1">
            <span className="text-lg font-bold">Delete dashboard</span>
            <span className="text-xs leading-[18px] text-grey-500">
              Delete “{dashboardName}”? This removes the dashboard and its widgets.
            </span>
          </div>
          <div className="flex justify-end gap-3">
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
