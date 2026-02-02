/**
 * Founder-facing dashboard types.
 *
 * These types focus on turning qualitative interviews into product decisions:
 * demand signals, trust/risk narratives, operational readiness, and pilot planning.
 */

export type FounderTheme =
  | "fx_demand"
  | "fx_referral"
  | "customer_support"
  | "fraud"
  | "trust"
  | "compliance"
  | "payments";

export interface EvidenceQuote {
  /** Short theme tag for filtering. */
  theme: FounderTheme;
  /** Verbatim excerpt from transcript. */
  quote: string;
  /** Provenance label shown in UI (e.g., "Interview #3 • Pharmacy • I/10"). */
  sourceLabel: string;
  /** Optional linking to the structured survey interview. */
  interviewId?: string;
  /** Optional linking to a raw transcript file. */
  transcriptFileName?: string;
}

export type ReadinessSegment =
  | "ready_now"
  | "promising_but_cautious"
  | "digital_no_fx_yet"
  | "cash_first";

export interface SegmentSummary {
  segment: ReadinessSegment;
  label: string;
  count: number;
  share: number;
  description: string;
  color: string;
}

export interface BarDatum {
  name: string;
  value: number;
  description?: string;
  color?: string;
}

export interface FounderDashboardData {
  totalInterviews: number;
  fxInquiryCount: number;
  helpRequestCount: number;
  fraudStoryCount: number;
  busyTimeDistribution: BarDatum[];
  paymentMethodMentions: BarDatum[];
  fxReferralDestinations: BarDatum[];
  whyNotHandleFxBuckets: BarDatum[];
  fraudPatternBuckets: BarDatum[];
  segments: SegmentSummary[];
  topOpportunities: string[];
  keyRisks: string[];
  recommendedExperiments: { title: string; successMetric: string; whyNow: string }[];
  pilotCandidates: { interviewId: string; label: string; reason: string }[];
  evidenceQuotes: EvidenceQuote[];
  dataQualityNotes: string[];
}

// ============================================================================
// Validation Dashboard Types (Lean Startup Decision Framework)
// ============================================================================

export type ValidationVerdict = "persevere" | "investigate" | "pivot" | "kill";
export type ValidationSignal = "strong" | "moderate" | "weak" | "absent";
export type ConfidenceLevel = "high" | "medium" | "low";
export type DimensionId = "problem" | "willingness" | "friction" | "trust" | "pilots";

export interface ValidationDimension {
  id: DimensionId;
  name: string;
  score: number; // 0-100
  signal: ValidationSignal;
  summary: string;
  evidenceIds: string[];
}

export interface ValidationScorecard {
  overallVerdict: ValidationVerdict;
  verdictRationale: string;
  confidenceLevel: ConfidenceLevel;
  dimensions: ValidationDimension[];
  lastUpdated: string;
}

export interface FunnelStage {
  name: string;
  count: number;
  percentage: number;
  interviewIds: string[];
  dropOffReason?: string;
}

export type Actionability = "high" | "medium" | "low";

export interface WillingnessFactor {
  factor: string;
  mentionCount: number;
  interviewIds: string[];
  actionability: Actionability;
  suggestedAction: string;
}

export type TrustConcernLevel = "low" | "medium" | "high";

export interface EnhancedPilotCandidate {
  interviewId: string;
  shopType: string;
  location: string;
  ownerAge: number;
  dailyCustomers: string;
  readinessScore: number; // 0-100
  factors: {
    hasFxDemand: boolean;
    helpsCustomers: boolean;
    digitalRailCount: number;
    trustConcernLevel: TrustConcernLevel;
    currentlyRefers: boolean;
  };
  approachScript: string;
  riskMitigation: string;
}

export type ExperimentStatus = "proposed" | "running" | "completed" | "cancelled";

export interface Experiment {
  id: string;
  title: string;
  hypothesis: string;
  successMetric: string;
  status: ExperimentStatus;
  linkedEvidence: string[];
}

/** Extended dashboard data with validation framework */
export interface FounderDashboardDataV2 extends FounderDashboardData {
  validationScorecard: ValidationScorecard;
  conversionFunnel: FunnelStage[];
  willingnessFactors: WillingnessFactor[];
  enhancedPilotCandidates: EnhancedPilotCandidate[];
  experiments: Experiment[];
}
