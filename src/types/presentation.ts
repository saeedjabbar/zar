/**
 * Presentation/Slide types for the survey analysis presentation mode
 */

/**
 * Available slide types
 */
export type SlideType =
  | "title"
  | "statistics"
  | "chart"
  | "keyFindings"
  | "quote"
  | "recommendations"
  | "comparison"
  | "timeline";

/**
 * Statistic item for statistics slides
 */
export interface SlideStat {
  /** The main value to display */
  value: string;
  /** Label describing the statistic */
  label: string;
  /** Optional change indicator (e.g., "+5%", "-3%") */
  change?: string;
}

/**
 * Chart data point for chart slides
 */
export interface SlideChartData {
  /** Name/label for the data point */
  name: string;
  /** Numeric value */
  value: number;
  /** Optional color for the chart segment */
  color?: string;
}

/**
 * Comparison column data for comparison slides
 */
export interface ComparisonColumn {
  /** Title for the column */
  title: string;
  /** List of items in the column */
  items: string[];
}

/**
 * Comparison data structure
 */
export interface SlideComparison {
  /** Left column data */
  left: ComparisonColumn;
  /** Right column data */
  right: ComparisonColumn;
}

/**
 * Main Slide interface representing a single presentation slide
 */
export interface Slide {
  /** Unique identifier for the slide */
  id?: string;

  /** Type of slide determines rendering */
  type: SlideType;

  /** Main title for the slide */
  title?: string;

  /** Subtitle (used in title slides) */
  subtitle?: string;

  /** Statistics data for statistics slides */
  stats?: SlideStat[];

  /** Chart data for chart slides */
  chartData?: SlideChartData[];

  /** Type of chart to render */
  chartType?: "pie" | "bar";

  /** Key findings list for keyFindings slides */
  findings?: string[];

  /** Quote text for quote slides */
  quote?: string;

  /** Attribution for quote slides */
  attribution?: string;

  /** Generic items list for recommendations/timeline slides */
  items?: string[];

  /** Comparison data for comparison slides */
  comparison?: SlideComparison;
}

/**
 * Presentation containing multiple slides
 */
export interface Presentation {
  /** Unique identifier */
  id: string;

  /** Presentation title */
  title: string;

  /** Optional description */
  description?: string;

  /** Array of slides */
  slides: Slide[];

  /** Creation timestamp */
  createdAt?: Date;

  /** Last modified timestamp */
  updatedAt?: Date;
}
