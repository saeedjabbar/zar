import type { ReactNode } from 'react';

interface SectionCardProps {
  children: ReactNode;
  title?: string;
  action?: ReactNode;
  id?: string;
  className?: string;
}

export function SectionCard({ children, title, action, id, className = '' }: SectionCardProps) {
  return (
    <section
      id={id}
      className={`rounded-xl ${className}`}
      style={{
        background: 'var(--paper)',
        border: '1px solid var(--border-light)',
        boxShadow: 'var(--shadow-paper)',
      }}
    >
      {(title || action) && (
        <div
          className="flex items-center justify-between gap-4 px-6 py-4"
          style={{ borderBottom: '1px solid var(--border-light)' }}
        >
          {title && (
            <h2
              className="font-serif text-lg font-semibold"
              style={{ color: 'var(--ink)' }}
            >
              {title}
            </h2>
          )}
          {action}
        </div>
      )}
      <div className="p-6">{children}</div>
    </section>
  );
}
