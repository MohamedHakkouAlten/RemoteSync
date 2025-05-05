export interface RotationReport {
    id: number; // Add an ID for unique key in *ngFor
    name: string;
    status: 'Remote' | 'On-site';
    dateRange: string ;
    reason: string;
  }