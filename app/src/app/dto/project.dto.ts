import { ProjectStatus } from '../dto/project-status.enum';
import { Client } from './client.dto';

export interface ProjectDTO {
  projectId: string;
  label: string;
  status: ProjectStatus;
  deadLine: Date;
  startDate: Date;
  isDeleted: boolean;
  owner: Client;
}
