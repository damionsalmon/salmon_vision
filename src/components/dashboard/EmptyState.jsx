import React from "react";
import Icon from "../ui/Icon.jsx";

export default function EmptyState({ onAdd }) {
  return (
    <div style={{ flexGrow: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div
        style={{
          position: "relative",
          width: 512,
          display: "flex",
          flexDirection: "column",
          gap: 24,
          alignItems: "center"
        }}
      >
        <svg
          width="480"
          height="480"
          viewBox="0 0 480 480"
          fill="none"
          style={{ position: "absolute", left: 16, top: -152, pointerEvents: "none" }}
          aria-hidden="true"
        >
          {[47.5, 79.5, 111.5, 143.5, 175.5, 207.5, 239.5].map((r, i) => (
            <circle key={r} cx="240" cy="240" r={r} stroke={["#E9EAEB", "#E9EAEB", "#E9EAEB", "#E9EAEB", "#ECEDEE", "#F3F4F5", "#F8F9FA"][i]} />
          ))}
        </svg>
        <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: 16, alignItems: "center" }}>
          <Icon name="folderOpen" size={24} color="var(--sa-fg-secondary)" />
          <div style={{ maxWidth: 352, display: "flex", flexDirection: "column", gap: 4, textAlign: "center" }}>
            <span style={{ fontSize: 16, fontWeight: 600, lineHeight: "24px", color: "var(--sa-fg)" }}>
              Add Widgets
            </span>
            <span style={{ fontSize: 14, lineHeight: "20px", color: "var(--sa-fg-secondary)" }}>
              Click 'Add Widget' to start building your dashboards by adding Action, KPIs and Chart widgets!
            </span>
          </div>
        </div>
        <button type="button" className="sv-btn sv-btn--primary" style={{ height: 40, padding: "10px 18px" }} onClick={onAdd}>
          Add Widgets
        </button>
      </div>
    </div>
  );
}
