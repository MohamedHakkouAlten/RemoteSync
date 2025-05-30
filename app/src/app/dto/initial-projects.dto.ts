import { Client } from './client.dto';
import { PagedProjectDTO } from './paged-project.dto';

export interface InitialProjectsDTO {
  allClients: Client[];
  projects: PagedProjectDTO;
}
