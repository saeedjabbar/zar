import Link from 'next/link';
import { NavigationPill, FlagIndicator } from './ui';

interface InterviewHeaderProps {
  interview: {
    id: string;
    shopType: string;
    location: string;
    dateOfInterview: string;
    timeOfInterview: string;
    interviewer: string;
    fraudStory: boolean;
    customerAskedForHelp: boolean;
    dollarInquiry: boolean;
  };
  prevId?: string;
  nextId?: string;
}

export default function InterviewHeader({ interview, prevId, nextId }: InterviewHeaderProps) {
  const sectionLinks = [
    { href: '#overview', label: 'Overview' },
    { href: '#transcript', label: 'Transcript' },
    { href: '#raw', label: 'Raw data' },
  ];

  return (
    <header className="animate-fade-in-up" style={{ background: 'var(--paper-warm)' }}>
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Top row: Breadcrumbs and Navigation */}
        <div className="flex items-center justify-between mb-6">
          {/* Breadcrumb navigation */}
          <nav aria-label="Breadcrumb">
            <ol className="flex items-center gap-2 text-sm" style={{ color: 'var(--ink-muted)' }}>
              <li>
                <Link
                  href="/"
                  className="hover:underline transition-colors"
                  style={{ color: 'var(--ink-light)' }}
                >
                  Dashboard
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li>
                <Link
                  href="/interviews"
                  className="hover:underline transition-colors"
                  style={{ color: 'var(--ink-light)' }}
                >
                  Interviews
                </Link>
              </li>
              <li aria-hidden="true">/</li>
              <li style={{ color: 'var(--ink)' }} aria-current="page">
                Interview #{interview.id}
              </li>
            </ol>
          </nav>

          {/* Prev/Next navigation */}
          <div className="flex items-center gap-2">
            <NavigationPill
              href={prevId ? `/interviews/${prevId}` : '#'}
              direction="prev"
              disabled={!prevId}
            />
            <NavigationPill
              href={nextId ? `/interviews/${nextId}` : '#'}
              direction="next"
              disabled={!nextId}
            />
          </div>
        </div>

        {/* Hero section */}
        <div className="mb-6">
          <h1
            className="font-serif text-3xl font-semibold mb-3"
            style={{ color: 'var(--ink)' }}
          >
            {interview.shopType}
          </h1>
          <div
            className="flex flex-wrap items-center gap-4 text-sm"
            style={{ color: 'var(--ink-light)' }}
          >
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              {interview.dateOfInterview}
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              {interview.timeOfInterview}
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              {interview.location}
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              {interview.interviewer}
            </span>
          </div>
        </div>

        {/* Flag indicators row */}
        {(interview.fraudStory || interview.customerAskedForHelp || interview.dollarInquiry) && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            {interview.fraudStory && <FlagIndicator type="fraud" />}
            {interview.customerAskedForHelp && <FlagIndicator type="help" />}
            {interview.dollarInquiry && <FlagIndicator type="fx" />}
          </div>
        )}

        {/* Section jump links */}
        <div
          className="flex items-center gap-2 pt-4"
          style={{ borderTop: `1px solid var(--border-light)` }}
        >
          {sectionLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-sm"
              style={{
                background: 'var(--paper)',
                color: 'var(--ink-light)',
                border: '1px solid var(--border-medium)',
              }}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </header>
  );
}
