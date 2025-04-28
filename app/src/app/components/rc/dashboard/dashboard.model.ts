// src/app/components/rc/dashboard/interfaces/dashboard.interfaces.ts

export interface IScheduleEntry {
    id: number;
    name: string;
    project: string;
    statuses: { [date: string]: 'Remote' | 'On-site' | null }; // Use date string as key
  }
  
  export interface IPendingRequest {
    id: number;
    name: string;
    status: 'Remote' | 'On-site' | 'Emergency'; // Added Emergency based on image
    dateRange: string;
    reason: string;
    clientInfo?: string; // Optional fields based on image examples
  }
  
  export interface ISiteStats {
    totalSites: number;
    totalCapacity: number;
    remoteWorkersPercentage: number;
    onsiteWorkersPercentage: number;
  }
  
  export interface IProjectHighlight {
    name: string;
    value: number | string; // Can be duration percentage or member count
    members?: { name: string; avatarUrl?: string }[]; // For largest team
    isPercentage?: boolean; // To help template decide on progress bar vs avatars
  }