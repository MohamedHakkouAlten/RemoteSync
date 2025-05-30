import { ReportType } from './report-type.enum';
import { ReportStatus } from './report-status.enum';
import { User } from './user.dto';

export interface ReportDTO {
  reportId: string;
  title: string;
  reason: string;
  type: ReportType;
  status: ReportStatus;
  description: string;
  createdAt: string;
  updatedAt: string;
  createdBy: User;
  updatedBy: User;
}
