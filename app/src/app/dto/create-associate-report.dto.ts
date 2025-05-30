import { ReportType } from './report-type.enum';

export interface CreateAssociateReportDTO {
    title: string;
    reason: string;
    type: ReportType;
    description?: string; // Optional field for more details
}
