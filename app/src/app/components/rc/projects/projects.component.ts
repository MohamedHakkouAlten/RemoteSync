
import { Component, OnInit, ViewChild } from '@angular/core';
import { Table } from 'primeng/table'; 

interface TeamMember { id: number; name: string; avatar: string; }
interface Project { id: number; name: string; rcName: string; rcAvatar: string; teamMembers: TeamMember[]; duration: string; status: 'In Progress' | 'Upcoming' | 'Completed'; }


type ProjectStatusSeverity = 'info' | 'warn' | 'success';


@Component({
  selector: 'app-projects',
  standalone: false,
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
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

  constructor() { }

  ngOnInit(): void {
    this.loading = true; 
    this.allProjects = this.getMockProjects();
    this.calculateSummaryStats();
    this.loading = false; 
  }

  getMockProjects(): Project[] {
    const avatarBase = 'https://api.dicebear.com/8.x/pixel-art/svg?seed=';
    return [
        { id: 1, name: 'Marketing Campaign 2024', rcName: 'Karim Benjelloun', rcAvatar: `${avatarBase}Karim.svg`, teamMembers: [{id: 101, name:'A', avatar: `${avatarBase}Alice.svg`}, {id: 102, name:'B', avatar: `${avatarBase}Bob.svg`}, {id: 103, name:'C', avatar: `${avatarBase}Charlie.svg`}], duration: 'Jan 15 - Mar 30', status: 'In Progress' },
        { id: 2, name: 'Website Redesign', rcName: 'Nadia Tazi', rcAvatar: `${avatarBase}Nadia.svg`, teamMembers: [{id: 104, name:'D', avatar: `${avatarBase}David.svg`}, {id: 105, name:'E', avatar: `${avatarBase}Eve.svg`}, {id: 106, name:'F', avatar: `${avatarBase}Frank.svg`}], duration: 'Feb 1 - Apr 15', status: 'Upcoming' },
        { id: 3, name: 'Mobile App Launch', rcName: 'Youssef El Amrani', rcAvatar: `${avatarBase}Youssef.svg`, teamMembers: [{id: 107, name:'G', avatar: `${avatarBase}Grace.svg`}, {id: 108, name:'H', avatar: `${avatarBase}Heidi.svg`}, {id: 109, name:'I', avatar: `${avatarBase}Ivy.svg`}, {id: 110, name:'J', avatar: `${avatarBase}Judy.svg`}, {id: 111, name:'K', avatar: `${avatarBase}Kevin.svg`}], duration: 'Dec 1 - Jan 30', status: 'Completed' },
        { id: 4, name: 'Data Analytics Platform', rcName: 'Amina Bouazza', rcAvatar: `${avatarBase}Amina.svg`, teamMembers: [{id: 112, name:'L', avatar: `${avatarBase}Liam.svg`}, {id: 113, name:'M', avatar: `${avatarBase}Mia.svg`}], duration: 'Mar 1 - Jun 30', status: 'In Progress' },
        { id: 5, name: 'Customer Portal Update', rcName: 'Hamza El Fassi', rcAvatar: `${avatarBase}Hamza.svg`, teamMembers: [{id: 114, name:'N', avatar: `${avatarBase}Noah.svg`}, {id: 115, name:'O', avatar: `${avatarBase}Olivia.svg`}, {id: 116, name:'P', avatar: `${avatarBase}Paul.svg`}, {id: 117, name:'Q', avatar: `${avatarBase}Quinn.svg`}], duration: 'Apr 15 - May 30', status: 'Upcoming' },
    ];
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
    console.log('Filters button clicked');
  
  }

  onNewProjectClick(): void {
    console.log('New Project button clicked');
    
  }

  editProject(project: Project): void {
    console.log('Edit project:', project.id);
  }

  viewProject(project: Project): void {
    console.log('View project:', project.id);
  }

  deleteProject(project: Project): void {
    console.log('Delete project:', project.id);
    
  }
}