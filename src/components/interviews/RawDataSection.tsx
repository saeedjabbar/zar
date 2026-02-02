import { SectionCard } from './ui';
import SurveyFields from '@/components/interviews/SurveyFields';
import type { Interview } from '@/types';

interface RawDataSectionProps {
  interview: Interview;
}

export default function RawDataSection({ interview }: RawDataSectionProps) {
  return (
    <SectionCard
      title="Raw Data"
      id="raw"
      action={
        <a href="#overview" className="text-sm font-medium" style={{ color: 'var(--accent-rust)' }}>
          Back to top
        </a>
      }
    >
      <SurveyFields interview={interview} />
    </SectionCard>
  );
}
