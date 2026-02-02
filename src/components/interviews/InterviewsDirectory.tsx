'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';

export interface InterviewSummary {
  id: string;
  interviewer: string;
  dateOfInterview: string;
  timeOfInterview: string;
  shopType: string;
  location: string;
  ownerAge: number;
  customersPerDay: string;
  busiestTime: string;
  paymentMethods: string[];
  fraudStory: boolean;
  customerAskedForHelp: boolean;
  dollarInquiry: boolean;
}

interface InterviewsDirectoryProps {
  interviews: InterviewSummary[];
}

function normalize(value: string) {
  return value.trim().toLowerCase();
}

// Badge component with field research styling
function Badge({
  children,
  variant = 'default'
}: {
  children: React.ReactNode;
  variant?: 'default' | 'rust' | 'sage' | 'ochre' | 'slate';
}) {
  const variantStyles = {
    default: {
      background: 'var(--paper)',
      color: 'var(--ink-light)',
      border: '1px solid var(--border-medium)',
    },
    rust: {
      background: 'var(--status-alert-bg)',
      color: 'var(--status-alert)',
      border: '1px solid var(--status-alert)',
    },
    sage: {
      background: 'var(--status-success-bg)',
      color: 'var(--status-success)',
      border: '1px solid var(--status-success)',
    },
    ochre: {
      background: 'var(--status-warning-bg)',
      color: 'var(--status-warning)',
      border: '1px solid var(--status-warning)',
    },
    slate: {
      background: 'var(--status-info-bg)',
      color: 'var(--status-info)',
      border: '1px solid var(--status-info)',
    },
  };

  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium"
      style={variantStyles[variant]}
    >
      {children}
    </span>
  );
}

// Flag indicator with icon
function FlagIndicator({ type }: { type: 'fraud' | 'help' | 'fx' }) {
  const config = {
    fraud: {
      label: 'Fraud',
      color: 'var(--status-alert)',
      bgColor: 'var(--status-alert-bg)',
      icon: (
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
    },
    help: {
      label: 'Help',
      color: 'var(--status-warning)',
      bgColor: 'var(--status-warning-bg)',
      icon: (
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    fx: {
      label: 'FX',
      color: 'var(--status-info)',
      bgColor: 'var(--status-info-bg)',
      icon: (
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  };

  const { label, color, bgColor, icon } = config[type];

  return (
    <span
      className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold"
      style={{ background: bgColor, color }}
    >
      {icon}
      {label}
    </span>
  );
}

// Filter chip component
function FilterChip({
  active,
  onClick,
  children,
  count,
  color,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  count: number;
  color: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200"
      style={{
        background: active ? color : 'var(--paper)',
        color: active ? 'white' : 'var(--ink-light)',
        border: `1px solid ${active ? color : 'var(--border-medium)'}`,
        boxShadow: active ? `0 2px 8px ${color}40` : 'none',
      }}
    >
      <span className="flex items-center gap-1.5">
        {children}
      </span>
      <span
        className="px-1.5 py-0.5 rounded text-xs font-bold"
        style={{
          background: active ? 'rgba(255,255,255,0.2)' : 'var(--paper-warm)',
          color: active ? 'white' : 'var(--ink-muted)',
        }}
      >
        {count}
      </span>
    </button>
  );
}

// Interview card component
function InterviewCard({
  interview,
  index
}: {
  interview: InterviewSummary;
  index: number;
}) {
  const flags: Array<'fraud' | 'help' | 'fx'> = [];
  if (interview.fraudStory) flags.push('fraud');
  if (interview.customerAskedForHelp) flags.push('help');
  if (interview.dollarInquiry) flags.push('fx');

  return (
    <Link
      href={`/interviews/${interview.id}`}
      className="group block rounded-xl transition-all duration-300 opacity-0 animate-fade-in-up"
      style={{
        background: 'var(--paper)',
        border: '1px solid var(--border-light)',
        boxShadow: 'var(--shadow-paper)',
        animationDelay: `${Math.min(index * 0.05, 0.3)}s`,
        animationFillMode: 'forwards',
      }}
    >
      <div className="p-5">
        {/* Header row */}
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex items-center gap-3">
            {/* Interview number badge */}
            <div
              className="flex items-center justify-center w-10 h-10 rounded-lg font-mono text-sm font-bold transition-colors duration-200"
              style={{
                background: 'var(--paper-warm)',
                color: 'var(--accent-rust)',
                border: '1px solid var(--border-light)',
              }}
            >
              {interview.id.padStart(2, '0')}
            </div>
            <div>
              <h3
                className="font-serif text-lg font-semibold transition-colors duration-200 group-hover:underline"
                style={{ color: 'var(--ink)' }}
              >
                {interview.shopType || 'Unknown Shop'}
              </h3>
              <p className="text-sm" style={{ color: 'var(--ink-muted)' }}>
                {interview.location || 'Location not recorded'}
              </p>
            </div>
          </div>

          {/* Arrow indicator */}
          <div
            className="flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0"
            style={{ background: 'var(--paper-warm)' }}
          >
            <svg
              className="w-4 h-4"
              style={{ color: 'var(--accent-rust)' }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>

        {/* Metadata row */}
        <div
          className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm mb-4 pb-4"
          style={{
            color: 'var(--ink-muted)',
            borderBottom: '1px dashed var(--border-light)',
          }}
        >
          <span className="inline-flex items-center gap-1.5">
            <svg className="w-4 h-4 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {interview.dateOfInterview}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <svg className="w-4 h-4 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {interview.timeOfInterview}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <svg className="w-4 h-4 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            {interview.interviewer}
          </span>
        </div>

        {/* Flags row */}
        {flags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {flags.map((flag) => (
              <FlagIndicator key={flag} type={flag} />
            ))}
          </div>
        )}

        {/* Payment methods */}
        {interview.paymentMethods.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {interview.paymentMethods.slice(0, 4).map((method) => (
              <Badge key={method}>{method}</Badge>
            ))}
            {interview.paymentMethods.length > 4 && (
              <Badge variant="sage">+{interview.paymentMethods.length - 4} more</Badge>
            )}
          </div>
        )}
      </div>

      {/* Hover accent bar */}
      <div
        className="h-1 rounded-b-xl transition-all duration-300 opacity-0 group-hover:opacity-100"
        style={{
          background: 'linear-gradient(90deg, var(--accent-rust), var(--accent-terra), var(--accent-ochre))',
        }}
      />
    </Link>
  );
}

export default function InterviewsDirectory({ interviews }: InterviewsDirectoryProps) {
  const [query, setQuery] = useState('');
  const [onlyFraud, setOnlyFraud] = useState(false);
  const [onlyHelp, setOnlyHelp] = useState(false);
  const [onlyFX, setOnlyFX] = useState(false);

  // Calculate filter counts
  const fraudCount = interviews.filter((i) => i.fraudStory).length;
  const helpCount = interviews.filter((i) => i.customerAskedForHelp).length;
  const fxCount = interviews.filter((i) => i.dollarInquiry).length;

  const filtered = useMemo(() => {
    const q = normalize(query);

    return interviews.filter((i) => {
      if (onlyFraud && !i.fraudStory) return false;
      if (onlyHelp && !i.customerAskedForHelp) return false;
      if (onlyFX && !i.dollarInquiry) return false;

      if (!q) return true;

      const haystack = [
        i.id,
        i.interviewer,
        i.dateOfInterview,
        i.timeOfInterview,
        i.shopType,
        i.location,
        i.customersPerDay,
        i.busiestTime,
        ...i.paymentMethods,
      ]
        .filter(Boolean)
        .join(' ');

      return normalize(haystack).includes(q);
    });
  }, [interviews, onlyFraud, onlyHelp, onlyFX, query]);

  const resultCount = filtered.length;
  const hasActiveFilters = query || onlyFraud || onlyHelp || onlyFX;

  const clearFilters = () => {
    setQuery('');
    setOnlyFraud(false);
    setOnlyHelp(false);
    setOnlyFX(false);
  };

  return (
    <div className="space-y-8">
      {/* Search and Filter Section */}
      <section
        className="rounded-2xl p-6"
        style={{
          background: 'var(--paper)',
          border: '1px solid var(--border-light)',
          boxShadow: 'var(--shadow-paper)',
        }}
      >
        {/* Search input */}
        <div className="relative mb-5">
          <div
            className="absolute left-4 top-1/2 -translate-y-1/2"
            style={{ color: 'var(--ink-muted)' }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by shop type, location, interviewer, payment method..."
            className="w-full pl-12 pr-4 py-3.5 rounded-xl text-base focus:outline-none transition-shadow duration-200"
            style={{
              background: 'var(--paper-warm)',
              color: 'var(--ink)',
              border: '1px solid var(--border-light)',
            }}
          />
        </div>

        {/* Filter chips */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm font-medium" style={{ color: 'var(--ink-muted)' }}>
            Filter by:
          </span>

          <FilterChip
            active={onlyFraud}
            onClick={() => setOnlyFraud(!onlyFraud)}
            count={fraudCount}
            color="var(--status-alert)"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Fraud Story
          </FilterChip>

          <FilterChip
            active={onlyHelp}
            onClick={() => setOnlyHelp(!onlyHelp)}
            count={helpCount}
            color="var(--status-warning)"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Help Requested
          </FilterChip>

          <FilterChip
            active={onlyFX}
            onClick={() => setOnlyFX(!onlyFX)}
            count={fxCount}
            color="var(--status-info)"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            FX Inquiry
          </FilterChip>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="ml-auto inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
              style={{
                color: 'var(--ink-muted)',
                background: 'transparent',
              }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Clear all
            </button>
          )}
        </div>
      </section>

      {/* Results header */}
      <div className="flex items-center justify-between">
        <p className="text-sm" style={{ color: 'var(--ink-muted)' }}>
          Showing{' '}
          <span className="font-semibold" style={{ color: 'var(--ink)' }}>
            {resultCount}
          </span>
          {' '}of{' '}
          <span className="font-semibold" style={{ color: 'var(--ink)' }}>
            {interviews.length}
          </span>
          {' '}interviews
        </p>

        {hasActiveFilters && (
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs"
            style={{
              background: 'var(--accent-sage)',
              color: 'white',
            }}
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filters active
          </div>
        )}
      </div>

      {/* Interview grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filtered.map((interview, index) => (
            <InterviewCard key={interview.id} interview={interview} index={index} />
          ))}
        </div>
      ) : (
        <div
          className="rounded-2xl p-12 text-center"
          style={{
            background: 'var(--paper)',
            border: '1px solid var(--border-light)',
          }}
        >
          <div
            className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-4"
            style={{ background: 'var(--paper-warm)' }}
          >
            <svg
              className="w-8 h-8"
              style={{ color: 'var(--ink-muted)' }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3
            className="font-serif text-xl font-semibold mb-2"
            style={{ color: 'var(--ink)' }}
          >
            No interviews found
          </h3>
          <p className="mb-4" style={{ color: 'var(--ink-muted)' }}>
            No interviews match your current search and filter criteria.
          </p>
          <button
            type="button"
            onClick={clearFilters}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
            style={{
              background: 'var(--accent-rust)',
              color: 'white',
            }}
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
