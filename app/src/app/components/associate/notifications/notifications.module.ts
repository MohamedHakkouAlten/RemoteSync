import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NotificationsRoutingModule } from './notifications-routing.module';
import { NotificationsComponent } from './notifications.component';
// Import PrimeNG Modules you need
import { CardModule } from 'primeng/card';
import { TabViewModule } from 'primeng/tabview';
import { BadgeModule } from 'primeng/badge';
import { NavigationComponent } from "../../shared/navigation/navigation.component";
import { TabsModule } from 'primeng/tabs';
import { PaginatorModule } from 'primeng/paginator';
import { NotificationCardComponent } from "../../shared/associate-ui/notification-card/notification-card.component";


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
    PaginatorModule,
    NavigationComponent,
    TabsModule,
    NotificationCardComponent
]
})
export class NotificationsModule { }
