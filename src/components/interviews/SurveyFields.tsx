import { Interview } from '@/types';

interface SurveyFieldsProps {
  interview: Interview;
}

interface FieldGroupProps {
  title: string;
  children: React.ReactNode;
  id: string;
}

function FieldGroup({ title, children, id }: FieldGroupProps) {
  return (
    <section aria-labelledby={id} className="space-y-4">
      <h3
        id={id}
        className="border-b border-zinc-200 pb-2 text-lg font-semibold text-zinc-900 dark:border-zinc-700 dark:text-zinc-100"
      >
        {title}
      </h3>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

interface FieldRowProps {
  label: string;
  value: string | number | null | undefined;
  className?: string;
}

function FieldRow({ label, value, className = '' }: FieldRowProps) {
  if (value === null || value === undefined || value === '') {
    return null;
  }

  return (
    <div className={`grid grid-cols-1 gap-1 sm:grid-cols-3 sm:gap-4 ${className}`}>
      <dt className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{label}</dt>
      <dd className="text-zinc-900 dark:text-zinc-100 sm:col-span-2">{value}</dd>
    </div>
  );
}

interface TagListProps {
  label: string;
  items: string[];
}

function TagList({ label, items }: TagListProps) {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 gap-1 sm:grid-cols-3 sm:gap-4">
      <dt className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{label}</dt>
      <dd className="sm:col-span-2">
        <div className="flex flex-wrap gap-2" role="list" aria-label={label}>
          {items.map((item) => (
            <span
              key={item}
              role="listitem"
              className="inline-flex rounded-full bg-zinc-100 px-3 py-1 text-sm font-medium text-zinc-800 dark:bg-zinc-700 dark:text-zinc-200"
            >
              {item}
            </span>
          ))}
        </div>
      </dd>
    </div>
  );
}

interface BooleanFieldProps {
  label: string;
  value: boolean;
  details?: string | null;
}

function BooleanField({ label, value, details }: BooleanFieldProps) {
  return (
    <div className="grid grid-cols-1 gap-1 sm:grid-cols-3 sm:gap-4">
      <dt className="text-sm font-medium text-zinc-500 dark:text-zinc-400">{label}</dt>
      <dd className="sm:col-span-2">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-sm font-medium ${
            value
              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
              : 'bg-zinc-100 text-zinc-600 dark:bg-zinc-700 dark:text-zinc-400'
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${value ? 'bg-green-500' : 'bg-zinc-400'}`}
            aria-hidden="true"
          />
          {value ? 'Yes' : 'No'}
        </span>
        {value && details && (
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{details}</p>
        )}
      </dd>
    </div>
  );
}

export default function SurveyFields({ interview }: SurveyFieldsProps) {
  return (
    <article className="space-y-8">
      <header>
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
          Survey Response Data
        </h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
          Raw data collected during the interview
        </p>
      </header>

      <dl className="space-y-8">
        {/* Shop Details */}
        <FieldGroup title="Shop Details" id="shop-details-heading">
          <FieldRow label="Shop Type" value={interview.shopType} />
          <FieldRow label="Location" value={interview.location} />
          <FieldRow label="Owner Age" value={`${interview.ownerAge} years old`} />
        </FieldGroup>

        {/* Business Metrics */}
        <FieldGroup title="Business Metrics" id="business-metrics-heading">
          <FieldRow label="Customers per Day" value={interview.customersPerDay} />
          <FieldRow label="Busiest Time" value={interview.busiestTime} />
        </FieldGroup>

        {/* Payment Methods */}
        <FieldGroup title="Payment Information" id="payment-info-heading">
          <TagList label="Payment Methods Accepted" items={interview.paymentMethods} />
          <FieldRow label="Mobile Payment Timeline" value={interview.mobilePaymentTimeline} />
          <FieldRow label="Concerns Before Starting" value={interview.concernsBeforeStarting} />
          <FieldRow label="Current Problems" value={interview.currentProblems} />
        </FieldGroup>

        {/* Customer Interactions */}
        <FieldGroup title="Customer Interactions" id="customer-interactions-heading">
          <BooleanField
            label="Customer Asked for Help"
            value={interview.customerAskedForHelp}
            details={interview.helpRequestDetails}
          />
          <BooleanField
            label="Dollar Inquiry"
            value={interview.dollarInquiry}
            details={interview.dollarResponse}
          />
          <TagList label="Currency Exchange Referrals" items={interview.currencyExchangeReferral} />
          {interview.whyReferElsewhere && (
            <FieldRow label="Why Refer Elsewhere" value={interview.whyReferElsewhere} />
          )}
        </FieldGroup>

        {/* Fraud Experience */}
        <FieldGroup title="Fraud Experience" id="fraud-experience-heading">
          <BooleanField
            label="Has Fraud Story"
            value={interview.fraudStory}
            details={interview.fraudDetails}
          />
          {interview.fraudStory && (
            <>
              <FieldRow label="Money Lost" value={interview.moneyLost} />
              <FieldRow label="Avoidance Behaviors" value={interview.avoidanceBehaviors} />
            </>
          )}
        </FieldGroup>

        {/* Trust & Decision Factors */}
        <FieldGroup title="Trust & Decision Factors" id="trust-factors-heading">
          <FieldRow label="Last New Service Adopted" value={interview.lastNewService} />
          <FieldRow label="Service Influencer" value={interview.serviceInfluencer} />
          <FieldRow label="Trust Factors" value={interview.trustFactors} />
        </FieldGroup>

        {/* Observations */}
        <FieldGroup title="Interviewer Observations" id="observations-heading">
          {interview.exactPhrases && (
            <div className="grid grid-cols-1 gap-1 sm:grid-cols-3 sm:gap-4">
              <dt className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                Exact Phrases Used
              </dt>
              <dd className="sm:col-span-2">
                <blockquote className="border-l-2 border-zinc-300 pl-4 italic text-zinc-700 dark:border-zinc-600 dark:text-zinc-300">
                  {interview.exactPhrases}
                </blockquote>
              </dd>
            </div>
          )}
          {interview.surprisingObservations && (
            <div className="grid grid-cols-1 gap-1 sm:grid-cols-3 sm:gap-4">
              <dt className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                Surprising Observations
              </dt>
              <dd className="rounded-lg bg-amber-50 p-3 text-amber-900 dark:bg-amber-900/20 dark:text-amber-200 sm:col-span-2">
                {interview.surprisingObservations}
              </dd>
            </div>
          )}
        </FieldGroup>

        {/* Interview Metadata */}
        <FieldGroup title="Interview Metadata" id="interview-metadata-heading">
          <FieldRow label="Interviewer" value={interview.interviewer} />
          <FieldRow label="Date" value={interview.dateOfInterview} />
          <FieldRow label="Time" value={interview.timeOfInterview} />
        </FieldGroup>
      </dl>
    </article>
  );
}
