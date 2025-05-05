import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LanguageService, SupportedLanguage } from '../../../services/language/language.service';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-language-selector',
  standalone: true,
  imports: [CommonModule, TranslateModule, DropdownModule, FormsModule, DialogModule, ButtonModule],
  templateUrl: './language-selector.component.html',
  styleUrl: './language-selector.component.css'
})
export class LanguageSelectorComponent implements OnInit {
  selectedLanguage: SupportedLanguage = 'en';
  languages: { code: SupportedLanguage, name: string }[] = [];
  showLanguageDialog: boolean = false;

  constructor(
    private languageService: LanguageService,
    private translateService: TranslateService
  ) { }

  ngOnInit(): void {
    // Get available languages
    this.languages = this.languageService.getLanguageOptions();
    
    // Subscribe to language changes
    this.languageService.currentLanguage$.subscribe(lang => {
      this.selectedLanguage = lang;
    });
  }

  onLanguageChange(langCode: SupportedLanguage): void {
    this.languageService.setLanguage(langCode);
    this.showLanguageDialog = false;
  }

  toggleLanguageDialog(): void {
    this.showLanguageDialog = !this.showLanguageDialog;
  }
}
