import { ReportStatus} from "../enums/report-status.enum";
import { User } from "./user.model";

export interface RotationReport {
    id: number; // Add an ID for unique key in *ngFor
    name: string;
    status: 'Remote' | 'On-site';
    dateRange: string ;
    reason: string;
  }

  export interface RCReport{
                reportId?: string,
                title?: string,
                description:string,
                status?: ReportStatus,
                createdBy :User
                createdAt: "2025-05-12T00:00:00"
  }