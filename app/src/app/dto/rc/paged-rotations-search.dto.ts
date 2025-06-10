export interface PagedRotationsSearchDTO {
  pageNumber: number;
  pageSize: number;
  label?: string;
  clientId?: string;
  factoryId?: string;
  subFactoryId?: string;
  projectId?: string;
  rotationStatus?: string;
}
