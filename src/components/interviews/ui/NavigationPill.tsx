import Link from 'next/link';

interface NavigationPillProps {
  href: string;
  direction: 'prev' | 'next';
  disabled?: boolean;
}

export function NavigationPill({ href, direction, disabled = false }: NavigationPillProps) {
  const isPrev = direction === 'prev';
  const label = isPrev ? 'Prev' : 'Next';

  const baseStyles = {
    background: disabled ? 'var(--paper-warm)' : 'var(--paper)',
    color: disabled ? 'var(--ink-muted)' : 'var(--ink-light)',
    border: `1px solid ${disabled ? 'var(--border-light)' : 'var(--border-medium)'}`,
  };

  if (disabled) {
    return (
      <span
        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium cursor-not-allowed opacity-60"
        style={baseStyles}
        aria-disabled="true"
      >
        {isPrev && (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
          </svg>
        )}
        {label}
        {!isPrev && (
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
          </svg>
        )}
      </span>
    );
  }

  return (
    <Link
      href={href}
      className="group inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-sm"
      style={baseStyles}
    >
      {isPrev && (
        <svg
          className="w-4 h-4 transition-transform group-hover:-translate-x-0.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
        </svg>
      )}
      {label}
      {!isPrev && (
        <svg
          className="w-4 h-4 transition-transform group-hover:translate-x-0.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
        </svg>
      )}
    </Link>
  );
}
