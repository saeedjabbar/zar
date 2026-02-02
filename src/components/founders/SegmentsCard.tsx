import type { SegmentSummary } from "@/types";

interface SegmentsCardProps {
  segments: SegmentSummary[];
}

export default function SegmentsCard({ segments }: SegmentsCardProps) {
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
          Pilot Segments
        </h3>
        <p className="text-sm mt-1" style={{ color: "var(--ink-muted)" }}>
          A lightweight segmentation based on demand, digital readiness, and trust
          signals.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {segments.map((s) => (
          <div
            key={s.segment}
            className="rounded-lg p-4"
            style={{
              background: "var(--paper-warm)",
              border: "1px solid var(--border-light)",
            }}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ background: s.color }}
                  />
                  <h4
                    className="font-serif font-semibold"
                    style={{ color: "var(--ink)" }}
                  >
                    {s.label}
                  </h4>
                </div>
                <p className="text-sm mt-1" style={{ color: "var(--ink-light)" }}>
                  {s.description}
                </p>
              </div>
              <div className="text-right">
                <div
                  className="font-serif text-2xl font-bold tabular-nums"
                  style={{ color: "var(--ink)" }}
                >
                  {s.count}
                </div>
                <div className="text-xs" style={{ color: "var(--ink-muted)" }}>
                  {Math.round(s.share * 100)}%
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

