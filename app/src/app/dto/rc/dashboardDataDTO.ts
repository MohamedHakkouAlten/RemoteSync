import { LargestProject, Project } from "../../models/project.model"
import { RCReport } from "../../models/report.model"

export interface DashBoardDataDTO {
        activeProjectCount: number
        completedProjectCount: number
        totalSites: number
        totalCapacity: number
        totalOnSiteAssociates: number
        longestDurationProject:Project
        largestMembersProject :LargestProject
        pendingReports:RCReport[]
}
export interface RCProjectCountsDTO {
        activeProjects: 3,
        totalProjects: 6,
        completedProjects: 1,
        cancelledProjects: 1,
        inActiveProjects : 1,
        projects :Project[]
}

