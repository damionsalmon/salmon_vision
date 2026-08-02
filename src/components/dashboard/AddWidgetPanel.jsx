import React, { useCallback, useMemo, useRef, useState } from "react";
import Icon, { GripIcon } from "../ui/Icon.jsx";
import { WIDGET_CATALOG } from "../../lib/widgetRegistry.js";

/** Floating, draggable, dockable widget catalogue. */
export default function AddWidgetPanel({ docked, onToggleDock, onClose, onApply, onTileDragStart, onTileDragEnd }) {
  const [pos, setPos] = useState({ x: 760, y: 48 });
  const [selected, setSelected] = useState([]);
  const [query, setQuery] = useState("");
  const dragState = useRef(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? WIDGET_CATALOG.filter((t) => t.title.toLowerCase().includes(q)) : WIDGET_CATALOG;
  }, [query]);

  const startDrag = useCallback(
    (e) => {
      if (docked) return;
      dragState.current = { ox: e.clientX - pos.x, oy: e.clientY - pos.y };
      const move = (ev) => {
        const s = dragState.current;
        if (!s) return;
        setPos({ x: ev.clientX - s.ox, y: ev.clientY - s.oy });
      };
      const up = () => {
        dragState.current = null;
        window.removeEventListener("mousemove", move);
        window.removeEventListener("mouseup", up);
      };
      window.addEventListener("mousemove", move);
      window.addEventListener("mouseup", up);
    },
    [docked, pos]
  );

  const toggle = (id) => setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  return (
    <div
      className={"sv-panel" + (docked ? " sv-panel--docked" : "")}
      style={docked ? undefined : { left: pos.x, top: pos.y }}
    >
      <div className="sv-panel__head" onMouseDown={startDrag} style={{ cursor: docked ? "default" : "grab" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <GripIcon />
          <span style={{ fontSize: 18, fontWeight: 700, color: "var(--sa-fg)" }}>Add Widgets</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <button
            type="button"
            className="sv-kebab"
            onClick={onToggleDock}
            title={docked ? "Undock panel" : "Dock to right"}
          >
            <Icon name="dock" size={16} color={docked ? "var(--sa-primary-600)" : "var(--sa-fg-secondary)"} />
          </button>
          <button type="button" className="sv-kebab" onClick={onClose} aria-label="Close">
            <Icon name="close" size={16} color="var(--sa-fg-secondary)" />
          </button>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 6,
          padding: 8,
          borderRadius: "var(--sa-radius-md)",
          background: "var(--sa-bg-subtle)"
        }}
      >
        <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
          <span style={{ position: "absolute", left: 12, display: "flex" }}>
            <Icon name="search" size={14} color="var(--sa-fg-tertiary)" />
          </span>
          <input
            className="sv-field"
            style={{ paddingLeft: 34 }}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search widgets"
          />
        </div>
        <span style={{ fontSize: 12, color: "var(--sa-fg-tertiary)" }}>Search the list of available widgets.</span>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span
          style={{
            height: 28,
            display: "flex",
            alignItems: "center",
            padding: "6px 12px",
            borderRadius: "var(--sa-radius-full)",
            background: "var(--sa-bg-muted)",
            fontSize: 13,
            fontWeight: 600,
            color: "var(--sa-fg-secondary)"
          }}
        >
          Selected ({selected.length})
        </span>
        <button
          type="button"
          onClick={() => setSelected([])}
          style={{ fontSize: 14, fontWeight: 600, color: "var(--sa-fg-secondary)" }}
        >
          Clear all
        </button>
      </div>

      <div className="sv-catalog">
        {results.map((type) => {
          const on = selected.includes(type.id);
          return (
            <button
              key={type.id}
              type="button"
              className={"sv-tile" + (on ? " sv-tile--on" : "")}
              onClick={() => toggle(type.id)}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData("text/plain", type.id);
                e.dataTransfer.effectAllowed = "copy";
                onTileDragStart(type.id);
              }}
              onDragEnd={onTileDragEnd}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span
                    style={{
                      width: 16,
                      height: 16,
                      borderRadius: 4,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: on ? "var(--sa-primary-600)" : "transparent",
                      boxShadow: on ? "none" : "inset 0 0 0 1px var(--sa-border-strong)"
                    }}
                  >
                    {on && <Icon name="check" size={10} color="var(--sa-white)" strokeWidth={2.6} />}
                  </span>
                  <Icon name={type.icon} size={20} color="var(--sa-primary-600)" strokeWidth={1.6} />
                </div>
                <GripIcon />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <span style={{ fontSize: 12, fontWeight: 700, lineHeight: "18px", color: "var(--sa-fg-secondary)" }}>
                  {type.title}
                </span>
                <span style={{ fontSize: 12, lineHeight: "18px", color: "var(--sa-fg-tertiary)" }}>
                  {type.description}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 16 }}>
        <button type="button" onClick={onClose} style={{ fontSize: 14, fontWeight: 600, color: "var(--sa-fg-secondary)" }}>
          Close
        </button>
        <button
          type="button"
          className="sv-btn sv-btn--primary"
          style={{ height: 37, padding: "10px 24px" }}
          onClick={() => {
            if (selected.length) onApply(selected);
            setSelected([]);
          }}
        >
          Apply
        </button>
      </div>
    </div>
  );
}
