import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { OverlayPanel } from 'primeng/overlaypanel';
import { interval, startWith, Subscription } from 'rxjs';



interface NavLink {
  label: string;
  route?: string; // Optional: Add route path if using Angular Router
}
interface ProjectStatus {
  name: string;
  project: string;
  statuses: { date: string; type: 'Remote' | 'On-site' | null }[]; // More flexible structure
}

interface PendingRequest {
  id: number; // Add an ID for unique key in *ngFor
  name: string;
  status: 'Remote' | 'On-site';
  dateRange: string;
  reason: string;
}
// Define an interface for the simpler structure matching the image columns directly
interface ProjectStatusSimple {
    name: string;
    project: string;
    status_20250414: 'Remote' | 'On-site' | null;
    status_20250421: 'Remote' | 'On-site' | null;
    status_20250429_1: 'Remote' | 'On-site' | null; // Assuming duplicate date needs distinction
    status_20250429_2: 'Remote' | 'On-site' | null;
}

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})

export class DashboardComponent implements OnInit {







  // Icons (using inline SVGs in the template is often easier with Tailwind)


  //left panel stats 
  activeProjects: number = 27;
  completedProjects: number = 15;

  totalSites: number = 8;
  totalCapacity: number = 450;

  remoteWorkersPercent: number = 65;
  onsiteWorkersPercent: number = 35;

  highestDurationProject: string = 'Project Alpha';
  // Approximate value for the progress bar based on the image
  highestDurationValue: number = 85;

  largestTeamProject: string = 'Project Beta';
  largestTeamMembersCount: number = 12;
  // Replace with your actual avatar paths
  teamAvatars: string[] = [
    'assets/images/avatar1.png',
    'assets/images/avatar2.png',
    'assets/images/avatar3.png',
    'assets/images/avatar4.png',
  ];
  // Calculate how many are hidden
  overflowAvatarsCount: number = Math.max(0, this.largestTeamMembersCount - this.teamAvatars.length);

//calendar 
welcomeName: string = 'Mohammed Alami';
tableData: ProjectStatusSimple[] = []; // Use the simpler interface for now
totalRecords: number = 150; // Total number of entries for pagination

// Fixed date columns based on the image
dateColumns: string[] = [
  '14/04/2025',
  '21/04/2025',
  '29/04/2025', // First instance
  '29/04/2025'  // Second instance
];

//recent reports 
pendingRequests: PendingRequest[] = [];


  ngOnInit(): void {




    this.tableData = [
      { name: 'Youssef El Amrani', project: 'Project Alpha', status_20250414: 'Remote', status_20250421: 'Remote', status_20250429_1: 'Remote', status_20250429_2: 'Remote' },
      { name: 'Leila Tazi', project: 'Project Delta', status_20250414: 'On-site', status_20250421: 'On-site', status_20250429_1: 'On-site', status_20250429_2: 'On-site' },
      { name: 'Omar Alaoui', project: 'Project Gamma', status_20250414: 'Remote', status_20250421: 'Remote', status_20250429_1: 'Remote', status_20250429_2: 'Remote' },
      { name: 'Omar Alaoui', project: 'Project Gamma', status_20250414: 'Remote', status_20250421: 'Remote', status_20250429_1: 'Remote', status_20250429_2: 'Remote' },
      { name: 'Omar Alaoui', project: 'Project Gamma', status_20250414: 'Remote', status_20250421: 'Remote', status_20250429_1: 'Remote', status_20250429_2: 'Remote' },
      { name: 'Omar Alaoui', project: 'Project Gamma', status_20250414: 'Remote', status_20250421: 'Remote', status_20250429_1: 'Remote', status_20250429_2: 'Remote' },
      { name: 'Hassan Benjelloun', project: 'Project Alpha', status_20250414: 'Remote', status_20250421: 'Remote', status_20250429_1: 'Remote', status_20250429_2: 'Remote' },
      // Add more mock data rows if needed to test pagination visually (up to 10 for the first page)
      { name: 'Another Person 1', project: 'Project Beta', status_20250414: 'On-site', status_20250421: 'Remote', status_20250429_1: 'On-site', status_20250429_2: 'Remote' },
      { name: 'Another Person 2', project: 'Project Epsilon', status_20250414: 'Remote', status_20250421: 'Remote', status_20250429_1: 'Remote', status_20250429_2: 'Remote' },
      { name: 'Another Person 3', project: 'Project Zeta', status_20250414: 'On-site', status_20250421: 'On-site', status_20250429_1: 'On-site', status_20250429_2: 'On-site' },

    ];
    // In a real app, you'd fetch this data from a service, possibly using the PaginatorState event
    // For now, we just simulate having the first 10 records for display.
    // totalRecords is set above to simulate the full dataset size for the paginator.
    this.pendingRequests = [
      { id: 1, name: 'Youssef El Amrani', status: 'Remote', dateRange: '02/02/2025 - 08/02/2025', reason: 'Client meeting in Paris' },
      { id: 2, name: 'Fatima Benali', status: 'On-site', dateRange: '09/02/2025 - 15/02/2025', reason: 'Project kickoff meeting' },
      { id: 3, name: 'Karim Ziani', status: 'Remote', dateRange: '16/02/2025 - 22/02/2025', reason: 'Family emergency' },
      // Add more requests if needed for scrolling/testing
    ];
  }

   // Placeholder for lazy loading data in a real app
   loadData(event: any) {
       console.log('Lazy load event:', event);
       // In a real app:
       // const page = event.first / event.rows;
       // const rows = event.rows;
       // const sortField = event.sortField;
       // const sortOrder = event.sortOrder;
       // Call your service to fetch data based on these parameters
       // this.myService.getData(page, rows, sortField, sortOrder).subscribe(data => {
       //      this.tableData = data.items;
       //      this.totalRecords = data.totalCount;
       // });
   }

   // Helper function to get the status based on index (since dates can be duplicated)
   getStatus(rowData: ProjectStatusSimple, index: number): 'Remote' | 'On-site' | null {
        switch(index) {
            case 0: return rowData.status_20250414;
            case 1: return rowData.status_20250421;
            case 2: return rowData.status_20250429_1;
            case 3: return rowData.status_20250429_2;
            default: return null;
        }
   
  }



 
}