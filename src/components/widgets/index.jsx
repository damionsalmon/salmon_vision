import React, { memo } from "react";
import {
  ACCOUNTS,
  BANK_TOTALS,
  CASH_SERIES,
  COUNTRY_TOTALS,
  CURRENCY_TOTALS,
  TOP_ACCOUNTS,
  formatMoney
} from "../../data/mockData.js";
import { AccountsTable, BarSeries, BreakdownList, Sparkline, TopAccountsList, TrendPill } from "./parts.jsx";

const TOTAL_EUR = CURRENCY_TOTALS.reduce((sum, row) => sum + row.eur, 0);

function CurrentCashWidget({ view, seed = 0 }) {
  if (view === "byCurrency") {
    return (
      <BreakdownList
        rows={CURRENCY_TOTALS.map((row) => ({
          key: row.code,
          label: row.code,
          value: row.amount,
          currency: row.code,
          share: row.share
        }))}
      />
    );
  }
  if (view === "byCountry") {
    return (
      <BreakdownList
        rows={COUNTRY_TOTALS.map((row) => ({
          key: row.code,
          label: row.label,
          value: row.eur,
          share: row.share
        }))}
      />
    );
  }
  if (view === "byBank") {
    return (
      <BreakdownList
        rows={BANK_TOTALS.map((row) => ({
          key: row.label,
          label: row.label,
          value: row.eur,
          share: row.share
        }))}
      />
    );
  }
  if (view === "topAccounts") return <TopAccountsList rows={TOP_ACCOUNTS} />;
  if (view === "accountsTable") return <AccountsTable rows={ACCOUNTS} />;

  const drift = 1 + (seed % 7) / 1000;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, justifyContent: "center", height: "100%" }}>
      <span className="sv-num" style={{ fontSize: 32, fontWeight: 700, color: "var(--sa-fg)" }}>
        {formatMoney(TOTAL_EUR * drift, "EUR")}
      </span>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <TrendPill value={2.3} />
        <span style={{ fontSize: 12, color: "var(--sa-fg-tertiary)" }}>vs last 7 days</span>
      </div>
    </div>
  );
}

function CashOverTimeWidget({ view }) {
  if (view === "bars") return <BarSeries series={CASH_SERIES} />;
  if (view === "table") {
    return (
      <table className="sv-table">
        <thead>
          <tr>
            <th>Day</th>
            <th className="sv-align-right">Closing balance</th>
          </tr>
        </thead>
        <tbody>
          {CASH_SERIES.map((point) => (
            <tr key={point.day}>
              <td style={{ color: "var(--sa-fg)" }}>{point.day}</td>
              <td className="sv-align-right sv-num">{formatMoney(point.value, "GBP")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
  return <Sparkline series={CASH_SERIES} />;
}

function BalanceByCurrencyWidget({ view }) {
  if (view === "table") {
    return (
      <table className="sv-table">
        <thead>
          <tr>
            <th>Currency</th>
            <th className="sv-align-right">Balance</th>
            <th className="sv-align-right">In EUR</th>
          </tr>
        </thead>
        <tbody>
          {CURRENCY_TOTALS.map((row) => (
            <tr key={row.code}>
              <td style={{ color: "var(--sa-fg)" }}>{row.code}</td>
              <td className="sv-align-right sv-num">{formatMoney(row.amount, row.code)}</td>
              <td className="sv-align-right sv-num">{formatMoney(row.eur, "EUR")}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
  return (
    <BreakdownList
      rows={CURRENCY_TOTALS.map((row) => ({
        key: row.code,
        label: row.code,
        value: row.amount,
        currency: row.code,
        share: row.share
      }))}
    />
  );
}

/** Types the source designs do not cover yet — rendered as an explicit gap, never invented. */
function UndesignedWidget({ title }) {
  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 12,
        borderRadius: "var(--sa-radius-md)",
        border: "1px dashed var(--sa-border-strong)",
        background: "var(--sa-bg-subtle)",
        textAlign: "center"
      }}
    >
      <span style={{ fontSize: 12, lineHeight: "18px", color: "var(--sa-fg-tertiary)" }}>
        Gap: no {title.toLowerCase()} body in the source designs.
      </span>
    </div>
  );
}

export const CurrentCash = memo(CurrentCashWidget);
export const CashOverTime = memo(CashOverTimeWidget);
export const BalanceByCurrency = memo(BalanceByCurrencyWidget);
export const Undesigned = memo(UndesignedWidget);
