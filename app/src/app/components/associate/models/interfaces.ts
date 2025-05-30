import { ProjectStatus } from '../../../dto/project-status.enum';

/**
 * Associates module common interfaces
 * These interfaces are used across multiple associate components
 */

// Project select item for dropdown components
export interface ClientSelectItem {
  name: string;
  id: string | null;
}

// Project status select item for dropdown components
export interface StatusSelectItem {
  label: string;
  value: ProjectStatus | null;
}

// Simple project interface used in dashboard
export interface AssociateProjectSummary {
  id: string;
  name: string;
  client: string;
  startDate: string;
  endDate: string;
  status: ProjectStatus;
}

// Simple notification interface used in dashboard
export interface AssociateNotificationSummary {
  id: string;
  message: string;
  date: string;
  read: boolean;
}

// Simple report interface used in dashboard
export interface AssociateReportSummary {
  id: string;
  title: string;
  date: string;
  status: string;
}
