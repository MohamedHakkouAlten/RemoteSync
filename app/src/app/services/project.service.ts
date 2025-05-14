import { Injectable } from '@angular/core';
import { ListItem } from '../components/rc/calendar/calendar.component';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ResponseWrapperDto } from '../dto/response-wrapper.dto';
export interface ProjectListItem{
  projectId:string,
  label:string
}

@Injectable()
export class ProjectService {
  private readonly rcApiUrl=environment.apiUrl+'/user/rc/projects'
  constructor(private http:HttpClient) { }
  getProjectList(label:string=''):Observable<ProjectListItem[]>{
    const url = this.rcApiUrl+'/byLabel';
    const params = new HttpParams()
      .set('label', label)

      return this.http.get<ResponseWrapperDto<ProjectListItem[]>>(url,{params}).pipe(

        map((response)=>{
           return response.data as ProjectListItem[]
        })
      )
   
    
  }
}
