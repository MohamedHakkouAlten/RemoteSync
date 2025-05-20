import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { PagedData, PagedReports, ResponseWrapperDto } from '../dto/response-wrapper.dto';
import { RCReport } from '../models/report.model';
import { ReportStatus } from '../enums/report-status.enum';


@Injectable()
export class ReportService {
  private readonly rcApiUrl=environment.apiUrl+'/user/rc/reports'
  constructor(private http:HttpClient) { }
  getReports(pageNumber:number=0,pageSize:number=6):Observable<PagedReports>{
    const url = this.rcApiUrl;

    const params=new HttpParams()
    .set('pageNumber',pageNumber)
    .set('pageSize',pageSize)
      return this.http.get<ResponseWrapperDto<PagedReports>>(url,{params}).pipe(

        map((response)=>{
           return response.data as PagedReports
        })
      )
   
    
  }
    getReportsByStatus(pageNumber:number=0,pageSize:number=9,status:string):Observable<PagedReports>{
    const url = this.rcApiUrl+'/byStatus';

    const params=new HttpParams()
    .set('pageNumber',pageNumber)
    .set('pageSize',pageSize)
    .set('status',status)
      return this.http.get<ResponseWrapperDto<PagedReports>>(url,{params}).pipe(

        map((response)=>{
           return response.data as PagedReports
        })
      )
   
  }
      getReportsByName(pageNumber:number=0,pageSize:number=9,name:string):Observable<PagedReports>{
    const url = this.rcApiUrl+'/byName';

    const params=new HttpParams()
    .set('pageNumber',pageNumber)
    .set('pageSize',pageSize)
    .set('name',name)
      return this.http.get<ResponseWrapperDto<PagedReports>>(url,{params}).pipe(

        map((response)=>{
           return response.data as PagedReports
        })
      )
   
  }
  updateReport(reportId:string,status:ReportStatus):Observable<boolean>{
     const url = this.rcApiUrl+'/update';
    const requestBody = {
      reportId: reportId,
      status: status
    };
    return this.http.put<ResponseWrapperDto<string>>(url,requestBody).pipe(
      map((response)=>response.status=='success'?true:false),
      catchError((err)=>{
        console.log(err)
        if(err instanceof HttpErrorResponse){
      return  throwError(()=>new Error(err.error.message))
      }
      return throwError(()=>new Error(err))
      })
    )
  
  }
      getReportsByDateRange(pageNumber:number=0,pageSize:number=9,startDate:string,endDate:string):Observable<PagedReports>{
    const url = this.rcApiUrl+'/byDateRange';

    const params=new HttpParams()
    .set('pageNumber',pageNumber)
    .set('pageSize',pageSize)
    .set('startDate',startDate)
    .set('endDate',endDate)
      return this.http.get<ResponseWrapperDto<PagedReports>>(url,{params}).pipe(

        map((response)=>{
           return response.data as PagedReports
        })
      )
   
    
  }
}
