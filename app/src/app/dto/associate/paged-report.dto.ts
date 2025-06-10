import { ReportDTO } from '../aio/report.dto';

export interface PagedReportDTO {
  reportDTOs: ReportDTO[];
  totalPages: number;
  totalElements: number;
  currentPage: number;
  pageSize: number;
}
