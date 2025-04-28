import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core'; // Import ChangeDetectorRef
import { Table } from 'primeng/table';
import { AutoCompleteCompleteEvent } from 'primeng/autocomplete';
// Import these if you implement delete confirmation/notifications
// import { ConfirmationService, MessageService } from 'primeng/api';

// --- Define Interfaces ---
interface User {
    id: number;
    name: string;
    avatar: string;
}

interface Project {
    id: number;
    name: string;
    rcId?: number | null;
    rcName?: string;
    rcAvatar?: string;
    teamMembers: User[];
    duration: string;
    status: 'In Progress' | 'Upcoming' | 'Completed';
    startDate?: Date | null;
    deadline?: Date | null;
    client?: string | null; // Keep as string | null for the dropdown value
}
interface SelectOption {
    label: string;
    value: string | null;
}

type ProjectStatusSeverity = 'info' | 'warn' | 'success';

@Component({
    selector: 'app-projects',
    standalone: false, // Ensure this matches your project setup
    templateUrl: './projects.component.html',
    styleUrls: ['./projects.component.css'],
    // providers: [ConfirmationService, MessageService] // If using
})
export class ProjectsComponent implements OnInit {

    @ViewChild('projectTable') projectTable: Table | undefined;

    allProjects: Project[] = [];
    selectedProjects: Project[] = [];

    totalProjectCount: number = 0;
    activeProjectCount: number = 0;
    completedProjectCount: number = 0;
    upcomingProjectCount: number = 0;

    loading: boolean = false;
    searchTerm: string = '';

    // --- Create Dialog Properties ---
    displayCreateProjectDialog: boolean = false;
    newProjectTitle: string = '';
    newProjectStatus: Project['status'] | null = null;
    newProjectDeadline: Date | null = null;
    newProjectStartDate: Date | null = null;
    newProjectClient: string | null = null; // Changed to string | null for dropdown

    // --- Edit Dialog Properties ---
    displayEditProjectDialog: boolean = false;
    projectToEdit: Project | null = null;
    editProjectRC: User | null = null;
    editProjectMembers: User[] = [];
    filteredUsersForEdit: User[] = [];

    // --- View Dialog Properties ---
    displayViewProjectDialog: boolean = false;
    projectToView: Project | null = null;

    // --- User/Member Selection Properties ---
    allUsers: User[] = [];
    filteredUsers: User[] = []; // For Create dialog
    newProjectRC: User | null = null; // For Create dialog
    newProjectMembers: User[] = []; // For Create dialog

    projectStatusOptions: SelectOption[] = [
        { label: 'Select Status', value: null },
        { label: 'In Progress', value: 'In Progress' },
        { label: 'Upcoming', value: 'Upcoming' },
        { label: 'Completed', value: 'Completed' }
    ];

    clientOptions: SelectOption[] = []; // For Client Dropdown

    // Inject services if needed
    constructor(
        private cdRef: ChangeDetectorRef, // Inject ChangeDetectorRef
        // private confirmationService: ConfirmationService,
        // private messageService: MessageService
    ) { }

    ngOnInit(): void {
        this.loading = true;
        this.allUsers = this.getMockUsers();
        this.allProjects = this.getMockProjects();
        this.populateClientOptions(); // Populate client dropdown options
        this.calculateSummaryStats();
        this.loading = false;
    }

    // --- Mock Data Fetching ---
    getMockUsers(): User[] {
        const avatarBase = 'https://api.dicebear.com/8.x/pixel-art/svg?seed=';
        return [
            { id: 101, name: 'Alice Martin', avatar: `${avatarBase}Alice.svg` },
            { id: 102, name: 'Bob Johnson', avatar: `${avatarBase}Bob.svg` },
            { id: 103, name: 'Charlie Brown', avatar: `${avatarBase}Charlie.svg` },
            { id: 104, name: 'David Williams', avatar: `${avatarBase}David.svg` },
            { id: 105, name: 'Emma Wilson', avatar: `${avatarBase}Emma.svg` },
            { id: 201, name: 'Karim Benjelloun', avatar: `${avatarBase}Karim.svg` },
            { id: 202, name: 'Nadia Tazi', avatar: `${avatarBase}Nadia.svg` },
            { id: 203, name: 'Youssef El Amrani', avatar: `${avatarBase}Youssef.svg` },
            { id: 204, name: 'Amina Bouazza', avatar: `${avatarBase}Amina.svg` },
            { id: 205, name: 'Hamza El Fassi', avatar: `${avatarBase}Hamza.svg` },
            { id: 999, name: 'John Smith', avatar: `${avatarBase}JohnS.svg` },
        ];
    }

    getMockProjects(): Project[] {
        const users = this.allUsers;
        const findUserById = (id: number): User | undefined => users.find(u => u.id === id);

        const rc1 = findUserById(201);
        const rc2 = findUserById(202);
        const rc3 = findUserById(203);
        const rc4 = findUserById(204);
        const rc5 = findUserById(205);

        const members1 = [101, 102, 103].map(id => findUserById(id)).filter((u): u is User => !!u);
        const members2 = [104, 105].map(id => findUserById(id)).filter((u): u is User => !!u);
        const members3 = [101, 103, 105, 201, 102, 104, 106, 202, 204].map(id => findUserById(id)).filter((u): u is User => !!u);
        const members4 = [102, 202].map(id => findUserById(id)).filter((u): u is User => !!u);
        const members5: User[] = [];

        const projectsRaw = [
             { id: 1, name: 'Marketing Campaign 2024', rc: rc1, members: members1, status: 'In Progress', start: '2024-01-15', end: '2024-03-30', client: 'Client A' },
             { id: 2, name: 'Website Redesign', rc: rc2, members: members2, status: 'Upcoming', start: '2024-05-01', end: '2024-08-15', client: 'Client B' },
             { id: 3, name: 'Mobile App V2 Launch', rc: rc3, members: members3, status: 'Completed', start: '2023-12-01', end: '2024-02-28', client: 'Internal' },
             { id: 4, name: 'Data Analytics Platform', rc: rc4, members: members4, status: 'In Progress', start: '2024-03-01', end: '2024-07-31', client: 'Client C' },
             { id: 5, name: 'Customer Portal Update', rc: rc5, members: members5, status: 'Upcoming', start: '2024-06-15', end: '2024-07-30', client: 'Client D' },
             { id: 6, name: 'Internal Tools Refactor', rc: rc1, members: [104, 101], status: 'Upcoming', start: '2024-07-01', end: null, client: 'Internal' },
        ];

        return projectsRaw.map(p => {
            const startDate = p.start ? new Date(p.start) : null;
            const deadline = p.end ? new Date(p.end) : null;
            return {
                id: p.id,
                name: p.name,
                rcId: p.rc?.id,
                rcName: p.rc?.name,
                rcAvatar: p.rc?.avatar,
                teamMembers: p.members.map(idOrUser => typeof idOrUser === 'number' ? findUserById(idOrUser) : idOrUser).filter((u): u is User => !!u),
                status: p.status as Project['status'],
                startDate: startDate,
                deadline: deadline,
                client: p.client || null,
                duration: this.calculateDuration(startDate, deadline)
            };
        });
    }

    // --- Utility Methods ---
    populateClientOptions(): void {
        const clients = new Set<string>();
        this.allProjects.forEach(p => {
            if (p.client && p.client !== 'Internal') {
                clients.add(p.client);
            }
        });
        const sortedClients = Array.from(clients).sort((a, b) => a.localeCompare(b));
        this.clientOptions = sortedClients.map(client => ({ label: client, value: client }));
        const hasInternal = this.allProjects.some(p => p.client === 'Internal');
        if (hasInternal || !this.clientOptions.find(opt => opt.value === 'Internal')) {
             this.clientOptions.push({ label: 'Internal', value: 'Internal' });
        }
        this.clientOptions.unshift({ label: 'Select Client', value: null });
    }


    calculateSummaryStats(): void {
        this.totalProjectCount = this.allProjects.length;
        this.activeProjectCount = this.allProjects.filter(p => p.status === 'In Progress').length;
        this.completedProjectCount = this.allProjects.filter(p => p.status === 'Completed').length;
        this.upcomingProjectCount = this.allProjects.filter(p => p.status === 'Upcoming').length;
    }

    getStatusSeverity(status: Project['status']): ProjectStatusSeverity {
        switch (status) {
            case 'In Progress': return 'info';
            case 'Upcoming': return 'warn';
            case 'Completed': return 'success';
            default: return 'info';
        }
    }

    formatDate(date: Date | string | null | undefined): string {
        if (!date) return '?';
        try {
            const dateObj = typeof date === 'string' ? new Date(date) : date;
            if (isNaN(dateObj.getTime())) { return '?'; }
            return dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: '2-digit' });
        } catch (e) {
            console.error("Error formatting date:", date, e);
            return '?';
        }
    }


    calculateDuration(start: Date | string | null | undefined, end: Date | string | null | undefined): string {
         const startDateStr = this.formatDate(start);
         const endDateStr = this.formatDate(end);
         if (startDateStr === '?' && endDateStr === '?') return 'N/A';
         if (startDateStr === '?') return `Ends ${endDateStr}`;
         if (endDateStr === '?') return `Starts ${startDateStr}`;
         return `${startDateStr} - ${endDateStr}`;
    }


    // --- Table Interaction ---
    applyGlobalFilter(event: Event): void {
        const inputElement = event.target as HTMLInputElement;
        const filterValue = inputElement.value;
        this.projectTable?.filterGlobal(filterValue, 'contains');
    }

    clearFilter(table: Table): void {
        table.clear();
        this.searchTerm = '';
    }

    onFilterClick(): void {
        console.log('Filters button clicked - Implement filtering logic');
    }

    // --- Create Dialog ---
    showCreateProjectDialog(): void {
        this.newProjectTitle = '';
        this.newProjectStatus = null;
        this.newProjectDeadline = null;
        this.newProjectStartDate = null;
        this.newProjectClient = null;
        this.newProjectRC = null;
        this.newProjectMembers = [];
        this.filteredUsers = [];
        this.displayCreateProjectDialog = true;
    }

    hideCreateProjectDialog(): void {
        this.displayCreateProjectDialog = false;
    }

    filterUsers(event: AutoCompleteCompleteEvent) {
        let filtered: User[] = [];
        let query = event.query?.toLowerCase() ?? '';

        if (Array.isArray(this.allUsers)) {
             for (let user of this.allUsers) {
                if (user.name?.toLowerCase().includes(query)) {
                    const isAlreadySelected = this.newProjectMembers?.some(m => m.id === user.id);
                    if (!isAlreadySelected) {
                        filtered.push(user);
                    }
                }
            }
        }
        this.filteredUsers = filtered;
    }

    saveNewProject(): void {
        if (!this.newProjectTitle || !this.newProjectStatus || !this.newProjectRC) {
            console.error("Title, Status, and RC in Charge are required.");
            return;
        }

        const newProject: Project = {
            id: Math.max(0, ...this.allProjects.map(p => p.id)) + 1,
            name: this.newProjectTitle,
            status: this.newProjectStatus,
            startDate: this.newProjectStartDate ? new Date(this.newProjectStartDate) : null,
            deadline: this.newProjectDeadline ? new Date(this.newProjectDeadline) : null,
            client: this.newProjectClient,
            rcId: this.newProjectRC?.id,
            rcName: this.newProjectRC?.name,
            rcAvatar: this.newProjectRC?.avatar,
            teamMembers: this.newProjectMembers || [],
            duration: this.calculateDuration(this.newProjectStartDate, this.newProjectDeadline)
        };

        console.log('Saving New Project:', newProject);
        // TODO: API call

        this.allProjects = [...this.allProjects, newProject];
        this.populateClientOptions();
        this.calculateSummaryStats();
        this.projectTable?.reset();
        this.hideCreateProjectDialog();
    }

    // --- Edit Dialog ---
    editProject(project: Project): void {
        const projectCopy = {
            ...project,
            startDate: project.startDate ? new Date(project.startDate) : null,
            deadline: project.deadline ? new Date(project.deadline) : null,
            teamMembers: [...project.teamMembers]
        };
        this.projectToEdit = projectCopy; 

        this.editProjectRC = this.allUsers.find(u => u.id === project.rcId) || null;

        this.editProjectMembers = [...(this.projectToEdit.teamMembers || [])];

        this.filteredUsersForEdit = this.allUsers.filter(user =>
            !this.editProjectMembers.some(member => member.id === user.id)
        );

        console.log('[EDIT] Showing Edit Dialog. projectToEdit is set:', !!this.projectToEdit);

        this.displayEditProjectDialog = true;

       
        setTimeout(() => {
            this.cdRef.detectChanges();
            console.log('[EDIT] Change detection triggered after showing dialog.');
        }, 0);
    }

    hideEditProjectDialog(): void {
        this.displayEditProjectDialog = false;
        this.projectToEdit = null;
        this.editProjectRC = null;
        this.editProjectMembers = [];
        this.filteredUsersForEdit = [];
    }

    filterUsersForEdit(event: AutoCompleteCompleteEvent) {
        let filtered: User[] = [];
        let query = event.query?.toLowerCase() ?? '';

        if (Array.isArray(this.allUsers)) {
            for (let user of this.allUsers) {
                if (user.name?.toLowerCase().includes(query)) {
                    const isAlreadySelected = this.editProjectMembers?.some(m => m.id === user.id);
                    if (!isAlreadySelected) {
                        filtered.push(user);
                    }
                }
            }
        }
        this.filteredUsersForEdit = filtered;
        console.log('[EDIT] Filtered suggestions for query "'+event.query+'":', this.filteredUsersForEdit);
    }


    updateProject(): void {
        if (!this.projectToEdit || !this.editProjectRC || !this.projectToEdit?.name || !this.projectToEdit?.status) {
             console.error("Cannot update project: Missing required data (Title, Status, RC).");
             return;
        }

        const index = this.allProjects.findIndex(p => p.id === this.projectToEdit!.id);
        if (index !== -1) {
            const updatedProjectData: Project = {
                ...this.projectToEdit,
                rcId: this.editProjectRC.id,
                rcName: this.editProjectRC.name,
                rcAvatar: this.editProjectRC.avatar,
                teamMembers: this.editProjectMembers || [],
                duration: this.calculateDuration(this.projectToEdit.startDate, this.projectToEdit.deadline)
            };

            console.log('Updating Project ID:', updatedProjectData.id, 'with data:', updatedProjectData);
            // TODO: API call

            const updatedProjects = [...this.allProjects];
            updatedProjects[index] = updatedProjectData;
            this.allProjects = updatedProjects;

            this.populateClientOptions();
            this.calculateSummaryStats();
            this.hideEditProjectDialog();
        } else {
            console.error("Could not find project in list to update with ID:", this.projectToEdit.id);
        }
    }

    // --- View Dialog ---
    viewProject(project: Project): void {
        this.projectToView = project;
        this.displayViewProjectDialog = true;
    }

    hideViewProjectDialog(): void {
        this.displayViewProjectDialog = false;
        this.projectToView = null;
    }

    // --- Delete Action ---
    deleteProject(project: Project): void {
        console.log('Delete project action triggered for:', project.id);
       if (confirm(`Are you sure you want to delete project "${project.name}"?`)) {
            console.log('Simulating deletion for project ID:', project.id);
            // TODO: API call

            this.allProjects = this.allProjects.filter(p => p.id !== project.id);
            this.selectedProjects = this.selectedProjects.filter(p => p.id !== project.id);
            this.calculateSummaryStats();
            this.populateClientOptions();
            console.log(`Project "${project.name}" deleted (simulation).`);
       }
    }
}