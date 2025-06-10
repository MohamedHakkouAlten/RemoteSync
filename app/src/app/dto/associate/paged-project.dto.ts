import { ProjectDTO } from '../aio/project.dto';

export interface PagedProjectDTO {
  projectDTOS: ProjectDTO[];
  totalPages: number;
  totalElements: number;
  currentPage: number;
  pageSize: number;
}
