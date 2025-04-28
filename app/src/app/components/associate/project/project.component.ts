import { Component, OnInit } from '@angular/core';

// Interface for Dropdown options
interface SelectItem {
  label: string;
  value: string | null; // Allow null for "All" options
}

// Interface for Assignee Avatars
interface Assignee {
  image?: string; // URL to avatar image
  label?: string; // Initials if no image
  styleClass?: string; // Optional extra class
}

// Interface for Project Card Data
interface ProjectCard {
  id: number;
  title: string;
  category: string;
  client: string;
  dueDate: string; // Or Date object
  progress: number;
  assignees: Assignee[];
  remainingAssignees?: number; // Number for the "+X" badge
  status: 'In Progress' | 'At Risk' | 'Completed' | 'On Hold';
  statusSeverity: 'warn' | 'danger' | 'success' | 'secondary'; // Maps to p-badge severity
}

@Component({
  selector: 'app-project',
  standalone: false,
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {

  // --- Component Properties ---
  searchTerm: string = '';
  selectedStatus: string | null = null; // Bound to status dropdown
  selectedClient: string | null = null; // Bound to client dropdown

  allProjects: ProjectCard[] = []; // Holds the master list
  filteredProjects: ProjectCard[] = []; // Holds the displayed list

  statusOptions: SelectItem[] = []; // Options for status dropdown
  clientOptions: SelectItem[] = []; // Options for client dropdown

  constructor() { }

  ngOnInit(): void {
    // --- Load Sample Data ---
    this.loadSampleProjects(); // Populate allProjects

    // --- Prepare Dropdown Options ---
    this.statusOptions = [
      { label: 'All Status', value: null },
      { label: 'In Progress', value: 'In Progress' },
      { label: 'At Risk', value: 'At Risk' },
      { label: 'Completed', value: 'Completed' },
      { label: 'On Hold', value: 'On Hold' }
    ];
    // Dynamically create client options from the project data
    this.clientOptions = this.generateClientOptions(this.allProjects);

    // --- Initialize Displayed Projects ---
    this.filterProjects(); // Apply initial (empty) filters
  }

  /**
   * Loads sample project data into the component.
   * Replace this with actual data fetching from a service.
   */
  loadSampleProjects(): void {
    this.allProjects = [
      { id: 1, title: 'Website Redesign', category: 'Digital Transformation', client: 'TechCorp Inc.', dueDate: 'Oct 26, 2024', progress: 75, assignees: [{ image: 'assets/images/avatar1.png' }, { image: 'assets/images/avatar1.png' }, { image: 'assets/images/avatar1.png' }], remainingAssignees: 2, status: 'In Progress', statusSeverity: 'warn' },
      { id: 2, title: 'Mobile App Development', category: 'Product Development', client: 'InnovateTech', dueDate: 'Dec 15, 2024', progress: 45, assignees: [{ image: 'assets/images/avatar1.png' }, { image: 'assets/images/avatar1.png' }, { image: 'assets/images/avatar1.png' }], status: 'At Risk', statusSeverity: 'danger' },
      { id: 3, title: 'Cloud Migration', category: 'Infrastructure', client: 'DataFlow Systems', dueDate: 'Sep 30, 2024', progress: 100, assignees: [{ image: 'assets/images/avatar1.png' }, { image: 'assets/images/avatar1.png' }, { image: 'assets/images/avatar1.png' }], remainingAssignees: 4, status: 'Completed', statusSeverity: 'success' },
      { id: 4, title: 'CRM Implementation', category: 'Business Solutions', client: 'Global Services Ltd', dueDate: 'Nov 30, 2024', progress: 30, assignees: [{ image: 'assets/images/avatar1.png' }, { image: 'assets/images/avatar1.png' }, { image: 'assets/images/avatar1.png' }], remainingAssignees: 1, status: 'On Hold', statusSeverity: 'secondary' },
      { id: 5, title: 'Data Analytics Platform', category: 'Business Intelligence', client: 'Analytics Pro', dueDate: 'Jan 15, 2025', progress: 60, assignees: [{ image: 'assets/images/avatar1.png' }, { image: 'assets/images/avatar1.png' }, { image: 'assets/images/avatar1.png' }], remainingAssignees: 3, status: 'In Progress', statusSeverity: 'warn' },
      { id: 6, title: 'Security Audit', category: 'Cybersecurity', client: 'SecureNet Inc', dueDate: 'Oct 15, 2024', progress: 100, assignees: [{ image: 'assets/images/avatar1.png' }, { image: 'assets/images/avatar1.png' }, { image: 'assets/images/avatar1.png' }], status: 'Completed', statusSeverity: 'success' },
    ];
    // IMPORTANT: Create dummy avatar image files in your assets folder (e.g., assets/images/avatar1.png)
    // or use initials: assignees: [{ label: 'AV' }, { label: 'BS' }] etc.
  }

  /**
   * Generates unique client options for the dropdown.
   * @param projects - The full list of projects.
   * @returns An array of SelectItem for the client dropdown.
   */
  generateClientOptions(projects: ProjectCard[]): SelectItem[] {
    // Get unique client names
    const uniqueClients = [...new Set(projects.map(p => p.client))];
    // Create SelectItem objects
    const clientItems = uniqueClients.map(client => ({ label: client, value: client }));
    // Add "All Clients" option at the beginning
    return [{ label: 'All Clients', value: null }, ...clientItems];
  }

  /**
   * Filters the displayed projects based on current search term,
   * selected status, and selected client.
   */
  filterProjects(): void {
    let projectsToFilter = [...this.allProjects]; // Start with the full list

    // Apply search term filter (case-insensitive)
    if (this.searchTerm) {
      const lowerSearchTerm = this.searchTerm.toLowerCase();
      projectsToFilter = projectsToFilter.filter(project =>
        project.title.toLowerCase().includes(lowerSearchTerm) ||
        project.category.toLowerCase().includes(lowerSearchTerm)
        // Add || project.client.toLowerCase().includes(lowerSearchTerm) if needed
      );
    }

    // Apply status filter
    if (this.selectedStatus) {
      projectsToFilter = projectsToFilter.filter(project => project.status === this.selectedStatus);
    }

    // Apply client filter
    if (this.selectedClient) {
      projectsToFilter = projectsToFilter.filter(project => project.client === this.selectedClient);
    }

    this.filteredProjects = projectsToFilter; // Update the displayed list
  }

}