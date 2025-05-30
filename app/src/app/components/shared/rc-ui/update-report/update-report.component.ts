import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { DialogModule } from 'primeng/dialog';
import { RCReport } from '../../../../models/report.model';
import { ReportStatus } from '../../../../enums/report-status.enum';
import { CommonModule } from '@angular/common';
import { UserAvatarComponent } from "../../shared-ui/user-avatar/user-avatar.component";
import { UserUtils } from '../../../../utilities/UserUtils';

@Component({
  selector: 'app-update-report',
  templateUrl: './update-report.component.html',
  styleUrl: './update-report.component.css',
  imports: [
    DialogModule,
    AvatarModule,
    CommonModule,
    UserAvatarComponent
]
})
export class UpdateReportComponent {


  @Input() report :RCReport |null=null
  @Input() visible :boolean=false

  @Output() updateReport=new EventEmitter<ReportStatus>()
  @Output() visibleChange=new EventEmitter<boolean>()


  userUtils=UserUtils
reportStatus = ReportStatus;
closeReportModal() {
  this.visibleChange.next(false)

}
updateReportStatus(status:ReportStatus) {

  this.updateReport.next(status)

}
    getStatusClass(status: ReportStatus): string {
      // CSS classes remain the same
  
      switch (status) {
        case ReportStatus.ACCEPTED: return 'bg-green-100 text-green-700 border border-green-200'; // Added border for definition
        case ReportStatus.PENDING: return 'bg-blue-100 text-blue-700 border border-blue-200';
        case ReportStatus.OPENED: return 'bg-blue-100 text-blue-700 border border-blue-200'; // Added border
        case ReportStatus.REJECTED: return 'bg-yellow-100 text-yellow-700 border border-yellow-200'; // Added border
        default: return 'bg-gray-100 text-gray-700 border border-gray-200'; // Added border
      }
    }
  
    getStatusBgColor(status: ReportStatus): string {
      switch (status) {
        case ReportStatus.ACCEPTED: return '#ccf0e0'; // Light green
        case ReportStatus.PENDING: return '#ccd5f0'; // Light blue
        case ReportStatus.OPENED: return '#ccd5f0'; // Light blue
        case ReportStatus.REJECTED: return '#f4f5e6'; // Light yellow
        default: return '#f1f1f1'; // Light gray
      }
    }
  
    getStatusTextColor(status: ReportStatus): string {
      switch (status) {
        case ReportStatus.ACCEPTED: return '#0da669'; // Green
        case ReportStatus.PENDING: return '#0d33a6'; // Blue
        case ReportStatus.OPENED: return '#0d33a6'; // Blue
        case ReportStatus.REJECTED: return '#a3a60d'; // Yellow
        default: return '#707070'; // Gray
      }
    }
}
