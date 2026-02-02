import type { BarDatum } from "@/types";

interface BarListCardProps {
  title: string;
  subtitle?: string;
  data: BarDatum[];
}

export default function BarListCard({ title, subtitle, data }: BarListCardProps) {
  const max = Math.max(1, ...data.map((d) => d.value));

  return (
    <section
      className="rounded-xl p-6"
      style={{
        background: "var(--paper)",
        border: "1px solid var(--border-light)",
        boxShadow: "var(--shadow-paper)",
      }}
    >
      <header className="mb-4">
        <h3
          className="font-serif text-lg font-semibold"
          style={{ color: "var(--ink)" }}
        >
          {title}
        </h3>
        {subtitle && (
          <p className="text-sm mt-1" style={{ color: "var(--ink-muted)" }}>
            {subtitle}
          </p>
        )}
      </header>

      {data.length === 0 ? (
        <p className="text-sm" style={{ color: "var(--ink-muted)" }}>
          No data available.
        </p>
      ) : (
        <ul className="space-y-3">
          {data.map((d) => {
            const pct = Math.round((d.value / max) * 100);
            return (
              <li key={d.name} className="space-y-1">
                <div className="flex items-baseline justify-between gap-4">
                  <span className="text-sm" style={{ color: "var(--ink-light)" }}>
                    {d.name}
                  </span>
                  <span
                    className="text-sm font-medium tabular-nums"
                    style={{ color: "var(--ink-muted)" }}
                  >
                    {d.value}
                  </span>
                </div>
                <div
                  className="h-2 rounded-full overflow-hidden"
                  style={{ background: "var(--paper-warm)" }}
                >
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${pct}%`,
                      background: d.color ?? "var(--accent-sage)",
                    }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

