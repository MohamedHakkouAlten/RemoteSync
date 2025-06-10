import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AvatarModule } from 'primeng/avatar';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { Project } from '../../../../models/project.model';
import { ProjectStatus } from '../../../../enums/project-status.enum';
import { ProgressBarModule } from 'primeng/progressbar';
import { differenceInDays } from 'date-fns';
import { ProjectStatusSeverity } from '../project.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../../../services/language/language.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-view-project',
  imports: [ 
    CommonModule,
    FormsModule,
    DialogModule,
    AvatarModule,
    TagModule,
    ProgressBarModule,
    TranslateModule
  ],
  templateUrl: './view-project.component.html',
  styleUrl: './view-project.component.css'
})
export class ViewProjectComponent implements OnInit, OnChanges {

   @Input() displayViewProjectDialog: boolean = false;
   @Input() projectToView: Project | null = null;

   @Output() hideDialog=new EventEmitter<boolean>(false)
   
   constructor(
     private translateService: TranslateService,
     private languageService: LanguageService
   ) {}
   
   ngOnInit(): void {
     // Ensure translations are loaded on component initialization
     this.refreshTranslations();
     
     // Subscribe to language changes to refresh translations
     this.languageService.currentLanguage$.subscribe(lang => {
       this.refreshTranslations();
     });
   }

   ngOnChanges(changes: SimpleChanges): void {
     // If the dialog becomes visible or project changes, ensure translations are fresh
     if (changes['projectToView'] || 
         (changes['displayViewProjectDialog'] && changes['displayViewProjectDialog'].currentValue === true)) {
       this.refreshTranslations();
     }
   }
   
   private refreshTranslations(): void {
     const currentLang = this.languageService.getCurrentLanguage();
     this.translateService.use(currentLang).pipe(take(1)).subscribe(() => {
       console.log(`ViewProject component translations refreshed for ${currentLang}`);
     });
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
            case ProjectStatus.ACTIVE   : return 'warn'; // Changed from 'info' to 'warn' for orange theme
            case ProjectStatus.INACTIVE : return 'warn';
            case ProjectStatus.COMPLETED: return 'success';
            case ProjectStatus.CANCELLED: return 'danger';
            default: return 'warn'; // Default to orange theme
        }
    }
    
    getTranslatedStatus(status: string): string {
        const key = `project_rc.statusTypes.${status.toLowerCase()}`;
        const translation = this.translateService.instant(key);
        // Return the translation if found, otherwise return capitalized status
        return translation !== key ? translation : status.charAt(0) + status.slice(1).toLowerCase();
    }
}
