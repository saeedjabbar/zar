"use client";

import { Fragment, useState } from "react";
import type { EnhancedPilotCandidate } from "@/types";

interface PilotCandidatesTableProps {
  candidates: EnhancedPilotCandidate[];
}

function ScoreBadge({ score }: { score: number }) {
  let color = "var(--accent-slate)";
  if (score >= 70) color = "var(--status-success)";
  else if (score >= 50) color = "var(--accent-ochre)";
  else if (score >= 30) color = "var(--accent-terra)";

  return (
    <span
      className="inline-block px-2 py-1 rounded text-xs font-mono font-bold"
      style={{
        background: `${color}20`,
        color: color,
      }}
    >
      {score}
    </span>
  );
}

function FactorPill({ active, label }: { active: boolean; label: string }) {
  return (
    <span
      className="text-xs px-2 py-0.5 rounded"
      style={{
        background: active ? "var(--status-success)20" : "var(--paper-warm)",
        color: active ? "var(--status-success)" : "var(--ink-muted)",
      }}
    >
      {label}
    </span>
  );
}

export default function PilotCandidatesTable({ candidates }: PilotCandidatesTableProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (candidates.length === 0) {
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
          Pilot Candidates
        </h3>
        <p className="text-sm mt-2" style={{ color: "var(--ink-muted)" }}>
          No candidates meet the minimum readiness threshold.
        </p>
      </section>
    );
  }

  return (
    <section
      className="rounded-xl overflow-hidden"
      style={{
        background: "var(--paper)",
        border: "1px solid var(--border-light)",
        boxShadow: "var(--shadow-paper)",
      }}
    >
      <header className="p-6 pb-4">
        <h3
          className="font-serif text-lg font-semibold"
          style={{ color: "var(--ink)" }}
        >
          Pilot Candidates
        </h3>
        <p className="text-sm mt-1" style={{ color: "var(--ink-muted)" }}>
          Ranked by readiness score. Click to expand approach details.
        </p>
      </header>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: "var(--paper-warm)" }}>
              <th
                className="px-6 py-3 text-left font-medium"
                style={{ color: "var(--ink-muted)" }}
              >
                Score
              </th>
              <th
                className="px-6 py-3 text-left font-medium"
                style={{ color: "var(--ink-muted)" }}
              >
                Shop
              </th>
              <th
                className="px-6 py-3 text-left font-medium"
                style={{ color: "var(--ink-muted)" }}
              >
                Location
              </th>
              <th
                className="px-6 py-3 text-left font-medium"
                style={{ color: "var(--ink-muted)" }}
              >
                Factors
              </th>
            </tr>
          </thead>
          <tbody>
            {candidates.map((candidate, idx) => {
              const isExpanded = expandedId === candidate.interviewId;
              return (
                <Fragment key={candidate.interviewId}>
                  <tr
                    onClick={() =>
                      setExpandedId(isExpanded ? null : candidate.interviewId)
                    }
                    className="cursor-pointer transition-colors"
                    style={{
                      borderTop: idx > 0 ? "1px solid var(--border-light)" : undefined,
                      background: isExpanded ? "var(--paper-warm)" : undefined,
                    }}
                  >
                    <td className="px-6 py-4">
                      <ScoreBadge score={candidate.readinessScore} />
                    </td>
                    <td className="px-6 py-4" style={{ color: "var(--ink)" }}>
                      {candidate.shopType}
                    </td>
                    <td className="px-6 py-4" style={{ color: "var(--ink-light)" }}>
                      {candidate.location}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        <FactorPill active={candidate.factors.hasFxDemand} label="FX" />
                        <FactorPill active={candidate.factors.helpsCustomers} label="Helps" />
                        <FactorPill
                          active={candidate.factors.digitalRailCount >= 2}
                          label={`${candidate.factors.digitalRailCount} rails`}
                        />
                        <FactorPill active={candidate.factors.currentlyRefers} label="Refers" />
                      </div>
                    </td>
                  </tr>
                  {isExpanded && (
                    <tr key={`${candidate.interviewId}-expanded`}>
                      <td
                        colSpan={4}
                        className="px-6 py-4"
                        style={{
                          background: "var(--paper-warm)",
                          borderTop: "1px dashed var(--border-light)",
                        }}
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h5
                              className="text-xs font-semibold uppercase tracking-wide mb-2"
                              style={{ color: "var(--ink-muted)" }}
                            >
                              Approach Script
                            </h5>
                            <p
                              className="text-sm"
                              style={{ color: "var(--ink-light)" }}
                            >
                              {candidate.approachScript}
                            </p>
                          </div>
                          <div>
                            <h5
                              className="text-xs font-semibold uppercase tracking-wide mb-2"
                              style={{ color: "var(--ink-muted)" }}
                            >
                              Risk Mitigation
                            </h5>
                            <p
                              className="text-sm"
                              style={{ color: "var(--ink-light)" }}
                            >
                              {candidate.riskMitigation}
                            </p>
                          </div>
                        </div>
                        <div className="mt-3 flex gap-4 text-xs" style={{ color: "var(--ink-muted)" }}>
                          <span>Owner age: {candidate.ownerAge}</span>
                          <span>Daily customers: {candidate.dailyCustomers}</span>
                          <span>Trust level: {candidate.factors.trustConcernLevel}</span>
                        </div>
                      </td>
                    </tr>
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}
