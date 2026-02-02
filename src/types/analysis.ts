/**
 * Analysis-related type definitions for the ZAR Survey Analysis project.
 * These types define the structure of analysis reports, findings, and insights.
 */

/**
 * Severity level for analysis findings.
 * Used to prioritize and categorize the importance of discovered insights.
 *
 * - "critical": Requires immediate attention, significant impact
 * - "important": High priority, should be addressed soon
 * - "moderate": Notable finding, medium priority
 * - "minor": Low priority, informational
 */
export type FindingSeverity = "critical" | "important" | "moderate" | "minor";

/**
 * Represents a single finding from the analysis.
 * Findings are individual insights or observations discovered during data analysis.
 */
export interface AnalysisFinding {
  /** Unique identifier for the finding */
  id: string;

  /** Brief, descriptive title of the finding */
  title: string;

  /** Detailed explanation of the finding and its implications */
  description: string;

  /** Severity/importance level of this finding */
  severity: FindingSeverity;

  /** Category or theme this finding belongs to (e.g., "User Satisfaction", "Feature Usage") */
  category: string;

  /** Optional key-value pairs of data that support this finding */
  supportingData?: Record<string, number | string>;

  /** Optional list of actionable recommendations based on this finding */
  recommendations?: string[];
}

/**
 * Represents a section of the analysis report.
 * Sections group related findings together under a common theme or topic.
 */
export interface AnalysisSection {
  /** Unique identifier for the section */
  id: string;

  /** Title of the analysis section */
  title: string;

  /** Brief summary of the section's key points */
  summary: string;

  /** List of findings within this section */
  findings: AnalysisFinding[];

  /** Optional type of visualization recommended for this section's data */
  visualizationType?: "pie" | "bar" | "line" | "table";

  /** Optional data formatted for chart rendering */
  chartData?: unknown;
}

/**
 * Represents a complete analysis report.
 * This is the top-level structure containing all analysis results.
 */
export interface AnalysisReport {
  /** Unique identifier for the report */
  id: string;

  /** Title of the analysis report */
  title: string;

  /** Timestamp when the report was generated */
  generatedAt: Date;

  /** Identifier or description of the data source analyzed */
  dataSource: string;

  /** Total number of survey responses included in this analysis */
  totalResponses: number;

  /** Array of analysis sections comprising the full report */
  sections: AnalysisSection[];

  /** High-level summary of the entire analysis for executives/stakeholders */
  executiveSummary: string;

  /** List of the most important recommendations derived from the analysis */
  keyRecommendations: string[];
}

/**
 * Represents a single insight for display purposes.
 * Used for dashboard widgets and summary displays.
 */
export interface Insight {
  /** Title or label for the insight */
  title: string;

  /** The main value or metric being displayed */
  value: string | number;

  /** Optional trend indicator showing direction of change */
  trend?: "up" | "down" | "stable";

  /** Optional additional context or explanation */
  description?: string;
}
