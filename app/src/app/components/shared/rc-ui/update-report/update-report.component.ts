import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { DialogModule } from 'primeng/dialog';
import { TooltipModule } from 'primeng/tooltip';
import { ButtonModule } from 'primeng/button';
import { RCReport } from '../../../../models/report.model';
import { ReportStatus } from '../../../../enums/report-status.enum';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { UserAvatarComponent } from "../../shared-ui/user-avatar/user-avatar.component";
import { UserUtils } from '../../../../utilities/UserUtils';
import { format, Locale } from 'date-fns';
import { LanguageService, SupportedLanguage } from '../../../../services/language/language.service';
import { es, fr } from 'date-fns/locale';

@Component({
  selector: 'app-update-report',
  templateUrl: './update-report.component.html',
  styleUrl: './update-report.component.css',
  imports: [
    DialogModule,
    AvatarModule,
    CommonModule,
    TranslateModule,
    ButtonModule,
    TooltipModule,
    UserAvatarComponent
]
})
export class UpdateReportComponent implements OnInit {
formatDate(date: string) {
       const lang=this.getDateLang()
return (lang)?format(date, 'MMM d, yyyy',{locale:lang}):format(date, 'MMM d, yyyy')
}
  getDateLang():Locale|null{
    if(this.currentLanguage=='fr') return fr
    else if(this.currentLanguage=='es') return es
    return null
  }

  @Input() report :RCReport |null=null
  @Input() visible :boolean=false

  @Output() updateReport=new EventEmitter<RCReport>()
  @Output() visibleChange=new EventEmitter<boolean>()

currentLanguage: SupportedLanguage = 'en';
  userUtils = UserUtils;
  reportStatus = ReportStatus;
constructor(private translate: TranslateService,private languageService:LanguageService) {}

ngOnInit() {
     this.languageService.currentLanguage$.subscribe(lang => {
      this.currentLanguage = lang;
    });

}

closeReportModal() {
  this.visible = false; // Close the dialog
  this.visibleChange.emit(false); // Emit the visibility change
}

updateReportStatus(status:ReportStatus) {
  // Emit the update event with the new status
  if (this.report) {
    this.report.status = status; // Update local status
    this.updateReport.emit(this.report);
    this.closeReportModal(); // Close dialog after update
  }
}

  getStatusClass(status: ReportStatus): string {
    // Updated classes to match the orange theme
    switch (status) {
      case ReportStatus.ACCEPTED: return 'bg-green-100 text-green-700 border border-green-200'; 
      case ReportStatus.PENDING: return 'bg-orange-100 text-orange-700 border border-orange-200';
      case ReportStatus.OPENED: return 'bg-orange-100 text-orange-700 border border-orange-200';
      case ReportStatus.REJECTED: return 'bg-red-100 text-red-700 border border-red-200';
      default: return 'bg-gray-100 text-gray-700 border border-gray-200';
    }
  }
  
  /**
   * Gets the translated status label from translation keys
   * @param status The status enum value
   * @returns Translated status text
   */
  getTranslatedStatus(status: ReportStatus): string {
    if (!status) return '';
    
    const statusKey = status.toString().toLowerCase();
    return this.translate.instant(`report_rc.statusTypes.${statusKey}`);
  }
  

}
