import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RCReport, RotationReport } from '../../../models/report.model';
import { addWeeks, differenceInDays, format, startOfWeek, subDays } from 'date-fns';
import { AuthFacadeService } from '../../../services/auth-facade.service';
import { RotationStatus } from '../../../enums/rotation-status.enum';

import { Router } from '@angular/router';
import { UserUtils } from '../../../utilities/UserUtils';
import { Rotation, UserRotation } from '../../../models/rotation.model';
import { DashBoardDataDTO } from '../../../dto/rc/dashboardDataDTO';
import { TranslateService } from '@ngx-translate/core';
import { RcService } from '../../../services/rc.service';
import { RcDashboardResponse } from '../../../dto/rc/rc-dashboard-response.dto';
import { RcRecentAssociateRotations } from '../../../dto/rc/rc-recent-associate-rotations.dto';
import { ResponseWrapperDto } from '../../../dto/response-wrapper.dto';
import { LanguageService, SupportedLanguage } from '../../../services/language/language.service';
import { ReportDTO } from '../../../dto/aio/report.dto';
import { UserService } from '../../../services/auth/user.service';
import { ReportStatus } from '../../../enums/report-status.enum';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {

  navigateToCalendar() {
       this.router.navigate([`/${this.userService.getCurrentLanguage()}/remotesync/rc/calendar`])
  }

  userUtils = UserUtils;
currentLanguage: SupportedLanguage = 'en';
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
  overflowAvatarsCount: number = 0;

  isPendingReports: boolean = false

  //calendar 

  tableData: UserRotation[] = []; // Use the simpler interface for now
  totalRecords: number = 150; // Total number of entries for pagination
  welcomeName: string = ""
  // Fixed date columns based on the image
  dateColumns: string[] = this.loadWeeksDates()

  displayedProjectMembers: string[] = [];

  //recent reports 

  pendingRequests: ReportDTO[] = [];

  constructor(private translate: TranslateService,
    private authService: AuthFacadeService,
    private languageService:LanguageService,
    private router: Router,
    private rcService: RcService,
    private userService:UserService,
    private cd: ChangeDetectorRef) {

  }
  viewAllProjects(): void {
  

  
       this.router.navigate([`/${this.userService.getCurrentLanguage()}/remotesync/rc/project`])
      
       }
         viewAllReports(): void {
  
     
       this.router.navigate([`/${this.userService.getCurrentLanguage()}/remotesync/rc/report`])
       }
            getTranslatedReportStatus(status: ReportStatus): string {
               if (!status) return '';
           
               const statusKey = status.toString().toLowerCase();
               return this.translate.instant(`report_rc.statusTypes.${statusKey}`);
             }
       

  ngOnInit(): void {
  this.languageService.currentLanguage$.subscribe(lang => {
      this.currentLanguage = lang;
    });
    // Fetch RC dashboard data from the new endpoint
    this.rcService.getRcDashboard(10).subscribe({
      next: (res: ResponseWrapperDto<RcDashboardResponse>) => {
        // Make sure we have valid data
        if (!res || !res.data) {
          console.error('Invalid response data from dashboard service');
          return;
        }

        try {
          // Update dashboard with data from the response
          this.completedProjects = res.data.completedProjectsCount || 0;
          this.activeProjects = res.data.activeProjectsCount || 0;
          this.totalSites = res.data.factoriesCount || 0;
          this.totalCapacity = res.data.capacityCount || 0;

          // Calculate percentages for on-site and remote workers
          const totalAssociates = this.totalCapacity;
          if (totalAssociates > 0) {
            this.onsiteWorkersPercent = Math.round(((res.data.countCurrentAssociateOnSite / totalAssociates) * 100) * 10) / 10 || 0;
            this.remoteWorkersPercent = Math.max(0, Math.min(100, 100 - this.onsiteWorkersPercent));
          } else {
            this.onsiteWorkersPercent = 0;
            this.remoteWorkersPercent = 0;
          }

          // Set project data if available
          if (res.data.longestDurationProject) {
            this.highestDurationProject = res.data.longestDurationProject.label || 'N/A';
            
            // Only calculate if we have valid dates
            if (res.data.longestDurationProject.deadLine && res.data.longestDurationProject.startDate) {
              const deadlineDate = new Date(res.data.longestDurationProject.deadLine);
              const startDate = new Date(res.data.longestDurationProject.startDate);
              
              // Validate dates before calculation
              if (!isNaN(deadlineDate.getTime()) && !isNaN(startDate.getTime())) {
                const totalDifference = differenceInDays(deadlineDate, startDate);
                const progressDifference = differenceInDays(new Date(), startDate);
                
                // Ensure we don't divide by zero
                if (totalDifference > 0) {
                  this.highestDurationValue = Math.max(0, Math.min(100, (progressDifference / totalDifference) * 100));
                } else {
                  this.highestDurationValue = 0;
                }
              } else {
                this.highestDurationValue = 0;
              }
            } else {
              this.highestDurationValue = 0;
            }
          } else {
            this.highestDurationProject = 'N/A';
            this.highestDurationValue = 0;
          }

          // Set largest team project data if available
          if (res.data.largestTeamProject) {
            this.largestTeamProject = res.data.largestTeamProject.projectDTO.label || 'N/A';
            this.displayedProjectMembers=res.data.largestTeamProject.usersList
            this.largestTeamMembersCount = res.data.largestTeamProject.usersCount;
            this.overflowAvatarsCount=this.largestTeamMembersCount-5
            // Placeholder value since we don't have this in the API response
          } else {
            this.largestTeamProject = 'N/A';
            this.largestTeamMembersCount = 0;
          }

          // Set pending reports if available
          if (res.data.pendingReports && res.data.pendingReports.reportDTOs) {
            this.pendingRequests = res.data.pendingReports.reportDTOs || [];
            this.isPendingReports = this.pendingRequests.length > 0;
          } else {
            this.pendingRequests = [];
            this.isPendingReports = false;
          }

          // Transform the recentAssociateRotations data for the table if available
          if (res.data.recentAssociateRotations && Array.isArray(res.data.recentAssociateRotations) && res.data.recentAssociateRotations.length > 0) {
            // Create a simple mapping of rotation data for the table
            this.tableData = res.data.recentAssociateRotations.map((rotation: RcRecentAssociateRotations) => {
              if (!rotation) return null;
              
              const fullName = rotation.fullName || '';
              const nameParts = fullName.split(' ');
              
              return {
                user: {
                  userId: rotation.userId || '',
                  firstName: nameParts[0] || '',
                  lastName: nameParts[1] || '',
                },
                rotation: {
                  rotationId: rotation.rotationId || '',
                  startDate: new Date().toISOString().split('T')[0],
                  endDate: new Date().toISOString().split('T')[0],
                  shift: 0, // Default shift value
                  onSiteDates: Array.isArray(rotation.onSiteDates) ? rotation.onSiteDates : [],
                  remoteDates: Array.isArray(rotation.remoteDates) ? rotation.remoteDates : []
                }
              } as UserRotation;
            }).filter((item: UserRotation | null) => item !== null);
            
            this.totalRecords = this.tableData.length;
          } else {
            this.tableData = [];
            this.totalRecords = 0;
          }
        } catch (error) {
          console.error('Error processing dashboard data:', error);
        }

        // Trigger change detection
        this.cd.detectChanges();
      },
      error: (error) => {
        console.error('Error fetching dashboard data:', error);
      }
    });

    this.welcomeName = this.authService.getFirstName() + " " + this.authService.getLastName();

    // No need to call the rotation service API anymore since we get the data from the dashboard API
    // this.rotationService.getActiveUsersRotation(0, 10).subscribe((pagedData) => { ... })
  }

  // Placeholder for lazy loading data in a real app
  loadData(event: any) {
    console.log('Lazy load event:', event);
    // We're using the data from the dashboard response directly
    // No need to make additional API calls for pagination
    // The pagination is handled on the client side
  }

  // Helper function to get the status based on date
  getStatus(rowData: Rotation, date: string): RotationStatus {
    if ((rowData as any).onSiteDates && (rowData as any).onSiteDates.includes(date)) {
      return RotationStatus.OnSite;
    }
    // Check if date is in remoteDates array
    else if ((rowData as any).remoteDates && (rowData as any).remoteDates.includes(date)) {
      return RotationStatus.Remote;
    }
    // Default to Off if not found in either array
    return RotationStatus.Off;
  }
  loadWeeksDates(): string[] {


    const dateFormat = 'yyyy-MM-dd';

    // --- End Configuration ---


    // Find the start of the current week
    const startOfCurrentWeek = startOfWeek(new Date(), { weekStartsOn: 1 });

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