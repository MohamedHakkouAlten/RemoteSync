import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AutoCompleteCompleteEvent, AutoCompleteModule } from 'primeng/autocomplete';
import { AvatarModule } from 'primeng/avatar';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { ProjectStatus } from '../../../../enums/project-status.enum';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { Project } from '../../../../models/project.model';
import { SelectOption } from '../project.component';
import { InputTextModule } from 'primeng/inputtext';
import { RcService } from '../../../../services/rc.service';
import { ClientDropDownDTO } from '../../../../dto/rc/client-dropdown.dto';
import { TranslateModule, TranslateService } from '@ngx-translate/core';


import { debounceTime, distinctUntilChanged, Subject, switchMap, take } from 'rxjs';


@Component({
  selector: 'app-add-project',
    providers :[
      RcService,TranslateService
    ],
  imports: [   
      CommonModule,
      DialogModule,
      DropdownModule,
      CalendarModule,
      AvatarModule,
      ButtonModule,
      InputTextModule,
      FormsModule,
      AutoCompleteModule,
      TranslateModule],
  templateUrl: './add-project.component.html',
  styleUrl: './add-project.component.css'
})
export class AddProjectComponent implements OnInit{
@Input() displayCreateProjectDialog: boolean = false;

@Output() hideDialog=new EventEmitter<boolean>(false)
@Output() saveProject=new EventEmitter<Project>()

searchClientSubject$=new Subject<string>
searchItem:string=''
clients: ClientDropDownDTO[] = []
  initialClients: ClientDropDownDTO[] = []
  newProjectTitle: string = '';
  
  newProjectLabel: string = '';
  newProjectStatus: ProjectStatus | null = null;
  newProjectDeadline: string | null = null;
  newProjectStartDate: string | null = null;
  newProjectClient: string | null = null; 
  constructor(private rcService:RcService,private translateService:TranslateService)
  {

  }
  ngOnInit(): void {
    this.setStatusOptions()
      
     this.translateService.onLangChange
      .pipe(take(1)) // Use takeUntil for proper unsubscription
      .subscribe(() => {
        console.log('Language changed, re-initializing status options.');
        this.setStatusOptions()
      });

   this.setupDebouncing()
   this.rcService.getClientListByLabel().subscribe((res: ClientDropDownDTO[]) => this.initialClients = res)
    

   
  }

setStatusOptions(){
 const translationKeys = [
     "project_rc.statusTypes.active",

     "project_rc.statusTypes.inactive",

   ];
 
   // Get the translations asynchronously
   this.translateService.get(translationKeys).pipe(
     take(1) // Take only one emission and complete
   ).subscribe(translations => {
    console.log("transssss"+translations["project_rc.statusTypes.active"])
     this.projectStatusOptions= [
       { label: translations["project_rc.statusTypes.active"], value: ProjectStatus.ACTIVE },
       { label: translations["project_rc.statusTypes.inactive"], value: ProjectStatus.INACTIVE },
 
     ];

   });
}
    projectStatusOptions: SelectOption[] = [];
setupDebouncing(){
  this.searchClientSubject$.pipe(
    debounceTime(1000),
    distinctUntilChanged(),
    switchMap((searchItem: string) => this.rcService.getClientListByLabel(searchItem))
    ).subscribe((res: ClientDropDownDTO[]) => this.clients = res)
}
  
  searchClient($event: AutoCompleteCompleteEvent) {
    
    const query=$event.query
   console.log(!query)
  if(!query) this.clients=[...this.initialClients]
  else this.searchClientSubject$.next(query)
  console.log(this.clients)
  }
  
  
  
  selectedClient: ClientDropDownDTO | null = null

onHideDialog(){
this.hideDialog.emit(true)
}
saveNewProject(){
this.saveProject.emit({clientId:this.selectedClient?.clientId,startDate:this.newProjectStartDate!,deadLine:this.newProjectDeadline!,titre:this.newProjectTitle,label:this.newProjectLabel,status:this.newProjectStatus!})
}
}
