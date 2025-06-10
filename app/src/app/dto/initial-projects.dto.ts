import { Client } from './aio/client.dto';
import { PagedProjectDTO } from './associate/paged-project.dto';

export interface InitialProjectsDTO {
  allClients: Client[];
  projects: PagedProjectDTO;
}
