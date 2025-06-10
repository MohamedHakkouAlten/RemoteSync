import { Component, OnInit, OnDestroy } from '@angular/core';
import { LanguageService, SupportedLanguage } from '../../../services/language/language.service';
import { MessageService } from 'primeng/api';
import { AssociateService } from '../../../services/associate.service';
import { RcService } from '../../../services/rc.service';
import { UserService } from '../../../services/auth/user.service';
import { ResponseWrapperDto } from '../../../dto/response-wrapper.dto';
import { ProfileDTO } from '../../../dto/profile.dto';
import { AssociateUpdateProfileDTO } from '../../../dto/associate-update-profile.dto';
import { finalize } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit, OnDestroy {
  activeLink: string = 'Projects';
  isLoading: boolean = false;
  profileLoaded: boolean = false;

  // User display data
  userAvatarUrl: string = 'assets/images/avatar.png';
  logoUrl: string = 'assets/images/alten.png';
  profileImageUrl: string = 'assets/images/avatar.png';
  userName: string = '';
  userEmail: string = '';
  username: string = '';

  // Form data
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  phoneNumber: string = '';
  language: SupportedLanguage = 'en';

  // Validation errors
  validationErrors: { [key: string]: string } = {};
  phoneNumberPattern: string = '^\\+[0-9]+ [0-9]+$';
  formChanged: boolean = false;

  // Language options
  languageOptions: { code: SupportedLanguage, name: string }[] = [];

  // Original data for reset
  private originalData: any = {};

  // For profile completion percentage calculation
  private readonly totalProfileFields = 4; // firstName, lastName, email, phoneNumber
  private completedFields = 0;
  private lastUpdated: Date | null = null;

  constructor(
    private associateService: AssociateService,
    private rcService: RcService,
    private userService: UserService,
    private languageService: LanguageService,
    private messageService: MessageService,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    // Load language options
    this.languageOptions = this.languageService.getLanguageOptions();

    // Set current language
    this.language = this.languageService.getCurrentLanguage();

    // Load user profile data
    this.loadProfileData();
  }

  ngOnDestroy(): void {
    // Cleanup if needed
  }

  /**
   * Load profile data from the backend based on user role
   */
  loadProfileData(): void {
    this.isLoading = true;

    // Determine which service to use based on user role
    if (this.userService.hasRole('RC')) {
      this.rcService.getRcProfile().subscribe({
        next: (response: ResponseWrapperDto<ProfileDTO>) => {
          this.handleProfileResponse(response);
          this.isLoading = false;
          this.profileLoaded = true;
        },
        error: (error) => {
          this.handleProfileError(error);
        }
      });
    } else {
      // Default to associate service if not RC
      this.associateService.getAssociateProfile().subscribe({
        next: (response: ResponseWrapperDto<ProfileDTO>) => {
          this.handleProfileResponse(response);
          this.isLoading = false;
          this.profileLoaded = true;
        },
        error: (error) => {
          this.handleProfileError(error);
        }
      });
    }
  }

  /**
   * Handle profile loading error
   */
  private handleProfileError(error: any): void {
    console.error('Error loading profile:', error);
    this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: 'Failed to load profile data. Please try again later.'
    });
    this.isLoading = false;
  }

  /**
   * Handle profile response data
   */
  private handleProfileResponse(response: ResponseWrapperDto<ProfileDTO>): void {
    if (response.status === 'success' && response.data) {
      const { firstName, lastName, email, username, phoneNumber, updatedAt } = response.data;

      // Set display data
      this.userName = `${firstName} ${lastName}`;
      this.userEmail = email;
      this.username = username;

      // Set form data
      this.firstName = firstName;
      this.lastName = lastName;
      this.email = email;
      this.phoneNumber = phoneNumber || '';

      // Set last updated date if available
      if (updatedAt) {
        this.lastUpdated = new Date(updatedAt);
      }

      // Calculate profile completion
      this.calculateProfileCompletion();

      // Store original data for reset
      this.originalData = { ...response.data };
      this.formChanged = false;
    }
  }

  /**
   * Calculate profile completion percentage
   */
  private calculateProfileCompletion(): void {
    // Reset counter
    this.completedFields = 0;

    // Count completed fields
    if (this.firstName?.trim()) this.completedFields++;
    if (this.lastName?.trim()) this.completedFields++;
    if (this.email?.trim()) this.completedFields++;
    if (this.phoneNumber?.trim()) this.completedFields++;
  }

  /**
   * Get profile completion percentage
   */
  getProfileCompletionPercentage(): number {
    return Math.round((this.completedFields / this.totalProfileFields) * 100);
  }

  /**
   * Get days since last update
   */
  getDaysSinceLastUpdate(): number | null {
    if (!this.lastUpdated) return null;

    const today = new Date();
    const diffTime = Math.abs(today.getTime() - this.lastUpdated.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  /**
   * Handle language change
   */
  onLanguageChange(): void {
    this.checkFormChanges();
    this.languageService.setLanguage(this.language);
  }

  /**
   * Function if clicking a link should change the active state
   */
  setActiveLink(linkName: string): void {
    this.activeLink = linkName;
  }

  /**
   * Save profile changes
   */
  onSave() {
    // First update language if changed
    if (this.language !== this.languageService.getCurrentLanguage()) {
      this.languageService.setLanguage(this.language);
    }

    // Clear any previous validation errors
    this.validationErrors = {};

    // Validate form fields before submission
    const isPhoneNumberValid = this.validatePhoneNumber();
    if (!isPhoneNumberValid) {
      // Show validation error message for phone number
      this.messageService.add({
        severity: 'error',
        summary: 'Validation Error',
        detail: this.validationErrors['phoneNumber']
      });
      return;
    }

    // Show loading indicator
    this.isLoading = true;

    // Prepare update data
    const updateData: AssociateUpdateProfileDTO = {
      firstName: this.firstName,
      lastName: this.lastName,
      phoneNumber: this.phoneNumber
    };

    console.log('Saving profile changes:', updateData);

    // Determine which service to use based on user role
    if (this.userService.hasRole('RC')) {
      this.rcService.updateRcProfile(updateData)
        .pipe(finalize(() => this.isLoading = false))
        .subscribe({
          next: (response) => this.handleUpdateSuccess(response),
          error: (error) => this.handleUpdateError(error)
        });
    } else {
      // Default to associate service if not RC
      this.associateService.updateAssociateProfile(updateData)
        .pipe(finalize(() => this.isLoading = false))
        .subscribe({
          next: (response) => this.handleUpdateSuccess(response),
          error: (error) => this.handleUpdateError(error)
        });
    }
  }

  /**
   * Handle successful profile update
   */
  private handleUpdateSuccess(response: ResponseWrapperDto<ProfileDTO>): void {
    if (response.status === 'success' && response.data) {
      // Update original data with the response data
      this.originalData = { ...response.data };

      // Update local form data if needed
      this.firstName = response.data.firstName;
      this.lastName = response.data.lastName;
      this.phoneNumber = response.data.phoneNumber || '';

      // Reset form changed flag
      this.formChanged = false;

      // Update the last updated timestamp
      this.lastUpdated = new Date();

      // Update user name in localStorage and userInfoSubject
      this.userService.updateUserName(this.firstName, this.lastName);
    }

    // Show success message using the TranslateService to maintain i18n standards
    this.translateService.get('profile.update_success').subscribe(translatedMessage => {
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: translatedMessage
      });
    });
  }

  /**
   * Handle profile update error
   */
  private handleUpdateError(error: any): void {
    console.error('Error updating profile:', error);

    // Check if it's a validation error response
    if (error?.error?.code === 'BAD_REQUEST' && error?.error?.errors) {
      // Handle field-specific validation errors
      const validationErrors = error.error.errors;
      this.validationErrors = {};

      // Process each validation error
      validationErrors.forEach((err: any) => {
        if (err.field && err.message) {
          this.validationErrors[err.field] = err.message;

          // Show error message for each field
          this.messageService.add({
            severity: 'error',
            summary: `Validation Error: ${this.getFieldDisplayName(err.field)}`,
            detail: err.message
          });
        }
      });
    } else {
      // Generic error message for other types of errors
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to update profile. Please try again later.'
      });
    }
  }

  /**
   * Get a user-friendly display name for a field
   */
  private getFieldDisplayName(field: string): string {
    const fieldMap: { [key: string]: string } = {
      firstName: 'First Name',
      lastName: 'Last Name',
      phoneNumber: 'Phone Number',
      email: 'Email'
    };

    return fieldMap[field] || field;
  }

  /**
   * Cancel changes and reset form
   */
  onCancel(): void {
    console.log('Cancelled');

    // Reset form fields to original values
    if (this.originalData) {
      this.firstName = this.originalData.firstName || '';
      this.lastName = this.originalData.lastName || '';
      this.email = this.originalData.email || '';
      this.phoneNumber = this.originalData.phoneNumber || '';

      // Reset language if changed
      this.language = this.languageService.getCurrentLanguage();
    }

    this.messageService.add({
      severity: 'info',
      summary: 'Cancelled',
      detail: 'Changes have been discarded.'
    });
  }

  /**
   * Check if form data has changed
   */
  checkFormChanges(): void {
    if (!this.originalData) {
      return;
    }

    this.formChanged = (
      this.firstName !== this.originalData.firstName ||
      this.lastName !== this.originalData.lastName ||
      this.phoneNumber !== this.originalData.phoneNumber
    );

    // Clear validation errors when fields are modified
    this.clearValidationError('firstName');
    this.clearValidationError('lastName');
    this.clearValidationError('phoneNumber');
  }

  /**
   * Clear validation error for a specific field
   */
  clearValidationError(field: string): void {
    if (this.validationErrors[field]) {
      delete this.validationErrors[field];
    }
  }

  /**
   * Validate the phone number format
   */
  validatePhoneNumber(): boolean {
    // Clear any existing phone number error
    this.clearValidationError('phoneNumber');

    // Skip validation if phone number is empty
    if (!this.phoneNumber?.trim()) {
      return true;
    }

    // Check for proper format: +CODE PHONE_NUMBER (e.g., +212 669242712)
    const regex = new RegExp(this.phoneNumberPattern);
    const isValid = regex.test(this.phoneNumber);

    if (!isValid) {
      // Use translation service to get localized error message
      this.translateService.get('profile.phone_format_error', { example: '+212 669242712' })
        .subscribe((res: string) => {
          this.validationErrors['phoneNumber'] = res;
        });
      return false;
    }

    return true;
  }
}
