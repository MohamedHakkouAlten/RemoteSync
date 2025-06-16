import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router, NavigationExtras } from '@angular/router';
import { PrimeNG } from 'primeng/config';

export type SupportedLanguage = 'en' | 'fr' | 'es';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private currentLanguageSubject = new BehaviorSubject<SupportedLanguage>('en');
  public currentLanguage$ = this.currentLanguageSubject.asObservable();

  constructor(
    private translate: TranslateService,
    private router: Router,
    public config: PrimeNG
  ) {
    // Set available languages
    translate.addLangs(['en', 'fr', 'es']);
    translate.setDefaultLang('en');
    
    // Initialize with browser language or default to English
    this.initLanguage();
    this.setPrimeNgLocale()
  }
   setPrimeNgLocale() {
    const lang = this.getCurrentLanguage()
    

    switch (lang) {
      case 'fr':
        this.config.setTranslation( {
       startsWith: 'Commence par',
    contains: 'Contient',
    notContains: 'Ne contient pas',
    endsWith: 'Se termine par',
    equals: 'Égal à',
    notEquals: 'N\'est pas égal à',
    noFilter: 'Sans filtre',
    lt: 'Inférieur à',
    lte: 'Inférieur ou égal à',
    gt: 'Supérieur à',
    gte: 'Supérieur ou égal à',
    is: 'Est',
    isNot: 'N\'est pas',
    before: 'Avant',
    after: 'Après',
    apply: 'Appliquer',
    matchAll: 'Correspondre à tous',
    matchAny: 'Correspondre à n\'importe quel',
    addRule: 'Ajouter une règle',
    removeRule: 'Supprimer la règle',

    // Confirmation/Dialog buttons
    accept: 'Oui',
    reject: 'Non',

    // FileUpload specific
    choose: 'Choisir',
    upload: 'Télécharger',
    cancel: 'Annuler',

    // Calendar specific
    firstDayOfWeek: 1, // Monday
    dayNames: ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"],
    dayNamesShort: ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"],
    dayNamesMin: ["Di", "Lu", "Ma", "Me", "Je", "Ve", "Sa"],
    monthNames: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"],
    monthNamesShort: ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"],
    today: "Aujourd'hui",
    clear: "Effacer",
    weekHeader: "Sem",
  })
       
        break;
      case 'es': // Example for Arabic
        this.config.setTranslation( {
          startsWith: 'Comienza con',
          contains: 'Contiene',
          notContains: 'No contiene',
          endsWith: 'Termina con',
          equals: 'Igual',
          notEquals: 'No es igual',
          noFilter: 'Sin filtro',
          lt: 'Menos que',
          lte: 'Menos que o igual a',
          gt: 'Mas grande que',
          gte: 'Mayor qué o igual a',
          is: 'Es',
          isNot: 'No es',
          before: 'Before',
          after: 'After',
          apply: 'Aplicar',
          matchAll: 'Coincidir con todos',
          matchAny: 'Coincidir con cualquiera',
          addRule: 'Agregar regla',
          removeRule: 'Eliminar regla',
          accept: 'Si',
          reject: 'No',
          choose: 'Escoger',
          upload: 'Subir',
          cancel: 'Cancelar',
          dayNames: [ 'Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado' ],
          dayNamesShort: [ 'dom','lun','mar','mié','jue','vie','sáb' ],
          dayNamesMin: [ 'D','L','M','X','J','V','S' ],
          monthNames: [ 'Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre' ],
          monthNamesShort: [ 'Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic' ],
          today: 'Hoy',
          clear: 'Limpiar',
          weekHeader: 'Sm'
  })
       
        break;
      case 'en': // Default to English
      default:
this.config.setTranslation( {
startsWith: 'Starts with',
    contains: 'Contains',
    notContains: 'Does not contain',
    endsWith: 'Ends with',
    equals: 'Equals',
    notEquals: 'Does not equal',
    noFilter: 'No Filter',
    lt: 'Less than',
    lte: 'Less than or equal to',
    gt: 'Greater than',
    gte: 'Greater than or equal to',
    is: 'Is',
    isNot: 'Is not',
    before: 'Before',
    after: 'After',
    apply: 'Apply',
    matchAll: 'Match All',
    matchAny: 'Match Any',
    addRule: 'Add Rule',
    removeRule: 'Remove Rule',

    // Confirmation/Dialog buttons
    accept: 'Yes',
    reject: 'No',

    // FileUpload specific
    choose: 'Choose',
    upload: 'Upload',
    cancel: 'Cancel',

    // Calendar specific
    dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    dayNamesMin: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
    monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    today: 'Today',
    clear: 'Clear',
    weekHeader: 'Wk',
        });
        break;
     
    }

    
    console.log(`PrimeNG locale set to: ${lang}`);
     
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
    this.setPrimeNgLocale()
  
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
