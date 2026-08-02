import React, { useMemo } from "react";
import GridLayout, { WidthProvider } from "react-grid-layout";
import WidgetFrame from "./WidgetFrame.jsx";
import useScrollWindow from "../../hooks/useScrollWindow.js";

const ResponsiveGrid = WidthProvider(GridLayout);

export const GRID_COLS = 12;
export const GRID_ROW_HEIGHT = 40;
export const GRID_MARGIN = [24, 24];

const rowTop = (y) => y * (GRID_ROW_HEIGHT + GRID_MARGIN[1]);
const boxHeight = (h) => h * GRID_ROW_HEIGHT + Math.max(0, h - 1) * GRID_MARGIN[1];

/**
 * react-grid-layout does the heavy lifting: even gutters, collision-free
 * placement, vertical compaction, smooth CSS-transform drag/resize.
 * Bodies outside the scroll band are skipped (see useScrollWindow).
 */
export default function WidgetGrid({
  widgets,
  editing,
  scrollRef,
  onLayoutChange,
  onSetView,
  onRefresh,
  onRemove,
  onOpenDetail
}) {
  const band = useScrollWindow(scrollRef);

  const layout = useMemo(
    () =>
      widgets.map((widget) => ({
        i: widget.i,
        x: widget.layout.x,
        y: widget.layout.y,
        w: widget.layout.w,
        h: widget.layout.h,
        minW: widget.layout.minW,
        minH: widget.layout.minH
      })),
    [widgets]
  );

  return (
    <ResponsiveGrid
      className={"sv-grid" + (editing ? " sv-grid--editing" : "")}
      layout={layout}
      cols={GRID_COLS}
      rowHeight={GRID_ROW_HEIGHT}
      margin={GRID_MARGIN}
      containerPadding={[0, 0]}
      isDraggable={editing}
      isResizable={editing}
      draggableHandle=".sv-drag-handle"
      compactType="vertical"
      preventCollision={false}
      useCSSTransforms
      measureBeforeMount={false}
      onLayoutChange={onLayoutChange}
      resizeHandles={["se"]}
    >
      {widgets.map((widget) => {
        const top = rowTop(widget.layout.y);
        const bottom = top + boxHeight(widget.layout.h);
        const active = bottom >= band.top && top <= band.bottom;
        return (
          <WidgetFrame
            key={widget.i}
            widget={widget}
            editing={editing}
            active={active}
            onSetView={onSetView}
            onRefresh={onRefresh}
            onRemove={onRemove}
            onOpenDetail={onOpenDetail}
          />
        );
      })}
    </ResponsiveGrid>
  );
}
