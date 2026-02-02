import { SectionCard } from './ui';

interface KeyNotesCardProps {
  concernsBeforeStarting: string;
  currentProblems: string;
  whyReferElsewhere?: string;
}

export default function KeyNotesCard({
  concernsBeforeStarting,
  currentProblems,
  whyReferElsewhere,
}: KeyNotesCardProps) {
  return (
    <SectionCard title="Key Notes">
      <div className="space-y-5">
        {/* Concerns before starting mobile payments */}
        <div>
          <h3
            className="text-sm font-semibold"
            style={{ color: 'var(--ink)' }}
          >
            Concerns before starting mobile payments
          </h3>
          <p
            className="text-sm whitespace-pre-wrap"
            style={{ color: 'var(--ink-light)' }}
          >
            {concernsBeforeStarting || '—'}
          </p>
        </div>

        {/* Current problems with mobile payments */}
        <div
          className="pt-5"
          style={{ borderTop: '1px solid var(--border-light)' }}
        >
          <h3
            className="text-sm font-semibold"
            style={{ color: 'var(--ink)' }}
          >
            Current problems with mobile payments
          </h3>
          <p
            className="text-sm whitespace-pre-wrap"
            style={{ color: 'var(--ink-light)' }}
          >
            {currentProblems || '—'}
          </p>
        </div>

        {/* Why they refer customers elsewhere - conditional */}
        {whyReferElsewhere && (
          <div
            className="pt-5"
            style={{ borderTop: '1px solid var(--border-light)' }}
          >
            <h3
              className="text-sm font-semibold"
              style={{ color: 'var(--ink)' }}
            >
              Why they refer customers elsewhere
            </h3>
            <p
              className="text-sm whitespace-pre-wrap"
              style={{ color: 'var(--ink-light)' }}
            >
              {whyReferElsewhere}
            </p>
          </div>
        )}
      </div>
    </SectionCard>
  );
}
