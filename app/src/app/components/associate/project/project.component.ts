import { Component, OnInit, OnDestroy } from '@angular/core';
import { AssociateService } from '../../../services/associate.service';
import { ProjectDTO } from '../../../dto/project.dto';
import { PagedProjectDTO } from '../../../dto/paged-project.dto';
import { ProjectStatus } from '../../../dto/project-status.enum';
import { debounceTime, distinctUntilChanged, tap, catchError } from 'rxjs/operators';
import { Subject, of, Subscription } from 'rxjs';
import { PagedProjectSearchDTO } from '../../../dto/paged-global-id.dto';
import { AssociateProjectByLabelDTO } from '../../../dto/associate/associate-project-by-label.dto';
import { AssociateProjectByClientDTO } from '../../../dto/associate/associate-project-by-client.dto';
import { Client } from '../../../dto/client.dto';

// Import shared interfaces from the models folder
import { ClientSelectItem, StatusSelectItem } from '../models/interfaces';

// Import utility helpers
import { AssociateUIHelpers } from '../utils/ui-helpers';

// Define the specific string literal type for PrimeNG badge severity
type BadgeSeverity = 'info' | 'success' | 'warn' | 'danger' | 'secondary' | 'contrast';


@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css'],
  standalone: false
})
export class ProjectComponent implements OnInit, OnDestroy {
  // UI state properties
  searchTerm: string = '';
  selectedStatus: ProjectStatus | null = null;
  selectedClient: string | null = null;

  // Data properties
  pagedProjects: PagedProjectDTO | null = null;
  isLoading: boolean = false;
  loadingError: boolean = false;
  
  // Pagination properties
  currentPage: number = 0;
  pageSize: number = 10;

  // Dropdown options
  statusOptions: StatusSelectItem[] = [];
  clientOptions: ClientSelectItem[] = [];

  // Private properties
  private loadingTimeout: any = null;
  private searchSubject = new Subject<string>();
  private subscriptions: Subscription[] = [];

  constructor(private associateService: AssociateService) { }

  /**
   * Initialize component data and setup subscriptions
   */
  ngOnInit(): void {
    // Initialize status filter options
    this.initStatusOptions();

    // Load initial data (clients and projects)
    this.loadInitialData();

    // Setup search debounce
    const searchSubscription = this.searchSubject.pipe(
      debounceTime(500),
      distinctUntilChanged(),
    ).subscribe(() => {
      this.currentPage = 0;
      this.loadProjects();
    });
    
    // Add to subscriptions array for cleanup
    this.subscriptions.push(searchSubscription);
  }
  
  /**
   * Clean up subscriptions and timers on component destruction
   */
  ngOnDestroy(): void {
    // Clear all subscriptions
    this.subscriptions.forEach(sub => sub.unsubscribe());
    
    // Clear any pending timers
    if (this.loadingTimeout) {
      clearTimeout(this.loadingTimeout);
    }
  }
  
  /**
   * Initialize status filter options
   */
  private initStatusOptions(): void {
    this.statusOptions = [
      { label: 'All Status', value: null },
      { label: 'In Progress', value: ProjectStatus.ACTIVE },
      { label: 'Completed', value: ProjectStatus.COMPLETED },
      { label: 'At Risk', value: ProjectStatus.PENDING },
      { label: 'On Hold', value: ProjectStatus.INACTIVE },
      { label: 'Cancelled', value: ProjectStatus.CANCELLED }
    ];
  }

  loadInitialData(): void {
    this.isLoading = true;
    this.loadingError = false;
    
    // Clear any existing timeout
    if (this.loadingTimeout) {
      clearTimeout(this.loadingTimeout);
    }
    
    // Set a timeout to show error if loading takes too long
    this.loadingTimeout = setTimeout(() => {
      if (this.isLoading) {
        this.loadingError = true;
      }
    }, 15000); // 15 seconds timeout
    this.associateService.getInitialProjects().pipe(
      tap(response => {
        if (response.status === 'success' && response.data) {
          // Set clients for dropdown
          this.loadClientsForDropdown(response.data.allClients);
          
          // Set initial projects - the response already contains a PagedProjectDTO
          this.pagedProjects = response.data.projects;
        } else {
          this.pagedProjects = null;
        }
        
        // Clear the timeout as we got a response
        if (this.loadingTimeout) {
          clearTimeout(this.loadingTimeout);
          this.loadingTimeout = null;
        }
        
        this.isLoading = false;
      }),
      catchError(error => {
        console.error('Error loading initial projects data:', error);
        this.pagedProjects = null;
        
        // Clear the timeout as we got an error response
        if (this.loadingTimeout) {
          clearTimeout(this.loadingTimeout);
          this.loadingTimeout = null;
        }
        
        this.isLoading = false;
        this.loadingError = true;
        return of(null);
      })
    ).subscribe();
  }

  loadProjects(): void {
    this.isLoading = true;
    this.loadingError = false;
    
    // Clear any existing timeout
    if (this.loadingTimeout) {
      clearTimeout(this.loadingTimeout);
    }
    
    // Set a timeout to show error if loading takes too long
    this.loadingTimeout = setTimeout(() => {
      if (this.isLoading) {
        this.loadingError = true;
      }
    }, 15000); // 15 seconds timeout
    if (this.searchTerm && this.searchTerm.trim() !== '') {
      this.searchProjectsByLabel();
    } else if (this.selectedClient) {
      this.fetchProjectsByClient();
    }
    else {
      this.fetchAllProjects();
    }
  }

  fetchAllProjects(): void {
    const pagedDto: PagedProjectSearchDTO = {
      pageNumber: this.currentPage,
      pageSize: this.pageSize
    };
    if (this.searchTerm && this.searchTerm.trim() !== '') {
      pagedDto.label = this.searchTerm;
    }
    if (this.selectedStatus) {
      pagedDto.status = this.selectedStatus;
    }
    this.associateService.getOldProjects(pagedDto).pipe(
      tap(response => {
        if (response.status === 'success' && response.data) {
          this.pagedProjects = response.data;
        } else {
          this.pagedProjects = null;
        }
        this.isLoading = false;
      }),
      catchError(error => {
        console.error('Error fetching all projects:', error);
        this.pagedProjects = null;
        
        // Clear the timeout as we got an error response
        if (this.loadingTimeout) {
          clearTimeout(this.loadingTimeout);
          this.loadingTimeout = null;
        }
        
        this.isLoading = false;
        this.loadingError = true;
        return of(null);
      })
    ).subscribe();
  }

  searchProjectsByLabel(): void {
    const pagedDto: PagedProjectSearchDTO = {
      pageNumber: this.currentPage,
      pageSize: this.pageSize
    };
    if (this.searchTerm && this.searchTerm.trim() !== '') {
      pagedDto.label = this.searchTerm;
    }
    if (this.selectedStatus) {
      pagedDto.status = this.selectedStatus;
    }
    this.associateService.getOldProjects(pagedDto).pipe(
      tap(response => {
        if (response.status === 'success' && response.data) {
          this.pagedProjects = response.data;
        } else {
          this.pagedProjects = null;
        }
        this.isLoading = false;
      }),
      catchError(error => {
        console.error('Error searching projects by label:', error);
        this.pagedProjects = null;
        
        // Clear the timeout as we got an error response
        if (this.loadingTimeout) {
          clearTimeout(this.loadingTimeout);
          this.loadingTimeout = null;
        }
        
        this.isLoading = false;
        this.loadingError = true;
        return of(null);
      })
    ).subscribe();
  }
  
  fetchProjectsByClient(): void {
    if (!this.selectedClient) {
        this.fetchAllProjects(); 
        return;
    }
    const dto: AssociateProjectByClientDTO = {
        clientId: this.selectedClient,
        pageNumber: this.currentPage,
        pageSize: this.pageSize
    };
    this.associateService.getAssociateProjectsByClient(dto).pipe(
        tap(response => {
            if (response.status === 'success' && response.data) {
                this.pagedProjects = response.data;
            } else {
                this.pagedProjects = null;
            }
            this.isLoading = false;
        }),
        catchError(error => {
          console.error('Error fetching projects by client:', error);
          this.pagedProjects = null;
          
          // Clear the timeout as we got an error response
          if (this.loadingTimeout) {
            clearTimeout(this.loadingTimeout);
            this.loadingTimeout = null;
          }
          
          this.isLoading = false;
          this.loadingError = true;
          return of(null);
      })
    ).subscribe();
  }

  loadClientsForDropdown(clients: Client[]): void {
    // Map Client objects to ClientSelectItem format
    const mappedClients = clients.map(client => ({
      id: client.clientId,
      name: client.label || client.name || client.clientId // Use label as name, fallback to name or ID
    }));
    
    // Add "All Clients" option at the beginning of the dropdown
    this.clientOptions = [{ name: 'All Clients', id: null }, ...mappedClients];
  }

  onSearchTermChange(): void {
    this.searchSubject.next(this.searchTerm);
  }

  onFilterChange(): void {
    this.currentPage = 0;
    this.loadProjects(); 
  }
  
  onClientFilterChange(): void {
    this.currentPage = 0;
    this.searchTerm = ''; 
    this.loadProjects();
  }

  onPageChange(event: any): void {
    this.currentPage = event.page;
    this.pageSize = event.rows;
    this.loadProjects();
  }

  getProjectProgress(project: ProjectDTO): number {
    if (!project || !project.startDate || !project.deadLine) return 0;
    const start = new Date(project.startDate).getTime();
    const end = new Date(project.deadLine).getTime();
    const now = Date.now();

    if (project.status === ProjectStatus.COMPLETED) return 100;
    if (project.status === ProjectStatus.CANCELLED || project.status === ProjectStatus.INACTIVE) return 0; 
    if (now >= end ) return 100; 
    if (now < start) return 0;

    const progress = ((now - start) / (end - start)) * 100;
    return Math.max(0, Math.min(100, Math.round(progress)));
  }

  getProjectStatusSeverity(status?: string): BadgeSeverity {
    if (!status) return 'secondary';
    
    // Convert any status string to proper BadgeSeverity type
    const statusLower = status.toLowerCase();
    
    if (statusLower.includes('active') || statusLower.includes('progress')) {
      return 'warn';
    } else if (statusLower.includes('risk') || statusLower.includes('danger')) {
      return 'danger';
    } else if (statusLower.includes('complete')) {
      return 'success';
    } else if (statusLower.includes('cancel')) {
      return 'secondary';
    } else if (statusLower.includes('hold') || statusLower.includes('inactive')) {
      return 'secondary';
    } else if (statusLower.includes('pend')) {
      return 'info';
    }
    
    return 'secondary';
  }
  
  getProgressBarColor(project: ProjectDTO): string {
    return AssociateUIHelpers.getProgressBarColor(project?.status);
  }
  
  /**
   * Get CSS class based on client sector/industry
   * @param sector Client sector or industry (can be undefined)
   * @returns CSS class for styling client avatar
   */
  getSectorClass(sector: string | undefined): string {
    if (!sector) return 'default-sector';
    
    const sectorLower = sector.toLowerCase();
    if (sectorLower.includes('tech') || sectorLower.includes('software')) {
      return 'tech-sector';
    } else if (sectorLower.includes('finance') || sectorLower.includes('bank')) {
      return 'finance-sector';
    } else if (sectorLower.includes('health') || sectorLower.includes('medical')) {
      return 'health-sector';
    } else if (sectorLower.includes('edu')) {
      return 'education-sector';
    } else if (sectorLower.includes('retail')) {
      return 'retail-sector';
    }
    return 'default-sector';
  }
  
  /**
   * Get client initials for avatar display
   * @param project Project containing client info
   * @returns Client initials (2 characters) or default placeholder
   */
  getClientInitials(project: ProjectDTO): string {
    if (!project || !project.owner || !project.owner.name) return 'CL';
    
    const clientName = project.owner.name;
    const nameParts = clientName.split(' ');
    
    if (nameParts.length >= 2) {
      return (nameParts[0][0] + nameParts[1][0]).toUpperCase();
    } else if (nameParts.length === 1 && nameParts[0].length >= 2) {
      return nameParts[0].substring(0, 2).toUpperCase();
    } else {
      return 'CL';
    }
  }
  
  /**
   * Navigate to project details page
   * @param project Project to view details for
   */
  viewProjectDetails(project: ProjectDTO): void {
    if (project && project.projectId) {
      // Navigate to project details page using the project ID
      // this.router.navigate(['/associate/projects', project.projectId]);
      console.log('View project details:', project.projectId);
      // For now, just log the action as the navigation isn't implemented yet
    }
  }
}