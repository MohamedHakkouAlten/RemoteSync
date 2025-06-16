import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { CreateAssociateReportDTO } from '../../../../dto/create-associate-report.dto';
import { AssociateService } from '../../../../services/associate.service';

@Component({
  selector: 'app-add-report',
  imports: [DialogModule,TranslateModule,InputTextModule,  CommonModule,
    FormsModule, ButtonModule,
    ReactiveFormsModule,],
    providers:[MessageService,AssociateService,FormBuilder,TranslateService],

  templateUrl: './add-report.component.html',
  styleUrl: './add-report.component.css'
})
export class AddReportComponent implements OnInit {
hideCreateDialog() {
this.cancelEvent.emit(false)
}
@Input() displayCreateDialog :boolean=false
@Output() cancelEvent =new EventEmitter(false)
@Output() saveEvent =new EventEmitter(false)
formSubmitted=false
  reportForm!: FormGroup;
    isFieldInvalid(fieldName: string): boolean {
    const field = this.reportForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched || this.formSubmitted));
  }
    // Initialize form with validation
  // Initialize form with validation
  private initReportForm(): void {
    this.reportForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(255)]],
      reason: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(500)]],
      type: ['REQUEST_ROTATION', Validators.required],
      description: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(500)]],// Optional field
    });
  }
constructor(private messageService:MessageService,private translateService:TranslateService,private associateService:AssociateService, private fb: FormBuilder){}
  ngOnInit(): void {
   this.initReportForm()
   console.log("test"+this.displayCreateDialog)
  }
  // Helper method to get field error message
  getFieldErrorMessage(fieldName: string): string {
    const field = this.reportForm.get(fieldName);
    if (!field) return '';

    if (field.errors?.['required']) {
      return 'This field is required';
    }
    if (field.errors?.['minlength']) {
      return `Minimum length is ${field.errors['minlength'].requiredLength} characters`;
    }
    if (field.errors?.['maxlength']) {
      return `Maximum length is ${field.errors['maxlength'].requiredLength} characters`;
    }

    return '';
  }
   saveNewReport(): void {
      this.formSubmitted = true;
  
      if (this.reportForm.invalid) {
        // Form is invalid - focus on the first invalid field and show validation errors
     this.messageService.add({
      severity: 'error',
      // Use translation keys for summary and detail
      summary: this.translateService.instant('error.validation.summary'),
      detail: this.translateService.instant('error.validation.detail')
    });
        return;
      }
  
      // Create the DTO from the form values
      const reportData: CreateAssociateReportDTO = {
        title: this.reportForm.value.title,
        reason: this.reportForm.value.reason,
        type: this.reportForm.value.type,
        description: this.reportForm.value.description
      };
  
      this.associateService.createAssociateReport(reportData).subscribe({
        next: (response) => {
          this.saveEvent.emit(true)
          this.hideCreateDialog();
        
        },
        error: (error) => {
          console.error('Error creating report:', error);
 this.saveEvent.emit(false)
        }
      });
    }
}
