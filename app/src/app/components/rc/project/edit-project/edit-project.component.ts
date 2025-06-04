
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { AutoCompleteCompleteEvent, AutoCompleteModule, AutoCompleteSelectEvent } from 'primeng/autocomplete';
import { AvatarModule } from 'primeng/avatar';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { ProjectStatus } from '../../../../enums/project-status.enum';
import { FormsModule } from '@angular/forms';
import { User } from '../../../../models/user.model';
import { ButtonModule } from 'primeng/button';
import { Project } from '../../../../models/project.model';
import { SelectOption } from '../project.component';
import { InputTextModule } from 'primeng/inputtext';
import { ClientListItem, RcService } from '../../../../services/rc.service';

import { debounceTime, distinctUntilChanged, Subject, switchMap } from 'rxjs';

@Component({
  selector: 'app-edit-project',
  providers :[
    RcService
  ],
  imports: [ CommonModule,
    DialogModule,
          DropdownModule,
          CalendarModule,
          AvatarModule,
          DropdownModule,
          ButtonModule,
          InputTextModule,
           FormsModule,
          AutoCompleteModule],
  templateUrl: './edit-project.component.html',
  styleUrl: './edit-project.component.css'
})
export class EditProjectComponent implements OnInit ,OnChanges{

initialClients:ClientListItem[]=[]
searchClientSubject$=new Subject<string>
searchItem:string=''
today=new Date()
maxDate:Date|null=null
searchClient($event: AutoCompleteCompleteEvent) {
  
  const query=$event.query
 console.log(!query)
if(!query) this.clients=[...this.initialClients]
else this.searchClientSubject$.next(query)
console.log(this.clients)
}


  @Input() projectToEdit: Project | null = null;
selectedClient:ClientListItem|null=null

  clients: ClientListItem[] = []
  @Input() displayEditProjectDialog: boolean = false;
  @Output() hideDialog=new EventEmitter<boolean>(false)
  @Output() editeProject=new EventEmitter<Project>()
  constructor(private rcService:RcService)
  {

  }
  ngOnChanges(changes: SimpleChanges): void {
      if (changes['projectToEdit']) {
      const currentProject = changes['projectToEdit'].currentValue;
   
      if (currentProject && currentProject.owner) {
        this.maxDate=new Date(currentProject.deadLine)
        console.log(this.maxDate)
        this.selectedClient = {
          clientId: currentProject.owner.clientId,
          label: currentProject.owner.label
        };
        console.log('selectedClient updated in ngOnChanges:', this.selectedClient);
      }
    }
  }
  ngOnInit(): void {
   this.setupDebouncing()
   this.rcService.getClientListByLabel().subscribe((res)=>this.initialClients=res)
    this.selectedClient={clientId:this.projectToEdit?.owner!.clientId!,label:this.projectToEdit?.owner!.label!};   
    console.log(this.projectToEdit)
  }
setupDebouncing(){
  this.searchClientSubject$.pipe(
    debounceTime(1000),
    distinctUntilChanged(),
    switchMap(searchItem=>this.rcService.getClientListByLabel(searchItem))
    ).subscribe(res=>this.clients=res)
}
  
  

 

    projectStatusOptions: SelectOption[] = [
        { label: 'Select Status', value: null },
        { label: 'Active', value: ProjectStatus.ACTIVE },
        { label: 'InActive', value: ProjectStatus.INACTIVE},
        { label: 'Completed', value: ProjectStatus.COMPLETED },
         { label: 'Cancelled', value: ProjectStatus.CANCELLED }
    ];


onHideDialog(){
this.hideDialog.emit(true)
}
updateProject() {

this.projectToEdit={...this.projectToEdit!,clientId:this.selectedClient!.clientId}

this.editeProject.emit(this.projectToEdit!)
}
}
