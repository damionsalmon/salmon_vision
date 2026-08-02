import React from "react";
import Icon from "../components/ui/Icon.jsx";
import { ACCOUNTS, CURRENCY_TOTALS, formatMoney, formatPercent } from "../data/mockData.js";

const FILTERS = ["Bank", "Entity", "Account", "Market", "Currency"];

/** Cash Position drill-down (the "NEXT" module screen from the Figma). */
export default function CashPositionScreen() {
  return (
    <div style={{ flexGrow: 1, alignSelf: "stretch", minHeight: 0, display: "flex", flexDirection: "column", gap: 24, padding: 12 }}>
      <div style={{ display: "flex", gap: 16, flexShrink: 0 }}>
        {CURRENCY_TOTALS.map((row) => (
          <div
            key={row.code}
            style={{
              flex: 1,
              minWidth: 0,
              height: 108,
              display: "flex",
              flexDirection: "column",
              gap: 12,
              padding: 16,
              borderRadius: "var(--sa-radius-xl)",
              background: "var(--sa-white)",
              boxShadow: "inset 0 0 0 1px var(--sa-divider)"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span
                style={{
                  padding: "4px 8px",
                  borderRadius: "var(--sa-radius-sm)",
                  background: "#EBF5FF",
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#2563EB"
                }}
              >
                {row.code}
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
                <Icon
                  name={row.trend >= 0 ? "arrowUp" : "arrowDown"}
                  size={10}
                  color={row.trend >= 0 ? "var(--sa-success-600)" : "var(--sa-error-600)"}
                />
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: row.trend >= 0 ? "var(--sa-success-600)" : "var(--sa-error-600)"
                  }}
                >
                  {formatPercent(row.trend)}
                </span>
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span
                className="sv-num"
                style={{ fontSize: 20, fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}
              >
                {formatMoney(row.amount, row.code)}
              </span>
              <span style={{ fontSize: 11, fontWeight: 500, color: "var(--sa-fg-tertiary)" }}>Available Balance</span>
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          flexGrow: 1,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          borderRadius: "var(--sa-radius-xl)",
          background: "var(--sa-white)",
          boxShadow: "inset 0 0 0 1px var(--sa-divider)"
        }}
      >
        <div
          style={{
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
            padding: "12px 16px",
            background: "var(--sa-bg-subtle)",
            borderBottom: "1px solid var(--sa-border)"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span className="sv-btn" style={{ height: 27, padding: "6px 10px", fontSize: 12, fontWeight: 500 }}>
              <Icon name="funnel" size={12} color="var(--sa-fg-secondary)" />
              Filter set
              <Icon name="chevronDown" size={10} color="var(--sa-fg-tertiary)" />
            </span>
            <span style={{ width: 1, height: 16, background: "var(--sa-divider)" }} />
            {FILTERS.map((label) => (
              <span key={label} className="sv-btn" style={{ height: 27, padding: "6px 10px", fontSize: 12, fontWeight: 500 }}>
                {label}
                <Icon name="chevronDown" size={10} color="var(--sa-fg-tertiary)" />
              </span>
            ))}
            <span
              style={{
                height: 27,
                display: "flex",
                alignItems: "center",
                padding: "6px 10px",
                borderRadius: "var(--sa-radius-sm)",
                background: "var(--sa-primary-25)",
                fontSize: 12,
                fontWeight: 600,
                color: "var(--sa-primary-600)"
              }}
            >
              Clear Filter
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span className="sv-btn" style={{ width: 26, height: 26, padding: 0 }}>
              <Icon name="search" size={14} color="var(--sa-fg-secondary)" />
            </span>
            <span className="sv-btn" style={{ height: 27, padding: "6px 10px", fontSize: 12, fontWeight: 500 }}>
              Booked balance
              <Icon name="chevronDown" size={10} color="var(--sa-fg-tertiary)" />
            </span>
            <span className="sv-btn" style={{ width: 26, height: 26, padding: 0 }}>
              <Icon name="download" size={14} color="var(--sa-fg-secondary)" />
            </span>
            <span className="sv-btn" style={{ height: 27, padding: "6px 10px", fontSize: 12, fontWeight: 500 }}>
              <Icon name="layers" size={12} color="var(--sa-fg-secondary)" />
              Group by
              <Icon name="chevronDown" size={10} color="var(--sa-fg-tertiary)" />
            </span>
          </div>
        </div>

        <div style={{ flexGrow: 1, minHeight: 0, overflow: "auto" }}>
          <table className="sv-table">
            <thead>
              <tr>
                <th>Bank</th>
                <th>Name</th>
                <th>Entity</th>
                <th>Account identifier</th>
                <th className="sv-align-right">Booked balance</th>
                <th className="sv-align-right">In EUR</th>
                <th className="sv-align-right">Last updated</th>
                <th style={{ textAlign: "center" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {ACCOUNTS.map((row) => (
                <tr key={row.id}>
                  <td style={{ color: "var(--sa-fg)" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
                      <Icon name="building" size={14} color="var(--sa-fg)" strokeWidth={1.4} />
                      {row.bank}
                    </span>
                  </td>
                  <td>{row.name}</td>
                  <td>{row.entity}</td>
                  <td>{row.account}</td>
                  <td className={"sv-align-right sv-num" + (row.balance < 0 ? " sv-neg" : "")}>
                    {formatMoney(row.balance, row.currency)}{" "}
                    <span style={{ fontSize: 10, color: "var(--sa-fg-tertiary)" }}>{row.currency}</span>
                  </td>
                  <td className={"sv-align-right sv-num" + (row.eur < 0 ? " sv-neg" : "")}>
                    {formatMoney(row.eur, "EUR")} <span style={{ fontSize: 10, color: "var(--sa-fg-tertiary)" }}>EUR</span>
                  </td>
                  <td className="sv-align-right" style={{ color: "var(--sa-fg-tertiary)", fontWeight: 400 }}>
                    {row.updated}
                    <span
                      style={{
                        display: "inline-block",
                        width: 6,
                        height: 6,
                        marginLeft: 6,
                        borderRadius: "50%",
                        background: "var(--sa-success-600)"
                      }}
                    />
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <Icon name="arrowRight" size={14} color="var(--sa-fg-secondary)" strokeWidth={1.4} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div
          style={{
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "12px 16px",
            borderTop: "1px solid var(--sa-border)"
          }}
        >
          <span style={{ fontSize: 12, color: "var(--sa-fg-tertiary)" }}>{ACCOUNTS.length} accounts</span>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 500, color: "var(--sa-fg-secondary)" }}>Page 1 of 1</span>
            <span className="sv-btn" style={{ width: 24, height: 24, padding: 0 }}>
              <Icon name="chevronRight" size={10} color="var(--sa-fg-tertiary)" style={{ transform: "rotate(180deg)" }} />
            </span>
            <span className="sv-btn" style={{ width: 24, height: 24, padding: 0 }}>
              <Icon name="chevronRight" size={10} color="var(--sa-fg-tertiary)" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
