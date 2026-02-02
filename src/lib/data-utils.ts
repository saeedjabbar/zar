/**
 * Data transformation utilities for ZAR Survey Analysis
 *
 * This module provides utility functions for transforming survey data
 * into formats suitable for analysis, statistics, and chart visualizations.
 *
 * @module lib/data-utils
 */

import {
  SurveyResponse,
  SurveyStats,
  ChartDataPoint,
  BarChartData,
  ShopType,
  PaymentMethod,
} from "@/types";

/**
 * All possible shop types for ensuring complete distribution records
 */
const ALL_SHOP_TYPES: ShopType[] = [
  "Grocery/Corner Store",
  "Restaurant/Food Vendor",
  "Clothing/Fashion",
  "Electronics",
  "Pharmacy",
  "Hardware Store",
  "Other",
];

/**
 * All possible payment methods for ensuring complete distribution records
 */
const ALL_PAYMENT_METHODS: PaymentMethod[] = [
  "Cash",
  "Debit Card",
  "Credit Card",
  "Mobile Wallet",
  "Bank Transfer",
  "BNPL",
  "Other",
];

/**
 * Calculate comprehensive statistics from survey responses.
 *
 * Computes aggregated statistics including total responses, distribution
 * by shop type, distribution by payment method, digital adoption rate,
 * and most common payment challenges.
 *
 * @param responses - Array of survey responses to analyze
 * @returns SurveyStats object containing computed statistics
 *
 * @example
 * ```typescript
 * const responses = [/* survey data *\/];
 * const stats = calculateSurveyStats(responses);
 * console.log(`Total: ${stats.totalResponses}`);
 * console.log(`Digital adoption: ${stats.digitalAdoptionRate * 100}%`);
 * ```
 */
export function calculateSurveyStats(responses: SurveyResponse[]): SurveyStats {
  // Handle empty array edge case
  if (responses.length === 0) {
    // Initialize empty distributions with zero counts
    const emptyShopDistribution = ALL_SHOP_TYPES.reduce(
      (acc, type) => {
        acc[type] = 0;
        return acc;
      },
      {} as Record<ShopType, number>
    );

    const emptyPaymentDistribution = ALL_PAYMENT_METHODS.reduce(
      (acc, method) => {
        acc[method] = 0;
        return acc;
      },
      {} as Record<PaymentMethod, number>
    );

    return {
      totalResponses: 0,
      shopTypeDistribution: emptyShopDistribution,
      paymentMethodDistribution: emptyPaymentDistribution,
      digitalAdoptionRate: 0,
      topChallenges: [],
    };
  }

  // Calculate shop type distribution
  const shopTypeDistribution = ALL_SHOP_TYPES.reduce(
    (acc, type) => {
      acc[type] = 0;
      return acc;
    },
    {} as Record<ShopType, number>
  );

  responses.forEach((response) => {
    if (response.shopType in shopTypeDistribution) {
      shopTypeDistribution[response.shopType]++;
    }
  });

  // Calculate payment method distribution (based on primary payment method)
  const paymentMethodDistribution = ALL_PAYMENT_METHODS.reduce(
    (acc, method) => {
      acc[method] = 0;
      return acc;
    },
    {} as Record<PaymentMethod, number>
  );

  responses.forEach((response) => {
    if (response.primaryPaymentMethod in paymentMethodDistribution) {
      paymentMethodDistribution[response.primaryPaymentMethod]++;
    }
  });

  // Calculate digital adoption rate
  const digitalAdoptersCount = responses.filter(
    (response) => response.wouldAdoptDigital
  ).length;
  const digitalAdoptionRate = calculatePercentage(
    digitalAdoptersCount,
    responses.length,
    4
  ) / 100;

  // Calculate top challenges
  const challengeCounts: Record<string, number> = {};
  responses.forEach((response) => {
    if (response.paymentChallenges) {
      response.paymentChallenges.forEach((challenge) => {
        challengeCounts[challenge] = (challengeCounts[challenge] || 0) + 1;
      });
    }
  });

  const topChallenges = Object.entries(challengeCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([challenge]) => challenge);

  return {
    totalResponses: responses.length,
    shopTypeDistribution,
    paymentMethodDistribution,
    digitalAdoptionRate,
    topChallenges,
  };
}

/**
 * Transform shop type data for bar chart visualization.
 *
 * Converts survey responses into an array of BarChartData objects
 * suitable for rendering bar charts showing distribution by shop type.
 *
 * @param responses - Array of survey responses to transform
 * @returns Array of BarChartData objects with name and count properties
 *
 * @example
 * ```typescript
 * const responses = [/* survey data *\/];
 * const chartData = getShopTypeChartData(responses);
 * // Returns: [{ name: "Grocery/Corner Store", count: 15 }, ...]
 * ```
 */
export function getShopTypeChartData(
  responses: SurveyResponse[]
): BarChartData[] {
  // Handle empty array edge case
  if (responses.length === 0) {
    return [];
  }

  // Count responses by shop type
  const shopTypeCounts: Record<string, number> = {};

  responses.forEach((response) => {
    const shopType = response.shopType;
    shopTypeCounts[shopType] = (shopTypeCounts[shopType] || 0) + 1;
  });

  // Convert to BarChartData array
  const chartData: BarChartData[] = Object.entries(shopTypeCounts).map(
    ([name, count]) => ({
      name,
      count,
    })
  );

  // Sort by count descending
  return chartData.sort((a, b) => b.count - a.count);
}

/**
 * Transform payment method data for pie chart visualization.
 *
 * Converts survey responses into an array of ChartDataPoint objects
 * suitable for rendering pie charts showing distribution by payment method.
 *
 * @param responses - Array of survey responses to transform
 * @returns Array of ChartDataPoint objects with name and value properties
 *
 * @example
 * ```typescript
 * const responses = [/* survey data *\/];
 * const pieData = getPaymentMethodChartData(responses);
 * // Returns: [{ name: "Cash", value: 45 }, { name: "Mobile Wallet", value: 30 }, ...]
 * ```
 */
export function getPaymentMethodChartData(
  responses: SurveyResponse[]
): ChartDataPoint[] {
  // Handle empty array edge case
  if (responses.length === 0) {
    return [];
  }

  // Count responses by primary payment method
  const paymentCounts: Record<string, number> = {};

  responses.forEach((response) => {
    const method = response.primaryPaymentMethod;
    paymentCounts[method] = (paymentCounts[method] || 0) + 1;
  });

  // Convert to ChartDataPoint array with colors
  const paymentColors: Record<string, string> = {
    Cash: "#22c55e",
    "Debit Card": "#3b82f6",
    "Credit Card": "#8b5cf6",
    "Mobile Wallet": "#f59e0b",
    "Bank Transfer": "#06b6d4",
    BNPL: "#ec4899",
    Other: "#6b7280",
  };

  const chartData: ChartDataPoint[] = Object.entries(paymentCounts).map(
    ([name, value]) => ({
      name,
      value,
      color: paymentColors[name] || "#6b7280",
    })
  );

  // Sort by value descending
  return sortByValue(chartData);
}

/**
 * Calculate percentage with optional decimal places.
 *
 * Safely computes the percentage of a value relative to a total,
 * handling edge cases like zero totals.
 *
 * @param value - The numerator value
 * @param total - The denominator (total) value
 * @param decimals - Optional number of decimal places (default: 2)
 * @returns The calculated percentage, or 0 if total is 0
 *
 * @example
 * ```typescript
 * calculatePercentage(25, 100);      // Returns: 25
 * calculatePercentage(1, 3, 4);      // Returns: 33.3333
 * calculatePercentage(50, 0);        // Returns: 0 (safe division)
 * ```
 */
export function calculatePercentage(
  value: number,
  total: number,
  decimals: number = 2
): number {
  // Handle edge case of zero total to prevent division by zero
  if (total === 0) {
    return 0;
  }

  // Handle negative inputs gracefully
  if (value < 0 || total < 0) {
    return 0;
  }

  const percentage = (value / total) * 100;
  const multiplier = Math.pow(10, decimals);

  return Math.round(percentage * multiplier) / multiplier;
}

/**
 * Group an array of items by a specific key.
 *
 * Creates a record/dictionary where keys are the unique values of the
 * specified property, and values are arrays of items with that property value.
 *
 * @typeParam T - The type of items in the array
 * @typeParam K - The key of T to group by (must be a key of T)
 * @param items - Array of items to group
 * @param key - The property key to group by
 * @returns Record with grouped items
 *
 * @example
 * ```typescript
 * const responses = [
 *   { shopType: "Grocery", id: "1" },
 *   { shopType: "Pharmacy", id: "2" },
 *   { shopType: "Grocery", id: "3" }
 * ];
 * const grouped = groupBy(responses, "shopType");
 * // Returns: {
 * //   "Grocery": [{ shopType: "Grocery", id: "1" }, { shopType: "Grocery", id: "3" }],
 * //   "Pharmacy": [{ shopType: "Pharmacy", id: "2" }]
 * // }
 * ```
 */
export function groupBy<T, K extends keyof T>(
  items: T[],
  key: K
): Record<string, T[]> {
  // Handle empty array edge case
  if (items.length === 0) {
    return {};
  }

  return items.reduce(
    (result, item) => {
      const groupKey = String(item[key]);

      if (!result[groupKey]) {
        result[groupKey] = [];
      }

      result[groupKey].push(item);

      return result;
    },
    {} as Record<string, T[]>
  );
}

/**
 * Sort chart data by value in descending order.
 *
 * Creates a new sorted array without mutating the original.
 * Items with higher values appear first in the result.
 *
 * @typeParam T - Type extending an object with a numeric value property
 * @param data - Array of data points to sort
 * @returns New array sorted by value descending
 *
 * @example
 * ```typescript
 * const data = [
 *   { name: "A", value: 10 },
 *   { name: "B", value: 30 },
 *   { name: "C", value: 20 }
 * ];
 * const sorted = sortByValue(data);
 * // Returns: [{ name: "B", value: 30 }, { name: "C", value: 20 }, { name: "A", value: 10 }]
 * ```
 */
export function sortByValue<T extends { value: number }>(data: T[]): T[] {
  // Handle empty array edge case
  if (data.length === 0) {
    return [];
  }

  // Create a new array to avoid mutating the original
  return [...data].sort((a, b) => b.value - a.value);
}

/**
 * Get the top N items from an array.
 *
 * Returns the first N items from the array. If N is greater than
 * the array length, returns all items. Does not mutate the original array.
 *
 * @typeParam T - The type of items in the array
 * @param items - Array of items
 * @param n - Number of items to return
 * @returns Array containing the first N items
 *
 * @example
 * ```typescript
 * const items = [1, 2, 3, 4, 5];
 * getTopN(items, 3);  // Returns: [1, 2, 3]
 * getTopN(items, 10); // Returns: [1, 2, 3, 4, 5] (all items)
 * getTopN([], 5);     // Returns: []
 * ```
 */
export function getTopN<T>(items: T[], n: number): T[] {
  // Handle edge cases
  if (items.length === 0 || n <= 0) {
    return [];
  }

  // Return slice of first N items (or all if N > length)
  return items.slice(0, n);
}
