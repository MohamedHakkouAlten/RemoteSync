import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpClient, HttpParams } from "@angular/common/http";
import { ResponseWrapperDto } from "../dto/response-wrapper.dto";
import { map, Observable } from "rxjs";
import { DashBoardDataDTO } from "../dto/rc/dashboardDataDTO";


@Injectable()
export class DashBoardService {
  readonly rcApiUrl=environment.apiUrl+'/user/rc'
  constructor(private http:HttpClient) { }
    getDashBoardData ():Observable<DashBoardDataDTO>{
const url =this.rcApiUrl+'/dashboard'


return this.http.get<ResponseWrapperDto<DashBoardDataDTO>>(url).pipe(
  map((response)=>{
  return response.data as DashBoardDataDTO
    
  })
)
          
       
    }


}