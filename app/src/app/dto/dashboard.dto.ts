import { ProjectDTO } from './aio/project.dto';
import { ReportDTO } from './aio/report.dto';

export interface DashboardDTO {
  onSiteWeeks: string[];
  recentReports: ReportDTO[];
  oldProjects: ProjectDTO[];
  reportsCount: number;
  projectsCount: number;
  currentProject: ProjectDTO;
}
