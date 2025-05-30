import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NotificationsRoutingModule } from './notifications-routing.module';
import { NotificationsComponent } from './notifications.component';
// Import PrimeNG Modules you need
import { CardModule } from 'primeng/card';
import { TabViewModule } from 'primeng/tabview';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { AvatarModule } from 'primeng/avatar';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { NavigationComponent } from "../../shared/navigation/navigation.component";
import { DefaultLayoutComponent } from "../../shared/layout/default-layout.component";
import { TabsModule } from 'primeng/tabs';
import { PaginatorModule } from 'primeng/paginator';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { InputTextModule } from 'primeng/inputtext';


@NgModule({
  declarations: [
    NotificationsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NotificationsRoutingModule,
    CardModule,
    TabViewModule,
    BadgeModule,
    ButtonModule,
    AvatarModule,
    ScrollPanelModule,
    PaginatorModule,
    TabsModule,
    ProgressSpinnerModule,
    DropdownModule,
    CalendarModule,
    InputTextModule,
    DefaultLayoutComponent
  ],
  providers: [DatePipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class NotificationsModule { }
