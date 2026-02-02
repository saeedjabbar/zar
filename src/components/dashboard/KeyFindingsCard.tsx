"use client";

interface KeyFindingsCardProps {
  title: string;
  findings: string[];
}

export function KeyFindingsCard({ title, findings }: KeyFindingsCardProps) {
  return (
    <div
      className="rounded-xl p-6 border transition-shadow duration-200 hover:shadow-lg"
      style={{
        background: "var(--paper)",
        borderColor: "var(--border-light)",
        boxShadow: "var(--shadow-paper)",
      }}
    >
      <h3
        className="font-serif text-lg font-semibold mb-4"
        style={{ color: "var(--ink)" }}
      >
        {title}
      </h3>
      <ul className="space-y-3">
        {findings.map((finding, index) => (
          <li key={index} className="flex items-start gap-3">
            <span className="flex-shrink-0 mt-0.5">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                style={{ color: "var(--accent-sage)" }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </span>
            <span
              className="text-sm leading-relaxed"
              style={{ color: "var(--ink-light)" }}
            >
              {finding}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
