import { ProjectStatus } from "../enums/project-status.enum"

export interface Client {
    clientId?:string,
    label?:string,
    address?:string,
    ice?:string
    email?:string,
    name ?:string
}
export interface Project {
            projectId?: string
            label?: string
            titre?: string
            status?: ProjectStatus
            deadLine?: string
            startDate?: string
            owner ?:Client
            clientId ?:string
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




  