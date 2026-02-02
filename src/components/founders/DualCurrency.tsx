import { formatDualCurrency, formatPkr, formatUsd } from "@/lib/founder-insights";

interface DualCurrencyProps {
  pkr: number;
  /** Display mode: "both" shows USD (PKR), "pkr" shows only PKR, "usd" shows only USD */
  mode?: "both" | "pkr" | "usd";
  /** Optional className for styling */
  className?: string;
}

export default function DualCurrency({
  pkr,
  mode = "both",
  className = "",
}: DualCurrencyProps) {
  if (pkr === 0 || pkr === undefined || pkr === null) {
    return (
      <span className={className} style={{ color: "var(--ink-muted)" }}>
        —
      </span>
    );
  }

  let display: string;
  switch (mode) {
    case "pkr":
      display = formatPkr(pkr);
      break;
    case "usd":
      display = formatUsd(pkr);
      break;
    default:
      display = formatDualCurrency(pkr);
  }

  return (
    <span className={`font-mono tabular-nums ${className}`}>
      {display}
    </span>
  );
}
