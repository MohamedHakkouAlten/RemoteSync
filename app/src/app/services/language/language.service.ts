import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router, NavigationExtras } from '@angular/router';

export type SupportedLanguage = 'en' | 'fr' | 'es';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private currentLanguageSubject = new BehaviorSubject<SupportedLanguage>('en');
  public currentLanguage$ = this.currentLanguageSubject.asObservable();

  constructor(
    private translate: TranslateService,
    private router: Router
  ) {
    // Set available languages
    translate.addLangs(['en', 'fr', 'es']);
    translate.setDefaultLang('en');
    
    // Initialize with browser language or default to English
    this.initLanguage();
  }

  private initLanguage(): void {
    // Get language from URL if present
    const urlLang = this.getLanguageFromUrl();
    if (urlLang) {
      this.setLanguage(urlLang);
      return;
    }

    // Try to get from browser language
    const browserLang = this.translate.getBrowserLang() as SupportedLanguage;
    const defaultLang = this.isSupportedLanguage(browserLang) ? browserLang : 'en';
    this.setLanguage(defaultLang);
  }

  private getLanguageFromUrl(): SupportedLanguage | null {
    const path = window.location.pathname;
    const segments = path.split('/');
    
    // Check if the URL contains a language code
    for (const segment of segments) {
      if (this.isSupportedLanguage(segment as SupportedLanguage)) {
        return segment as SupportedLanguage;
      }
    }
    
    return null;
  }

  private isSupportedLanguage(lang: string): boolean {
    return ['en', 'fr', 'es'].includes(lang);
  }

  public setLanguage(lang: SupportedLanguage): void {
    if (!this.isSupportedLanguage(lang)) {
      lang = 'en';
    }
    
    // Use the language and load its translations
    this.translate.use(lang).subscribe(() => {
      console.log(`Language set to ${lang}`);
    }, error => {
      console.error('Error loading translations:', error);
    });
    
    this.currentLanguageSubject.next(lang);
    
    // Update URL with language code
    this.updateUrlWithLanguage(lang);
  }

  public getCurrentLanguage(): SupportedLanguage {
    return this.currentLanguageSubject.value;
  }

  private updateUrlWithLanguage(lang: SupportedLanguage): void {
    // Get current URL path
    const currentUrl = this.router.url;
    const urlParts = currentUrl.split('/');
    
    // Check if URL already has a language code
    const hasLanguageCode = this.isSupportedLanguage(urlParts[1] as SupportedLanguage);
    
    // Create new URL with language code
    let newUrl: string;
    if (hasLanguageCode) {
      // Replace existing language code
      urlParts[1] = lang;
      newUrl = urlParts.join('/');
    } else {
      // Add language code after first slash
      newUrl = '/' + lang + currentUrl;
    }
    
    // Navigate to new URL without reloading the page
    this.router.navigateByUrl(newUrl, { 
      replaceUrl: true,
      skipLocationChange: false
    });
  }

  public getLanguageOptions(): { code: SupportedLanguage, name: string }[] {
    return [
      { code: 'en', name: this.translate.instant('English') },
      { code: 'fr', name: this.translate.instant('French') },
      { code: 'es', name: this.translate.instant('Spanish') }
    ];
  }
}
