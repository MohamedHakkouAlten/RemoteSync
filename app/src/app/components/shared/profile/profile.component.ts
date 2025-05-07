import { Component } from '@angular/core';

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  activeLink: string = 'Projects';
  
  userAvatarUrl: string = 'assets/images/avatar.png'; // Replace with your actual path
  logoUrl: string = 'assets/images/alten.png';
    // Example function if clicking a link should change the active state
    setActiveLink(linkName: string): void {
      this.activeLink = linkName;
      // Add navigation logic here if needed (e.g., using Angular Router)
    }
    profileImageUrl: string = 'assets/images/avatar.png'; // Replace with actual path or binding
    userName: string = 'Alexa Rawles'; // Ideally split into first/last for the form
    userEmail: string = 'alexarawles@gmail.com';
  
    // --- Form Fields ---
    // Initialize form fields - potentially pre-fill with user data
    firstName: string = 'Alexa'; // Example pre-fill
    lastName: string = 'Rawles'; // Example pre-fill
    address: string = '';
    email: string = 'alexarawles@gmail.com'; // Example pre-fill (likely read-only or needs confirmation)
    language: string = '';
    phoneNumber: string = '';
  
    constructor() {
      // In a real app, fetch user data here
    }
  
    onSave() {
      console.log('Saving changes:', {
        firstName: this.firstName,
        lastName: this.lastName,
        address: this.address,
        email: this.email,
        language: this.language,
        phoneNumber: this.phoneNumber,
      });
      // Add actual save logic (e.g., API call)
    }
  
    onCancel() {
      console.log('Cancelled');
      // Add cancel logic (e.g., reset form, navigate away)
    }
}
