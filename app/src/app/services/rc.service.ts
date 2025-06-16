import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { ResponseWrapperDto } from '../dto/response-wrapper.dto';
import { ProfileDTO } from '../dto/profile.dto';
import { AssociateUpdateProfileDTO } from '../dto/associate-update-profile.dto';
import { map, catchError } from 'rxjs/operators';
import { PagedProject, PagedReports } from '../dto/response-wrapper.dto';
import { ReportStatus } from '../enums/report-status.enum';
import { PagedReportSearchDTO } from '../dto/rc/paged-report-search.dto';
import { ChatMessage, MessageType } from '../dto/rc/chat-message.dto';
import { AuthService } from './auth/auth.service';
import { AuthFacadeService } from './auth-facade.service';
import { ReportFilter } from '../dto/rc/report-filter.dto';
import { ProjectFilter } from '../dto/rc/project-filter.dto';
import { RCProjectCountsDTO } from '../dto/rc/dashboardDataDTO';
import { Project } from '../models/project.model';
import { ClientDropDownDTO } from '../dto/rc/client-dropdown.dto';
import { FactoryDropDownDTO } from '../dto/rc/factory-dropdown.dto';
import { ProjectDropDownDTO } from '../dto/rc/project-dropdown.dto';
import { SubFactoryDropDownDTO } from '../dto/rc/subfactory-dropdown.dto.js';
import { RcInitialCalendarResponse } from '../dto/rc/rc-initial-calendar-response.dto.js';
import { RcRotationsResponse } from '../dto/rc/rc-rotations-response.dto.js';
import { RcRecentAssociateRotations } from '../dto/rc/rc-recent-associate-rotations.dto';
import { PagedReportDTO } from '../dto/rc/paged-report.dto.js';
import { PagedRotationsSearchDTO } from '../dto/rc/paged-rotations-search.dto';
import { RcSearchAssociateDTO } from '../dto/rc/rc-search-associate.dto';
import { RcAssociateDTO } from '../dto/rc/rc-associate.dto';
import { RotationStatus } from '../dto/rc/rotation-status.enum';
import { RcUpdateAssociateRotationDTO } from '../dto/rc/rc-update-associate-rotation.dto';
import { CustomDate } from '../dto/rc/custom-date.dto';
import { RcAssignRotationUser } from '../dto/rc/rc-assign-rotation-user.dto';
import { RcDashboardResponse } from '../dto/rc/rc-dashboard-response.dto';
import { ListItem } from '../dto/rc/list-item.dto';
import { ReportDTO } from '../dto/rc/report.dto';
import { LargestTeamProjectDTO } from '../dto/rc/largest-team-project.dto.js';
import { RcCompletedProjectsCountDTO } from '../dto/rc/rc-completed-projects-count.dto.js';
import { RcFactoriesCountDTO } from '../dto/rc/rc-factories-count.dto.js';
import { RcSubFactoriesCapacityCountDTO } from '../dto/rc/rc-sub-factories-capacity-count.dto.js';
import { RcCountCurrentAssociateOnSiteDTO } from '../dto/rc/rc-count-current-associate-on-site.dto.js';

// RcSearchAssociateDTO now imported from '../dto/rc/rc-search-associate.dto'

// RcAssociateDTO now imported from '../dto/rc/rc-associate.dto'

// RotationStatus now imported from '../dto/rc/rotation-status.enum'

// RcUpdateAssociateRotationDTO now imported from '../dto/rc/rc-update-associate-rotation.dto'

// CustomDate now imported from '../dto/rc/custom-date.dto'

// RcAssignRotationUser now imported from '../dto/rc/rc-assign-rotation-user.dto'

// RcDashboardResponse now imported from '../dto/rc/rc-dashboard-response.dto'

@Injectable({
  providedIn: 'root'
})
export class RcService {
  private apiUrl = `${environment.apiUrl}/user/rc`;
  private readonly reportApiUrl =  this.apiUrl + '/reports'
  private readonly projectApiUrl = this.apiUrl + '/projects'
  private readonly clientApiUrl =  this.apiUrl + '/clients'
  constructor(private http: HttpClient) { }

  /**
   * Get the RC dashboard data
   * @returns Observable with the RC dashboard data
   */
  getRcDashboard(): Observable<ResponseWrapperDto<RcDashboardResponse>> {
    return this.http.get<ResponseWrapperDto<RcDashboardResponse>>(`${this.apiUrl}/dashboard`);
  }

  /**
   * Get the RC profile information
   * @returns Observable with the RC profile data
   */
  getRcProfile(): Observable<ResponseWrapperDto<ProfileDTO>> {
    return this.http.get<ResponseWrapperDto<ProfileDTO>>(`${this.apiUrl}/my-profile`);
  }

  /**
   * Updates the RC's profile information
   * @param updateData Profile data to update (first name, last name, phone number)
   * @returns Updated profile data
   */
  updateRcProfile(updateData: AssociateUpdateProfileDTO): Observable<ResponseWrapperDto<ProfileDTO>> {
    return this.http.put<ResponseWrapperDto<ProfileDTO>>(`${this.apiUrl}/my-profile/update`, updateData);
  }

  /**
   * Get reports with optional search criteria
   * @param searchCriteria - Optional search criteria including pagination, title, status, and date filters
   * @returns Observable with paged report data
   */
  getRcReports(searchCriteria?: PagedReportSearchDTO): Observable<ResponseWrapperDto<PagedReportDTO>> {
    // Create empty HttpParams object
    let params = new HttpParams();

    // Only add parameters that have actual values (not undefined or null)
    if (searchCriteria) {
      Object.entries(searchCriteria).forEach(([key, value]) => {
        // Only add the parameter if it has a value
        if (value !== undefined && value !== null && value !== '') {
          params = params.append(key, value.toString());
        }
      });
    }

    // Make the HTTP request with the filtered parameters
    return this.http.get<ResponseWrapperDto<PagedReportDTO>>(`${this.apiUrl}/reports`, { params });
  }

  /**
   * Get the initial calendar data for RC including client dropdown, factory dropdown, and recent rotations
   * @returns Observable with initial calendar data
   */
  getRcInitialCalendar(): Observable<ResponseWrapperDto<RcInitialCalendarResponse>> {
    return this.http.get<ResponseWrapperDto<RcInitialCalendarResponse>>(`${this.apiUrl}/initial-calendar`);
  }

  /**
   * Get user rotations with pagination and optional filtering
   * @param searchCriteria - Optional search criteria including pagination, labels, and IDs
   * @returns Observable with paginated rotation data
   */
  getRcRotations(searchCriteria?: PagedRotationsSearchDTO): Observable<ResponseWrapperDto<RcRotationsResponse>> {
    // Create empty HttpParams object
    let params = new HttpParams();

    // Only add parameters that have actual values (not undefined, null, or empty string)
    if (searchCriteria) {
      // Filter out undefined, null, and empty values
      const cleanedParams = Object.fromEntries(
        Object.entries(searchCriteria)
          .filter(([_, value]) => value !== undefined && value !== null && value !== '')
      );

      // Add filtered parameters to the HttpParams object
      Object.entries(cleanedParams).forEach(([key, value]) => {
        params = params.append(key, String(value));
      });
    }

    // Make the HTTP request with the filtered parameters
    return this.http.get<ResponseWrapperDto<RcRotationsResponse>>(`${this.apiUrl}/rotations`, { params });
  }

  /**
   * Create a new user rotation
   * @param rotationData - The rotation data to create
   * @returns Observable indicating success or failure
   */
  addUserRotation(rotationData: any): Observable<ResponseWrapperDto<boolean>> {
    return this.http.post<ResponseWrapperDto<boolean>>(`${this.apiUrl}/rotation`, rotationData);
  }

  /**
   * Create a new rotation assignment for associates
   * @param rotationData - The rotation assignment data with associates, dates, and pattern
   * @returns Observable with the created rotation data
   */
  createRotation(rotationData: RcAssignRotationUser): Observable<ResponseWrapperDto<any>> {
    return this.http.post<ResponseWrapperDto<any>>(`${this.apiUrl}/rotations/create`, rotationData);
  }

  /**
   * Update an associate's rotation status for specific dates
   * @param updateData - The update data containing userId and customDates with rotation status
   * @returns Observable with the updated rotation data
   */
  updateRcAssignedRotation(updateData: RcUpdateAssociateRotationDTO): Observable<ResponseWrapperDto<any>> {
    return this.http.put<ResponseWrapperDto<any>>(`${this.apiUrl}/rotation/update`, updateData);
  }

  /**
   * Get projects by client ID
   * @param clientId - UUID of the client
   * @returns Observable with list of projects for the selected client
   */
  getRcProjectsByClient(clientId: string): Observable<ResponseWrapperDto<ProjectDropDownDTO[]>> {
    return this.http.get<ResponseWrapperDto<ProjectDropDownDTO[]>>(`${this.apiUrl}/projects/${clientId}`);
  }

  /**
   * Get subfactories by factory ID
   * @param factoryId - UUID of the factory
   * @returns Observable with list of subfactories for the selected factory
   */
  getRcSubFactoriesByFactory(factoryId: string): Observable<ResponseWrapperDto<SubFactoryDropDownDTO[]>> {
    return this.http.get<ResponseWrapperDto<SubFactoryDropDownDTO[]>>(`${this.apiUrl}/sub-factories/${factoryId}`);
  }

  // Removed duplicate getRcReports method

  /**
   * Update report status
   */
 getFilteredReports(filter:ReportFilter): Observable<PagedReports> {
    const url = this.reportApiUrl + "/filter"
    
    // Always include required parameters: pageNumber, pageSize, and name
    let params = new HttpParams()
      .set("pageNumber", filter.pageNumber)
      .set("pageSize", filter.pageSize)
      .set("name", filter.name) // Always add empty name parameter to avoid null backend issues
    
  
    
    if (filter.startDate && filter.startDate.trim() !== '') {
      params = params.set("startDate", filter.startDate.trim())
    }
    
    if (filter.endDate && filter.endDate.trim() !== '') {
      params = params.set("endDate", filter.endDate.trim())
    }
    
    if (filter.status && filter.status.trim() !== '') {
      params = params.set("status", filter.status.trim())
    }
    
    return this.http.get<ResponseWrapperDto<PagedReports>>(url, { params }).pipe(
      map((response) => response.data as PagedReports)
    )
  }

  updateReport(reportId:string,status:ReportStatus):Observable<boolean>{
     const url = this.reportApiUrl+'/update';
    const requestBody = {
      reportId: reportId,
      status: status
    };
    return this.http.put<ResponseWrapperDto<string>>(url,requestBody).pipe(
      map((response)=>response.status=='success'?true:false),
      catchError((err)=>{
        console.log(err)
        if(err instanceof HttpErrorResponse){
      return  throwError(()=>new Error(err.error.message))
      }
      return throwError(()=>new Error(err))
      })
    )
  }

  /**
   * Get client list for dropdown/autocomplete with optional search filter
   * @param searchQuery Optional search query to filter clients
   * @returns Observable with array of ClientDropDownDTO objects
   */
  getClientListByLabel(searchQuery?: string): Observable<ClientDropDownDTO[]> {
    const url = this.clientApiUrl + '/byLabel';
    // Always include the required 'label' parameter, using searchQuery if provided
    let params = new HttpParams()
      .set('label', searchQuery?.trim() || '');
    
    return this.http.get<ResponseWrapperDto<ClientDropDownDTO[]>>(url, { params })
      .pipe(
        map(response => response.data || []), // Return empty array if data is undefined
        catchError(error => {
          console.error('Error fetching client list:', error);
          return throwError(() => new Error(error.message || 'Failed to fetch clients'));
        })
      );
  }

  /**
   * Get all RC projects
   * @returns Observable with list of all available projects
   */
  getRcProjects(): Observable<ResponseWrapperDto<ProjectDropDownDTO[]>> {
    return this.http.get<ResponseWrapperDto<ProjectDropDownDTO[]>>(`${this.apiUrl}/projects/dropDown`)
      .pipe(
        map(response => {
          // Handle any data transformation if needed
          return response;
        })
      );
  }

  /**
   * Get all RC associates without assigned rotation
   * @param searchCriteria - Optional search criteria including fullName filter
   * @returns Observable with list of associates
   */
  getRcAssociates(fullName:string=''): Observable<ResponseWrapperDto<RcAssociateDTO[]>> {
    // Create HttpParams object with the name parameter (empty if not provided)
    const params = new HttpParams()
      .set('name', fullName?.trim() || '');
    
    // Make the HTTP request with the parameter
    return this.http.get<ResponseWrapperDto<RcAssociateDTO[]>>(`${this.apiUrl}/users/byName`, { params });
  }


  //Projects
   getInitialProject(): Observable<RCProjectCountsDTO> {
    const url = this.projectApiUrl + "/initialize"
    return this.http.get<ResponseWrapperDto<RCProjectCountsDTO>>(url).pipe(
      map((response) => response.data as RCProjectCountsDTO)
    )
  }

  getFilteredProjects(filter:ProjectFilter): Observable<PagedProject> {
    const url = this.projectApiUrl + "/filter"
    console.log(filter)
    // Always include all required parameters with default values to prevent null pointers
    let params = new HttpParams()
      .set("pageNumber", filter.pageNumber)
      .set("pageSize", filter.pageSize)
      .set("filter", filter.filter?.trim() || '') // Send name as 'filter' to match backend DTO
      .set("sort", filter.sort?.trim() || '') // Default empty string
      .set("sortType", filter.sortType?.toString() || '0') // Default to 0
      .set("value", filter.value?.trim() || '') // Default empty string
    
  
      
    return this.http.get<ResponseWrapperDto<PagedProject>>(url, { params }).pipe(
      map((response) => response.data as PagedProject)
    )
  }
    getRcClientDropDownWithId(): Observable<ClientDropDownDTO[]> {
    const url = this.clientApiUrl + '/byLabel'
    const params = new HttpParams()
      .set('label', ''); // The backend expects this parameter name

    return this.http.get<ResponseWrapperDto<ClientDropDownDTO[]>>(url, { params }).pipe(
      map((response) => {
        return response.data as ClientDropDownDTO[]
      })
    )
  }
    updateProject(project:Project): Observable<Project> {
    const url = this.projectApiUrl + '/update'


    return this.http.put<ResponseWrapperDto<Project>>(url,  project).pipe(
      map((response) => {
        return response.data as Project

      })
    )


  }
      createProject(project:Project): Observable<Project> {
    const url = this.projectApiUrl + '/create'


    return this.http.post<ResponseWrapperDto<Project>>(url,  project).pipe(
      map((response) => {
        return response.data as Project

      })
    )


  }
        deleteProject(projectId:string): Observable<Project> {
    const url = this.projectApiUrl + '/delete'

    const params =new HttpParams()
    .set("projectId",projectId)


    return this.http.delete<ResponseWrapperDto<Project>>(url,{params} ).pipe(
      map((response) => {
        return response.data as Project

      })
    )


  }
}
