
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
import { RcService } from '../../../../services/rc.service';
import { ClientDropDownDTO } from '../../../../dto/rc/client-dropdown.dto';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { debounceTime, distinctUntilChanged, Subject, switchMap, take } from 'rxjs';

@Component({
  selector: 'app-edit-project',
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
  templateUrl: './edit-project.component.html',
  styleUrl: './edit-project.component.css'
})
export class EditProjectComponent implements OnInit ,OnChanges{

initialClients: ClientDropDownDTO[] = []
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
selectedClient: ClientDropDownDTO | null = null

  clients: ClientDropDownDTO[] = []
  @Input() displayEditProjectDialog: boolean = false;
  @Output() hideDialog=new EventEmitter<boolean>(false)
  @Output() editeProject=new EventEmitter<Project>()
  constructor(private rcService:RcService,private translateService:TranslateService)
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
   this.rcService.getClientListByLabel().subscribe((res: ClientDropDownDTO[]) => this.initialClients = res)
    this.selectedClient={clientId:this.projectToEdit?.owner!.clientId!,label:this.projectToEdit?.owner!.label!};   
        this.initStatusOptions()
      
     this.translateService.onLangChange
      .pipe(take(1)) // Use takeUntil for proper unsubscription
      .subscribe(() => {
        console.log('Language changed, re-initializing status options.');
        this.initStatusOptions()
      });

  }
setupDebouncing(){
  this.searchClientSubject$.pipe(
    debounceTime(1000),
    distinctUntilChanged(),
    switchMap((searchItem: string) => this.rcService.getClientListByLabel(searchItem))
    ).subscribe((res: ClientDropDownDTO[]) => this.clients = res)
}
  
  private initStatusOptions(): void {
      
  const translationKeys = [
      "project_rc.statusTypes.active",
      "project_rc.statusTypes.completed",
      "project_rc.statusTypes.inactive",
      "project_rc.statusTypes.cancelled"
    ];
  
    // Get the translations asynchronously
    this.translateService.get(translationKeys).pipe(
      take(1) // Take only one emission and complete
    ).subscribe(translations => {
      this.projectStatusOptions = [
        { label: translations["project_rc.statusTypes.active"], value: ProjectStatus.ACTIVE },
        { label: translations["project_rc.statusTypes.completed"], value: ProjectStatus.COMPLETED },
        { label: translations["project_rc.statusTypes.inactive"], value: ProjectStatus.INACTIVE },
        { label: translations["project_rc.statusTypes.cancelled"], value: ProjectStatus.CANCELLED }
      ];
      console.log('Status options initialized with translations:');
    });
  
    }

 

    projectStatusOptions: SelectOption[] = []


onHideDialog(){
this.hideDialog.emit(true)
}
updateProject() {

this.projectToEdit={...this.projectToEdit!,clientId:this.selectedClient!.clientId}

this.editeProject.emit(this.projectToEdit!)
}
}
