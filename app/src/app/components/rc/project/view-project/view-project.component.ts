import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AvatarModule } from 'primeng/avatar';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { Project } from '../../../../models/project.model';
import { ProjectStatus } from '../../../../enums/project-status.enum';
import { ProgressBarModule } from 'primeng/progressbar';
import { differenceInDays, format, Locale } from 'date-fns';
import { ProjectStatusSeverity } from '../project.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageService, SupportedLanguage } from '../../../../services/language/language.service';


import { take } from 'rxjs/operators';
import { es, fr } from 'date-fns/locale';

@Component({
  selector: 'app-view-project',
  imports: [

    CommonModule,
    FormsModule,
    DialogModule,
    AvatarModule,
    TagModule,
    TranslateModule,
     ProgressBarModule,
  ],
  providers:[
    TranslateService,
    LanguageService
  ],
  templateUrl: './view-project.component.html',
  styleUrl: './view-project.component.css'
})
export class ViewProjectComponent  implements OnInit{

   @Input() displayViewProjectDialog: boolean = false;
   @Input()  projectToView: Project | null = null;

   @Output() hideDialog=new EventEmitter<boolean>(false)
   currentLanguage: SupportedLanguage = 'en';
   constructor(private translateService:TranslateService,
    private languageService:LanguageService
   ){

   }
  ngOnInit(): void {

   this.languageService.currentLanguage$.subscribe(lang => {
      this.currentLanguage = lang;

    });
  }
  formatDate(date: string) {
         const lang=this.getDateLang()
  return (lang)?format(date, 'MMM d, yyyy',{locale:lang}):format(date, 'MMM d, yyyy')
  }
    getDateLang():Locale|null{
      if(this.currentLanguage=='fr') return fr
      else if(this.currentLanguage=='es') return es
      return null
    }
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

    getTranslatedStatus(status: string): string {
        const key = `project_rc.statusTypes.${status.toLowerCase()}`;
        const translation = this.translateService.instant(key);
        // Return the translation if found, otherwise return capitalized status
        return translation !== key ? translation : status.charAt(0) + status.slice(1).toLowerCase();
    }
}
