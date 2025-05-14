import { Injectable } from '@angular/core';
import { ListItem } from '../components/rc/calendar/calendar.component';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { ResponseWrapperDto } from '../dto/response-wrapper.dto';
export interface SubFactoryListItem{
  subFactoryID:string,
  label:string
}

@Injectable()
export class SubfactoryService {

  private readonly rcApiUrl=environment.apiUrl+'/user/rc/subFactories'
   constructor(private http:HttpClient) { }
   getSubFactoryList():Observable<SubFactoryListItem[]>{
     const url = this.rcApiUrl
 
       return this.http.get<ResponseWrapperDto<SubFactoryListItem[]>>(url).pipe(
 
         map((response)=>{
            return response.data as SubFactoryListItem[]
         })
       )
    
     
   }
}
