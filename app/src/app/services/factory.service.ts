import { Injectable } from '@angular/core';
import { ListItem } from '../components/rc/calendar/calendar.component';

@Injectable()
export class FactoryService {

  constructor() { }

  getFactoryList():ListItem[]{
        const tempFactories: ListItem[] = [];
        const factoryLocations = ['North', 'South', 'East', 'West', 'Central', 'Metro', 'Coastal', 'Mountain', 'Valley', 'Island'];
        for (let i = 1; i <= 10; i++) {
          tempFactories.push({
            id: `FCT-${factoryLocations[i-1].substring(0, 3).toUpperCase()}`,
           name: `${factoryLocations[i-1]} Sector Factory`
          });
        }
        return tempFactories;
  }
}
