import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AvatarModule } from 'primeng/avatar';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { Project } from '../../../../models/project.model';
import { ProjectStatus } from '../../../../enums/project-status.enum';
import { ProgressBarModule } from 'primeng/progressbar';
import { differenceInDays } from 'date-fns';
import { ProjectStatusSeverity } from '../project.component';

@Component({
  selector: 'app-view-project',
  imports: [ 
    
    CommonModule,
    FormsModule,
    DialogModule,
    AvatarModule,
    TagModule,
     ProgressBarModule,
  ],
  templateUrl: './view-project.component.html',
  styleUrl: './view-project.component.css'
})
export class ViewProjectComponent  {

   @Input() displayViewProjectDialog: boolean = false;
   @Input()  projectToView: Project | null = null;

   @Output() hideDialog=new EventEmitter<boolean>(false)
   
   getProgressValue():number{
       const totalDifference = differenceInDays(this.projectToView!.deadLine!,this.projectToView!.startDate!);
          const progressDifference = differenceInDays(new Date(), this.projectToView!.startDate!);
          console.log( totalDifference ,progressDifference)
        return (progressDifference / totalDifference) * 100;
   }
onHideDialog(){

this.hideDialog.emit(true)
}
    getStatusSeverity(status: ProjectStatus): ProjectStatusSeverity {
        switch (status) {
            case  ProjectStatus.ACTIVE   : return 'info';
            case  ProjectStatus.INACTIVE : return 'warn';
            case  ProjectStatus.COMPLETED: return 'success';
            case  ProjectStatus.CANCELLED: return 'danger';
            default: return 'info';
        }
    }
}
