import { Injectable } from '@angular/core';
import { ListItem } from '../components/rc/calendar/calendar.component';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { ResponseWrapperDto } from '../dto/response-wrapper.dto';
export interface FactoryListItem{
  factoryId:string,
  label:string
}

@Injectable()
export class FactoryService {

  private readonly rcApiUrl=environment.apiUrl+'/user/rc/factories'
  constructor(private http:HttpClient) { }
  getFactoryList():Observable<FactoryListItem[]>{
    const url = this.rcApiUrl

      return this.http.get<ResponseWrapperDto<FactoryListItem[]>>(url).pipe(

        map((response)=>{
           return response.data as FactoryListItem[]
        })
      )
   
    
  }
}
