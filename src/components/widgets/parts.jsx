import React from "react";
import { formatMoney, formatCompact, formatPercent } from "../../data/mockData.js";
import Icon from "../ui/Icon.jsx";

export function TrendPill({ value }) {
  const up = value >= 0;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
      <Icon
        name={up ? "arrowUp" : "arrowDown"}
        size={12}
        color={up ? "var(--sa-success-600)" : "var(--sa-error-600)"}
      />
      <span
        className="sv-num"
        style={{
          fontSize: 12,
          fontWeight: 600,
          color: up ? "var(--sa-success-600)" : "var(--sa-error-600)"
        }}
      >
        {formatPercent(value)}
      </span>
    </span>
  );
}

/** Ranked bar list — the shared shape behind By currency / By country / By bank. */
export function BreakdownList({ rows, currency = "EUR" }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {rows.map((row) => (
        <div key={row.key} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "baseline" }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: "var(--sa-fg)" }}>{row.label}</span>
            <span className="sv-num" style={{ fontSize: 13, fontWeight: 500, color: "var(--sa-fg-secondary)" }}>
              {formatMoney(row.value, row.currency || currency)}
              <span style={{ color: "var(--sa-fg-tertiary)" }}> ({Math.round(row.share * 100)}%)</span>
            </span>
          </div>
          <div className="sv-bar-track">
            <div className="sv-bar-fill" style={{ width: Math.max(2, row.share * 100) + "%" }} />
          </div>
        </div>
      ))}
    </div>
  );
}

export function TopAccountsList({ rows }) {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {rows.map((row) => (
        <div
          key={row.id}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            padding: "8px 0",
            borderBottom: "1px solid var(--sa-border)"
          }}
        >
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: "var(--sa-fg)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis"
              }}
            >
              {row.bank}
            </div>
            <div
              style={{
                fontSize: 11,
                color: "var(--sa-fg-tertiary)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis"
              }}
            >
              {row.account}
            </div>
          </div>
          <span
            className={"sv-num" + (row.eur < 0 ? " sv-neg" : "")}
            style={{ fontSize: 13, fontWeight: 600, whiteSpace: "nowrap" }}
          >
            {formatCompact(row.eur, "EUR")}
          </span>
        </div>
      ))}
    </div>
  );
}

export function AccountsTable({ rows }) {
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
            <td style={{ color: "var(--sa-fg)" }}>{row.bank}</td>
            <td>{row.entity}</td>
            <td>{row.account}</td>
            <td className={"sv-align-right sv-num" + (row.balance < 0 ? " sv-neg" : "")}>
              {formatMoney(row.balance, row.currency)}{" "}
              <span style={{ fontSize: 10, color: "var(--sa-fg-tertiary)" }}>{row.currency}</span>
            </td>
            <td className={"sv-align-right sv-num" + (row.eur < 0 ? " sv-neg" : "")}>{formatMoney(row.eur, "EUR")}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export function Sparkline({ series, height = 96 }) {
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
    <svg
      viewBox={"0 0 100 " + height}
      preserveAspectRatio="none"
      style={{ width: "100%", height: "100%", minHeight: 60, display: "block" }}
    >
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

export function BarSeries({ series }) {
  const max = Math.max(...series.map((p) => p.value));
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: "100%", minHeight: 80 }}>
      {series.map((p) => (
        <div key={p.day} style={{ flex: 1, display: "flex", flexDirection: "column", gap: 6, alignItems: "center" }}>
          <div
            style={{
              width: "100%",
              height: Math.max(4, (p.value / max) * 100) + "%",
              borderRadius: "4px 4px 0 0",
              background: "var(--sa-primary-600)",
              opacity: 0.85
            }}
          />
          <span style={{ fontSize: 10, color: "var(--sa-fg-tertiary)" }}>{p.day}</span>
        </div>
      ))}
    </div>
  );
}
