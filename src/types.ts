import type { ComponentType } from "react";

export interface WidgetLayout {
  x: number;
  y: number;
  w: number;
  h: number;
  minW: number;
  minH: number;
}

export interface Widget {
  i: string;
  type: string;
  view: string;
  refreshedAt: number;
  layout: WidgetLayout;
}

export interface Dashboard {
  id: string;
  name: string;
  predefined?: boolean;
  visible: boolean;
  widgets: Widget[];
}

export interface Crumb {
  label: string;
  onClick?: () => void;
}

export interface WidgetBodyProps {
  view: string;
  seed: number;
  title: string;
}

export interface WidgetView {
  id: string;
  label: string;
}

export interface DefaultWidgetLayout {
  w: number;
  h: number;
  minW: number;
  minH: number;
}

export interface WidgetTypeDef {
  id: string;
  title: string;
  description: string;
  icon: string;
  component: ComponentType<WidgetBodyProps>;
  defaultView: string;
  views: WidgetView[];
  defaultLayout: DefaultWidgetLayout;
}

export interface GridPosition {
  x: number;
  y: number;
}
