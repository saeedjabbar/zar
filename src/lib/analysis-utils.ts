import {
  AnalysisFinding,
  AnalysisReport,
  Insight,
  FindingSeverity,
} from "@/types";

/**
 * Mapping of severity levels to their priority numbers.
 * Lower numbers indicate higher priority (more severe).
 */
const SEVERITY_PRIORITY_MAP: Record<FindingSeverity, number> = {
  critical: 1,
  important: 2,
  moderate: 3,
  minor: 4,
};

/**
 * Mapping of severity levels to their display colors.
 * Colors are Tailwind CSS color classes.
 */
const SEVERITY_COLOR_MAP: Record<FindingSeverity, string> = {
  critical: "red",
  important: "orange",
  moderate: "yellow",
  minor: "blue",
};

/**
 * Mapping of severity levels to their icon names.
 * Icons are from common icon libraries (e.g., Lucide, Heroicons).
 */
const SEVERITY_ICON_MAP: Record<FindingSeverity, string> = {
  critical: "alert-circle",
  important: "alert-triangle",
  moderate: "info",
  minor: "check-circle",
};

/**
 * Get severity priority number (lower = more severe).
 * Used for sorting and comparing severity levels.
 *
 * @param severity - The severity level to get the priority for
 * @returns A number representing the priority (1-4, where 1 is most severe)
 *
 * @example
 * ```typescript
 * getSeverityPriority("critical"); // Returns 1
 * getSeverityPriority("minor"); // Returns 4
 * ```
 */
export function getSeverityPriority(severity: FindingSeverity): number {
  return SEVERITY_PRIORITY_MAP[severity];
}

/**
 * Sort findings by severity (critical first, minor last).
 * Creates a new sorted array without mutating the original.
 *
 * @param findings - Array of findings to sort
 * @returns A new array of findings sorted by severity (most severe first)
 *
 * @example
 * ```typescript
 * const sorted = sortFindingsBySeverity(findings);
 * // sorted[0] will be a critical finding (if any exist)
 * ```
 */
export function sortFindingsBySeverity(
  findings: AnalysisFinding[]
): AnalysisFinding[] {
  return [...findings].sort((a, b) => {
    return getSeverityPriority(a.severity) - getSeverityPriority(b.severity);
  });
}

/**
 * Filter findings by minimum severity level.
 * Returns findings that are at or above the specified severity threshold.
 *
 * @param findings - Array of findings to filter
 * @param minSeverity - The minimum severity level to include
 * @returns A new array containing only findings at or above the minimum severity
 *
 * @example
 * ```typescript
 * // Get only critical and important findings
 * const highPriority = filterBySeverity(findings, "important");
 *
 * // Get all findings except minor
 * const significant = filterBySeverity(findings, "moderate");
 * ```
 */
export function filterBySeverity(
  findings: AnalysisFinding[],
  minSeverity: FindingSeverity
): AnalysisFinding[] {
  const minPriority = getSeverityPriority(minSeverity);
  return findings.filter(
    (finding) => getSeverityPriority(finding.severity) <= minPriority
  );
}

/**
 * Format a finding as a summary string.
 * Creates a human-readable summary including severity, title, and description.
 *
 * @param finding - The finding to format
 * @returns A formatted string summarizing the finding
 *
 * @example
 * ```typescript
 * const summary = formatFindingSummary(finding);
 * // Returns: "[CRITICAL] User Satisfaction Low: Overall satisfaction score dropped by 15%"
 * ```
 */
export function formatFindingSummary(finding: AnalysisFinding): string {
  const severityLabel = finding.severity.toUpperCase();
  return `[${severityLabel}] ${finding.title}: ${finding.description}`;
}

/**
 * Extract all recommendations from a report.
 * Collects recommendations from both the report level and all individual findings.
 *
 * @param report - The analysis report to extract recommendations from
 * @returns An array of all unique recommendations
 *
 * @example
 * ```typescript
 * const recommendations = extractAllRecommendations(report);
 * // Returns all recommendations from keyRecommendations and individual findings
 * ```
 */
export function extractAllRecommendations(report: AnalysisReport): string[] {
  const recommendations: Set<string> = new Set();

  // Add key recommendations from the report
  report.keyRecommendations.forEach((rec) => recommendations.add(rec));

  // Add recommendations from each finding in each section
  report.sections.forEach((section) => {
    section.findings.forEach((finding) => {
      if (finding.recommendations) {
        finding.recommendations.forEach((rec) => recommendations.add(rec));
      }
    });
  });

  // Convert Set to array to return unique recommendations
  return Array.from(recommendations);
}

/**
 * Create an insight from raw data.
 * Automatically calculates the trend based on current and previous values.
 *
 * @param title - The title or label for the insight
 * @param value - The main value or metric (can be string or number)
 * @param previousValue - Optional previous value for trend calculation
 * @returns An Insight object with calculated trend
 *
 * @example
 * ```typescript
 * // Create insight with trend calculation
 * const insight = createInsight("Customer Satisfaction", 85, 80);
 * // Returns: { title: "Customer Satisfaction", value: 85, trend: "up" }
 *
 * // Create insight without trend
 * const simpleInsight = createInsight("Total Responses", 1250);
 * // Returns: { title: "Total Responses", value: 1250, trend: undefined }
 * ```
 */
export function createInsight(
  title: string,
  value: string | number,
  previousValue?: number
): Insight {
  const insight: Insight = {
    title,
    value,
  };

  // Calculate trend if both current and previous values are numbers
  if (typeof value === "number" && previousValue !== undefined) {
    if (value > previousValue) {
      insight.trend = "up";
    } else if (value < previousValue) {
      insight.trend = "down";
    } else {
      insight.trend = "stable";
    }
  }

  return insight;
}

/**
 * Get severity color for UI display.
 * Returns a color name suitable for use with Tailwind CSS or other styling.
 *
 * @param severity - The severity level to get the color for
 * @returns A color name string (e.g., "red", "orange", "yellow", "blue")
 *
 * @example
 * ```typescript
 * const color = getSeverityColor("critical");
 * // Returns: "red"
 *
 * // Usage with Tailwind CSS
 * const className = `bg-${getSeverityColor(severity)}-100 text-${getSeverityColor(severity)}-800`;
 * ```
 */
export function getSeverityColor(severity: FindingSeverity): string {
  return SEVERITY_COLOR_MAP[severity];
}

/**
 * Get severity icon name for UI display.
 * Returns an icon name compatible with common icon libraries.
 *
 * @param severity - The severity level to get the icon for
 * @returns An icon name string (e.g., "alert-circle", "alert-triangle")
 *
 * @example
 * ```typescript
 * const iconName = getSeverityIcon("critical");
 * // Returns: "alert-circle"
 *
 * // Usage with Lucide React
 * import { AlertCircle, AlertTriangle, Info, CheckCircle } from "lucide-react";
 * ```
 */
export function getSeverityIcon(severity: FindingSeverity): string {
  return SEVERITY_ICON_MAP[severity];
}
