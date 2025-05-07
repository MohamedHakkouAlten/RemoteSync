import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

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
import { TabsModule } from 'primeng/tabs';
import { PaginatorModule } from 'primeng/paginator';


@NgModule({
  declarations: [
    NotificationsComponent
  ],
  imports: [
    CommonModule,
    NotificationsRoutingModule,
    CardModule,
    TabViewModule,
    BadgeModule,
    ButtonModule,
    AvatarModule,
    ScrollPanelModule,
    PaginatorModule,
    NavigationComponent,
    TabsModule,
]
})
export class NotificationsModule { }
