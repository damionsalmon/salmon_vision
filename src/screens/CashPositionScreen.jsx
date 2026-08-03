import React from "react";
import Icon from "../components/ui/Icon.jsx";
import { ACCOUNTS, CURRENCY_TOTALS, formatMoney, formatPercent } from "../data/mockData.js";

const FILTERS = ["Bank", "Entity", "Account", "Market", "Currency"];

/** Cash Position drill-down (the "NEXT" module screen from the Figma). */
export default function CashPositionScreen() {
  return (
    <div className="flex-grow self-stretch min-h-0 flex flex-col gap-6 p-3">
      <div className="flex gap-4 shrink-0">
        {CURRENCY_TOTALS.map((row) => (
          <div key={row.code} className="cp-currency-card">
            <div className="flex items-center justify-between">
              <span className="cp-chip">{row.code}</span>
              <span className="flex items-center gap-1">
                <Icon
                  name={row.trend >= 0 ? "arrowUp" : "arrowDown"}
                  size={10}
                  color={row.trend >= 0 ? "var(--sa-success-600)" : "var(--sa-error-600)"}
                />
                <span
                  className={"text-xs font-semibold" + (row.trend >= 0 ? " text-success-600" : " text-error-600")}
                >
                  {formatPercent(row.trend)}
                </span>
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="sv-num text-xl font-bold whitespace-nowrap overflow-hidden text-ellipsis">
                {formatMoney(row.amount, row.code)}
              </span>
              <span className="text-[11px] font-medium text-grey-500">Available Balance</span>
            </div>
          </div>
        ))}
      </div>

      <div className="cp-table-card">
        <div className="cp-toolbar">
          <div className="flex items-center gap-2">
            <span className="sv-btn sv-btn--filter">
              <Icon name="funnel" size={12} color="var(--sa-fg-secondary)" />
              Filter set
              <Icon name="chevronDown" size={10} color="var(--sa-fg-tertiary)" />
            </span>
            <span className="w-px h-4 bg-[var(--sa-divider)]" />
            {FILTERS.map((label) => (
              <span key={label} className="sv-btn sv-btn--filter">
                {label}
                <Icon name="chevronDown" size={10} color="var(--sa-fg-tertiary)" />
              </span>
            ))}
            <span className="cp-clear-filter">Clear Filter</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="sv-btn sv-btn--icon-26">
              <Icon name="search" size={14} color="var(--sa-fg-secondary)" />
            </span>
            <span className="sv-btn sv-btn--filter">
              Booked balance
              <Icon name="chevronDown" size={10} color="var(--sa-fg-tertiary)" />
            </span>
            <span className="sv-btn sv-btn--icon-26">
              <Icon name="download" size={14} color="var(--sa-fg-secondary)" />
            </span>
            <span className="sv-btn sv-btn--filter">
              <Icon name="layers" size={12} color="var(--sa-fg-secondary)" />
              Group by
              <Icon name="chevronDown" size={10} color="var(--sa-fg-tertiary)" />
            </span>
          </div>
        </div>

        <div className="flex-grow min-h-0 overflow-auto">
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
                <th className="sv-table-cell--center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {ACCOUNTS.map((row) => (
                <tr key={row.id}>
                  <td className="sv-table-cell--emphasis">
                    <span className="inline-flex items-center gap-2">
                      <Icon name="building" size={14} color="var(--sa-fg)" strokeWidth={1.4} />
                      {row.bank}
                    </span>
                  </td>
                  <td>{row.name}</td>
                  <td>{row.entity}</td>
                  <td>{row.account}</td>
                  <td className={"sv-align-right sv-num" + (row.balance < 0 ? " sv-neg" : "")}>
                    {formatMoney(row.balance, row.currency)}{" "}
                    <span className="text-[10px] text-grey-500">{row.currency}</span>
                  </td>
                  <td className={"sv-align-right sv-num" + (row.eur < 0 ? " sv-neg" : "")}>
                    {formatMoney(row.eur, "EUR")} <span className="text-[10px] text-grey-500">EUR</span>
                  </td>
                  <td className="sv-align-right sv-table-cell--muted">
                    {row.updated}
                    <span className="inline-block w-1.5 h-1.5 ml-1.5 rounded-full bg-success-600" />
                  </td>
                  <td className="text-center">
                    <Icon name="arrowRight" size={14} color="var(--sa-fg-secondary)" strokeWidth={1.4} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="cp-footer">
          <span className="text-xs text-grey-500">{ACCOUNTS.length} accounts</span>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-grey-700">Page 1 of 1</span>
            <span className="sv-btn sv-btn--icon-24">
              <Icon name="chevronRight" size={10} color="var(--sa-fg-tertiary)" flip />
            </span>
            <span className="sv-btn sv-btn--icon-24">
              <Icon name="chevronRight" size={10} color="var(--sa-fg-tertiary)" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
