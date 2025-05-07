import { Injectable } from '@angular/core';
import { ListItem } from '../components/rc/calendar/calendar.component';

@Injectable()
export class ProjectService {

  constructor() { }
  getProjectList():ListItem[]{
        const tempProjects: ListItem[] = [];
        const projectNames = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta', 'Iota', 'Kappa'];
        for (let i = 0; i < 10; i++) {
          tempProjects.push({
            id: 1000 + i,
            value: `Project ${projectNames[i]}`
          });
        }
        return tempProjects;
  }
}
