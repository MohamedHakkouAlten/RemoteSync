import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ResponseWrapperDto } from '../dto/response-wrapper.dto';
import { map } from 'rxjs/operators';
import { ReportStatus } from '../enums/report-status.enum';

/**
 * Generic ListItem interface for dropdowns and selections
 */
export interface ListItem {
  id?: string;
  label: string;
  [key: string]: any; // Allow for additional properties
}

// DTOs based on the RC Dashboard response
export interface RcCompletedProjectsCountDTO {
  completedProjectsCount: number;
}

export interface RcFactoriesCountDTO {
  factoriesCount: number;
}

export interface RcSubFactoriesCapacityCountDTO {
  subFactoriesCount: number;
}

export interface RcCountCurrentAssociateOnSiteDTO {
  countCurrentAssociateOnSite: number;
}

export interface ProjectDTO {
  projectId: string;
  label: string;
  titre: string | null;
  status: string;
  deadLine: string;
  startDate: string;
  isDeleted: boolean;
  owner: {
    clientId: string;
    label: string;
    address: string;
    email: string;
    name: string;
    sector: string;
    deleted: boolean;
    ice: string;
  };
}

export interface ReportDTO {
  reportId: string;
  title: string;
  reason: string;
  type: string;
  status: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  createdBy: any; // Using any for now as it's a complex object
  updatedBy: any | null;
}

export interface PagedReportDTO {
  reportDTOs: ReportDTO[];
  totalPages: number;
  totalElements: number;
  currentPage: number;
  pageSize: number;
}

/**
 * Search criteria for fetching RC reports
 */
export interface PagedReportSearchDTO {
  pageNumber?: number;
  pageSize?: number;
  title?: string;
  status?: ReportStatus;
  startDate?: string; // ISO format date string YYYY-MM-DD
}

/**
 * DTO for searching paginated rotations
 */
export interface PagedRotationsSearchDTO {
  pageNumber?: number;
  pageSize?: number;
  label?: string;
  clientId?: string;
  projectId?: string;
  factoryId?: string;
  subFactoryId?: string;
}

/**
 * Client dropdown DTO for RC calendar
 */
export interface ClientDropDownDTO {
  clientId: string;
  label: string;
}

/**
 * Factory dropdown DTO for RC calendar
 */
export interface FactoryDropDownDTO {
  factoryId: string;
  label: string;
}

/**
 * Project dropdown DTO for RC calendar
 */
export interface ProjectDropDownDTO {
  projectId: string;
  label: string;
}

/**
 * Subfactory dropdown DTO for RC calendar
 */
export interface SubFactoryDropDownDTO {
  subFactoryId: string; // Changed to lowercase 'id' to match URL parameter naming
  label: string;
}

/**
 * Response for RC initial calendar
 */
export interface RcInitialCalendarResponse {
  clientDropDown: ClientDropDownDTO[];
  factoryDropDown: FactoryDropDownDTO[];
  allRecentAssociateRotations: RcRecentAssociateRotations[];
}

/**
 * Response for RC rotations with pagination
 */
export interface RcRotationsResponse {
  rcAllRecentAssociateRotations: RcRecentAssociateRotations[];
  totalPages: number;
  totalElements: number;
  currentPage: number;
  pageSize: number;
}

/**
 * Report response with pagination
 */
export interface PagedReportDTO {
  content: any[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
}

export interface RcRecentAssociateRotations {
  userId: string;
  rotationId: string;
  fullName: string;
  onSiteDates: string[];
  remoteDates: string[];
}

/**
 * Interface for searching associates in RC module
 */
export interface RcSearchAssociateDTO {
  fullName?: string;
}

/**
 * Associate DTO for RC rotation
 */
export interface RcAssociateDTO {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  username: string;
  reference: number;
  phoneNumber?: string;
}

/**
 * Enum for rotation status (onsite/remote)
 * Matches backend enum values
 */
export enum RotationStatus {
  ONSITE = 'on-site',
  REMOTE = 'remote'
}

/**
 * Custom date for rotation with specific status
 * Used for updating associate rotation
 */
export interface RcUpdateAssociateRotationDTO {
  userId: string;
  customDates: CustomDate[];
}

/**
 * Custom date for rotation with specific status
 */
export interface CustomDate {
  date: string; // ISO format date string YYYY-MM-DD
  rotationStatus: RotationStatus;
}

/**
 * DTO for creating a new rotation assignment
 */
export interface RcAssignRotationUser {
  associates: string[]; // List of associate UUIDs
  customDates?: CustomDate[]; // Optional list of custom dates with status
  projectId: string;
  startDate: string; // ISO format date string YYYY-MM-DD
  endDate: string; // ISO format date string YYYY-MM-DD
  remoteWeeksPerCycle: number; // For automatic rotation pattern
  cycleLengthWeeks: number; // For automatic rotation pattern
}

export interface RcDashboardResponse {
  completedProjectsCount: number;
  activeProjectsCount: number;
  factoriesCount: number;
  capacityCount: number;
  countCurrentAssociateOnSite: number;
  longestDurationProject: ProjectDTO;
  largestTeamProject: ProjectDTO;
  pendingReports: PagedReportDTO;
  recentAssociateRotations: RcRecentAssociateRotations[];
}

@Injectable({
  providedIn: 'root'
})
export class RcService {
  private apiUrl = `${environment.apiUrl}/user/rc`;

  constructor(private http: HttpClient) { }

  /**
   * Get the RC dashboard data
   * @returns Observable with the RC dashboard data
   */
  getRcDashboard(): Observable<ResponseWrapperDto<RcDashboardResponse>> {
    return this.http.get<ResponseWrapperDto<RcDashboardResponse>>(`${this.apiUrl}/dashboard`);
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
  updateReport(reportId: string, status: ReportStatus): Observable<any> {
    return this.http.put(`${this.apiUrl}/reports/${reportId}/status`, { status });
  }
  
  /**
   * Get all RC projects
   * @returns Observable with list of all available projects
   */
  getRcProjects(): Observable<ResponseWrapperDto<ProjectDropDownDTO[]>> {
    return this.http.get<ResponseWrapperDto<ProjectDropDownDTO[]>>(`${this.apiUrl}/projects`)
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
  getRcAssociates(searchCriteria?: RcSearchAssociateDTO): Observable<ResponseWrapperDto<RcAssociateDTO[]>> {
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
    return this.http.get<ResponseWrapperDto<RcAssociateDTO[]>>(`${this.apiUrl}/associates`, { params });
  }
}