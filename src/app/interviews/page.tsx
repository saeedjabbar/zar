import Link from "next/link";

import InterviewsDirectory, {
  type InterviewSummary,
} from "@/components/interviews/InterviewsDirectory";
import { getInterviews } from "@/lib/interviews";

export default function InterviewsPage() {
  const interviews = getInterviews();

  const summaries: InterviewSummary[] = interviews.map((i) => ({
    id: i.id,
    interviewer: i.interviewer,
    dateOfInterview: i.dateOfInterview,
    timeOfInterview: i.timeOfInterview,
    shopType: i.shopType,
    location: i.location,
    ownerAge: i.ownerAge,
    customersPerDay: i.customersPerDay,
    busiestTime: i.busiestTime,
    paymentMethods: i.paymentMethods,
    fraudStory: i.fraudStory,
    customerAskedForHelp: i.customerAskedForHelp,
    dollarInquiry: i.dollarInquiry,
  }));

  // Calculate some stats for the header
  const fraudCount = interviews.filter((i) => i.fraudStory).length;
  const helpCount = interviews.filter((i) => i.customerAskedForHelp).length;
  const fxCount = interviews.filter((i) => i.dollarInquiry).length;

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
                style={{ background: "var(--accent-sage)" }}
              />
              Field Research Collection
            </div>

            {/* Title */}
            <h1
              className="font-serif text-4xl md:text-5xl font-bold tracking-tight mb-4"
              style={{ color: "var(--ink)" }}
            >
              Interview Archive
            </h1>
            <p
              className="text-lg md:text-xl max-w-2xl leading-relaxed"
              style={{ color: "var(--ink-light)" }}
            >
              Primary research collected from retail establishments across South
              Africa. Each interview captures payment behaviors, fraud
              experiences, and trust factors.
            </p>

            {/* Quick Stats */}
            <div className="flex flex-wrap gap-6 mt-8">
              <div
                className="flex items-baseline gap-2"
                style={{ animation: "fadeInUp 0.5s ease-out 0.1s both" }}
              >
                <span
                  className="font-serif text-3xl font-bold"
                  style={{ color: "var(--accent-rust)" }}
                >
                  {interviews.length}
                </span>
                <span className="text-sm" style={{ color: "var(--ink-muted)" }}>
                  interviews
                </span>
              </div>
              <div
                className="flex items-baseline gap-2"
                style={{ animation: "fadeInUp 0.5s ease-out 0.15s both" }}
              >
                <span
                  className="font-serif text-3xl font-bold"
                  style={{ color: "var(--status-alert)" }}
                >
                  {fraudCount}
                </span>
                <span className="text-sm" style={{ color: "var(--ink-muted)" }}>
                  fraud stories
                </span>
              </div>
              <div
                className="flex items-baseline gap-2"
                style={{ animation: "fadeInUp 0.5s ease-out 0.2s both" }}
              >
                <span
                  className="font-serif text-3xl font-bold"
                  style={{ color: "var(--status-warning)" }}
                >
                  {helpCount}
                </span>
                <span className="text-sm" style={{ color: "var(--ink-muted)" }}>
                  help requests
                </span>
              </div>
              <div
                className="flex items-baseline gap-2"
                style={{ animation: "fadeInUp 0.5s ease-out 0.25s both" }}
              >
                <span
                  className="font-serif text-3xl font-bold"
                  style={{ color: "var(--status-info)" }}
                >
                  {fxCount}
                </span>
                <span className="text-sm" style={{ color: "var(--ink-muted)" }}>
                  FX inquiries
                </span>
              </div>
            </div>
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
        <InterviewsDirectory interviews={summaries} />
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
