import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RCReport, RotationReport } from '../../../models/report.model';
import { addWeeks, differenceInDays, format, startOfWeek, subDays } from 'date-fns';
import { AuthFacadeService } from '../../../services/auth-facade.service';
import { RotationStatus } from '../../../enums/rotation-status.enum';

import { Router } from '@angular/router';
import { UserUtils } from '../../../utilities/UserUtils';
import { Rotation, UserRotation } from '../../../models/rotation.model';
import { RotationService } from '../../../services/rotation.service';
import { DashBoardService } from '../../../services/dash-board.service';
import { DashBoardDataDTO } from '../../../dto/rc/dashboardDataDTO';
import { TranslateService } from '@ngx-translate/core';






@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})

export class DashboardComponent implements OnInit {


navigateToCalendar() {
this.router.navigate([this.translate.currentLang+'/remotesync/rc/calendar'])
}








userUtils=UserUtils;

  //left panel stats 
  activeProjects: number = 0;
  completedProjects: number = 0;

  totalSites: number = 0;
  totalCapacity: number = 0;

  remoteWorkersPercent: number = 0;
  onsiteWorkersPercent: number = 0;

  highestDurationProject: string = '';
  // Approximate value for the progress bar based on the image
  highestDurationValue: number = 0;

  largestTeamProject: string = '';
  largestTeamMembersCount: number = 0;
  // Replace with your actual avatar paths

  // Calculate how many are hidden
  overflowAvatarsCount: number =0;

  isPendingReports:boolean=false

  
//calendar 

tableData: UserRotation[] = []; // Use the simpler interface for now
totalRecords: number = 150; // Total number of entries for pagination
welcomeName: string=""
// Fixed date columns based on the image
dateColumns:  string[] =this.loadWeeksDates()


displayedProjectMembers: string[] = [];


//recent reports 

pendingRequests: RCReport[] = [];

constructor(private translate:TranslateService,
  private authService :AuthFacadeService,
  private dashBoardService : DashBoardService,
  private rotationService:RotationService,
  private router:Router,
  private cd :ChangeDetectorRef){

}

  ngOnInit(): void {
    

    this.dashBoardService.getDashBoardData().subscribe((res:DashBoardDataDTO)=>{
      this.activeProjects=res.activeProjectCount
      this.completedProjects=res.completedProjectCount
      this.totalCapacity=res.totalCapacity
      this.totalSites=res.totalSites
      this.onsiteWorkersPercent=Math.round(((res.totalOnSiteAssociates / this.totalCapacity) * 100) * 10) / 10
      this.remoteWorkersPercent=100-this.onsiteWorkersPercent
      this.highestDurationProject=res.longestDurationProject.titre!
      const totalDifference = differenceInDays(res.longestDurationProject.deadLine!,res.longestDurationProject.startDate!);
      const progressDifference = differenceInDays(new Date(), res.longestDurationProject.startDate!);
      this.highestDurationValue=(progressDifference / totalDifference) * 100;
      this.largestTeamProject=res.largestMembersProject.titre!
      this.largestTeamMembersCount=res.largestMembersProject.usersCount
      this.displayedProjectMembers=res.largestMembersProject.usersList!
      this.overflowAvatarsCount=this.largestTeamMembersCount-this.displayedProjectMembers.length
      this.pendingRequests=res.pendingReports
      if(this.pendingRequests.length>0)this.isPendingReports=true
      

  
    })
  
    this.welcomeName = this.authService.getFirstName()+" "+this.authService.getLastName();

    this.rotationService.getActiveUsersRotation(0,10).subscribe((pagedData)=>{this.totalRecords=pagedData.totalElements;this.tableData=pagedData.assignedRotations;console.log(this.tableData)})
  
  // ];

    // In a real app, you'd fetch this data from a service, possibly using the PaginatorState event
    // For now, we just simulate having the first 10 records for display.
    // totalRecords is set above to simulate the full dataset size for the paginator.
   
  }

   // Placeholder for lazy loading data in a real app
   loadData(event: any) {
       console.log('Lazy load event:', event);
       // In a real app:
       const page = event.first / event.rows;
       const rows = event.rows;
       this.rotationService.getActiveUsersRotation(page,rows).subscribe((pagedData)=>{this.tableData=pagedData.assignedRotations;console.log(this.tableData)})
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