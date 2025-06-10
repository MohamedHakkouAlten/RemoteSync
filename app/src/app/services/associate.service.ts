import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ResponseWrapperDto } from '../dto/response-wrapper.dto';

// Project-related imports
import { ProjectDTO } from '../dto/aio/project.dto';
import { ProjectsCountDTO } from '../dto/projects-count.dto';
import { PagedProjectSearchDTO } from '../dto/paged-global-id.dto';
import { AssociateProjectByClientDTO } from '../dto/associate/associate-project-by-client.dto';
import { AssociateProjectByLabelDTO } from '../dto/associate/associate-project-by-label.dto';
import { InitialProjectsDTO } from '../dto/initial-projects.dto';

// Report-related imports
import { PagedReportDTO } from '../dto/associate/paged-report.dto';
import { PagedReportSearchDTO } from '../dto/associate/paged-report-search.dto';
import { CreateAssociateReportDTO } from '../dto/associate/create-report.dto';

// Dashboard & profile imports
import { DashboardDTO } from '../dto/dashboard.dto';
import { ProfileDTO } from '../dto/profile.dto';
import { AssociateUpdateProfileDTO } from '../dto/associate-update-profile.dto';
import { CurrentRotationsDTO } from '../dto/associate/current-rotations.dto';

// Notification-related imports
import { PagedNotificationDTO } from '../dto/notification.dto';
import { PagedProjectDTO } from '../dto/associate/paged-project.dto';
import { PagedNotificationSearchDTO } from '../dto/aio/paged-notification-search.dto';

@Injectable({
  providedIn: 'root'
})
export class AssociateService {
  private apiUrl = `${environment.apiUrl}/user/associate`;

  constructor(private http: HttpClient) { }

  //#region Project-related Methods
  /**
   * Fetches the associate's current project
   * @returns The current project for the associate
   */
  getCurrentProject(): Observable<ResponseWrapperDto<ProjectDTO>> {
    return this.http.get<ResponseWrapperDto<ProjectDTO>>(`${this.apiUrl}/currentProject`);
  }

  /**
   * Fetches the associate's old projects with pagination
   * @param pagedGlobalIdDTO Search parameters for filtering projects
   * @returns Paginated list of old projects
   */
  getOldProjects(pagedGlobalIdDTO: PagedProjectSearchDTO): Observable<ResponseWrapperDto<PagedProjectDTO>> {
    return this.http.get<ResponseWrapperDto<PagedProjectDTO>>(`${this.apiUrl}/projects/old`, { params: pagedGlobalIdDTO as any });
  }

  /**
   * Gets project count statistics
   * @returns Statistics about projects (total, current, completed, etc.)
   */
  getProjectsCount(): Observable<ResponseWrapperDto<ProjectsCountDTO>> {
    return this.http.get<ResponseWrapperDto<ProjectsCountDTO>>(`${this.apiUrl}/projects/count`);
  }

  /**
   * Fetches projects filtered by client
   * @param dto Parameters for filtering by client
   * @returns Paginated projects filtered by client
   */
  getAssociateProjectsByClient(dto: AssociateProjectByClientDTO): Observable<ResponseWrapperDto<PagedProjectDTO>> {
    return this.http.get<ResponseWrapperDto<PagedProjectDTO>>(`${this.apiUrl}/projects/byClient`, { params: dto as any });
  }

  /**
   * Fetches old projects filtered by label
   * @param dto Parameters for filtering by label
   * @returns Paginated projects filtered by label
   */
  getAssociateOldProjectsByLabel(dto: AssociateProjectByLabelDTO): Observable<ResponseWrapperDto<PagedProjectDTO>> {
    return this.http.get<ResponseWrapperDto<PagedProjectDTO>>(`${this.apiUrl}/projects/byLabel`, { params: dto as any });
  }

  /**
   * Fetches detailed information for a specific project
   * @param projectId The ID of the project to fetch
   * @returns Detailed project information
   */
  getAssociateProjectDetails(projectId: string): Observable<ResponseWrapperDto<ProjectDTO>> {
    return this.http.get<ResponseWrapperDto<ProjectDTO>>(`${this.apiUrl}/projects/${projectId}`);
  }

  /**
   * Fetches initial projects data for setup
   * @returns Initial projects data
   */
  getInitialProjects(): Observable<ResponseWrapperDto<InitialProjectsDTO>> {
    return this.http.get<ResponseWrapperDto<InitialProjectsDTO>>(`${this.apiUrl}/initial-projects`);
  }
  //#endregion

  //#region Report-related Methods
  /**
   * Fetches reports with pagination
   * @param pageNumber Page number to fetch
   * @param pageSize Number of items per page
   * @returns Paginated reports
   */
  getMyReports(pageNumber: number, pageSize: number): Observable<ResponseWrapperDto<PagedReportDTO>> {
    return this.http.get<ResponseWrapperDto<PagedReportDTO>>(`${this.apiUrl}/myReports/${pageNumber}/${pageSize}`);
  }

  /**
   * Fetches old reports with search criteria
   * @param pagedReportSearchDTO Search parameters for filtering reports
   * @returns Paginated reports matching criteria
   */
  getAssociateOldReports(pagedReportSearchDTO: PagedReportSearchDTO): Observable<ResponseWrapperDto<PagedReportDTO>> {
    return this.http.get<ResponseWrapperDto<PagedReportDTO>>(`${this.apiUrl}/my-reports`, {
      params: pagedReportSearchDTO as any
    });
  }

  /**
   * Creates a new associate report
   * @param createAssociateReportDTO Data for the new report
   * @returns Response from the server
   */
  createAssociateReport(createAssociateReportDTO: CreateAssociateReportDTO): Observable<ResponseWrapperDto<any>> {
    return this.http.post<ResponseWrapperDto<any>>(`${this.apiUrl}/report/rotation-request`, createAssociateReportDTO);
  }
  //#endregion

  //#region Dashboard & Profile Methods
  /**
   * Fetches dashboard data for the associate
   * @returns Dashboard information
   */
  getDashboard(): Observable<ResponseWrapperDto<DashboardDTO>> {
    return this.http.get<ResponseWrapperDto<DashboardDTO>>(`${this.apiUrl}/dashboard`);
  }

  /**
   * Fetches current rotations information
   * @returns Current rotations data
   */
  getCurrentRotations(): Observable<ResponseWrapperDto<CurrentRotationsDTO>> {
    return this.http.get<ResponseWrapperDto<CurrentRotationsDTO>>(`${this.apiUrl}/current-rotations`);
  }

  /**
   * Fetches the associate's profile information
   * @returns Profile data containing user details
   */
  getAssociateProfile(): Observable<ResponseWrapperDto<ProfileDTO>> {
    return this.http.get<ResponseWrapperDto<ProfileDTO>>(`${this.apiUrl}/my-profile`);
  }

  /**
   * Updates the associate's profile information
   * @param updateData Profile data to update (first name, last name, phone number)
   * @returns Updated profile data
   */
  updateAssociateProfile(updateData: AssociateUpdateProfileDTO): Observable<ResponseWrapperDto<ProfileDTO>> {
    return this.http.put<ResponseWrapperDto<ProfileDTO>>(`${this.apiUrl}/my-profile/update`, updateData);
  }
  //#endregion

  //#region Notification Methods
  /**
   * Fetches notifications for the current associate
   * @param pagedNotificationSearchDTO Search parameters for filtering notifications
   * @returns Paginated notifications
   */
  getAssociateNotifications(pagedNotificationSearchDTO: PagedNotificationSearchDTO): Observable<ResponseWrapperDto<PagedNotificationDTO>> {
    return this.http.get<ResponseWrapperDto<PagedNotificationDTO>>(`${this.apiUrl}/my-notifications`, {
      params: pagedNotificationSearchDTO as any
    });
  }
  //#endregion
}
