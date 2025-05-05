import { Component, OnInit } from '@angular/core';
import { RotationReport } from '../../../models/report.model';
import { addWeeks, format, startOfWeek } from 'date-fns';
import { AuthService } from '../../../services/auth.service';
import { RotationStatus } from '../../../enums/rotation-status.enum';

import { Router } from '@angular/router';
import { UserUtils } from '../../../utilities/UserUtils';
import { Rotation } from '../../../models/rotation.model';
import { User } from '../../../models/user.model';
import { RotationService } from '../../../services/rotation.service';






@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})

export class DashboardComponent implements OnInit {


navigateToCalendar() {
this.router.navigate(['RemoteSync/Rc/Calendar'])
}








userUtils=UserUtils;

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

  // Calculate how many are hidden
  overflowAvatarsCount: number = 4;

//calendar 

tableData: Rotation[] = []; // Use the simpler interface for now
totalRecords: number = 150; // Total number of entries for pagination
welcomeName: string=""
// Fixed date columns based on the image
dateColumns:  string[] =this.loadWeeksDates()

user1: User = { id_user: 'user001', firstName: 'Alice', lastName: 'Smith' };
user2: User = { id_user: 'user002', firstName: 'Bob', lastName: 'Jones' };
users:User[]=[this.user1,this.user2]
//recent reports 

pendingRequests: RotationReport[] = [];

constructor(private authService :AuthService,private rotationService:RotationService,private router:Router){

}

  ngOnInit(): void {


    this.welcomeName = this.authService.getFirstName()+" "+this.authService.getLastName();

    this.tableData  = [
      // Rotation 1: Standard 2 weeks OnSite, 2 weeks Remote (Cycle 4)
      {
          user: this.user1,
          startDate: '2025-03-03', // Monday
          endDate: '2025-06-16',   // Sunday
          shift: 2, // 2 weeks OnSite
          cycle: 4, // 4 week total cycle
          customDates: [] // No overrides
      },
      // Rotation 2: 3 weeks OnSite, 1 week Remote (Cycle 4) with Custom Date Overrides
      {
          user: this.user2,
          startDate: '2025-02-05', // Monday
          endDate: '2025-07-28',   // Sunday
          shift: 3, // 3 weeks OnSite
          cycle: 4, // 4 week total cycle
          customDates: [
              { date: '2025-04-27', rotationStatus: RotationStatus.Off },    // Specific day Off (Valentine's Day)
              { date: '2025-05-04', rotationStatus: RotationStatus.Remote }, // Explicitly OnSite (might override cycle)
              { date: '2025-03-04', rotationStatus: RotationStatus.Remote }, // Force Remote during expected OnSite
              { date: '2025-04-01', rotationStatus: RotationStatus.Off }     // Custom date outside initial cycle logic test
          ]
      },
      // Rotation 3: 1 week OnSite, 1 week Remote (Cycle 2) - Shorter cycle
     
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
   getStatus(rowData:Rotation, date :string): RotationStatus {
return this.rotationService.getDateRotationStatus(rowData,date);
  }
  loadWeeksDates():string[]{


    const dateFormat = 'yyyy-MM-dd';

// --- End Configuration ---


// Find the start of the current week
const startOfCurrentWeek = startOfWeek(new Date());

const dateColumns: string[] = [];

// Generate the dates for the current week and the next (numberOfWeeks - 1) weeks
for (let i = 0; i < 4; i++) {
  // Calculate the start date for the target week (0=current, 1=next, etc.)
  const weekStartDate = addWeeks(startOfCurrentWeek, i);

  // Format the date as required
  const formattedDate = format(weekStartDate, dateFormat);

  // Add the formatted date string to the array
  dateColumns.push(formattedDate);
}
return dateColumns;

  }


}