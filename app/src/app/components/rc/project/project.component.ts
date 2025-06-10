import { Component, OnInit, ViewChild, ChangeDetectorRef, signal, computed } from '@angular/core'; // Import ChangeDetectorRef
import { Table, TablePageEvent } from 'primeng/table';


import { ProjectStatus } from '../../../enums/project-status.enum';
import { Project } from '../../../models/project.model';
import { RcService } from '../../../services/rc.service';
import { debounceTime, distinctUntilChanged, Subject, switchMap } from 'rxjs';
import { MessageService, ConfirmationService } from 'primeng/api';
import { LanguageService, SupportedLanguage } from '../../../services/language/language.service';
import { TranslateService } from '@ngx-translate/core';
import { take } from 'rxjs/operators';



export interface SelectOption {
    label: string;
    value: string | null;
}
export interface projectFilter {
    filter?: 'projectLabel' | 'clientLabel' | "",
    value?: string,
    sort: 'label' | 'titre' | 'client' | 'status'
    sortType: 1 | -1,
    pageNumber: number,
    pageSize: number,

}
export type ProjectStatusSeverity = 'info' | 'warn' | 'success' | 'danger';

@Component({
    selector: 'app-project',
    standalone: false, // Ensure this matches your project setup
    templateUrl: './project.component.html',
    styleUrls: ['./project.component.css'],
    // providers: [ConfirmationService, MessageService] // If using
})

export class ProjectComponent implements OnInit {
    onSortChange($event: any) {
        this.sort.set($event.field)
        this.sortType.set($event.order)
        this.getProjects()
    }
    filter = computed(() => {

        return {
            filter: this.activeFilter(),
            pageNumber: this.page(),
            pageSize: this.state().rows(),
            sort: this.sort(),
            sortType: this.sortType(),
            value: this.searchItem()


        }
    })
    searchItem = signal<string>('')
    activeFilter = signal<'projectLabel' | 'clientLabel' | ''>('')
    sort = signal<'label' | 'titre' | 'client' | 'status'>('label')
    sortType = signal<1 | -1>(1)
    searchByClient($event: Event) {
        const event = $event as InputEvent
        if (this.activeFilter() != 'clientLabel') this.activeFilter.set('clientLabel')
        if (!event.data) {
            this.activeFilter.set('')
            this.getProjects()
        }
        else {
            this.searchItem.set(this.searchClient)
            this.searchClientInputChange$.next(this.searchClient);
        }
    }
    searchByLabel($event: Event) {
        const event = $event as InputEvent
        if (this.activeFilter() != 'projectLabel') this.activeFilter.set('projectLabel')
        if (!event.data) {
            this.activeFilter.set('')
            this.getProjects()
        }
        else {
            this.searchItem.set(this.searchLabel)
            this.searchProjectInputChange$.next(this.searchLabel);
        }
    }
    onPageChange($event: TablePageEvent) {
        this.rowsSignal.set($event.rows);
        this.firstSignal.set($event.first);
        console.log(this.state().first());
        this.getProjects();
    }
    page = computed(() => this.state().first() / this.state().rows())
    private searchProjectInputChange$ = new Subject<string>();
    private searchClientInputChange$ = new Subject<string>();
    @ViewChild('projectTable') projectTable: Table | undefined;

    allProjects: Project[] = [];
    selectedProjects: Project[] = [];

currentLanguage: SupportedLanguage = 'en';

    // Pagination state as distinct signals
    private firstSignal = signal(0);
    private rowsSignal = signal(5);
    
    totalRecords = 0;
    totalProjectCount: number = 0;
    activeProjectCount: number = 0;
    completedProjectCount: number = 0;
    inActiveProjectCount: number = 0;
    cancelledProjectCount: number = 0;
    
    // Computed state that combines all state values
    state = computed(() => {
        return {
            sort: this.sort(),
            sortType: this.sortType(),
            filter: this.activeFilter(),
            // Provide access to the signals and their values
            firstSignal: this.firstSignal,
            rowsSignal: this.rowsSignal,
            first: () => this.firstSignal(),
            rows: () => this.rowsSignal()
        }
    })

    searchLabel: string = '';
    searchClient: string = '';

    // --- Create Dialog Properties ---
    displayCreateProjectDialog: boolean = false;



    // --- Edit Dialog Properties ---
    displayEditProjectDialog: boolean = false;
    projectToEdit: Project | null = null;


    // --- View Dialog Properties ---
    displayViewProjectDialog: boolean = false;
    projectToView: Project | null = null;


    constructor(
        private rcService: RcService,
        private languageService: LanguageService,
        private translate: TranslateService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService
    ) { }

    getProjects() {

      
        this.rcService.getFilteredProjects(this.filter()).subscribe(pagedData => {  console.log(pagedData); this.allProjects = pagedData.projectDTOS; this.totalRecords = pagedData.totalElements })

    }
    getTranslatedStatus(statusKey: string): string {
        if (!statusKey) return '';
        const formattedKey = statusKey.toLowerCase(); // Assuming keys in JSON are lowercase
        // Construct the full translation key
        const translationKey = `project_rc.statusTypes.${formattedKey}`;
        // Get the translation, fallback to original if not found
        return this.translate.instant(translationKey, { defaultValue: statusKey.charAt(0).toUpperCase() + statusKey.slice(1).toLowerCase() });
    }
    ngOnInit(): void {
        // First ensure translations are loaded
        this.languageService.currentLanguage$.subscribe(lang => {
            this.currentLanguage = lang;
            
            // Force reload translations when language changes or component initializes
            this.translate.use(lang).pipe(take(1)).subscribe(() => {
                console.log(`Translations refreshed for ${lang}`);
                
                // Load project data after translations are ready
                this.loadProjectData();
            }, error => {
                console.error('Error reloading translations:', error);
                // Still try to load data even if translations fail
                this.loadProjectData();
            });
        });
        
        this.setupSearchDebounce();
    }
    
    /**
     * Loads project data and ensures proper pagination setup
     * This method is called during initialization and when language changes
     */
    private loadProjectData(): void {
        // Use the proper API call to get initial project data
        this.rcService.getInitialProject().subscribe(res => {
            this.activeProjectCount = res.activeProjects;
            this.totalProjectCount = res.totalProjects;
            this.completedProjectCount = res.completedProjects;
            this.inActiveProjectCount = res.inActiveProjects;
            this.cancelledProjectCount = res.cancelledProjects;
            this.allProjects = res.projects;
            
            // Ensure the totalRecords value is correctly set for proper pagination
            this.totalRecords = res.totalProjects;
            
            console.log(`Project data loaded: ${this.allProjects.length} projects, totalRecords=${this.totalRecords}`);
            
            // Force detection of these changes in the UI
            setTimeout(() => {
                if (this.projectTable) {
                    this.projectTable.totalRecords = this.totalRecords;
                }
            });
        });
    }






    getStatusSeverity(status: ProjectStatus): ProjectStatusSeverity {
        switch (status) {
            case ProjectStatus.ACTIVE: return 'success';
            case ProjectStatus.COMPLETED: return 'info';
            case ProjectStatus.INACTIVE: return 'warn';
            case ProjectStatus.CANCELLED: return 'danger';
            default: return 'info';
        }
    }
    
    /**
   * Gets the translated pagination template with dynamic values
   * This method is called by the template and needs to be as efficient as possible
   * @returns A fully translated pagination string with values interpolated
   */
  getPaginationTemplate(): string {
    // Force evaluation of these values to ensure reactivity
    const start = this.state().first() + 1;
    const end = Math.min(this.state().first() + this.state().rows(), this.totalRecords);
    const total = this.totalRecords;

    // Use instant translation with the standardized parameters
    return this.translate.instant('project_rc.paginationSummary', {
        start: start,
        end: end,
        total: total
    });
  }
  
  /**
   * Helper method to calculate the last displayed item number for pagination
   * This is needed because Math is not directly available in the template
   * @returns The number of the last item on the current page
   */
  calculateLastDisplayedItemNumber(): number {
    // Make sure we have positive numbers to work with
    if (!this.totalRecords || this.totalRecords <= 0) return 0;
    
    const start = this.state().first();
    const rows = this.state().rows();
    const end = Math.min(start + rows, this.totalRecords);
    
    console.log(`Pagination calculation: start=${start+1}, rows=${rows}, total=${this.totalRecords}, end=${end}`);
    
    return end;
  }






    // --- Table Interaction ---

    clearFilter(table: Table): void {
        table.clear();
        this.searchLabel = '';
    }

    onClear(): void {
        this.activeFilter.set('')
        this.searchClient = ''
        this.searchLabel = ''
        this.getProjects()
    }

    // --- Create Dialog ---
    showCreateProjectDialog(): void {

        this.displayCreateProjectDialog = true;
    }

    hideCreateProjectDialog(): void {
        this.displayCreateProjectDialog = false;
    }


    private setupSearchDebounce(): void {
        this.searchProjectInputChange$.pipe(
            debounceTime(1000),
            distinctUntilChanged(),
            switchMap(searchLabel => {

                return this.rcService.getFilteredProjects(this.filter())
            })
        ).subscribe(results => {
            console.log(results)
            this.allProjects = results.projectDTOS
            this.totalRecords = results.totalElements


        });
        this.searchClientInputChange$.pipe(
            debounceTime(1000),
            distinctUntilChanged(),
            switchMap(searchClient => {

                return this.rcService.getFilteredProjects(this.filter())
            })
        ).subscribe(results => {
            console.log(results)
            this.allProjects = results.projectDTOS
            this.totalRecords = results.totalElements


        });
    }
    saveNewProject(project: Project): void {
        console.log(project)
        this.displayCreateProjectDialog = false
        this.rcService.createProject(project).subscribe(res => {
            if (res) {
                this.messageService.add({
                    severity: 'success',
                    summary: "project updated successfully"
                })
                this.allProjects = [res, ...this.allProjects.slice(0, this.allProjects.length)]
            }
        })

    }

    // --- Edit Dialog ---
    editProject(project: Project): void {
        const projectCopy = {
            ...project,
            startDate: project.startDate,
            deadline: project.deadLine,

        };
        this.projectToEdit = projectCopy;
        this.displayEditProjectDialog = true


    }

    hideEditProjectDialog(): void {
        this.displayEditProjectDialog = false;
        this.projectToEdit = null;

    }



    updateProject(project: Project): void {

        this.displayEditProjectDialog = false
        this.rcService.updateProject(project).subscribe(res => {
            if (res) {
                this.messageService.add({
                    severity: 'success',
                    summary: "project updated successfully"
                })
                this.allProjects = this.allProjects.map((p) => {
                    if (project.projectId == p.projectId) return res
                    return p
                })
            }
        })

    }

    // --- View Dialog ---
    viewProject(project: Project): void {
        console.log(project)
        this.projectToView = project;
        this.displayViewProjectDialog = true;
    }

    hideViewProjectDialog(): void {
        this.displayViewProjectDialog = false;
        this.projectToView = null;
    }


    deleteProject(project: Project): void {
        // Show confirmation dialog before deleting
        this.confirmationService.confirm({
            header: this.translate.instant('project_rc.deleteConfirmation.header'),
            message: this.translate.instant('project_rc.deleteConfirmation.message', { title: project.titre }),
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: this.translate.instant('project_rc.deleteConfirmation.accept'),
            rejectLabel: this.translate.instant('project_rc.deleteConfirmation.reject'),
            acceptButtonStyleClass: 'p-button-danger',
            rejectButtonStyleClass: 'p-button-text p-button-secondary',
            accept: () => {
                // User confirmed the deletion
                this.rcService.deleteProject(project.projectId!).subscribe(res => {
                    if (res) {
                        this.messageService.add({
                            severity: 'success',
                            summary: this.translate.instant('project_rc.deleteConfirmation.success'),
                            detail: this.translate.instant('project_rc.deleteConfirmation.successDetail')
                        });
                        // Remove the deleted project from the array
                        this.allProjects = this.allProjects.filter(p => p.projectId !== project.projectId);
                        
                        // Refresh project counts
                        this.loadProjectData();
                    }
                });
            },
            reject: () => {
                // User cancelled the deletion - do nothing
                this.messageService.add({
                    severity: 'info',
                    summary: this.translate.instant('project_rc.deleteConfirmation.cancelled')
                });
            }
        });
    }
}