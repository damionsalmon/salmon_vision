import React, { forwardRef, memo, useCallback, useRef, useState } from "react";
import Icon, { GripIcon, KebabIcon } from "../ui/Icon.jsx";
import WidgetMenu from "./WidgetMenu.jsx";
import { getWidgetType } from "../../lib/widgetRegistry.js";

/**
 * Chrome around a widget body. `active` comes from the grid's virtualization
 * window — off-screen widgets keep their frame but skip rendering their body,
 * which is what keeps a hundred-widget dashboard smooth.
 */
function WidgetFrameInner(
  {
    widget,
    editing,
    active = true,
    onSetView,
    onRefresh,
    onRemove,
    onOpenDetail,
    style,
    className,
    children,
    onMouseDown,
    onMouseUp,
    onTouchEnd,
    ...rest
  },
  ref
) {
  const type = getWidgetType(widget.type);
  const [menuRect, setMenuRect] = useState(null);
  const openMenu = useCallback((e) => {
    e.stopPropagation();
    setMenuRect(e.currentTarget.getBoundingClientRect());
  }, []);

  const Body = type ? type.component : null;
  const activeView = type ? type.views.find((v) => v.id === widget.view) : null;

  return (
    <div
      ref={ref}
      className={(className || "") + " sv-widget-host"}
      style={style}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onTouchEnd={onTouchEnd}
      {...rest}
    >
      <div className={"sv-widget" + (editing ? " sv-widget--editing" : "")}>
        <div className={"sv-widget__head" + (editing ? " sv-widget__drag sv-drag-handle" : "")}>
          <div style={{ minWidth: 0, display: "flex", flexDirection: "column", gap: 2 }}>
            <span className="sv-widget__title">{type ? type.title : widget.type}</span>
            {activeView && activeView.id !== type.defaultView && (
              <span className="sv-widget__sub">{activeView.label}</span>
            )}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
            {editing && <GripIcon />}
            {!editing && onOpenDetail && (
              <button type="button" className="sv-kebab" onClick={onOpenDetail} aria-label="Open detail">
                <Icon name="chevronRight" size={16} color="var(--sa-primary-600)" />
              </button>
            )}
            <button
              type="button"
              className="sv-kebab"
              onClick={openMenu}
              onMouseDown={(e) => e.stopPropagation()}
              aria-label="Widget options"
              aria-haspopup="menu"
            >
              <KebabIcon />
            </button>
          </div>
        </div>

        <div className="sv-widget__body">
          {active && Body ? <Body view={widget.view} seed={widget.refreshedAt} title={type.title} /> : null}
        </div>
      </div>

      {menuRect && (
        <WidgetMenu
          anchorRect={menuRect}
          views={type ? type.views : []}
          activeView={widget.view}
          onSelectView={(view) => onSetView(widget.i, view)}
          onRefresh={() => onRefresh(widget.i)}
          onRemove={() => onRemove(widget.i)}
          onClose={() => setMenuRect(null)}
        />
      )}
      {children}
    </div>
  );
}

const WidgetFrame = memo(forwardRef(WidgetFrameInner));
WidgetFrame.displayName = "WidgetFrame";
export default WidgetFrame;
