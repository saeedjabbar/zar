"use client";

import { ReactNode } from "react";

interface StatCardProps {
  label: string;
  value: string;
  change?: string;
  icon?: ReactNode;
  accentColor?: "rust" | "slate";
}

export function StatCard({
  label,
  value,
  change,
  icon,
  accentColor = "rust",
}: StatCardProps) {
  const isPositiveChange = change && !change.startsWith("-");
  const isNegativeChange = change && change.startsWith("-");

  const iconAccent =
    accentColor === "slate" ? "var(--accent-slate)" : "var(--accent-rust)";

  return (
    <div
      className="rounded-xl p-6 transition-all duration-200 ease-out animate-fade-in-up hover:-translate-y-[1px]"
      style={{
        background: "var(--paper)",
        border: "1px solid var(--border-light)",
        boxShadow: "var(--shadow-paper)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "var(--shadow-card)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "var(--shadow-paper)";
      }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p
            className="text-sm font-medium mb-1"
            style={{ color: "var(--ink-muted)" }}
          >
            {label}
          </p>
          <p
            className="text-2xl font-bold font-serif"
            style={{ color: "var(--ink)" }}
          >
            {value}
          </p>
          {change && (
            <div className="mt-2 flex items-center">
              <span
                className="text-sm font-medium"
                style={{
                  color: isPositiveChange
                    ? "var(--status-success)"
                    : isNegativeChange
                    ? "var(--status-alert)"
                    : "var(--ink-muted)",
                }}
              >
                {isPositiveChange && (
                  <svg
                    className="inline-block w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 10l7-7m0 0l7 7m-7-7v18"
                    />
                  </svg>
                )}
                {isNegativeChange && (
                  <svg
                    className="inline-block w-4 h-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    />
                  </svg>
                )}
                {change}
              </span>
            </div>
          )}
        </div>
        {icon && (
          <div
            className="flex-shrink-0 p-3 rounded-xl"
            style={{
              background: `color-mix(in srgb, ${iconAccent} 10%, transparent)`,
              color: iconAccent,
            }}
          >
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
