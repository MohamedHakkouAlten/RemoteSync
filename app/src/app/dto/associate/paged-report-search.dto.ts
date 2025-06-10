import { ReportStatus } from '../report-status.enum';

export interface PagedReportSearchDTO {
  pageNumber: number;
  pageSize: number;
  title?: string; // Optional
  status?: ReportStatus; // Optional
}
