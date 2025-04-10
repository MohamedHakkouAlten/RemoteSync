import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import { definePreset } from '@primeng/themes';
import Lara from '@primeng/themes/lara';

import { ButtonModule } from 'primeng/button';

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
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ButtonModule
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
    })
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
