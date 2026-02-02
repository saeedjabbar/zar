import { SectionCard } from './ui';
import TranscriptViewer from '@/components/interviews/TranscriptViewer';

interface TranscriptSectionProps {
  transcript: string;
}

export default function TranscriptSection({ transcript }: TranscriptSectionProps) {
  return (
    <SectionCard
      title="Transcript"
      id="transcript"
      action={
        <a href="#overview" className="text-sm font-medium" style={{ color: 'var(--accent-rust)' }}>
          Back to top
        </a>
      }
    >
      {transcript ? (
        <TranscriptViewer transcript={transcript} maxHeight="70vh" />
      ) : (
        <p
          className="text-center py-8"
          style={{ color: 'var(--ink-muted)' }}
        >
          No transcript available.
        </p>
      )}
    </SectionCard>
  );
}
