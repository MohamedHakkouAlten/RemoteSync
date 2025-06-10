import { ReportStatus } from '../../enums/report-status.enum';

export interface PagedReportSearchDTO {
  pageNumber?: number;
  pageSize?: number;
  title?: string;
  status?: ReportStatus;
  startDate?: string;
  endDate?: string;
  clientId?: string;
  factoryId?: string;
}
