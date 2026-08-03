import React, { useCallback, useMemo, useRef, useState } from "react";
import Icon, { GripIcon } from "../ui/Icon";
import { WIDGET_CATALOG } from "../../lib/widgetRegistry";

export interface AddWidgetPanelProps {
  docked: boolean;
  onToggleDock: () => void;
  onClose: () => void;
  onApply: (typeIds: string[]) => void;
  onTileDragStart: (typeId: string) => void;
  onTileDragEnd: () => void;
}

/** Floating, draggable, dockable widget catalogue. */
export default function AddWidgetPanel({ docked, onToggleDock, onClose, onApply, onTileDragStart, onTileDragEnd }: AddWidgetPanelProps) {
  const [pos, setPos] = useState({ x: 760, y: 48 });
  const [selected, setSelected] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const dragState = useRef<{ ox: number; oy: number } | null>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? WIDGET_CATALOG.filter((t) => t.title.toLowerCase().includes(q)) : WIDGET_CATALOG;
  }, [query]);

  const startDrag = useCallback(
    (e: React.MouseEvent) => {
      if (docked) return;
      dragState.current = { ox: e.clientX - pos.x, oy: e.clientY - pos.y };
      const move = (ev: MouseEvent) => {
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

  const toggle = (id: string) => setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  return (
    <div
      className={"sv-panel" + (docked ? " sv-panel--docked" : "")}
      style={docked ? undefined : ({ "--panel-x": pos.x + "px", "--panel-y": pos.y + "px" } as React.CSSProperties)}
    >
      <div
        className={"sv-panel__head" + (docked ? "" : " sv-panel__head--draggable")}
        onMouseDown={startDrag}
      >
        <div className="flex items-center gap-2.5">
          <GripIcon />
          <span className="text-lg font-bold text-black">Add Widgets</span>
        </div>
        <div className="flex items-center gap-1">
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

      <div className="flex flex-col gap-1.5 p-2 rounded-md bg-grey-25">
        <div className="relative flex items-center">
          <input
            className="sv-field pl-[34px]"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="..."
          />
        </div>
        <span className="text-xs text-grey-500">Search the list of available widgets.</span>
      </div>

      <div className="flex items-center justify-between">
        <span className="h-7 flex items-center px-3 py-1.5 rounded-full bg-grey-100 text-[13px] font-semibold text-grey-700">
          Selected ({selected.length})
        </span>
        <button type="button" onClick={() => setSelected([])} className="text-sm font-semibold text-grey-700">
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
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={"sv-tile__check" + (on ? " sv-tile__check--on" : "")}>
                    {on && <Icon name="check" size={10} color="var(--sa-white)" strokeWidth={2.6} />}
                  </span>
                  <Icon name={type.icon} size={20} color="var(--sa-primary-600)" strokeWidth={1.6} />
                </div>
                <GripIcon />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs font-bold leading-[18px] text-grey-700">{type.title}</span>
                <span className="text-xs leading-[18px] text-grey-500">{type.description}</span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex items-center justify-end gap-4">
        <button type="button" onClick={onClose} className="text-sm font-semibold text-grey-700">
          Close
        </button>
        <button
          type="button"
          className="sv-btn sv-btn--primary sv-btn--apply"
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
