import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RotationReport } from '../../../models/report.model';
import { addWeeks, format, startOfWeek } from 'date-fns';
import { AuthFacadeService } from '../../../services/auth-facade.service';
import { RotationStatus } from '../../../enums/rotation-status.enum';

import { Router } from '@angular/router';
import { UserUtils } from '../../../utilities/UserUtils';
import { Rotation, UserRotation } from '../../../models/rotation.model';
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
  largestTeamMembersCount: number = 0;
  // Replace with your actual avatar paths

  // Calculate how many are hidden
  overflowAvatarsCount: number =0;

//calendar 

tableData: UserRotation[] = []; // Use the simpler interface for now
totalRecords: number = 150; // Total number of entries for pagination
welcomeName: string=""
// Fixed date columns based on the image
dateColumns:  string[] =this.loadWeeksDates()

user1: User = { id_user: 'user001', firstName: 'Alice', lastName: 'Smith' };
user2: User = { id_user: 'user002', firstName: 'Bob', lastName: 'Jones' };
user3: User = { id_user: 'user003', firstName: 'Charlie', lastName: 'Brown' };
user4: User = { id_user: 'user004', firstName: 'Diana', lastName: 'Prince' };
user5: User = { id_user: 'user005', firstName: 'Edward', lastName: 'Norton' };
user6: User = { id_user: 'user006', firstName: 'Fiona', lastName: 'Apple' };
user7: User = { id_user: 'user007', firstName: 'George', lastName: 'Lucas' };
user8: User = { id_user: 'user008', firstName: 'Hannah', lastName: 'Baker' };
user9: User = { id_user: 'user009', firstName: 'Ian', lastName: 'Somerhalder' };
user10: User = { id_user: 'user010', firstName: 'Jane', lastName: 'Goodall' };

users: User[] = [
    this.user1, this.user2, this.user3, this.user4, this.user5,
    this.user6, this.user7, this.user8, this.user9, this.user10
];
displayedProjectMembers: User[] = [];

updateProjectMembersDisplay(): void {
  if (this.users.length > 4) {
    this. overflowAvatarsCount=this.users.length - 4;

    this.displayedProjectMembers = this.users.slice(0, 4);
  } else {
    this. overflowAvatarsCount = this.users.length; // Or 0 if no overflow, depending on meaning
    this.displayedProjectMembers = [...this.users]; // Use spread for new array ref if needed
  }
  this.largestTeamMembersCount = this.users.length ;

}
//recent reports 

pendingRequests: RotationReport[] = [];

constructor(private authService :AuthFacadeService,private rotationService:RotationService,private router:Router,private cd :ChangeDetectorRef){

}

  ngOnInit(): void {

  this.updateProjectMembersDisplay()
    this.welcomeName = this.authService.getFirstName()+" "+this.authService.getLastName();

    this.rotationService.getActiveUsersRotation(0,10).subscribe((pagedData)=>{this.tableData=pagedData.assignedRotations;console.log(this.tableData)})
  //   this.tableData  = [
  //     // Rotation 1: Standard 2 weeks OnSite, 2 weeks Remote (Cycle 4)
  //     {
  //         user: this.user1,
  //        rotation:{ startDate: '2025-03-03', // Monday
  //         endDate: '2025-06-16',   // Sunday
  //         shift: 2, // 2 weeks OnSite
  //         cycle: 4, // 4 week total cycle
  //         customDates: [] // No overrides
  //        }
  //     },
  //     // Rotation 2: 3 weeks OnSite, 1 week Remote (Cycle 4) with Custom Date Overrides
  //     {
  //         user: this.user2,
  //         rotation:{   startDate: '2025-02-05', // Monday
  //         endDate: '2025-07-28',   // Sunday
  //         shift: 3, // 3 weeks OnSite
  //         cycle: 4, // 4 week total cycle
  //         customDates: [
  //             { date: '2025-04-27', rotationStatus: RotationStatus.Off },    // Specific day Off (Valentine's Day)
  //             { date: '2025-05-04', rotationStatus: RotationStatus.Remote }, // Explicitly OnSite (might override cycle)
  //             { date: '2025-03-04', rotationStatus: RotationStatus.Remote }, // Force Remote during expected OnSite
  //             { date: '2025-04-01', rotationStatus: RotationStatus.Off }     // Custom date outside initial cycle logic test
  //         ]
  //       }
  //     },
  //     {
  //       user: this.user3, // Charlie Brown
  //       rotation:{  startDate: '2025-01-06', // Monday
  //       endDate: '2025-06-27',   // Sunday
  //       shift: 1, // 1 week OnSite
  //       cycle: 2, // 2 week total cycle
  //       customDates: []}
  //   },
  //   // Rotation 4: 2 weeks OnSite, 1 week Remote (Cycle 3)
  //   {
  //       user: this.user4, // Diana Prince
  //       rotation:{ startDate: '2025-04-07', // Monday
  //       endDate: '2025-08-03',   // Sunday
  //       shift: 2, // 2 weeks OnSite
  //       cycle: 3, // 3 week total cycle
  //       customDates: [
  //           { date: '2025-05-01', rotationStatus: RotationStatus.Off } // May Day Off
  //       ]}
  //   },
  //   // Rotation 5: 4 weeks OnSite, 2 weeks Remote (Cycle 6) - Longer shift
  //   {
  //       user: this.user5, // Edward Norton
  //       rotation:{ startDate: '2025-04-02', // Monday
  //       endDate: '2025-10-19',   // Sunday
  //       shift: 4, // 4 weeks OnSite
  //       cycle: 6, // 6 week total cycle
  //       customDates: [
  //           { date: '2025-07-04', rotationStatus: RotationStatus.Off },      // Independence Day Off
  //           { date: '2025-08-15', rotationStatus: RotationStatus.Remote }   // Specific day forced Remote
  //       ]}
  //   },
  //   // Rotation 6: 1 week OnSite, 3 weeks Remote (Cycle 4) - Mostly remote
  //   {
  //       user: this.user6, // Fiona Apple
  //       rotation:{  startDate: '2025-01-20', // Monday
  //       endDate: '2025-05-18',   // Sunday
  //       shift: 1, // 1 week OnSite
  //       cycle: 4, // 4 week total cycle (1 OnSite, 3 Remote)
  //       customDates: []}
  //   },
  //   // Rotation 7: Reusing user1 (Alice) - 2 weeks OnSite, 3 weeks Remote (Cycle 5)
  //   {
  //       user: this.user1, // Alice Smith (reused)
  //       rotation:{  startDate: '2025-04-07', // Monday
  //       endDate: '2025-11-09',   // Sunday
  //       shift: 2, // 2 weeks OnSite
  //       cycle: 5, // 5 week total cycle (2 OnSite, 3 Remote)
  //       customDates: [
  //           { date: '2025-07-21', rotationStatus: RotationStatus.OnSite }, // Force OnSite
  //           { date: '2025-09-01', rotationStatus: RotationStatus.Off }     // Labor Day Off
  //       ]}
  //   },
  //   // Rotation 8: Reusing user2 (Bob) - Always OnSite (3 weeks OnSite, 0 Remote within cycle)
  //   {
  //       user: this.user2, // Bob Jones (reused)
  //       rotation:{  startDate: '2025-04-04', // Monday
  //       endDate: '2025-12-28',   // Sunday
  //       shift: 3, // 3 weeks OnSite
  //       cycle: 3, // 3 week total cycle (effectively always OnSite unless overridden)
  //       customDates: [
  //           { date: '2025-11-27', rotationStatus: RotationStatus.Off }, // Thanksgiving Day Off
  //           { date: '2025-12-25', rotationStatus: RotationStatus.Off }  // Christmas Day Off
  //       ]}
  //   },
  //   // Rotation 9: Short, continuous OnSite period (1 week OnSite, 0 Remote cycle)
  //   {
  //       user: this.user7, // George Lucas
  //       rotation:{ startDate: '2025-03-10', // Monday
  //       endDate: '2025-06-04',   // Sunday
  //       shift: 1, // 1 week OnSite
  //       cycle: 1, // 1 week total cycle (always OnSite)
  //       customDates: []}
  //   },
  //   // Rotation 10: Standard 2 on / 2 off crossing year boundary
  //   {
  //       user: this.user8, // Hannah Baker
  //       rotation:{  startDate: '2025-04-01', // Monday
  //       endDate: '2026-01-11',   // Sunday (crossing into next year)
  //       shift: 2, // 2 weeks OnSite
  //       cycle: 4, // 4 week total cycle
  //       customDates: [
  //           { date: '2025-10-13', rotationStatus: RotationStatus.Remote }, // Specific day Remote
  //           { date: '2025-11-11', rotationStatus: RotationStatus.OnSite }, // Specific day OnSite
  //           { date: '2026-01-01', rotationStatus: RotationStatus.Off }     // New Year's Day Off
  //       ]}
  //   }
  //     // Rotation 3: 1 week OnSite, 1 week Remote (Cycle 2) - Shorter cycle
     
  // ];

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
const startOfCurrentWeek = startOfWeek(new Date(),{weekStartsOn:1});

const dateColumns: string[] = [];

// Generate the dates for the current week and the next (numberOfWeeks - 1) weeks
for (let i = 0; i < 5; i++) {
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