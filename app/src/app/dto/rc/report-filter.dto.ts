import { ReportStatus } from "../report-status.enum";

export interface ReportFilter {
  name: string,
  status: ReportStatus | string,
  startDate: string,
  endDate: string,
  pageNumber: number,
  pageSize: number,

}