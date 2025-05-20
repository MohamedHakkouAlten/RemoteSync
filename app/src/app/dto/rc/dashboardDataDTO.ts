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

