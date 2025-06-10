/**
 * ProjectFilter interface that maps to the backend ProjectFilterDTO
 * @see Backend: com.alten.remotesync.application.project.record.request.ProjectFilterDTO
 */
export interface ProjectFilter {
  pageNumber: number;   // Required by backend - page number for pagination
  pageSize: number;     // Required by backend - page size for pagination
  name?: string;        // Maps to 'filter' parameter in backend
  sort?: string;        // Required by backend - sorting field
  sortType?: number;    // Required by backend - sorting direction (0 for ASC, 1 for DESC)
  value?: string;       // Required by backend - additional filter value
  status?: string;      // Optional filter by status
  clientId?: string;    // Optional filter by client ID
}
