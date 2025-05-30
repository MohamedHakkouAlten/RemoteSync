export interface PagedProjectSearchDTO {
  pageNumber: number;
  pageSize: number;
  clientId?: string;          // UUID as string
  label?: string;             // Project label search
  status?: 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'COMPLETED' | 'CANCELLED'; // Enum as string
}
