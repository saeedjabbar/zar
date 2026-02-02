"use client";

import { useMemo, useState } from "react";

import type { EvidenceQuote, FounderTheme } from "@/types";

const THEME_LABELS: Record<FounderTheme, string> = {
  fx_demand: "FX demand",
  fx_referral: "Referrals",
  customer_support: "Customer help",
  fraud: "Fraud",
  trust: "Trust",
  compliance: "Compliance",
  payments: "Payments",
};

interface EvidenceExplorerProps {
  quotes: EvidenceQuote[];
}

export default function EvidenceExplorer({ quotes }: EvidenceExplorerProps) {
  const [theme, setTheme] = useState<FounderTheme | "all">("all");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return quotes.filter((item) => {
      const themeOk = theme === "all" ? true : item.theme === theme;
      if (!themeOk) return false;
      if (!q) return true;
      return (
        item.quote.toLowerCase().includes(q) ||
        item.sourceLabel.toLowerCase().includes(q)
      );
    });
  }, [quotes, query, theme]);

  return (
    <section
      className="rounded-xl p-6"
      style={{
        background: "var(--paper)",
        border: "1px solid var(--border-light)",
        boxShadow: "var(--shadow-paper)",
      }}
    >
      <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-5">
        <div>
          <h3
            className="font-serif text-lg font-semibold"
            style={{ color: "var(--ink)" }}
          >
            Evidence Explorer
          </h3>
          <p className="text-sm mt-1" style={{ color: "var(--ink-muted)" }}>
            Filter verbatim quotes pulled from transcripts.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <label className="text-sm" style={{ color: "var(--ink-muted)" }}>
            <span className="sr-only">Theme</span>
            <select
              className="px-3 py-2 rounded-lg text-sm"
              style={{
                background: "var(--paper-warm)",
                border: "1px solid var(--border-light)",
                color: "var(--ink)",
              }}
              value={theme}
              onChange={(e) => setTheme(e.target.value as FounderTheme | "all")}
            >
              <option value="all">All themes</option>
              {Object.entries(THEME_LABELS).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </label>

          <label className="text-sm" style={{ color: "var(--ink-muted)" }}>
            <span className="sr-only">Search</span>
            <input
              className="px-3 py-2 rounded-lg text-sm w-full sm:w-64"
              style={{
                background: "var(--paper-warm)",
                border: "1px solid var(--border-light)",
                color: "var(--ink)",
              }}
              placeholder="Search quotes…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </label>
        </div>
      </header>

      <div className="space-y-4">
        {filtered.length === 0 ? (
          <p className="text-sm" style={{ color: "var(--ink-muted)" }}>
            No matching quotes.
          </p>
        ) : (
          filtered.slice(0, 40).map((q, idx) => (
            <article
              key={`${q.sourceLabel}-${q.theme}-${idx}`}
              className="rounded-lg p-4"
              style={{
                background: "var(--paper-warm)",
                border: "1px solid var(--border-light)",
              }}
            >
              <div className="flex items-center justify-between gap-4 mb-2">
                <span
                  className="text-xs font-medium uppercase tracking-wide"
                  style={{ color: "var(--ink-muted)" }}
                >
                  {THEME_LABELS[q.theme]}
                </span>
                <span
                  className="text-xs"
                  style={{ color: "var(--ink-muted)" }}
                >
                  {q.sourceLabel}
                </span>
              </div>
              <blockquote
                className="text-sm leading-relaxed"
                style={{ color: "var(--ink-light)" }}
              >
                “{q.quote}”
              </blockquote>
            </article>
          ))
        )}
      </div>
    </section>
  );
}

