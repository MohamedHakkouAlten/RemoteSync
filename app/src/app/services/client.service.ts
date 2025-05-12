import { Injectable } from "@angular/core";
import { ListItem } from "../components/rc/calendar/calendar.component";


@Injectable()
export class ClientService {

    getClientList ():ListItem[]{
            const tempClients: ListItem[] = [];
            for (let i = 1; i <= 10; i++) {
              tempClients.push({
                id: `CL-${i.toString().padStart(3, '0')}`,
                name: `Client Name ${i}`
              });
            }
            return tempClients;
    }


}