import { Injectable } from '@angular/core';
import { ListItem } from '../components/rc/calendar/calendar.component';

@Injectable()
export class SubfactoryService {

  constructor() { }
  getSubFactoryList():ListItem[]{
    const tempSubFactories: ListItem[] = [];
    // Ensure factorys signal has been set if needed for ID generation,
    // but using the temp array directly is safer here if synchronous.
    
    for (let i = 1; i <= 10; i++) {
      const mainFactoryIndex = Math.floor((i - 1) / 2);
      // Check bounds if needed
   
          tempSubFactories.push({
            id: `${i}-Sub${i % 2 === 1 ? 'A' : 'B'}`,
            value: `Sub-Assembly Unit ${String.fromCharCode(64 + i)}`
          });
       
    }
    return tempSubFactories;
  }
}
