/**
 * TypeScript type definitions for the ZAR Retail Payment Survey
 *
 * This module contains all type definitions used for survey data collection,
 * analysis, and visualization in the ZAR Survey Analysis project.
 */

// ============================================================================
// Existing Interview Types
// ============================================================================

export interface Interview {
  id: string;
  timestamp: string;
  interviewer: string;
  dateOfInterview: string;
  timeOfInterview: string;
  shopType: string;
  location: string;
  ownerAge: number;
  customersPerDay: string;
  busiestTime: string;
  paymentMethods: string[];
  mobilePaymentTimeline: string;
  concernsBeforeStarting: string;
  currentProblems: string;
  customerAskedForHelp: boolean;
  helpRequestDetails: string | null;
  dollarInquiry: boolean;
  dollarResponse: string | null;
  currencyExchangeReferral: string[];
  whyReferElsewhere: string;
  fraudStory: boolean;
  fraudDetails: string | null;
  moneyLost: string | null;
  avoidanceBehaviors: string | null;
  lastNewService: string;
  serviceInfluencer: string;
  trustFactors: string;
  exactPhrases: string | null;
  surprisingObservations: string | null;
  audioFile: string;
  photoFile: string;
  transcript: string;
}

export interface InterviewInsight {
  interviewId: string;
  keyThemes: string[];
  sentiment: "positive" | "neutral" | "negative" | "mixed";
  sentimentScore: number;
  paymentSummary: string;
  fraudSummary: string;
  trustSummary: string;
  behavioralPatterns: string;
  notableQuotes: { quote: string; context: string }[];
  recommendations: string[];
}

// ============================================================================
// Shop Types
// ============================================================================

/**
 * Enumeration of shop/business types covered in the survey.
 * These categories represent the primary retail sectors in the survey area.
 */
export type ShopType =
  | "Grocery/Corner Store"
  | "Restaurant/Food Vendor"
  | "Clothing/Fashion"
  | "Electronics"
  | "Pharmacy"
  | "Hardware Store"
  | "Other";

// ============================================================================
// Payment Methods
// ============================================================================

/**
 * Payment methods available and tracked in the survey.
 *
 * - Cash: Physical currency transactions
 * - Debit Card: Direct bank account debit cards
 * - Credit Card: Credit-based card payments
 * - Mobile Wallet: Digital wallet apps (e.g., mobile money, e-wallets)
 * - Bank Transfer: Direct bank-to-bank transfers (EFT, RTGS)
 * - BNPL: Buy Now, Pay Later services
 * - Other: Any payment method not listed above
 */
export type PaymentMethod =
  | "Cash"
  | "Debit Card"
  | "Credit Card"
  | "Mobile Wallet"
  | "Bank Transfer"
  | "BNPL"
  | "Other";

// ============================================================================
// Survey Response
// ============================================================================

/**
 * Represents a single survey response from a retail establishment.
 * Contains all data collected during the survey interview.
 */
export interface SurveyResponse {
  /**
   * Unique identifier for the survey response.
   * Format: UUID or sequential ID depending on data source.
   */
  id: string;

  /**
   * Date and time when the survey was completed.
   */
  timestamp: Date;

  /**
   * Category/type of the surveyed shop or business.
   */
  shopType: ShopType;

  /**
   * Name of the shop or business (optional for anonymity).
   */
  shopName?: string;

  /**
   * Geographic location or area of the shop.
   * Could be neighborhood, district, or address.
   */
  location?: string;

  // --------------------------------------------------------------------------
  // Payment Preferences
  // --------------------------------------------------------------------------

  /**
   * The payment method most commonly used by customers at this shop.
   */
  primaryPaymentMethod: PaymentMethod;

  /**
   * List of all payment methods the shop accepts.
   */
  acceptedPaymentMethods: PaymentMethod[];

  /**
   * The payment method the shop owner/operator prefers to receive.
   */
  preferredPaymentMethod: PaymentMethod;

  // --------------------------------------------------------------------------
  // Transaction Details
  // --------------------------------------------------------------------------

  /**
   * Average value of a single transaction in local currency (ZAR).
   * Optional as some respondents may not disclose financial details.
   */
  averageTransactionValue?: number;

  /**
   * Approximate number of transactions processed per day.
   * Optional as this may vary significantly or be unknown.
   */
  dailyTransactionVolume?: number;

  // --------------------------------------------------------------------------
  // Pain Points and Preferences
  // --------------------------------------------------------------------------

  /**
   * List of challenges or issues the shop faces with current payment methods.
   * Examples: "High fees", "Network issues", "Cash handling risks"
   */
  paymentChallenges?: string[];

  /**
   * Whether the shop is willing to adopt digital payment methods
   * if barriers were removed.
   */
  wouldAdoptDigital: boolean;

  /**
   * Reasons preventing or discouraging adoption of digital payments.
   * Examples: "Cost of equipment", "Lack of customer demand", "Trust issues"
   */
  digitalAdoptionBarriers?: string[];

  // --------------------------------------------------------------------------
  // Additional Fields
  // --------------------------------------------------------------------------

  /**
   * Free-form notes or additional comments from the survey.
   */
  notes?: string;
}

// ============================================================================
// Survey Statistics
// ============================================================================

/**
 * Aggregated statistics computed from survey responses.
 * Used for dashboard displays and summary reports.
 */
export interface SurveyStats {
  /**
   * Total number of survey responses collected.
   */
  totalResponses: number;

  /**
   * Distribution of responses by shop type.
   * Key is the shop type, value is the count of responses.
   */
  shopTypeDistribution: Record<ShopType, number>;

  /**
   * Distribution of primary payment methods across all responses.
   * Key is the payment method, value is the count of shops using it as primary.
   */
  paymentMethodDistribution: Record<PaymentMethod, number>;

  /**
   * Percentage of respondents willing to adopt digital payments.
   * Value between 0 and 1 (e.g., 0.75 = 75%).
   */
  digitalAdoptionRate: number;

  /**
   * Most frequently reported payment challenges, sorted by frequency.
   */
  topChallenges: string[];
}

// ============================================================================
// Chart Data Types
// ============================================================================

/**
 * Generic data point for pie charts and similar visualizations.
 * Used with charting libraries like Recharts.
 */
export interface ChartDataPoint {
  /**
   * Label for this data point (displayed in legend/tooltip).
   */
  name: string;

  /**
   * Numeric value for this data point.
   */
  value: number;

  /**
   * Optional color code for this data point (hex or named color).
   * If not provided, the chart library will use default colors.
   */
  color?: string;
}

/**
 * Data structure for bar chart visualizations.
 * Represents a single bar in a bar chart.
 */
export interface BarChartData {
  /**
   * Label for the bar (x-axis category).
   */
  name: string;

  /**
   * Height/value of the bar (y-axis value).
   */
  count: number;
}
