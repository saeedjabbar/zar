import Link from "next/link";

import {
  StatCard,
  PaymentMethodsChart,
  ShopTypeChart,
  KeyFindingsCard,
} from "@/components/dashboard";
import { getInterviews } from "@/lib/interviews";

const COLORS = [
  "#22c55e",
  "#3b82f6",
  "#f59e0b",
  "#8b5cf6",
  "#06b6d4",
  "#ec4899",
  "#f97316",
  "#6b7280",
];

function formatPercent(value: number, total: number) {
  if (total <= 0) return "0%";
  return `${Math.round((value / total) * 100)}%`;
}

// Icons for stat cards
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

const CashIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
    />
  </svg>
);

const TrendingUpIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
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

export default function Home() {
  const interviews = getInterviews();

  const totalResponses = interviews.length;
  const fraudStories = interviews.filter((i) => i.fraudStory).length;
  const helpRequests = interviews.filter((i) => i.customerAskedForHelp).length;
  const dollarInquiries = interviews.filter((i) => i.dollarInquiry).length;

  const shopTypeCounts = interviews.reduce<Record<string, number>>((acc, i) => {
    const key = i.shopType || "Unknown";
    acc[key] = (acc[key] ?? 0) + 1;
    return acc;
  }, {});

  const shopTypeData = Object.entries(shopTypeCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  const paymentCounts = interviews.reduce<Record<string, number>>((acc, i) => {
    i.paymentMethods.forEach((method) => {
      const key = method || "Unknown";
      acc[key] = (acc[key] ?? 0) + 1;
    });
    return acc;
  }, {});

  const paymentSorted = Object.entries(paymentCounts).sort((a, b) => b[1] - a[1]);
  const topPayments = paymentSorted.slice(0, 7);
  const otherPayments = paymentSorted.slice(7).reduce((sum, [, v]) => sum + v, 0);

  const paymentData = [
    ...topPayments.map(([name, value], idx) => ({
      name,
      value,
      color: COLORS[idx % COLORS.length],
    })),
    ...(otherPayments > 0
      ? [{ name: "Other", value: otherPayments, color: COLORS[COLORS.length - 1] }]
      : []),
  ];

  const topShopType = shopTypeData[0];
  const topPayment = paymentSorted[0];

  const keyFindings = [
    `Total interviews: ${totalResponses}.`,
    topShopType
      ? `Most common shop type: ${topShopType.name} (${topShopType.count}, ${formatPercent(topShopType.count, totalResponses)}).`
      : "No shop type data available.",
    topPayment
      ? `Most-mentioned accepted payment method: ${topPayment[0]} (${topPayment[1]} mentions).`
      : "No payment method data available.",
    `${fraudStories} of ${totalResponses} mentioned a real fraud story.`,
    `${helpRequests} of ${totalResponses} reported customers asking for help sending/receiving money.`,
    `${dollarInquiries} of ${totalResponses} reported customer questions about dollars/foreign money.`,
  ];

  const lastUpdated = (() => {
    const dates = interviews
      .map((i) => new Date(i.timestamp))
      .filter((d) => !Number.isNaN(d.getTime()))
      .sort((a, b) => b.getTime() - a.getTime());

    return dates[0]?.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  })();

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
              Research Dashboard
            </div>

            {/* Title */}
            <h1
              className="font-serif text-4xl md:text-5xl font-bold tracking-tight mb-4"
              style={{ color: "var(--ink)" }}
            >
              ZAR Interview Dashboard
            </h1>
            <p
              className="text-lg md:text-xl max-w-2xl leading-relaxed"
              style={{ color: "var(--ink-light)" }}
            >
              Summary views computed directly from{" "}
              <code
                className="font-mono text-sm px-1.5 py-0.5 rounded"
                style={{
                  background: "var(--paper)",
                  color: "var(--ink-light)",
                }}
              >
                src/data/data.md
              </code>
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <section className="mb-8">
          <h2
            className="font-serif text-xl font-semibold mb-4"
            style={{ color: "var(--ink)" }}
          >
            Key Metrics
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard
              label="Total Interviews"
              value={String(totalResponses)}
              icon={<UsersIcon />}
            />
            <StatCard
              label="Fraud Stories"
              value={String(fraudStories)}
              icon={<CashIcon />}
            />
            <StatCard
              label="Help Requests"
              value={String(helpRequests)}
              icon={<TrendingUpIcon />}
            />
            <StatCard
              label="Dollar Inquiries"
              value={String(dollarInquiries)}
              icon={<CurrencyIcon />}
            />
          </div>
        </section>

        {/* Charts Section */}
        <section className="mb-8">
          <h2
            className="font-serif text-xl font-semibold mb-4"
            style={{ color: "var(--ink)" }}
          >
            Distribution Analysis
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <PaymentMethodsChart
              data={paymentData}
              title="Accepted Payment Methods (mentions)"
            />
            <ShopTypeChart data={shopTypeData} />
          </div>
        </section>

        {/* Key Findings Section */}
        <section className="mb-8">
          <h2
            className="font-serif text-xl font-semibold mb-4"
            style={{ color: "var(--ink)" }}
          >
            Insights & Recommendations
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <KeyFindingsCard
              title="Key Findings"
              findings={keyFindings.slice(0, 3)}
            />
            <KeyFindingsCard
              title="Notable Trends"
              findings={keyFindings.slice(3)}
            />
          </div>
        </section>

        {/* Browse Interviews Section */}
        <section className="mb-8">
          <div className="flex items-center justify-between gap-4 mb-4">
            <h2
              className="font-serif text-xl font-semibold"
              style={{ color: "var(--ink)" }}
            >
              Browse Interviews
            </h2>
            <Link
              href="/interviews"
              className="group inline-flex items-center gap-2 text-sm font-medium transition-colors"
              style={{ color: "var(--accent-terra)" }}
            >
              <span className="group-hover:underline">View all</span>
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
          <div
            className="rounded-xl divide-y"
            style={{
              background: "var(--paper)",
              border: "1px solid var(--border-light)",
              boxShadow: "var(--shadow-paper)",
            }}
          >
            {interviews.slice(0, 10).map((interview) => (
              <Link
                key={interview.id}
                href={`/interviews/${interview.id}`}
                className="block px-6 py-4 transition-colors hover:bg-[var(--paper-warm)]"
                style={{ borderColor: "var(--border-light)" }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p
                      className="font-semibold"
                      style={{ color: "var(--ink)" }}
                    >
                      Interview #{interview.id} — {interview.shopType || "Unknown"}
                    </p>
                    <p
                      className="text-sm mt-1"
                      style={{ color: "var(--ink-light)" }}
                    >
                      {interview.location || "Unknown location"} • {interview.dateOfInterview} •{" "}
                      {interview.timeOfInterview}
                    </p>
                  </div>
                  <span
                    className="text-sm"
                    style={{ color: "var(--ink-muted)" }}
                  >
                    {interview.interviewer}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
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
              Data last updated: {lastUpdated || "Unknown"}
            </p>
            <p className="font-serif italic">ZAR Retail Payment Survey</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
