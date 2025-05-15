import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpClient, HttpParams } from "@angular/common/http";
import { ResponseWrapperDto } from "../dto/response-wrapper.dto";
import { map, Observable, throwError } from "rxjs";

export interface ClientListItem{
  clientId:string,
  label:string
}
@Injectable()
export class ClientService {
  readonly rcApiUrl=environment.apiUrl+'/user/rc/clients'
  constructor(private http:HttpClient) { }
    getClientListByLabel (label:string=''):Observable<ClientListItem[]>{
const url =this.rcApiUrl+'/byLabel'
const params =new HttpParams().
set('label',label);

return this.http.get<ResponseWrapperDto<ClientListItem[]>>(url,{params}).pipe(
  map((response)=>{
  return response.data as ClientListItem[]
    
  })
)
          
       
    }


}