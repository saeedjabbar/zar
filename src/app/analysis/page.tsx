import Link from "next/link";

import { AnalysisSection, AnalysisFinding, FindingSeverity } from "@/types";
import { sortFindingsBySeverity } from "@/lib/analysis-utils";
import { getInterviews } from "@/lib/interviews";

function safePercent(numerator: number, denominator: number) {
  if (denominator <= 0) return 0;
  return Math.round((numerator / denominator) * 100);
}

function severityFromShare(share: number): FindingSeverity {
  if (share >= 0.5) return "critical";
  if (share >= 0.25) return "important";
  if (share >= 0.1) return "moderate";
  return "minor";
}

const analysisData = (() => {
  const interviews = getInterviews();
  const total = interviews.length;

  const paymentCounts = interviews.reduce<Record<string, number>>((acc, i) => {
    i.paymentMethods.forEach((method) => {
      const key = method || "Unknown";
      acc[key] = (acc[key] ?? 0) + 1;
    });
    return acc;
  }, {});

  const topPayments = Object.entries(paymentCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const usesMobilePayments = interviews.filter((i) => {
    const v = i.mobilePaymentTimeline.trim().toLowerCase();
    if (!v) return false;
    return !["no", "n/a", "na", "none", "never"].includes(v);
  }).length;

  const fraudStories = interviews.filter((i) => i.fraudStory).length;
  const helpRequests = interviews.filter((i) => i.customerAskedForHelp).length;
  const dollarInquiries = interviews.filter((i) => i.dollarInquiry).length;
  const currencyExchangeReferrals = interviews.filter(
    (i) => i.currencyExchangeReferral.length > 0
  ).length;

  const sections: AnalysisSection[] = [
    {
      id: "1",
      title: "Payments & Adoption",
      summary: "Accepted payment methods and mobile payment adoption signals.",
      findings: [
        {
          id: "f1",
          title: "Top Accepted Payment Methods",
          description:
            topPayments.length > 0
              ? `Most-mentioned methods: ${topPayments
                  .map(([name, count]) => `${name} (${count})`)
                  .join(", ")}.`
              : "No payment methods were detected in the dataset.",
          severity: "important",
          category: "payments",
        },
        {
          id: "f2",
          title: "Mobile Payments Adoption",
          description: `${usesMobilePayments} of ${total} (${safePercent(
            usesMobilePayments,
            total
          )}%) reported a non-empty timeline for starting mobile payments.`,
          severity: severityFromShare(total > 0 ? usesMobilePayments / total : 0),
          category: "adoption",
          recommendations: [
            "Standardize onboarding and training materials",
            "Clarify common setup steps for merchants",
          ],
        },
      ] as AnalysisFinding[],
    },
    {
      id: "2",
      title: "Fraud, Trust & Customer Support",
      summary:
        "Signals around fraud experiences, customer help requests, and foreign currency questions.",
      findings: [
        {
          id: "f3",
          title: "Fraud Stories Mentioned",
          description: `${fraudStories} of ${total} (${safePercent(
            fraudStories,
            total
          )}%) mentioned a real fraud story.`,
          severity: severityFromShare(total > 0 ? fraudStories / total : 0),
          category: "fraud",
          recommendations: [
            "Add lightweight fraud-prevention checklists",
            "Share scam patterns and safe handling practices",
          ],
        },
        {
          id: "f4",
          title: "Customers Asking for Help",
          description: `${helpRequests} of ${total} (${safePercent(
            helpRequests,
            total
          )}%) reported customers asking for help sending/receiving money.`,
          severity: severityFromShare(total > 0 ? helpRequests / total : 0),
          category: "support",
          recommendations: [
            "Create simple, in-store step-by-step guides",
            "Provide a clear escalation path for customer issues",
          ],
        },
        {
          id: "f5",
          title: "Foreign Currency Questions",
          description: `${dollarInquiries} of ${total} (${safePercent(
            dollarInquiries,
            total
          )}%) reported customer questions about dollars/foreign money.`,
          severity: severityFromShare(total > 0 ? dollarInquiries / total : 0),
          category: "fx",
        },
        {
          id: "f6",
          title: "Currency Exchange Referrals",
          description: `${currencyExchangeReferrals} of ${total} (${safePercent(
            currencyExchangeReferrals,
            total
          )}%) said they send customers elsewhere for currency exchange.`,
          severity: severityFromShare(
            total > 0 ? currencyExchangeReferrals / total : 0
          ),
          category: "fx",
        },
      ] as AnalysisFinding[],
    },
  ];

  const mostMentionedPayment = topPayments[0]?.[0];

  return {
    title: "Interview Analysis Report",
    executiveSummary:
      total === 0
        ? "No interviews available to analyze."
        : `This report summarizes ${total} interviews. The most-mentioned accepted payment method is ${
            mostMentionedPayment ?? "N/A"
          }. Fraud stories were mentioned by ${fraudStories} interviewees, and ${helpRequests} reported customers asking for help with sending/receiving money.`,
    sections,
    keyRecommendations: [
      "Standardize merchant onboarding for mobile payments",
      "Provide clear fraud-prevention and scam-awareness guidance",
      "Offer customer-facing how-to materials for common payment flows",
      "Document recommended currency exchange referral options",
    ],
  };
})();

// Severity indicator component with Field Notes design system
function SeverityBadge({ severity }: { severity: FindingSeverity }) {
  const getColorStyles = (sev: FindingSeverity) => {
    switch (sev) {
      case "critical":
        return {
          background: "color-mix(in srgb, var(--status-alert) 15%, transparent)",
          color: "var(--status-alert)",
          borderColor: "color-mix(in srgb, var(--status-alert) 30%, transparent)",
        };
      case "important":
        return {
          background: "color-mix(in srgb, var(--status-warning) 15%, transparent)",
          color: "var(--status-warning)",
          borderColor: "color-mix(in srgb, var(--status-warning) 30%, transparent)",
        };
      case "moderate":
        return {
          background: "color-mix(in srgb, var(--accent-ochre) 15%, transparent)",
          color: "var(--accent-ochre)",
          borderColor: "color-mix(in srgb, var(--accent-ochre) 30%, transparent)",
        };
      case "minor":
        return {
          background: "color-mix(in srgb, var(--accent-sage) 15%, transparent)",
          color: "var(--accent-sage)",
          borderColor: "color-mix(in srgb, var(--accent-sage) 30%, transparent)",
        };
    }
  };

  const iconMap: Record<FindingSeverity, React.ReactNode> = {
    critical: (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <circle cx="12" cy="12" r="10" strokeWidth="2" />
        <line x1="12" y1="8" x2="12" y2="12" strokeWidth="2" />
        <circle cx="12" cy="16" r="1" fill="currentColor" />
      </svg>
    ),
    important: (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
      </svg>
    ),
    moderate: (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <circle cx="12" cy="12" r="10" strokeWidth="2" />
        <line x1="12" y1="16" x2="12" y2="12" strokeWidth="2" />
        <circle cx="12" cy="8" r="1" fill="currentColor" />
      </svg>
    ),
    minor: (
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  };

  const styles = getColorStyles(severity);

  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full border"
      style={styles}
    >
      {iconMap[severity]}
      {severity.charAt(0).toUpperCase() + severity.slice(1)}
    </span>
  );
}

// Finding card component with Field Notes design system
function FindingCard({ finding }: { finding: AnalysisFinding }) {
  return (
    <div
      className="rounded-xl p-5"
      style={{
        background: "var(--paper)",
        border: "1px solid var(--border-light)",
        boxShadow: "var(--shadow-paper)",
      }}
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <h4
          className="font-serif font-semibold text-base"
          style={{ color: "var(--ink)" }}
        >
          {finding.title}
        </h4>
        <SeverityBadge severity={finding.severity} />
      </div>
      <p className="text-sm mb-4" style={{ color: "var(--ink-light)" }}>
        {finding.description}
      </p>
      <div className="flex items-center gap-2 text-xs mb-3">
        <span
          className="px-2.5 py-1 rounded-full"
          style={{
            background: "var(--paper-warm)",
            color: "var(--ink-muted)",
            border: "1px solid var(--border-light)",
          }}
        >
          {finding.category}
        </span>
      </div>
      {finding.recommendations && finding.recommendations.length > 0 && (
        <div
          className="mt-4 pt-4"
          style={{ borderTop: "1px solid var(--border-light)" }}
        >
          <p
            className="text-xs font-medium mb-2"
            style={{ color: "var(--ink)" }}
          >
            Recommendations:
          </p>
          <ul className="space-y-1.5">
            {finding.recommendations.map((rec, index) => (
              <li
                key={index}
                className="text-xs flex items-start gap-2"
                style={{ color: "var(--ink-light)" }}
              >
                <span style={{ color: "var(--accent-sage)" }}>-</span>
                {rec}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// Analysis section component with Field Notes design system
function AnalysisSectionCard({ section }: { section: AnalysisSection }) {
  const sortedFindings = sortFindingsBySeverity(section.findings);

  return (
    <div
      className="rounded-xl p-6 mb-6"
      style={{
        background: "var(--paper)",
        border: "1px solid var(--border-light)",
        boxShadow: "var(--shadow-paper)",
      }}
    >
      <h2
        className="font-serif text-xl font-bold mb-2"
        style={{ color: "var(--ink)" }}
      >
        {section.title}
      </h2>
      <p className="text-sm mb-6" style={{ color: "var(--ink-light)" }}>
        {section.summary}
      </p>
      <div className="space-y-4">
        {sortedFindings.map((finding) => (
          <FindingCard key={finding.id} finding={finding} />
        ))}
      </div>
    </div>
  );
}

export default function AnalysisPage() {
  return (
    <div className="min-h-screen" style={{ background: "var(--background)" }}>
      {/* Decorative header band */}
      <div
        className="h-2"
        style={{
          background:
            "linear-gradient(90deg, var(--accent-rust) 0%, var(--accent-terra) 25%, var(--accent-ochre) 50%, var(--accent-sage) 75%, var(--accent-slate) 100%)",
        }}
      />

      {/* Navigation */}
      <nav
        className="border-b"
        style={{
          background: "var(--paper)",
          borderColor: "var(--border-light)",
        }}
      >
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="group inline-flex items-center gap-2 text-sm font-medium transition-colors"
              style={{ color: "var(--ink-light)" }}
            >
              <svg
                className="w-4 h-4 transition-transform group-hover:-translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              <span className="group-hover:underline">Dashboard</span>
            </Link>
            <Link
              href="/interviews"
              className="group inline-flex items-center gap-2 text-sm font-medium transition-colors"
              style={{ color: "var(--ink-light)" }}
            >
              <span className="group-hover:underline">Interviews</span>
              <svg
                className="w-4 h-4 transition-transform group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Header */}
      <header
        className="relative overflow-hidden"
        style={{ background: "var(--paper-warm)" }}
      >
        {/* Decorative elements */}
        <div
          className="absolute top-0 right-0 w-96 h-96 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%232d2620' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div className="max-w-6xl mx-auto px-6 py-12 relative">
          <div className="animate-fade-in-up">
            {/* Eyebrow */}
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium tracking-wide uppercase mb-6"
              style={{
                background: "var(--paper)",
                color: "var(--ink-muted)",
                border: "1px solid var(--border-medium)",
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: "var(--accent-rust)" }}
              />
              Analysis Report
            </div>

            {/* Title */}
            <h1
              className="font-serif text-4xl md:text-5xl font-bold tracking-tight mb-4"
              style={{ color: "var(--ink)" }}
            >
              Survey Analysis Report
            </h1>
            <p
              className="text-lg md:text-xl max-w-2xl leading-relaxed"
              style={{ color: "var(--ink-light)" }}
            >
              {analysisData.title}
            </p>
          </div>
        </div>

        {/* Bottom edge decoration */}
        <div
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, var(--border-medium) 20%, var(--border-medium) 80%, transparent 100%)",
          }}
        />
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-10">
        {/* Executive Summary */}
        <div
          className="rounded-xl p-6 mb-8"
          style={{
            background: "var(--paper)",
            border: "1px solid var(--border-light)",
            boxShadow: "var(--shadow-paper)",
          }}
        >
          <h2
            className="font-serif text-xl font-bold mb-4"
            style={{ color: "var(--ink)" }}
          >
            Executive Summary
          </h2>
          <p className="leading-relaxed" style={{ color: "var(--ink-light)" }}>
            {analysisData.executiveSummary}
          </p>
        </div>

        {/* Analysis Sections */}
        <section className="mb-8">
          <h2
            className="font-serif text-2xl font-semibold mb-6"
            style={{ color: "var(--ink)" }}
          >
            Detailed Analysis
          </h2>
          {analysisData.sections.map((section) => (
            <AnalysisSectionCard key={section.id} section={section} />
          ))}
        </section>

        {/* Key Recommendations */}
        <div
          className="rounded-xl p-6"
          style={{
            background: "var(--paper)",
            border: "1px solid var(--border-light)",
            boxShadow: "var(--shadow-paper)",
          }}
        >
          <h2
            className="font-serif text-xl font-bold mb-2"
            style={{ color: "var(--ink)" }}
          >
            Key Recommendations
          </h2>
          <p className="text-sm mb-6" style={{ color: "var(--ink-light)" }}>
            Strategic recommendations based on the analysis findings
          </p>
          <ul className="space-y-3">
            {analysisData.keyRecommendations.map((recommendation, index) => (
              <li key={index} className="flex items-start gap-3">
                <span
                  className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium"
                  style={{
                    background:
                      "color-mix(in srgb, var(--accent-sage) 20%, transparent)",
                    color: "var(--accent-sage)",
                  }}
                >
                  {index + 1}
                </span>
                <span style={{ color: "var(--ink-light)" }}>
                  {recommendation}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </main>

      {/* Footer */}
      <footer
        className="border-t py-8"
        style={{
          borderColor: "var(--border-light)",
          background: "var(--paper-warm)",
        }}
      >
        <div className="max-w-6xl mx-auto px-6">
          <div
            className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-sm"
            style={{ color: "var(--ink-muted)" }}
          >
            <p>
              Data sourced from{" "}
              <code
                className="font-mono text-xs px-1.5 py-0.5 rounded"
                style={{
                  background: "var(--paper)",
                  color: "var(--ink-light)",
                }}
              >
                src/data/data.md
              </code>
            </p>
            <p className="font-serif italic">ZAR Retail Payment Survey</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
