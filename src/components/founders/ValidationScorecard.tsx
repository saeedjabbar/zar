"use client";

import type { ValidationScorecard as ScorecardType, ValidationDimension } from "@/types";

interface ValidationScorecardProps {
  scorecard: ScorecardType;
}

const verdictColors: Record<ScorecardType["overallVerdict"], string> = {
  persevere: "var(--status-success)",
  investigate: "var(--accent-ochre)",
  pivot: "var(--accent-terra)",
  kill: "var(--status-alert)",
};

const verdictLabels: Record<ScorecardType["overallVerdict"], string> = {
  persevere: "PERSEVERE",
  investigate: "INVESTIGATE",
  pivot: "PIVOT",
  kill: "KILL",
};

const signalColors: Record<ValidationDimension["signal"], string> = {
  strong: "var(--status-success)",
  moderate: "var(--accent-ochre)",
  weak: "var(--accent-terra)",
  absent: "var(--status-alert)",
};

function GaugeBar({ score, signal }: { score: number; signal: ValidationDimension["signal"] }) {
  return (
    <div
      className="h-2 rounded-full overflow-hidden flex-1"
      style={{ background: "var(--paper-warm)" }}
    >
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{
          width: `${score}%`,
          background: signalColors[signal],
        }}
      />
    </div>
  );
}

export default function ValidationScorecard({ scorecard }: ValidationScorecardProps) {
  const verdictColor = verdictColors[scorecard.overallVerdict];

  return (
    <section
      className="rounded-xl overflow-hidden"
      style={{
        background: "var(--paper)",
        border: "1px solid var(--border-light)",
        boxShadow: "var(--shadow-card)",
      }}
    >
      {/* Verdict Header */}
      <div
        className="p-6 text-center"
        style={{
          background: `linear-gradient(135deg, ${verdictColor}15, ${verdictColor}05)`,
          borderBottom: `2px solid ${verdictColor}`,
        }}
      >
        <div
          className="inline-block px-4 py-2 rounded-full font-mono text-sm font-bold tracking-wider"
          style={{
            background: verdictColor,
            color: "var(--paper)",
          }}
        >
          {verdictLabels[scorecard.overallVerdict]}
        </div>
        <p
          className="mt-3 text-sm max-w-md mx-auto"
          style={{ color: "var(--ink-light)" }}
        >
          {scorecard.verdictRationale}
        </p>
        <p
          className="mt-2 text-xs uppercase tracking-wide"
          style={{ color: "var(--ink-muted)" }}
        >
          Confidence: {scorecard.confidenceLevel} ({scorecard.dimensions.length} dimensions)
        </p>
      </div>

      {/* Dimensions */}
      <div className="p-6">
        <h4
          className="font-serif text-sm font-semibold mb-4 uppercase tracking-wide"
          style={{ color: "var(--ink-muted)" }}
        >
          Validation Dimensions
        </h4>
        <ul className="space-y-4">
          {scorecard.dimensions.map((dim) => (
            <li key={dim.id}>
              <div className="flex items-center justify-between gap-4 mb-1">
                <span
                  className="text-sm font-medium"
                  style={{ color: "var(--ink)" }}
                >
                  {dim.name}
                </span>
                <span
                  className="text-xs font-mono tabular-nums px-2 py-0.5 rounded"
                  style={{
                    background: `${signalColors[dim.signal]}20`,
                    color: signalColors[dim.signal],
                  }}
                >
                  {dim.score}%
                </span>
              </div>
              <div className="flex items-center gap-3">
                <GaugeBar score={dim.score} signal={dim.signal} />
              </div>
              <p
                className="text-xs mt-1"
                style={{ color: "var(--ink-muted)" }}
              >
                {dim.summary}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
