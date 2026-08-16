export function formatTZS(amount: number | string | null | undefined): string {
  const value = Number(amount ?? 0);
  return `TZS ${value.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
}

export function formatCompact(amount: number | string | null | undefined): string {
  const value = Number(amount ?? 0);
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1).replace(/\.0$/, "")}K`;
  return `${value}`;
}

export function formatDate(value: string | Date | null | undefined): string {
  if (!value) return "—";
  return new Date(value).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function progressPercent(raised: number | string, goal: number | string): number {
  const g = Number(goal ?? 0);
  if (!g) return 0;
  return Math.min(100, Math.round((Number(raised ?? 0) / g) * 100));
}

export function daysRemaining(endDate: string | null | undefined): number | null {
  if (!endDate) return null;
  const diff = new Date(endDate).getTime() - Date.now();
  return Math.max(0, Math.ceil(diff / 86_400_000));
}

export const PAYMENT_METHODS = [
  { id: "mpesa", label: "M-Pesa", hint: "Vodacom mobile money" },
  { id: "airtel", label: "Airtel Money", hint: "Airtel mobile money" },
  { id: "tigo", label: "Tigo Pesa", hint: "Mixx by Yas" },
  { id: "visa", label: "Visa", hint: "Debit or credit card" },
  { id: "mastercard", label: "Mastercard", hint: "Debit or credit card" },
] as const;

export function paymentLabel(id: string): string {
  return PAYMENT_METHODS.find((m) => m.id === id)?.label ?? id;
}

export const TSHIRT_SIZES = ["XS", "S", "M", "L", "XL", "XXL"] as const;
export type TshirtSize = (typeof TSHIRT_SIZES)[number];

export const ORDER_STEPS = [
  "confirmed",
  "reserved",
  "processing",
  "ready",
  "shipped",
  "delivered",
] as const;

export const ORDER_STEP_LABELS: Record<string, string> = {
  confirmed: "Donation confirmed",
  reserved: "Reserved",
  processing: "Processing",
  ready: "Ready",
  shipped: "Shipped",
  delivered: "Delivered",
};
