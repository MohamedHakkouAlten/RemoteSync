import { ProjectStatus } from "../enums/project-status.enum"

export interface Project {
            projectId: string
            label?: string
            titre?: string
            status?: ProjectStatus
            deadLine?: string
            startDate?: string
  }
  export interface LargestProject {
            projectId: string
            label?: string
            titre?: string
            status?: ProjectStatus
            deadLine?: string
            startDate?: string
            usersList?:string[]
            usersCount:number
  }


  