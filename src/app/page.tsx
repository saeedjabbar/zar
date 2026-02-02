import Link from "next/link";

import { StatCard } from "@/components/dashboard";
import {
  ValidationScorecard,
  ConversionFunnel,
  WillingnessFactors,
  BarListCard,
  PilotCandidatesTable,
  SegmentsCard,
  EvidenceExplorer,
} from "@/components/founders";
import {
  getFounderDashboardData,
  computeValidationScorecard,
  computeConversionFunnel,
  extractWillingnessFactors,
  computeEnhancedPilotCandidates,
} from "@/lib/founder-insights";
import { getInterviews } from "@/lib/interviews";

// Icons for stat cards
const FxIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

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

const AlertIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
    />
  </svg>
);

const RocketIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13 10V3L4 14h7v7l9-11h-7z"
    />
  </svg>
);

export default function Home() {
  const data = getFounderDashboardData();
  const interviews = getInterviews();

  // Compute validation scorecard
  const scorecard = computeValidationScorecard(
    data.totalInterviews,
    data.fxInquiryCount,
    data.segments,
    data.whyNotHandleFxBuckets,
    data.fraudStoryCount,
    data.pilotCandidates.length
  );

  // Compute conversion funnel
  const funnel = computeConversionFunnel(
    interviews.map((i) => ({
      id: i.id,
      dollarInquiry: i.dollarInquiry,
      customerAskedForHelp: i.customerAskedForHelp,
      fraudStory: i.fraudStory,
      paymentMethods: i.paymentMethods,
    }))
  );

  // Compute willingness factors
  const willingnessFactors = extractWillingnessFactors(
    interviews.map((i) => ({
      id: i.id,
      trustFactors: i.trustFactors || "",
      transcript: i.transcript || "",
    }))
  );

  // Compute enhanced pilot candidates
  const enhancedCandidates = computeEnhancedPilotCandidates(
    interviews.map((i) => ({
      id: i.id,
      shopType: i.shopType,
      location: i.location,
      ownerAge: i.ownerAge,
      customersPerDay: i.customersPerDay,
      dollarInquiry: i.dollarInquiry,
      customerAskedForHelp: i.customerAskedForHelp,
      paymentMethods: i.paymentMethods,
      fraudStory: i.fraudStory,
      concernsBeforeStarting: i.concernsBeforeStarting || "",
      currentProblems: i.currentProblems || "",
      currencyExchangeReferral: i.currencyExchangeReferral,
    }))
  );

  // Find pilot-ready count from funnel
  const pilotReadyCount = funnel.find((s) => s.name === "Pilot Ready")?.count ?? 0;

  return (
    <div className="min-h-screen" style={{ background: "var(--background)" }}>
      {/* Decorative gradient header band */}
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
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
            <Link
              href="/analysis"
              className="group inline-flex items-center gap-2 text-sm font-medium transition-colors"
              style={{ color: "var(--ink-light)" }}
            >
              <span className="group-hover:underline">Analysis Report</span>
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
        {/* Decorative SVG pattern */}
        <div
          className="absolute top-0 right-0 w-96 h-96 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%232d2620' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative">
          <div className="animate-fade-in-up">
            {/* Eyebrow badge */}


            {/* Title */}
            <h1
              className="font-serif text-4xl md:text-5xl font-bold tracking-tight mb-4"
              style={{ color: "var(--ink)" }}
            >
              Interview Dashboard
            </h1>
            <p
              className="text-lg md:text-xl max-w-2xl leading-relaxed"
              style={{ color: "var(--ink-light)" }}
            >
              Validating merchants as FX agents for{" "}
              <span className="font-semibold" style={{ color: "var(--ink)" }}>
                USD ↔ PKR
              </span>{" "}
              exchange. Data from {data.totalInterviews} interviews in Islamabad, Pakistan.
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Section 1: Validation Scorecard */}
        <section>
          <h2
            className="font-serif text-xl font-semibold mb-4"
            style={{ color: "var(--ink)" }}
          >
            The Verdict
          </h2>
          <ValidationScorecard scorecard={scorecard} />
        </section>

        {/* Section 2: Key Metrics */}
        <section>
          <h2
            className="font-serif text-xl font-semibold mb-4"
            style={{ color: "var(--ink)" }}
          >
            Key Signals
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              label="FX Demand"
              value={`${data.fxInquiryCount}/${data.totalInterviews}`}
              icon={<FxIcon />}
            />
            <StatCard
              label="Help Requests"
              value={`${data.helpRequestCount}/${data.totalInterviews}`}
              icon={<UsersIcon />}
            />
            <StatCard
              label="Fraud Stories"
              value={String(data.fraudStoryCount)}
              icon={<AlertIcon />}
            />
            <StatCard
              label="Pilot Ready"
              value={String(pilotReadyCount)}
              icon={<RocketIcon />}
            />
          </div>
        </section>

        {/* Section 3: Conversion Funnel */}
        <section>
          <ConversionFunnel stages={funnel} />
        </section>

        {/* Section 4: Pilot Segments + Willingness Factors */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SegmentsCard segments={data.segments} />
          <WillingnessFactors factors={willingnessFactors} />
        </section>

        {/* Section 5: Risk Analysis */}
        <section>
          <h2
            className="font-serif text-xl font-semibold mb-4"
            style={{ color: "var(--ink)" }}
          >
            Risk Analysis
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <BarListCard
              title="Why Merchants Don't Handle FX"
              subtitle="Self-reported barriers to becoming an exchange agent"
              data={data.whyNotHandleFxBuckets}
            />
            <BarListCard
              title="Fraud & Reliability Patterns"
              subtitle="Trust barriers mentioned in interviews"
              data={data.fraudPatternBuckets}
            />
          </div>
        </section>

        {/* Section 6: Pilot Candidates */}
        <section>
          <PilotCandidatesTable candidates={enhancedCandidates} />
        </section>

        {/* Section 7: Opportunities & Risks */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div
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
              Top Opportunities
            </h3>
            <ul className="space-y-3">
              {data.topOpportunities.map((opp, idx) => (
                <li key={idx} className="flex gap-3">
                  <span
                    className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{
                      background: "var(--status-success)20",
                      color: "var(--status-success)",
                    }}
                  >
                    {idx + 1}
                  </span>
                  <span className="text-sm" style={{ color: "var(--ink-light)" }}>
                    {opp}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div
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
              Key Risks
            </h3>
            <ul className="space-y-3">
              {data.keyRisks.map((risk, idx) => (
                <li key={idx} className="flex gap-3">
                  <span
                    className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{
                      background: "var(--status-alert)20",
                      color: "var(--status-alert)",
                    }}
                  >
                    !
                  </span>
                  <span className="text-sm" style={{ color: "var(--ink-light)" }}>
                    {risk}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* Section 8: Recommended Experiments */}
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
            Recommended Experiments
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {data.recommendedExperiments.map((exp, idx) => (
              <div
                key={idx}
                className="rounded-lg p-4"
                style={{
                  background: "var(--paper-warm)",
                  border: "1px solid var(--border-light)",
                }}
              >
                <div
                  className="text-xs uppercase tracking-wide font-semibold mb-2"
                  style={{ color: "var(--accent-terra)" }}
                >
                  Experiment {idx + 1}
                </div>
                <h4
                  className="font-semibold mb-2"
                  style={{ color: "var(--ink)" }}
                >
                  {exp.title}
                </h4>
                <div className="space-y-2 text-sm">
                  <div>
                    <span
                      className="font-medium"
                      style={{ color: "var(--ink-muted)" }}
                    >
                      Success Metric:
                    </span>
                    <p style={{ color: "var(--ink-light)" }}>{exp.successMetric}</p>
                  </div>
                  <div>
                    <span
                      className="font-medium"
                      style={{ color: "var(--ink-muted)" }}
                    >
                      Why Now:
                    </span>
                    <p style={{ color: "var(--ink-light)" }}>{exp.whyNow}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section 9: Evidence Explorer */}
        <section>
          <h2
            className="font-serif text-xl font-semibold mb-4"
            style={{ color: "var(--ink)" }}
          >
            Evidence Explorer
          </h2>
          <EvidenceExplorer quotes={data.evidenceQuotes} />
        </section>

        {/* Data Quality Notes */}
        {data.dataQualityNotes.length > 0 && (
          <section
            className="rounded-xl p-4"
            style={{
              background: "var(--paper-warm)",
              border: "1px solid var(--border-light)",
            }}
          >
            <h4
              className="text-sm font-semibold mb-2"
              style={{ color: "var(--ink-muted)" }}
            >
              Data Quality Notes
            </h4>
            <ul className="space-y-1">
              {data.dataQualityNotes.map((note, idx) => (
                <li
                  key={idx}
                  className="text-xs"
                  style={{ color: "var(--ink-muted)" }}
                >
                  • {note}
                </li>
              ))}
            </ul>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer
        className="border-t py-8 mt-8"
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
              Based on {data.totalInterviews} interviews • All amounts in USD (~$1 = 280 PKR) and PKR
            </p>
            <p className="font-serif italic">
              <a
                href="https://zar.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
                style={{ color: "var(--accent-terra)" }}
              >
                ZAR
              </a>
              {" "}Lean Startup Validation
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
