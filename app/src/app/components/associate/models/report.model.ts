import { ReportStatus } from '../../../dto/report-status.enum';
import { ReportType } from '../../../dto/report-type.enum';

/**
 * Report-specific interfaces for the associate module
 */

/**
 * Tag severity types for PrimeNG tags
 */
export type TagSeverity = "success" | "danger" | "warn" | "info" | "secondary" | "contrast" | undefined;

/**
 * UI-friendly report structure for display
 */
export interface Report {
  id: string; 
  title: string;
  type: string;
  typeIcon: string;
  description: string;
  date: string;
  status: string;
  statusSeverity?: TagSeverity;
}

/**
 * Report filter options for search/filtering
 */
export interface ReportFilter {
  status: ReportStatus | null;
  type: ReportType | null;
  startDate: Date | null;
  endDate: Date | null;
  title: string | null;
}

/**
 * Select option for dropdowns
 */
export interface SelectOption {
  label: string;
  value: string | null;
}
