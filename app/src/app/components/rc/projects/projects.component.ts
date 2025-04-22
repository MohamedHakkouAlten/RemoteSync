// src/app/components/admin/projects/projects.component.ts
import { Component, OnInit, ViewChild } from '@angular/core';
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

// TeamMember can often just be User
// interface TeamMember extends User {}

interface Project {
    id: number;
    name: string;
    rcId?: number | null;
    rcName?: string;
    rcAvatar?: string;
    teamMembers: User[]; // Use User directly if TeamMember is identical
    duration: string;
    status: 'In Progress' | 'Upcoming' | 'Completed';
    startDate?: Date | null; // Use Date for p-calendar binding
    deadline?: Date | null;  // Use Date for p-calendar binding
    client?: string | null;
}
interface SelectOption {
    label: string;
    value: string | null;
}

type ProjectStatusSeverity = 'info' | 'warn' | 'success';

@Component({
    selector: 'app-projects',
    standalone: false, // Ensure this matches your project setup (false if using NgModules)
    templateUrl: './projects.component.html',
    styleUrls: ['./projects.component.css'],
    // Add providers here if you use ConfirmationService/MessageService
    // providers: [ConfirmationService, MessageService]
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
    newProjectClient: string = '';

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

    // Inject services if needed
    constructor(
        // private confirmationService: ConfirmationService,
        // private messageService: MessageService
    ) { }

    ngOnInit(): void {
        this.loading = true;
        this.allUsers = this.getMockUsers();
        this.allProjects = this.getMockProjects(); // This now returns projects with Date objects
        this.calculateSummaryStats();
        this.loading = false;
    }

    // --- Mock Data Fetching ---
    getMockUsers(): User[] {
        const avatarBase = 'https://api.dicebear.com/8.x/pixel-art/svg?seed=';
        // Example user data (add more as needed)
        return [
            { id: 101, name: 'Alice Martin', avatar: `${avatarBase}Alice.svg` },
            { id: 102, name: 'Bob Johnson', avatar: `${avatarBase}Bob.svg` },
            { id: 103, name: 'Charlie Brown', avatar: `${avatarBase}Charlie.svg` },
            { id: 104, name: 'David Williams', avatar: `${avatarBase}David.svg` },
            { id: 105, name: 'Emma Wilson', avatar: `${avatarBase}Emma.svg` },
            { id: 201, name: 'Karim Benjelloun', avatar: `${avatarBase}Karim.svg` }, // RC
            { id: 202, name: 'Nadia Tazi', avatar: `${avatarBase}Nadia.svg` }, // RC
            { id: 203, name: 'Youssef El Amrani', avatar: `${avatarBase}Youssef.svg` }, // RC
            { id: 204, name: 'Amina Bouazza', avatar: `${avatarBase}Amina.svg` }, // RC
            { id: 205, name: 'Hamza El Fassi', avatar: `${avatarBase}Hamza.svg` }, // RC
            { id: 999, name: 'John Smith', avatar: `${avatarBase}JohnS.svg` },
        ];
    }

    getMockProjects(): Project[] {
        const users = this.allUsers;
        const findUserById = (id: number): User | undefined => users.find(u => u.id === id);

        // Find RCs by ID for reliability
        const rc1 = findUserById(201);
        const rc2 = findUserById(202);
        const rc3 = findUserById(203);
        const rc4 = findUserById(204);
        const rc5 = findUserById(205);

        // Find members by ID
        const members1 = [101, 102, 103].map(id => findUserById(id)).filter((u): u is User => !!u);
        const members2 = [104, 105].map(id => findUserById(id)).filter((u): u is User => !!u);
        const members3 = [101, 103, 105, 201].map(id => findUserById(id)).filter((u): u is User => !!u); // Mixed
        const members4 = [102, 202].map(id => findUserById(id)).filter((u): u is User => !!u);
        const members5: User[] = []; // No members example

        const projectsRaw = [
             { id: 1, name: 'Marketing Campaign 2024', rc: rc1, members: members1, status: 'In Progress', start: '2024-01-15', end: '2024-03-30', client: 'Client A' },
             { id: 2, name: 'Website Redesign', rc: rc2, members: members2, status: 'Upcoming', start: '2024-05-01', end: '2024-08-15', client: 'Client B' },
             { id: 3, name: 'Mobile App V2 Launch', rc: rc3, members: members3, status: 'Completed', start: '2023-12-01', end: '2024-02-28', client: 'Internal' },
             { id: 4, name: 'Data Analytics Platform', rc: rc4, members: members4, status: 'In Progress', start: '2024-03-01', end: '2024-07-31', client: 'Client C' },
             { id: 5, name: 'Customer Portal Update', rc: rc5, members: members5, status: 'Upcoming', start: '2024-06-15', end: '2024-07-30', client: 'Client D' },
             { id: 6, name: 'Internal Tools Refactor', rc: rc1, members: [104, 101], status: 'Upcoming', start: '2024-07-01', end: null, client: 'Internal' }, // No end date yet
        ];

        // Map raw data to Project interface, ensuring Date objects and duration
        return projectsRaw.map(p => {
            const startDate = p.start ? new Date(p.start) : null;
            const deadline = p.end ? new Date(p.end) : null;
            return {
                id: p.id,
                name: p.name,
                rcId: p.rc?.id,
                rcName: p.rc?.name,
                rcAvatar: p.rc?.avatar,
                teamMembers: p.members.map(idOrUser => typeof idOrUser === 'number' ? findUserById(idOrUser) : idOrUser).filter((u): u is User => !!u), // Ensure members are User objects
                status: p.status as Project['status'], // Assert status type
                startDate: startDate,
                deadline: deadline,
                client: p.client || null,
                duration: this.calculateDuration(startDate, deadline) // Calculate duration here
            };
        });
    }

    // --- Utility Methods ---
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
            default: return 'info'; // Fallback severity
        }
    }

    formatDate(date: Date | string | null | undefined): string {
        if (!date) return '?';
        try {
            // Handle potential string dates, although internal state should be Date objects
            const dateObj = typeof date === 'string' ? new Date(date) : date;
            // Check if the Date object is valid
            if (isNaN(dateObj.getTime())) {
                return '?';
            }
            return dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
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
        // Example: Show a filter sidebar or dialog
        // this.displayFilterSidebar = true;
    }

    // --- Create Dialog ---
    showCreateProjectDialog(): void {
        this.newProjectTitle = '';
        this.newProjectStatus = null;
        this.newProjectDeadline = null;
        this.newProjectStartDate = null;
        this.newProjectClient = '';
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

        if (query && Array.isArray(this.allUsers)) {
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
             // Use MessageService for user feedback
            // this.messageService.add({severity:'warn', summary: 'Validation Error', detail:'Please fill all required fields: Title, Status, RC.'});
            return;
        }

        const newProject: Project = {
            id: Math.max(0, ...this.allProjects.map(p => p.id)) + 1, // Simple ID generation
            name: this.newProjectTitle,
            status: this.newProjectStatus,
            startDate: this.newProjectStartDate ? new Date(this.newProjectStartDate) : null,
            deadline: this.newProjectDeadline ? new Date(this.newProjectDeadline) : null,
            client: this.newProjectClient || null,
            rcId: this.newProjectRC?.id,
            rcName: this.newProjectRC?.name,
            rcAvatar: this.newProjectRC?.avatar,
            teamMembers: this.newProjectMembers || [],
            duration: this.calculateDuration(this.newProjectStartDate, this.newProjectDeadline)
        };

        console.log('Saving New Project:', newProject);
        // TODO: Replace with actual API call via a service
        // this.projectService.create(newProject).subscribe(...)

        // Add to local array (immutable update)
        this.allProjects = [...this.allProjects, newProject];
        this.calculateSummaryStats();
        this.projectTable?.reset(); // Optional: Reset sort/filter
        this.hideCreateProjectDialog();
         // Success feedback
        // this.messageService.add({severity:'success', summary: 'Success', detail:'Project created successfully.'});
    }

    // --- Edit Dialog ---
    editProject(project: Project): void {
        // 1. Create a deep copy to avoid modifying the original object reference directly in the table
        //    A simple spread might not be enough if teamMembers is complex. JSON parse/stringify is easy but has limitations (e.g., loses Date objects).
        //    Let's handle dates explicitly.
        const projectCopy = {
            ...project,
            startDate: project.startDate ? new Date(project.startDate) : null,
            deadline: project.deadline ? new Date(project.deadline) : null,
            // Create a new array of member references (doesn't deep copy members themselves)
            teamMembers: [...project.teamMembers]
        };
        this.projectToEdit = projectCopy;

        // 2. Find the full User object for the RC based on rcId
        this.editProjectRC = this.allUsers.find(u => u.id === project.rcId) || null;

        // 3. Set the members for the autocomplete (use the copied array)
        //    Ensure it's a new array reference for the autocomplete component
        this.editProjectMembers = [...(this.projectToEdit.teamMembers || [])];

        // 4. Reset suggestions for edit autocomplete
        this.filteredUsersForEdit = [];

        // 5. Show the dialog
        this.displayEditProjectDialog = true;
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

        if (query && Array.isArray(this.allUsers)) {
             for (let user of this.allUsers) {
                if (user.name?.toLowerCase().includes(query)) {
                    // Exclude users already selected IN THE EDIT DIALOG
                    const isAlreadySelected = this.editProjectMembers?.some(m => m.id === user.id);
                    if (!isAlreadySelected) {
                        filtered.push(user);
                    }
                }
            }
        }
        this.filteredUsersForEdit = filtered;
    }

    updateProject(): void {
        if (!this.projectToEdit || !this.editProjectRC || !this.projectToEdit.name || !this.projectToEdit.status) {
             console.error("Cannot update project: Missing required data.");
             // this.messageService.add({severity:'warn', summary: 'Validation Error', detail:'Cannot update: Title, Status, and RC are required.'});
             return;
        }

        const index = this.allProjects.findIndex(p => p.id === this.projectToEdit!.id);
        if (index !== -1) {
            // Create the updated project object from the dialog models
            const updatedProjectData: Project = {
                ...this.projectToEdit, // Includes id, name, status, client, potentially modified dates
                rcId: this.editProjectRC.id, // Get ID from selected RC User object
                rcName: this.editProjectRC.name,
                rcAvatar: this.editProjectRC.avatar,
                teamMembers: this.editProjectMembers || [], // Assign selected members
                // Recalculate duration based on potentially edited dates
                duration: this.calculateDuration(this.projectToEdit.startDate, this.projectToEdit.deadline)
            };

            console.log('Updating Project ID:', updatedProjectData.id, 'with data:', updatedProjectData);
            // TODO: Replace with actual API call via a service
            // this.projectService.update(updatedProjectData.id, updatedProjectData).subscribe(...)

            // Update the array immutably
            const updatedProjects = [...this.allProjects];
            updatedProjects[index] = updatedProjectData;
            this.allProjects = updatedProjects;

            this.calculateSummaryStats();
            this.hideEditProjectDialog();
            // this.messageService.add({severity:'success', summary: 'Success', detail:`Project "${updatedProjectData.name}" updated.`});
        } else {
            console.error("Could not find project in list to update with ID:", this.projectToEdit.id);
            // this.messageService.add({severity:'error', summary: 'Error', detail:'Could not find the project to update.'});
        }
    }

    // --- View Dialog ---
    viewProject(project: Project): void {
        // Assign the selected project (no copy needed for viewing)
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
        // Use ConfirmationService for safety
         /*
        this.confirmationService.confirm({
            message: `Are you sure you want to delete project "${project.name}"? This action cannot be undone.`,
            header: 'Confirm Deletion',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Delete',
            rejectLabel: 'Cancel',
            acceptButtonStyleClass: 'p-button-danger',
            rejectButtonStyleClass: 'p-button-text',
            accept: () => {
                console.log('Deletion confirmed for project ID:', project.id);
                // --- TODO: Replace with actual DELETE request via a service ---
                // Example: this.projectService.delete(project.id).subscribe(() => { ... });

                // Simulate local removal after successful API call
                this.allProjects = this.allProjects.filter(p => p.id !== project.id);
                this.selectedProjects = this.selectedProjects.filter(p => p.id !== project.id); // Remove from selection too
                this.calculateSummaryStats();
                this.messageService.add({severity:'success', summary: 'Deleted', detail: `Project "${project.name}" has been deleted.`});
                // -----------------------------------------------------------
            },
            reject: () => {
                console.log('Deletion rejected for project ID:', project.id);
            }
        });
        */
       // If not using ConfirmationService, show a simple alert for now (NOT RECOMMENDED FOR PRODUCTION)
       if (confirm(`Are you sure you want to delete project "${project.name}"?`)) {
            console.log('Simulating deletion for project ID:', project.id);
             // Simulate local removal
            this.allProjects = this.allProjects.filter(p => p.id !== project.id);
            this.selectedProjects = this.selectedProjects.filter(p => p.id !== project.id);
            this.calculateSummaryStats();
            console.log(`Project "${project.name}" deleted (simulation).`);
       }
    }
}