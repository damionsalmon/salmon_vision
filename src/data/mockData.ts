export interface CurrencyTotal {
  code: string;
  label: string;
  amount: number;
  eur: number;
  share: number;
  trend: number;
}

export interface CountryTotal {
  code: string;
  label: string;
  eur: number;
  share: number;
  trend: number;
}

export interface BankTotal {
  label: string;
  eur: number;
  share: number;
  trend: number;
  accounts: number;
}

export interface CashPoint {
  day: string;
  value: number;
}

export interface Account {
  id: string;
  bank: string;
  name: string;
  entity: string;
  account: string;
  balance: number;
  currency: string;
  eur: number;
  updated: string;
}

export const CURRENCY_TOTALS: CurrencyTotal[] = [
  { code: "GBP", label: "Pound sterling", amount: 2456789.0, eur: 2874443.13, share: 0.24, trend: 1.2 },
  { code: "EUR", label: "Euro", amount: 11819632.0, eur: 11819632.0, share: 0.42, trend: 0.8 },
  { code: "USD", label: "US dollar", amount: 892340.0, eur: 775849.35, share: 0.08, trend: -2.1 },
  { code: "SEK", label: "Swedish krona", amount: 54241866.0, eur: 4940329.53, share: 0.18, trend: 0.3 },
  { code: "DKK", label: "Danish krone", amount: 107947000.0, eur: 14440394.1, share: 0.08, trend: -0.5 }
];

export const COUNTRY_TOTALS: CountryTotal[] = [
  { code: "DE", label: "Germany", eur: 11819632.0, share: 0.34, trend: 0.9 },
  { code: "DK", label: "Denmark", eur: 14440394.1, share: 0.31, trend: -0.5 },
  { code: "SE", label: "Sweden", eur: 4940329.53, share: 0.14, trend: 0.3 },
  { code: "GB", label: "United Kingdom", eur: 7045662.4, share: 0.17, trend: 1.2 },
  { code: "NL", label: "Netherlands", eur: 155116.73, share: 0.04, trend: -0.2 }
];

export const BANK_TOTALS: BankTotal[] = [
  { label: "Nordea Bank", eur: 2094414.89, share: 0.21, trend: 0.6, accounts: 3 },
  { label: "Deutsche Bank", eur: 2094870.3, share: 0.21, trend: 0.4, accounts: 2 },
  { label: "Barclays Bank", eur: 7222926.02, share: 0.28, trend: 1.1, accounts: 4 },
  { label: "BNP Paribas", eur: 7221735.44, share: 0.19, trend: -0.3, accounts: 2 },
  { label: "HSBC Bank", eur: 101836.0, share: 0.11, trend: 0.2, accounts: 1 }
];

export const CASH_SERIES: CashPoint[] = [
  { day: "Mon", value: 1980000 },
  { day: "Tue", value: 2110000 },
  { day: "Wed", value: 2045000 },
  { day: "Thu", value: 2280000 },
  { day: "Fri", value: 2190000 },
  { day: "Sat", value: 2390000 },
  { day: "Sun", value: 2456789 }
];

const DEFAULT_NAME = "Arctic Commerce Bank Collection SEK";
const DEFAULT_ENTITY = "Test AB";
const DEFAULT_ACCOUNT = "SE6517658659947588313253";
const DEFAULT_DATE = "2026-07-30 22:59";

type AccountSeed = Partial<Account> & { bank: string; balance: number; currency: string; eur: number };

const ACCOUNT_SEEDS: AccountSeed[] = [
  { bank: "Société Générale", balance: -6723.21, currency: "EUR", eur: -6723.21 },
  { bank: "Intesa Sanpaolo", balance: -6120.01, currency: "EUR", eur: -6120.01 },
  {
    bank: "Raiffeisen Bank",
    name: "Arctic Commerce Bank Corporate SEK",
    account: "SE9618481343965545886425",
    balance: 4075308.0,
    currency: "SEK",
    eur: 371184.42
  },
  {
    bank: "ABN AMRO",
    name: "Arctic Commerce Bank Corporate SEK",
    account: "SE9618481343965545886425",
    balance: 4170558.0,
    currency: "SEK",
    eur: 379859.92
  },
  {
    bank: "Nordea Bank",
    name: "Arctic Commerce Bank Disbursement SEK",
    account: "SE3057712583769462657446",
    balance: 22995000.0,
    currency: "SEK",
    eur: 2094414.89
  },
  {
    bank: "Deutsche Bank",
    name: "Arctic Commerce Bank Disbursement SEK",
    account: "SE3057712583769462657446",
    balance: 23000000.0,
    currency: "SEK",
    eur: 2094870.3
  },
  {
    bank: "Santander Bank",
    name: "Baltic Trade Bank Collection DKK",
    account: "DK3650517838176483",
    entity: "Test ApS",
    balance: -31900.0,
    currency: "DKK",
    eur: -4267.36
  },
  {
    bank: "UBS Bank",
    name: "Baltic Trade Bank Collection DKK",
    account: "DK3650517838176483",
    entity: "Test ApS",
    balance: 0,
    currency: "DKK",
    eur: 0
  },
  {
    bank: "Barclays Bank",
    name: "Baltic Trade Bank Disbursement DKK",
    account: "DK5750512643544999",
    entity: "Test ApS",
    balance: 53993900.0,
    currency: "DKK",
    eur: 7222926.02
  },
  {
    bank: "BNP Paribas",
    name: "Baltic Trade Bank Disbursement DKK",
    account: "DK5750512643544999",
    entity: "Test ApS",
    balance: 53985000.0,
    currency: "DKK",
    eur: 7221735.44
  },
  {
    bank: "Credit Suisse",
    name: "Summit Finance Bank Collection EUR",
    account: "DE77500105179251553356",
    entity: "Test GmbH",
    balance: 5805460.0,
    currency: "EUR",
    eur: 5805460.0
  },
  {
    bank: "ING Bank",
    name: "Summit Finance Bank Collection EUR",
    account: "DE77500105179251553356",
    entity: "Test GmbH",
    balance: 5808000.0,
    currency: "EUR",
    eur: 5808000.0
  },
  {
    bank: "UniCredit Bank",
    name: "Summit Finance Bank Corporate EUR",
    account: "DE93500105171811179611",
    entity: "Test GmbH",
    balance: 104336.0,
    currency: "EUR",
    eur: 104336.0
  },
  {
    bank: "HSBC Bank",
    name: "Summit Finance Bank Corporate EUR",
    account: "DE93500105171811179611",
    entity: "Test GmbH",
    balance: 101836.0,
    currency: "EUR",
    eur: 101836.0
  },
  {
    bank: "Lloyds Bank",
    name: "Royal Crown Trade Bank Corporate GBP",
    account: "GB12BARC20032661422176",
    entity: "Test Ltd",
    balance: 6021364.0,
    currency: "GBP",
    eur: 7045662.4,
    updated: "2026-07-30 23:59"
  },
  {
    bank: "Rabobank",
    name: "Royal Crown Trade Bank Corporate USD",
    account: "GB49BARC20035398793132",
    entity: "Test Ltd",
    balance: 178392.0,
    currency: "USD",
    eur: 155116.73,
    updated: "2026-07-30 23:59"
  }
];

export const ACCOUNTS: Account[] = ACCOUNT_SEEDS.map((row, i) => ({
  id: "acc-" + i,
  name: DEFAULT_NAME,
  entity: DEFAULT_ENTITY,
  account: DEFAULT_ACCOUNT,
  updated: DEFAULT_DATE,
  ...row
}));

export const TOP_ACCOUNTS: Account[] = [...ACCOUNTS].sort((a, b) => b.eur - a.eur).slice(0, 6);

const SYMBOLS: Record<string, string> = { GBP: "£", EUR: "€", USD: "$", SEK: "kr", DKK: "kr" };

export function formatMoney(value: number, currency: string): string {
  const symbol = SYMBOLS[currency] || "";
  const abs = Math.abs(value).toLocaleString("en-GB", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  return (value < 0 ? "-" : "") + symbol + abs;
}

export function formatCompact(value: number, currency: string): string {
  const symbol = SYMBOLS[currency] || "";
  const abs = Math.abs(value);
  const unit = abs >= 1e6 ? "M" : abs >= 1e3 ? "K" : "";
  const scaled = abs >= 1e6 ? abs / 1e6 : abs >= 1e3 ? abs / 1e3 : abs;
  return (value < 0 ? "-" : "") + symbol + scaled.toFixed(scaled < 10 ? 2 : 1) + unit;
}

export function formatPercent(value: number): string {
  return (value > 0 ? "+" : "") + value.toFixed(1) + "%";
}
