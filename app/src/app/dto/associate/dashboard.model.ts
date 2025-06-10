import { ProjectDTO } from "../aio/project.dto";
import { ReportDTO } from "../aio/report.dto";

/**
 * Dashboard-specific interfaces for the associate module
 */

/**
 * Calendar day interface for dashboard mini calendar
 */
export interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  hasEvent: boolean;
  isToday: boolean;
}

/**
 * Calendar event interface for marking dates on the calendar
 */
export interface CalendarEvent {
  date: Date;
  type: 'on-site' | 'remote' | 'holiday' | 'report';
  title: string;
}

/**
 * Dashboard stats for quick overview of associate data
 */
export interface DashboardStats {
  totalProjects: number;
  onSiteWeeks: number;
  reportsCount: number;
}

/**
 * Extended ProjectDTO for UI display with additional properties
 */
export interface DashboardProjectDTO extends ProjectDTO {
  // Additional UI-specific properties
  progressValue: number;
  client: string;
  timeline: string;
  teamSize: number;
  duration: string;
}

/**
 * Extended ReportDTO for UI display with additional properties
 */
export interface DashboardReportDTO extends ReportDTO {
  // Additional UI-specific properties
  statusSeverity: string;
  date: string;
  reason: string;
  description: string;
}

/**
 * Project summary for the dashboard
 */
export interface ProjectSummary {
  id: string;
  name: string;
  client: string;
  startDate: string;
  endDate: string;
  progress: number;
}

/**
 * Report summary for the dashboard
 */
export interface ReportSummary {
  id: string;
  title: string;
  date: string;
  status: string;
}
