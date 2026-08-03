import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Icon from "../ui/Icon";
import type { WidgetView } from "../../types";

export interface WidgetMenuProps {
  anchorRect: DOMRect;
  views: WidgetView[];
  activeView: string;
  onSelectView: (view: string) => void;
  onRefresh: () => void;
  onRemove: () => void;
  onClose: () => void;
}

/**
 * Widget ellipsis menu: VIEW switcher + data actions.
 * Rendered in a portal and positioned against the trigger so it is never
 * clipped by the widget's own overflow.
 */
export default function WidgetMenu({ anchorRect, views, activeView, onSelectView, onRefresh, onRemove, onClose }: WidgetMenuProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ left: -9999, top: -9999 });

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || !anchorRect) return;
    const { width, height } = el.getBoundingClientRect();
    const left = Math.min(Math.max(8, anchorRect.right - width), window.innerWidth - width - 8);
    const below = anchorRect.bottom + 6;
    const top = below + height > window.innerHeight - 8 ? Math.max(8, anchorRect.top - height - 6) : below;
    setPos({ left, top });
  }, [anchorRect]);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("mousedown", onDown);
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onClose);
    return () => {
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onClose);
    };
  }, [onClose]);

  const hasViews = views && views.length > 0;

  return createPortal(
    <div
      ref={ref}
      className="sv-menu"
      style={{ "--menu-left": pos.left + "px", "--menu-top": pos.top + "px" } as React.CSSProperties}
      role="menu"
    >
      {hasViews && (
        <>
          <div className="sv-menu__eyebrow">View</div>
          {views.map((view) => {
            const on = view.id === activeView;
            return (
              <button
                key={view.id}
                type="button"
                role="menuitemradio"
                aria-checked={on}
                className="sv-menu__item"
                onClick={() => {
                  onSelectView(view.id);
                  onClose();
                }}
              >
                <span className="sv-menu__check">
                  {on && <Icon name="check" size={14} color="var(--sa-primary-600)" strokeWidth={2.4} />}
                </span>
                {view.label}
              </button>
            );
          })}
          <div className="sv-menu__rule" />
        </>
      )}
      <button
        type="button"
        role="menuitem"
        className="sv-menu__item"
        onClick={() => {
          onRefresh();
          onClose();
        }}
      >
        <span className="sv-menu__check" />
        Refresh data
      </button>
      <div className="sv-menu__rule" />
      <button
        type="button"
        role="menuitem"
        className="sv-menu__item sv-menu__item--danger"
        onClick={() => {
          onRemove();
          onClose();
        }}
      >
        <span className="sv-menu__check" />
        Remove widget
      </button>
    </div>,
    document.body
  );
}
