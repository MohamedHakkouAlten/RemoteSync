import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CalendarRoutingModule } from './calendar-routing.module';
import { CalendarComponent } from './calendar.component';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { AvatarModule } from 'primeng/avatar';
import { NavigationComponent } from "../../shared/navigation/navigation.component";
import { InputIcon } from 'primeng/inputicon';
import { IconField } from 'primeng/iconfield';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TooltipModule } from 'primeng/tooltip';
import { ThreeStateToggleComponent } from "../../shared/three-state-toggle/three-state-toggle.component";
import { RotationComponent } from "../rotation/rotation.component";
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { PaginatorModule } from 'primeng/paginator';
import { DefaultLayoutComponent } from "../../shared/layout/default-layout.component";
import { WebSocketService } from '../../../services/web-socket.service';
import { LanguageService } from '../../../services/language/language.service';

@NgModule({
  declarations: [
    CalendarComponent
  ],
  imports: [
    CommonModule,
    CalendarRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    // PrimeNG Components
    ButtonModule,
    InputTextModule,
    DropdownModule,
    AvatarModule,
    SelectButtonModule,
    TooltipModule,
    AutoCompleteModule,
    ToastModule,
    PaginatorModule,
    // Standalone Components
    NavigationComponent,
    InputIcon,
    IconField,
    AutoCompleteModule,
    ThreeStateToggleComponent,
    RotationComponent,
    ToastModule,
    PaginatorModule,
    TranslateModule,
    DefaultLayoutComponent
],
providers :[
    MessageService,
    TranslateService,
    WebSocketService,
    LanguageService
]
})
export class CalendarModule { }
