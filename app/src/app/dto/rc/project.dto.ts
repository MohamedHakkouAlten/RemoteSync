export interface ProjectDTO {
  projectId: string;
  projectName: string;
  clientName: string;
  factoryName: string;
  subFactoryName?: string;
  startDate?: string;
  endDate?: string;
  calculateCapacity?: boolean;
  projectDescription?: string;
  status: string;
  creationDate: string;
  modificationDate?: string;
}
