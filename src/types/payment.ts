/**
 * Payment-related type definitions for ZAR Survey Analysis
 * @module types/payment
 */

/**
 * Payment method categories representing the main classification of payment types
 * - cash: Physical currency transactions
 * - card: Debit and credit card payments
 * - digital: Mobile wallets and electronic payment systems
 * - credit: Credit-based payment methods including BNPL
 */
export type PaymentCategory = "cash" | "card" | "digital" | "credit";

/**
 * Detailed information about a specific payment method
 */
export interface PaymentMethodInfo {
  /** Unique identifier for the payment method */
  id: string;
  /** Display name of the payment method */
  name: string;
  /** Category classification of the payment method */
  category: PaymentCategory;
  /** Optional icon identifier or path for UI display */
  icon?: string;
  /** Optional description explaining the payment method */
  description?: string;
  /** Optional adoption rate as a percentage (0-100) */
  adoptionRate?: number;
}

/**
 * Payment trend data showing usage patterns and growth projections
 */
export interface PaymentTrend {
  /** Name of the payment method */
  method: string;
  /** Current usage percentage (0-100) */
  currentUsage: number;
  /** Projected growth rate as a percentage */
  projectedGrowth: number;
  /** List of challenges affecting adoption or growth */
  challenges: string[];
}

/**
 * Comparison metrics for evaluating different payment methods
 */
export interface PaymentComparison {
  /** Name of the payment method being compared */
  method: string;
  /** Transaction processing speed rating */
  speed: "fast" | "medium" | "slow";
  /** Cost level for merchants/users */
  cost: "low" | "medium" | "high";
  /** How accessible the method is to the general population */
  accessibility: "high" | "medium" | "low";
  /** Security rating of the payment method */
  securityLevel: "high" | "medium" | "low";
}

/**
 * Constant definitions for payment methods with their display names and chart colors
 * Used for consistent styling across visualizations and UI components
 */
export const PAYMENT_METHODS = {
  /** Physical currency - most accessible payment method */
  cash: { name: "Cash", color: "#22c55e" },
  /** Debit card - direct bank account payments */
  debitCard: { name: "Debit Card", color: "#3b82f6" },
  /** Credit card - credit-based card payments */
  creditCard: { name: "Credit Card", color: "#8b5cf6" },
  /** Mobile wallet - digital payment apps */
  mobileWallet: { name: "Mobile Wallet", color: "#f59e0b" },
  /** Bank transfer - direct bank-to-bank payments */
  bankTransfer: { name: "Bank Transfer", color: "#06b6d4" },
  /** Buy Now Pay Later - deferred payment services */
  bnpl: { name: "BNPL", color: "#ec4899" },
} as const;

/**
 * Type representing valid keys of the PAYMENT_METHODS constant
 */
export type PaymentMethodKey = keyof typeof PAYMENT_METHODS;

/**
 * Type representing the structure of a payment method entry in PAYMENT_METHODS
 */
export type PaymentMethodEntry = (typeof PAYMENT_METHODS)[PaymentMethodKey];
