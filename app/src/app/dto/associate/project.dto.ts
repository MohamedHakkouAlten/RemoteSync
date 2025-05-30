import { ProjectStatus } from '../project-status.enum';
import { Client } from '../client.dto';

/**
 * Associate-specific project DTO
 * Contains only the fields that associates need to see about projects
 */
export interface AssociateProjectDTO {
    id: string;
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    status: ProjectStatus;
    client: Client;
    labels: string[];
}
