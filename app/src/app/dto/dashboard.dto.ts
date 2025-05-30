import { ProjectDTO } from './project.dto';
import { ReportDTO } from './report.dto';

export interface DashboardDTO {
  onSiteWeeks: string[];
  recentReports: ReportDTO[];
  oldProjects: ProjectDTO[];
  reportsCount: number;
  projectsCount: number;
  currentProject: ProjectDTO;
}
