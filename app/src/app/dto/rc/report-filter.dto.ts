export interface ReportFilter {
  pageNumber: number;
  pageSize: number;
  title?: string;  // Changed from name to title
  status?: string;
  startDate?: string;
  endDate?: string;
}
