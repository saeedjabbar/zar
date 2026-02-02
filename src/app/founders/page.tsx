import Link from "next/link";

import { StatCard } from "@/components/dashboard";
import { BarListCard, EvidenceExplorer, SegmentsCard } from "@/components/founders";
import { getFounderDashboardData } from "@/lib/founder-insights";

const UsersIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
    />
  </svg>
);

const CurrencyIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const ShieldIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
    />
  </svg>
);

const SupportIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M18.364 5.636l-1.414 1.414A7 7 0 005.636 18.364l1.414-1.414A5 5 0 0116.95 7.05l1.414-1.414z"
    />
  </svg>
);

export default function FoundersPage() {
  const data = getFounderDashboardData();

  return (
    <div className="min-h-screen" style={{ background: "var(--background)" }}>
      <div
        className="h-2"
        style={{
          background:
            "linear-gradient(90deg, var(--accent-rust) 0%, var(--accent-terra) 25%, var(--accent-ochre) 50%, var(--accent-sage) 75%, var(--accent-slate) 100%)",
        }}
      />

      <nav
        className="border-b"
        style={{ background: "var(--paper)", borderColor: "var(--border-light)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="group inline-flex items-center gap-2 text-sm font-medium transition-colors"
                style={{ color: "var(--ink-light)" }}
              >
                <span className="group-hover:underline">Dashboard</span>
              </Link>
              <Link
                href="/interviews"
                className="group inline-flex items-center gap-2 text-sm font-medium transition-colors"
                style={{ color: "var(--ink-light)" }}
              >
                <span className="group-hover:underline">Interviews</span>
              </Link>
              <Link
                href="/analysis"
                className="group inline-flex items-center gap-2 text-sm font-medium transition-colors"
                style={{ color: "var(--ink-light)" }}
              >
                <span className="group-hover:underline">Analysis</span>
              </Link>
            </div>

            <span
              className="text-sm font-medium"
              style={{ color: "var(--ink-muted)" }}
            >
              Founder Dashboard
            </span>
          </div>
        </div>
      </nav>

      <header
        className="relative overflow-hidden"
        style={{ background: "var(--paper-warm)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
          <div className="animate-fade-in-up">
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
                style={{ background: "var(--accent-ochre)" }}
              />
              Lean Startup Research Readout
            </div>

            <h1
              className="font-serif text-4xl md:text-5xl font-bold tracking-tight mb-4"
              style={{ color: "var(--ink)" }}
            >
              ZAR Founder Dashboard
            </h1>
            <p
              className="text-lg md:text-xl max-w-3xl leading-relaxed"
              style={{ color: "var(--ink-light)" }}
            >
              Evidence-led insights from shop-owner interviews for building ZAR’s
              USD↔PKR exchange product. Focus: demand signals, current workarounds,
              trust barriers, and who to pilot with first.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
              <StatCard
                label="Interviews"
                value={String(data.totalInterviews)}
                icon={<UsersIcon />}
              />
              <StatCard
                label="FX inquiries"
                value={String(data.fxInquiryCount)}
                icon={<CurrencyIcon />}
                accentColor="slate"
              />
              <StatCard
                label="Help requests"
                value={String(data.helpRequestCount)}
                icon={<SupportIcon />}
              />
              <StatCard
                label="Fraud stories"
                value={String(data.fraudStoryCount)}
                icon={<ShieldIcon />}
                accentColor="slate"
              />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <SegmentsCard segments={data.segments} />
          </div>
          <BarListCard
            title="Where FX demand leaks today"
            subtitle="Who merchants send customers to for currency exchange."
            data={data.fxReferralDestinations}
          />
        </div>

        <section
          className="rounded-xl p-6"
          style={{
            background: "var(--paper)",
            border: "1px solid var(--border-light)",
            boxShadow: "var(--shadow-paper)",
          }}
        >
          <h3
            className="font-serif text-lg font-semibold mb-3"
            style={{ color: "var(--ink)" }}
          >
            Who to pilot with first
          </h3>
          <p className="text-sm mb-4" style={{ color: "var(--ink-muted)" }}>
            Candidates are selected from “Ready now” and “Promising, but cautious”
            segments.
          </p>
          {data.pilotCandidates.length === 0 ? (
            <p className="text-sm" style={{ color: "var(--ink-muted)" }}>
              No pilot candidates detected in the current dataset.
            </p>
          ) : (
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {data.pilotCandidates.map((c) => (
                <li
                  key={c.interviewId}
                  className="rounded-lg p-4"
                  style={{
                    background: "var(--paper-warm)",
                    border: "1px solid var(--border-light)",
                  }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <Link
                        href={`/interviews/${c.interviewId}`}
                        className="text-sm font-medium"
                        style={{ color: "var(--ink)" }}
                      >
                        Interview #{c.interviewId}
                      </Link>
                      <p
                        className="text-sm mt-1"
                        style={{ color: "var(--ink-light)" }}
                      >
                        {c.label}
                      </p>
                      <p
                        className="text-xs mt-2"
                        style={{ color: "var(--ink-muted)" }}
                      >
                        {c.reason}
                      </p>
                    </div>
                    <span
                      className="text-xs font-mono"
                      style={{ color: "var(--ink-muted)" }}
                    >
                      #{c.interviewId}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <BarListCard
            title="Why merchants don’t handle FX"
            subtitle="Buckets built from structured answers + transcript hints."
            data={data.whyNotHandleFxBuckets}
          />
          <BarListCard
            title="Fraud & reliability patterns"
            subtitle="What breaks trust in digital flows."
            data={data.fraudPatternBuckets}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <BarListCard
            title="Payment method mentions"
            subtitle="Normalize before treating as truth; see Data Quality."
            data={data.paymentMethodMentions}
          />
          <BarListCard
            title="Busiest time of day"
            subtitle="When merchants have throughput constraints."
            data={data.busyTimeDistribution}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <section
            className="rounded-xl p-6"
            style={{
              background: "var(--paper)",
              border: "1px solid var(--border-light)",
              boxShadow: "var(--shadow-paper)",
            }}
          >
            <h3
              className="font-serif text-lg font-semibold mb-3"
              style={{ color: "var(--ink)" }}
            >
              Opportunities
            </h3>
            <ul className="space-y-2">
              {data.topOpportunities.map((item) => (
                <li
                  key={item}
                  className="text-sm leading-relaxed"
                  style={{ color: "var(--ink-light)" }}
                >
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section
            className="rounded-xl p-6"
            style={{
              background: "var(--paper)",
              border: "1px solid var(--border-light)",
              boxShadow: "var(--shadow-paper)",
            }}
          >
            <h3
              className="font-serif text-lg font-semibold mb-3"
              style={{ color: "var(--ink)" }}
            >
              Risks & blockers
            </h3>
            <ul className="space-y-2">
              {data.keyRisks.map((item) => (
                <li
                  key={item}
                  className="text-sm leading-relaxed"
                  style={{ color: "var(--ink-light)" }}
                >
                  {item}
                </li>
              ))}
            </ul>
          </section>
        </div>

        <section
          className="rounded-xl p-6"
          style={{
            background: "var(--paper)",
            border: "1px solid var(--border-light)",
            boxShadow: "var(--shadow-paper)",
          }}
        >
          <h3
            className="font-serif text-lg font-semibold mb-4"
            style={{ color: "var(--ink)" }}
          >
            Next experiments (2–3 week cycles)
          </h3>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {data.recommendedExperiments.map((exp) => (
              <div
                key={exp.title}
                className="rounded-lg p-4"
                style={{
                  background: "var(--paper-warm)",
                  border: "1px solid var(--border-light)",
                }}
              >
                <h4
                  className="font-serif font-semibold"
                  style={{ color: "var(--ink)" }}
                >
                  {exp.title}
                </h4>
                <p className="text-sm mt-2" style={{ color: "var(--ink-light)" }}>
                  <span className="font-medium" style={{ color: "var(--ink)" }}>
                    Success metric:
                  </span>{" "}
                  {exp.successMetric}
                </p>
                <p className="text-sm mt-2" style={{ color: "var(--ink-light)" }}>
                  <span className="font-medium" style={{ color: "var(--ink)" }}>
                    Why now:
                  </span>{" "}
                  {exp.whyNow}
                </p>
              </div>
            ))}
          </div>
        </section>

        <EvidenceExplorer quotes={data.evidenceQuotes} />

        {data.dataQualityNotes.length > 0 && (
          <section
            className="rounded-xl p-6"
            style={{
              background: "var(--paper)",
              border: "1px solid var(--border-light)",
              boxShadow: "var(--shadow-paper)",
            }}
          >
            <h3
              className="font-serif text-lg font-semibold mb-3"
              style={{ color: "var(--ink)" }}
            >
              Data quality notes
            </h3>
            <ul className="space-y-2">
              {data.dataQualityNotes.slice(0, 8).map((n) => (
                <li
                  key={n}
                  className="text-sm leading-relaxed"
                  style={{ color: "var(--ink-light)" }}
                >
                  {n}
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>

      <footer
        className="border-t py-8"
        style={{
          borderColor: "var(--border-light)",
          background: "var(--paper-warm)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-sm"
            style={{ color: "var(--ink-muted)" }}
          >
            <p>
              Built from {data.totalInterviews} interviews • Evidence-first • Lean
              cycles
            </p>
            <p className="font-serif italic">ZAR Research Dashboard</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
