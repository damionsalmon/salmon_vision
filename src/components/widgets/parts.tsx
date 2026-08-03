import React from "react";
import { formatMoney, formatCompact, formatPercent, type Account, type CashPoint } from "../../data/mockData";
import Icon from "../ui/Icon";

export interface TrendPillProps {
  value: number;
}

export function TrendPill({ value }: TrendPillProps) {
  const up = value >= 0;
  return (
    <span className="inline-flex items-center gap-1">
      <Icon
        name={up ? "arrowUp" : "arrowDown"}
        size={12}
        color={up ? "var(--sa-success-600)" : "var(--sa-error-600)"}
      />
      <span className={"sv-num text-xs font-semibold" + (up ? " text-success-600" : " text-error-600")}>
        {formatPercent(value)}
      </span>
    </span>
  );
}

export interface BreakdownRow {
  key: string;
  label: string;
  value: number;
  currency?: string;
  share: number;
}

export interface BreakdownListProps {
  rows: BreakdownRow[];
  currency?: string;
}

/** Ranked bar list — the shared shape behind By currency / By country / By bank. */
export function BreakdownList({ rows, currency = "EUR" }: BreakdownListProps) {
  return (
    <div className="flex flex-col gap-3">
      {rows.map((row) => (
        <div key={row.key} className="flex flex-col gap-1">
          <div className="flex justify-between gap-2 items-baseline">
            <span className="text-[13px] font-semibold text-black">{row.label}</span>
            <span className="sv-num text-[13px] font-medium text-grey-700">
              {formatMoney(row.value, row.currency || currency)}
              <span className="text-grey-500"> ({Math.round(row.share * 100)}%)</span>
            </span>
          </div>
          <div className="sv-bar-track">
            <div className="sv-bar-fill" style={{ "--fill": Math.max(2, row.share * 100) + "%" } as React.CSSProperties} />
          </div>
        </div>
      ))}
    </div>
  );
}

export interface TopAccountRow {
  id: string;
  bank: string;
  account: string;
  eur: number;
}

export interface TopAccountsListProps {
  rows: TopAccountRow[];
}

export function TopAccountsList({ rows }: TopAccountsListProps) {
  return (
    <div className="flex flex-col">
      {rows.map((row) => (
        <div key={row.id} className="flex items-center justify-between gap-3 py-2 border-b border-[var(--sa-border)]">
          <div className="min-w-0">
            <div className="text-[13px] font-semibold text-black whitespace-nowrap overflow-hidden text-ellipsis">
              {row.bank}
            </div>
            <div className="text-[11px] text-grey-500 whitespace-nowrap overflow-hidden text-ellipsis">
              {row.account}
            </div>
          </div>
          <span className={"sv-num text-[13px] font-semibold whitespace-nowrap" + (row.eur < 0 ? " sv-neg" : "")}>
            {formatCompact(row.eur, "EUR")}
          </span>
        </div>
      ))}
    </div>
  );
}

export interface AccountsTableProps {
  rows: Account[];
}

export function AccountsTable({ rows }: AccountsTableProps) {
  return (
    <table className="sv-table">
      <thead>
        <tr>
          <th>Bank</th>
          <th>Entity</th>
          <th>Account identifier</th>
          <th className="sv-align-right">Booked balance</th>
          <th className="sv-align-right">In EUR</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.id}>
            <td className="sv-table-cell--emphasis">{row.bank}</td>
            <td>{row.entity}</td>
            <td>{row.account}</td>
            <td className={"sv-align-right sv-num" + (row.balance < 0 ? " sv-neg" : "")}>
              {formatMoney(row.balance, row.currency)} <span className="text-[10px] text-grey-500">{row.currency}</span>
            </td>
            <td className={"sv-align-right sv-num" + (row.eur < 0 ? " sv-neg" : "")}>{formatMoney(row.eur, "EUR")}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export interface SparklineProps {
  series: CashPoint[];
  height?: number;
}

export function Sparkline({ series, height = 96 }: SparklineProps) {
  const values = series.map((p) => p.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const points = series.map((p, i) => {
    const x = (i / (series.length - 1)) * 100;
    const y = height - 8 - ((p.value - min) / span) * (height - 24);
    return { x, y, ...p };
  });
  const path = points.map((p, i) => (i === 0 ? "M" : "L") + p.x + "," + p.y).join(" ");
  return (
    <svg viewBox={"0 0 100 " + height} preserveAspectRatio="none" className="w-full h-full min-h-[60px] block">
      {[0, 1, 2, 3].map((i) => (
        <line
          key={i}
          x1="0"
          x2="100"
          y1={(height / 3) * i}
          y2={(height / 3) * i}
          stroke="var(--sa-divider)"
          strokeWidth="0.5"
          vectorEffect="non-scaling-stroke"
        />
      ))}
      <path
        d={path}
        fill="none"
        stroke="var(--sa-primary-600)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
      {points.map((p) => (
        <circle
          key={p.day}
          cx={p.x}
          cy={p.y}
          r="2"
          fill="var(--sa-white)"
          stroke="var(--sa-primary-600)"
          strokeWidth="1.5"
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>
  );
}

export interface BarSeriesProps {
  series: CashPoint[];
}

export function BarSeries({ series }: BarSeriesProps) {
  const max = Math.max(...series.map((p) => p.value));
  return (
    <div className="flex items-end gap-2 h-full min-h-[80px]">
      {series.map((p) => (
        <div key={p.day} className="flex-1 flex flex-col gap-1.5 items-center">
          <div
            className="sv-bar-series-fill"
            style={{ "--bar-h": Math.max(4, (p.value / max) * 100) + "%" } as React.CSSProperties}
          />
          <span className="text-[10px] text-grey-500">{p.day}</span>
        </div>
      ))}
    </div>
  );
}
