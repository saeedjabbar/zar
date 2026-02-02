"use client";

import type { WillingnessFactor, Actionability } from "@/types";

interface WillingnessFactorsProps {
  factors: WillingnessFactor[];
}

const actionabilityColors: Record<Actionability, string> = {
  high: "var(--status-success)",
  medium: "var(--accent-ochre)",
  low: "var(--accent-slate)",
};

const actionabilityLabels: Record<Actionability, string> = {
  high: "High",
  medium: "Med",
  low: "Low",
};

export default function WillingnessFactors({ factors }: WillingnessFactorsProps) {
  if (factors.length === 0) {
    return (
      <section
        className="rounded-xl p-6"
        style={{
          background: "var(--paper)",
          border: "1px solid var(--border-light)",
          boxShadow: "var(--shadow-paper)",
        }}
      >
        <h3
          className="font-serif text-lg font-semibold"
          style={{ color: "var(--ink)" }}
        >
          What Would Convert Merchants
        </h3>
        <p className="text-sm mt-2" style={{ color: "var(--ink-muted)" }}>
          No willingness factors detected in interviews.
        </p>
      </section>
    );
  }

  const maxMentions = Math.max(1, ...factors.map((f) => f.mentionCount));

  return (
    <section
      className="rounded-xl p-6"
      style={{
        background: "var(--paper)",
        border: "1px solid var(--border-light)",
        boxShadow: "var(--shadow-paper)",
      }}
    >
      <header className="mb-5">
        <h3
          className="font-serif text-lg font-semibold"
          style={{ color: "var(--ink)" }}
        >
          What Would Convert Merchants
        </h3>
        <p className="text-sm mt-1" style={{ color: "var(--ink-muted)" }}>
          Factors that build trust and willingness to act
        </p>
      </header>

      <ul className="space-y-4">
        {factors.map((factor) => {
          const pct = Math.round((factor.mentionCount / maxMentions) * 100);
          const actionColor = actionabilityColors[factor.actionability];

          return (
            <li key={factor.factor}>
              <div className="flex items-center justify-between gap-4 mb-1">
                <div className="flex items-center gap-2">
                  <span
                    className="text-sm font-medium"
                    style={{ color: "var(--ink)" }}
                  >
                    {factor.factor}
                  </span>
                  <span
                    className="text-xs px-2 py-0.5 rounded font-mono"
                    style={{
                      background: `${actionColor}20`,
                      color: actionColor,
                    }}
                  >
                    {actionabilityLabels[factor.actionability]}
                  </span>
                </div>
                <span
                  className="text-sm font-mono tabular-nums"
                  style={{ color: "var(--ink-muted)" }}
                >
                  {factor.mentionCount} mention{factor.mentionCount !== 1 ? "s" : ""}
                </span>
              </div>

              <div
                className="h-2 rounded-full overflow-hidden mb-2"
                style={{ background: "var(--paper-warm)" }}
              >
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${pct}%`,
                    background: actionColor,
                  }}
                />
              </div>

              <p
                className="text-xs"
                style={{ color: "var(--ink-muted)" }}
              >
                → {factor.suggestedAction}
              </p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
