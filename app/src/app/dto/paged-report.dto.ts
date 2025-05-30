import { ReportDTO } from './report.dto';

export interface PagedReportDTO {
  reportDTOs: ReportDTO[];
  totalPages: number;
  totalElements: number;
  currentPage: number;
  pageSize: number;
}
