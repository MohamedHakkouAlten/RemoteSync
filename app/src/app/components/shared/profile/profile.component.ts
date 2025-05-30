import { Component, OnInit } from '@angular/core';
import { LanguageService, SupportedLanguage } from '../../../services/language/language.service';
import { MessageService } from 'primeng/api';
import { AssociateService } from '../../../services/associate.service';
import { ResponseWrapperDto } from '../../../dto/response-wrapper.dto';
import { ProfileDTO } from '../../../dto/profile.dto';

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  activeLink: string = 'Projects';
  isLoading: boolean = false;
  profileLoaded: boolean = false;
  
  // User data
  userAvatarUrl: string = 'assets/images/avatar.png';
  logoUrl: string = 'assets/images/alten.png';
  profileImageUrl: string = 'assets/images/avatar.png';
  userName: string = '';
  userEmail: string = '';
  username: string = '';

  // Form fields
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  language: SupportedLanguage = 'en';
  phoneNumber: string = '';

  // Language options
  languageOptions: { code: SupportedLanguage, name: string }[] = [];
  
  // Original data for reset
  private originalData: any = {};
  
  constructor(
    private associateService: AssociateService,
    private languageService: LanguageService,
    private messageService: MessageService
  ) {}
  
  ngOnInit(): void {
    // Load language options
    this.languageOptions = this.languageService.getLanguageOptions();
    
    // Set current language
    this.language = this.languageService.getCurrentLanguage();
    
    // Load user profile data
    this.loadProfileData();
  }
  
  /**
   * Load profile data from the backend
   */
  loadProfileData(): void {
    this.isLoading = true;
    
    this.associateService.getAssociateProfile().subscribe({
      next: (response: ResponseWrapperDto<ProfileDTO>) => {
        this.handleProfileResponse(response);
        this.isLoading = false;
        this.profileLoaded = true;
      },
      error: (error) => {
        console.error('Error loading profile:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load profile data. Please try again later.'
        });
        this.isLoading = false;
      }
    });
  }
  
  /**
   * Handle profile response data
   */
  private handleProfileResponse(response: ResponseWrapperDto<ProfileDTO>): void {
    if (response.status === 'success' && response.data) {
      const { firstName, lastName, email, username, phoneNumber } = response.data;
      
      // Set display data
      this.userName = `${firstName} ${lastName}`;
      this.userEmail = email;
      this.username = username;
      
      // Set form data
      this.firstName = firstName;
      this.lastName = lastName;
      this.email = email;
      this.phoneNumber = phoneNumber || '';
      
      // Store original data for reset
      this.originalData = { ...response.data };
    }
  }
  
  /**
   * Handle language change
   */
  onLanguageChange(): void {
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
    
    // Prepare update data
    const updateData = {
      firstName: this.firstName,
      lastName: this.lastName,
      phoneNumber: this.phoneNumber
    };
    
    console.log('Saving changes:', updateData);
    
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Profile updated successfully.'
    });
    
    // When backend supports profile update:
    /*
    this.profileService.updateAssociateProfile(updateData).subscribe({
      next: (response) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Profile updated successfully.'
        });
      },
      error: (error) => {
        console.error('Error updating profile:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to update profile. Please try again later.'
        });
      }
    });
    */
  }
  
  /**
   * Cancel changes and reset form
   */
  onCancel() {
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
}
