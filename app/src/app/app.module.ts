import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule, provideHttpClient, withFetch } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthInterceptor } from './interceptors/auth.interceptor';

import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import { definePreset } from '@primeng/themes';
import Lara from '@primeng/themes/lara';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ButtonModule } from 'primeng/button';
import { NavigationComponent } from "./components/shared/navigation/navigation.component";
import { CalendarComponent } from './utility/rc/calendar/calendar.component';

// Translation imports
import { TranslateModule, TranslateLoader, TranslateService } from '@ngx-translate/core';
import { HttpLoaderFactory } from './i18n/translation-loader.factory';
import { LanguageSelectorComponent } from './components/shared/language-selector/language-selector.component';
import { AuthFacadeService } from './services/auth-facade.service';



const BlackLara = definePreset(Lara, {
  semantic: {
      primary: {
          50: '{slate.50}',
          100: '{slate.100}',
          200: '{slate.200}',
          300: '{slate.300}',
          400: '{slate.400}',
          500: '{slate.950}',
          600: '{slate.900}',
          700: '{slate.800}',
          800: '{slate.700}',
          900: '{slate.600}',
          950: '{slate.500}'
      }
  }
});


@NgModule({
  declarations: [
    AppComponent,
    CalendarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ButtonModule,
    // We need HttpClientModule for the TranslateLoader
    HttpClientModule,
    NavigationComponent,
    // Translation module
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      },
      defaultLanguage: 'en',
      isolate: false
    }),
    LanguageSelectorComponent
],

  providers: [
    provideAnimationsAsync(),
    providePrimeNG({
      theme: {
          preset: BlackLara,
          options: {
              darkModeSelector: '.app-dark'
          }
      },
    }),
    provideHttpClient(withFetch()), // Modern approach to provide HttpClient
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    TranslateService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
