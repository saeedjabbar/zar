import type { ReactNode } from 'react';

export type BadgeVariant = 'default' | 'rust' | 'sage' | 'ochre' | 'slate';

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  className?: string;
}

const variantStyles: Record<BadgeVariant, React.CSSProperties> = {
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

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium ${className}`}
      style={variantStyles[variant]}
    >
      {children}
    </span>
  );
}
