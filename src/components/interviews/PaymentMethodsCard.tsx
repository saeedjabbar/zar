import { SectionCard, Badge } from './ui';

interface PaymentMethodsCardProps {
  paymentMethods: string[];
}

export default function PaymentMethodsCard({ paymentMethods }: PaymentMethodsCardProps) {
  return (
    <SectionCard title="Payment Methods Accepted">
      {paymentMethods.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {paymentMethods.map((method) => (
            <Badge key={method}>{method}</Badge>
          ))}
        </div>
      ) : (
        <p style={{ color: 'var(--ink-muted)' }}>No payment methods recorded.</p>
      )}
    </SectionCard>
  );
}
