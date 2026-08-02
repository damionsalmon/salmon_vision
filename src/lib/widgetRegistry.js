import { BalanceByCurrency, CashOverTime, CurrentCash, Undesigned } from "../components/widgets/index.jsx";

/**
 * One entry per widget type. `views` drives the VIEW section of the widget
 * ellipsis menu; `defaultLayout` seeds react-grid-layout (12-col grid).
 */
export const WIDGET_TYPES = {
  currentCash: {
    id: "currentCash",
    title: "Current Cash",
    description: "Cash across multiple currencies",
    icon: "coins",
    component: CurrentCash,
    defaultView: "summary",
    views: [
      { id: "summary", label: "Total" },
      { id: "byCurrency", label: "By Currency" },
      { id: "byCountry", label: "By Country" },
      { id: "byBank", label: "By Bank" },
      { id: "topAccounts", label: "Top Accounts" },
      { id: "accountsTable", label: "Accounts table" }
    ],
    defaultLayout: { w: 4, h: 5, minW: 3, minH: 4 }
  },
  cashOverTime: {
    id: "cashOverTime",
    title: "Cash Over Time (7D)",
    description: "Cash balance trend over 7 days",
    icon: "lineChart",
    component: CashOverTime,
    defaultView: "line",
    views: [
      { id: "line", label: "Line" },
      { id: "bars", label: "Bars" },
      { id: "table", label: "Table" }
    ],
    defaultLayout: { w: 4, h: 5, minW: 3, minH: 4 }
  },
  balanceByCurrency: {
    id: "balanceByCurrency",
    title: "Balance by Currency",
    description: "Balance split by currency",
    icon: "pie",
    component: BalanceByCurrency,
    defaultView: "bars",
    views: [
      { id: "bars", label: "Bars" },
      { id: "table", label: "Table" }
    ],
    defaultLayout: { w: 4, h: 5, minW: 3, minH: 4 }
  },
  bankAccounts: {
    id: "bankAccounts",
    title: "Bank Accounts",
    description: "Accounts and booked balances",
    icon: "landmark",
    component: Undesigned,
    defaultView: "default",
    views: [],
    defaultLayout: { w: 4, h: 5, minW: 3, minH: 4 }
  },
  paymentQueue: {
    id: "paymentQueue",
    title: "Payment Queue",
    description: "Payments awaiting approval",
    icon: "listChecks",
    component: Undesigned,
    defaultView: "default",
    views: [],
    defaultLayout: { w: 4, h: 5, minW: 3, minH: 4 }
  },
  fxRates: {
    id: "fxRates",
    title: "FX Rates",
    description: "Rates used for conversion",
    icon: "exchange",
    component: Undesigned,
    defaultView: "default",
    views: [],
    defaultLayout: { w: 4, h: 5, minW: 3, minH: 4 }
  },
  forecast: {
    id: "forecast",
    title: "Forecast",
    description: "Projected cash position",
    icon: "trending",
    component: Undesigned,
    defaultView: "default",
    views: [],
    defaultLayout: { w: 4, h: 5, minW: 3, minH: 4 }
  }
};

export const WIDGET_CATALOG = Object.values(WIDGET_TYPES);

export function getWidgetType(typeId) {
  return WIDGET_TYPES[typeId] || null;
}
