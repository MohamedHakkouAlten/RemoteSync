import { RcRecentAssociateRotations } from './rc-recent-associate-rotations.dto';

export interface RcDashboardResponse {
  largestTeamProject: { 
    projectDTO: any;
    usersList: any[];
    usersCount: number;
  };
  pendingReports: { reportDTOs: any[] };
  completedProjectsCount: number;
  activeProjectsCount: number;
  factoriesCount: number;
  capacityCount: number;
  countCurrentAssociateOnSite: number;
  longestDurationProject: {
    projectId?: string;
    title?: string;
    label?: string;
    startDate?: string;
    endDate?: string;
    deadLine?: string; // Added for dashboard component usage
    duration?: number;
  };
  recentAssociateRotations: RcRecentAssociateRotations[];
}
