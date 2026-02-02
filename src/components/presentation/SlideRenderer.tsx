'use client';

import { Slide } from '@/types';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface SlideRendererProps {
  slide: Slide;
}

const DEFAULT_COLORS = [
  '#3B82F6', // blue-500
  '#10B981', // emerald-500
  '#F59E0B', // amber-500
  '#EF4444', // red-500
  '#8B5CF6', // violet-500
  '#EC4899', // pink-500
  '#06B6D4', // cyan-500
  '#84CC16', // lime-500
];

function TitleSlide({ slide }: { slide: Slide }) {
  return (
    <div className="flex h-full flex-col items-center justify-center text-center">
      <h1 className="mb-6 text-6xl font-bold tracking-tight text-zinc-900 dark:text-white md:text-7xl lg:text-8xl">
        {slide.title}
      </h1>
      {slide.subtitle && (
        <p className="text-2xl font-light text-zinc-600 dark:text-zinc-400 md:text-3xl lg:text-4xl">
          {slide.subtitle}
        </p>
      )}
    </div>
  );
}

function StatisticsSlide({ slide }: { slide: Slide }) {
  return (
    <div className="flex h-full flex-col">
      {slide.title && (
        <h2 className="mb-8 text-4xl font-bold text-zinc-900 dark:text-white md:text-5xl">
          {slide.title}
        </h2>
      )}
      <div className="grid flex-1 grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
        {slide.stats?.map((stat, index) => (
          <div
            key={index}
            className="flex flex-col items-center justify-center rounded-2xl bg-zinc-100 p-6 dark:bg-zinc-800"
          >
            <span className="text-4xl font-bold text-zinc-900 dark:text-white md:text-5xl lg:text-6xl">
              {stat.value}
            </span>
            <span className="mt-2 text-center text-lg text-zinc-600 dark:text-zinc-400 md:text-xl">
              {stat.label}
            </span>
            {stat.change && (
              <span
                className={`mt-1 text-sm font-medium ${
                  stat.change.startsWith('+')
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : stat.change.startsWith('-')
                      ? 'text-red-600 dark:text-red-400'
                      : 'text-zinc-500'
                }`}
              >
                {stat.change}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function ChartSlide({ slide }: { slide: Slide }) {
  const data = slide.chartData?.map((item, index) => ({
    ...item,
    color: item.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length],
  }));

  return (
    <div className="flex h-full flex-col">
      {slide.title && (
        <h2 className="mb-8 text-4xl font-bold text-zinc-900 dark:text-white md:text-5xl">
          {slide.title}
        </h2>
      )}
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          {slide.chartType === 'pie' ? (
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius="40%"
                outerRadius="70%"
                paddingAngle={2}
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) =>
                  `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`
                }
                labelLine={{ stroke: '#71717a' }}
              >
                {data?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#18181b',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                }}
              />
              <Legend
                wrapperStyle={{ fontSize: '1.125rem' }}
                formatter={(value) => (
                  <span className="text-zinc-700 dark:text-zinc-300">{value}</span>
                )}
              />
            </PieChart>
          ) : (
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" />
              <XAxis
                dataKey="name"
                tick={{ fill: '#71717a', fontSize: 14 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis tick={{ fill: '#71717a', fontSize: 14 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#18181b',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#fff',
                }}
              />
              <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                {data?.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function KeyFindingsSlide({ slide }: { slide: Slide }) {
  return (
    <div className="flex h-full flex-col">
      {slide.title && (
        <h2 className="mb-8 text-4xl font-bold text-zinc-900 dark:text-white md:text-5xl">
          {slide.title}
        </h2>
      )}
      <ul className="flex-1 space-y-4">
        {slide.findings?.map((finding, index) => (
          <li
            key={index}
            className="flex items-start gap-4 text-xl text-zinc-700 dark:text-zinc-300 md:text-2xl"
          >
            <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-500 text-base font-bold text-white">
              {index + 1}
            </span>
            <span className="leading-relaxed">{finding}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function QuoteSlide({ slide }: { slide: Slide }) {
  return (
    <div className="flex h-full flex-col items-center justify-center px-8 text-center">
      <svg
        className="mb-6 h-16 w-16 text-blue-500 opacity-50"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
      </svg>
      <blockquote className="mb-8 max-w-4xl text-3xl font-medium italic leading-relaxed text-zinc-800 dark:text-zinc-200 md:text-4xl lg:text-5xl">
        &ldquo;{slide.quote}&rdquo;
      </blockquote>
      {slide.attribution && (
        <cite className="text-xl text-zinc-600 not-italic dark:text-zinc-400 md:text-2xl">
          &mdash; {slide.attribution}
        </cite>
      )}
    </div>
  );
}

function RecommendationsSlide({ slide }: { slide: Slide }) {
  return (
    <div className="flex h-full flex-col">
      {slide.title && (
        <h2 className="mb-8 text-4xl font-bold text-zinc-900 dark:text-white md:text-5xl">
          {slide.title}
        </h2>
      )}
      <ol className="flex-1 space-y-4">
        {slide.items?.map((item, index) => (
          <li
            key={index}
            className="flex items-start gap-4 text-xl text-zinc-700 dark:text-zinc-300 md:text-2xl"
          >
            <span className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500 text-lg font-bold text-white">
              {index + 1}
            </span>
            <span className="leading-relaxed">{item}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

function ComparisonSlide({ slide }: { slide: Slide }) {
  const { left, right } = slide.comparison || { left: { title: '', items: [] }, right: { title: '', items: [] } };

  return (
    <div className="flex h-full flex-col">
      {slide.title && (
        <h2 className="mb-8 text-4xl font-bold text-zinc-900 dark:text-white md:text-5xl">
          {slide.title}
        </h2>
      )}
      <div className="grid flex-1 grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="rounded-2xl bg-blue-50 p-6 dark:bg-blue-900/20">
          <h3 className="mb-6 text-2xl font-bold text-blue-700 dark:text-blue-400 md:text-3xl">
            {left.title}
          </h3>
          <ul className="space-y-3">
            {left.items.map((item, index) => (
              <li
                key={index}
                className="flex items-start gap-3 text-lg text-zinc-700 dark:text-zinc-300 md:text-xl"
              >
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Right Column */}
        <div className="rounded-2xl bg-emerald-50 p-6 dark:bg-emerald-900/20">
          <h3 className="mb-6 text-2xl font-bold text-emerald-700 dark:text-emerald-400 md:text-3xl">
            {right.title}
          </h3>
          <ul className="space-y-3">
            {right.items.map((item, index) => (
              <li
                key={index}
                className="flex items-start gap-3 text-lg text-zinc-700 dark:text-zinc-300 md:text-xl"
              >
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function TimelineSlide({ slide }: { slide: Slide }) {
  return (
    <div className="flex h-full flex-col">
      {slide.title && (
        <h2 className="mb-8 text-4xl font-bold text-zinc-900 dark:text-white md:text-5xl">
          {slide.title}
        </h2>
      )}
      <div className="flex-1 space-y-6">
        {slide.items?.map((item, index) => (
          <div key={index} className="flex items-center gap-4">
            <div className="flex flex-col items-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-lg font-bold text-white">
                {index + 1}
              </div>
              {index < (slide.items?.length || 0) - 1 && (
                <div className="h-8 w-0.5 bg-blue-300 dark:bg-blue-700" />
              )}
            </div>
            <p className="text-xl text-zinc-700 dark:text-zinc-300 md:text-2xl">
              {item}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SlideRenderer({ slide }: SlideRendererProps) {
  const slideComponents: Record<Slide['type'], React.ComponentType<{ slide: Slide }>> = {
    title: TitleSlide,
    statistics: StatisticsSlide,
    chart: ChartSlide,
    keyFindings: KeyFindingsSlide,
    quote: QuoteSlide,
    recommendations: RecommendationsSlide,
    comparison: ComparisonSlide,
    timeline: TimelineSlide,
  };

  const SlideComponent = slideComponents[slide.type];

  if (!SlideComponent) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-xl text-zinc-500">Unknown slide type: {slide.type}</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full p-8 md:p-12 lg:p-16">
      <SlideComponent slide={slide} />
    </div>
  );
}
