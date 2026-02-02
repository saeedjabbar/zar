"use client";

import type { FunnelStage } from "@/types";

interface ConversionFunnelProps {
  stages: FunnelStage[];
}

const stageColors = [
  "var(--accent-slate)",
  "var(--accent-terra)",
  "var(--accent-ochre)",
  "var(--accent-sage)",
  "var(--status-success)",
];

export default function ConversionFunnel({ stages }: ConversionFunnelProps) {
  if (stages.length === 0) return null;

  const maxCount = stages[0]?.count ?? 1;

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
          Conversion Funnel
        </h3>
        <p className="text-sm mt-1" style={{ color: "var(--ink-muted)" }}>
          From all interviews to pilot-ready merchants
        </p>
      </header>

      <div className="space-y-3">
        {stages.map((stage, idx) => {
          const widthPct = maxCount > 0 ? (stage.count / maxCount) * 100 : 0;
          const color = stageColors[idx] ?? "var(--accent-slate)";
          const isLast = idx === stages.length - 1;
          const dropOff = idx > 0 ? stages[idx - 1].count - stage.count : 0;

          return (
            <div key={stage.name}>
              <div className="flex items-center justify-between gap-4 mb-1">
                <span
                  className="text-sm font-medium"
                  style={{ color: "var(--ink)" }}
                >
                  {stage.name}
                </span>
                <div className="flex items-center gap-2">
                  {dropOff > 0 && (
                    <span
                      className="text-xs"
                      style={{ color: "var(--accent-terra)" }}
                    >
                      -{dropOff}
                    </span>
                  )}
                  <span
                    className="text-sm font-mono tabular-nums font-bold"
                    style={{ color: "var(--ink)" }}
                  >
                    {stage.count}
                  </span>
                  <span
                    className="text-xs font-mono tabular-nums"
                    style={{ color: "var(--ink-muted)" }}
                  >
                    ({stage.percentage}%)
                  </span>
                </div>
              </div>

              <div
                className="h-8 rounded-lg overflow-hidden relative"
                style={{ background: "var(--paper-warm)" }}
              >
                <div
                  className="h-full rounded-lg transition-all duration-500 flex items-center justify-end pr-3"
                  style={{
                    width: `${Math.max(widthPct, 10)}%`,
                    background: color,
                    minWidth: "60px",
                  }}
                >
                  {isLast && stage.count > 0 && (
                    <span
                      className="text-xs font-bold"
                      style={{ color: "var(--paper)" }}
                    >
                      READY
                    </span>
                  )}
                </div>
              </div>

              {stage.dropOffReason && idx > 0 && dropOff > 0 && (
                <p
                  className="text-xs mt-1 pl-2"
                  style={{ color: "var(--ink-muted)" }}
                >
                  Drop-off: {stage.dropOffReason}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
