import { InterviewInsight } from '@/types';

interface InsightsPanelProps {
  insight: InterviewInsight;
}

const sentimentConfig = {
  positive: {
    label: 'Positive',
    bgColor: 'bg-green-100',
    textColor: 'text-green-800',
    borderColor: 'border-green-300',
    icon: '+',
  },
  neutral: {
    label: 'Neutral',
    bgColor: 'bg-gray-100',
    textColor: 'text-gray-800',
    borderColor: 'border-gray-300',
    icon: '~',
  },
  negative: {
    label: 'Negative',
    bgColor: 'bg-red-100',
    textColor: 'text-red-800',
    borderColor: 'border-red-300',
    icon: '-',
  },
  mixed: {
    label: 'Mixed',
    bgColor: 'bg-amber-100',
    textColor: 'text-amber-800',
    borderColor: 'border-amber-300',
    icon: '+/-',
  },
};

const themeColors = [
  'bg-blue-100 text-blue-800',
  'bg-purple-100 text-purple-800',
  'bg-teal-100 text-teal-800',
  'bg-indigo-100 text-indigo-800',
  'bg-pink-100 text-pink-800',
  'bg-cyan-100 text-cyan-800',
  'bg-emerald-100 text-emerald-800',
  'bg-orange-100 text-orange-800',
];

export default function InsightsPanel({ insight }: InsightsPanelProps) {
  const sentiment = sentimentConfig[insight.sentiment];

  return (
    <article className="space-y-8">
      {/* Header with Sentiment */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
          AI-Generated Insights
        </h2>
        <div
          className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 ${sentiment.bgColor} ${sentiment.textColor} ${sentiment.borderColor}`}
          role="status"
          aria-label={`Sentiment: ${sentiment.label}`}
        >
          <span className="font-mono text-sm font-bold" aria-hidden="true">
            {sentiment.icon}
          </span>
          <span className="text-sm font-medium">{sentiment.label} Sentiment</span>
          <span className="text-xs opacity-75">
            ({Math.round(insight.sentimentScore * 100)}%)
          </span>
        </div>
      </header>

      {/* Key Themes */}
      <section aria-labelledby="themes-heading">
        <h3
          id="themes-heading"
          className="mb-3 text-sm font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400"
        >
          Key Themes
        </h3>
        <div className="flex flex-wrap gap-2" role="list" aria-label="Key themes">
          {insight.keyThemes.map((theme, index) => (
            <span
              key={theme}
              role="listitem"
              className={`inline-flex rounded-full px-3 py-1 text-sm font-medium ${themeColors[index % themeColors.length]}`}
            >
              {theme}
            </span>
          ))}
        </div>
      </section>

      {/* Notable Quotes */}
      {insight.notableQuotes.length > 0 && (
        <section aria-labelledby="quotes-heading">
          <h3
            id="quotes-heading"
            className="mb-4 text-sm font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400"
          >
            Notable Quotes
          </h3>
          <div className="space-y-4">
            {insight.notableQuotes.map((item, index) => (
              <figure key={index} className="relative">
                <blockquote className="border-l-4 border-blue-500 bg-zinc-50 py-4 pl-6 pr-4 dark:bg-zinc-800/50">
                  <p className="italic text-zinc-700 dark:text-zinc-300">
                    &ldquo;{item.quote}&rdquo;
                  </p>
                </blockquote>
                <figcaption className="mt-2 pl-6 text-sm text-zinc-500 dark:text-zinc-400">
                  Context: {item.context}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}

      {/* Payment Summary */}
      <section aria-labelledby="payment-summary-heading">
        <h3
          id="payment-summary-heading"
          className="mb-3 text-sm font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400"
        >
          Payment Summary
        </h3>
        <p className="leading-relaxed text-zinc-700 dark:text-zinc-300">
          {insight.paymentSummary}
        </p>
      </section>

      {/* Fraud & Trust Summary */}
      <section aria-labelledby="fraud-trust-heading">
        <h3
          id="fraud-trust-heading"
          className="mb-3 text-sm font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400"
        >
          Fraud & Trust Analysis
        </h3>
        <div className="space-y-4">
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950/30">
            <h4 className="mb-2 text-sm font-semibold text-red-800 dark:text-red-300">
              Fraud Concerns
            </h4>
            <p className="text-sm leading-relaxed text-red-700 dark:text-red-400">
              {insight.fraudSummary}
            </p>
          </div>
          <div className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-900 dark:bg-green-950/30">
            <h4 className="mb-2 text-sm font-semibold text-green-800 dark:text-green-300">
              Trust Factors
            </h4>
            <p className="text-sm leading-relaxed text-green-700 dark:text-green-400">
              {insight.trustSummary}
            </p>
          </div>
        </div>
      </section>

      {/* Behavioral Patterns */}
      {insight.behavioralPatterns && (
        <section aria-labelledby="behavioral-heading">
          <h3
            id="behavioral-heading"
            className="mb-3 text-sm font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400"
          >
            Behavioral Patterns
          </h3>
          <p className="leading-relaxed text-zinc-700 dark:text-zinc-300">
            {insight.behavioralPatterns}
          </p>
        </section>
      )}

      {/* Recommendations */}
      {insight.recommendations.length > 0 && (
        <section aria-labelledby="recommendations-heading">
          <h3
            id="recommendations-heading"
            className="mb-3 text-sm font-medium uppercase tracking-wide text-zinc-500 dark:text-zinc-400"
          >
            Recommendations
          </h3>
          <ul className="space-y-2" role="list">
            {insight.recommendations.map((recommendation, index) => (
              <li
                key={index}
                className="flex items-start gap-3 text-zinc-700 dark:text-zinc-300"
              >
                <span
                  className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-blue-500"
                  aria-hidden="true"
                />
                <span className="leading-relaxed">{recommendation}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </article>
  );
}
