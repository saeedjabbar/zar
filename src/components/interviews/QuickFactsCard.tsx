import { SectionCard } from './ui';

interface QuickFactsCardProps {
  shopType: string;
  location: string;
  ownerAge: number;
  customersPerDay: string;
  busiestTime: string;
  mobilePaymentTimeline: string;
}

interface FactItemProps {
  label: string;
  value: string | number | undefined | null;
}

function FactItem({ label, value }: FactItemProps) {
  const displayValue = value || 'Unknown';

  return (
    <div>
      <dt
        className="text-sm font-medium"
        style={{ color: 'var(--ink-muted)' }}
      >
        {label}
      </dt>
      <dd style={{ color: 'var(--ink)' }}>{displayValue}</dd>
    </div>
  );
}

export default function QuickFactsCard({
  shopType,
  location,
  ownerAge,
  customersPerDay,
  busiestTime,
  mobilePaymentTimeline,
}: QuickFactsCardProps) {
  return (
    <SectionCard title="Quick Facts">
      <dl className="grid grid-cols-2 gap-4">
        <FactItem label="Shop Type" value={shopType} />
        <FactItem label="Location" value={location} />
        <FactItem label="Estimated Owner Age" value={ownerAge} />
        <FactItem label="Estimated Customers/Day" value={customersPerDay} />
        <FactItem label="Busiest Time" value={busiestTime} />
        <FactItem label="Mobile Payment Start Date" value={mobilePaymentTimeline} />
      </dl>
    </SectionCard>
  );
}
