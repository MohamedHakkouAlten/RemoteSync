import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { ChatRoutingModule } from './chat-routing.module';
import { ChatComponent } from './chat.component';

// PrimeNG imports
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { TooltipModule } from 'primeng/tooltip';
import { ScrollPanelModule } from 'primeng/scrollpanel';

@NgModule({
  declarations: [
    ChatComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    ChatRoutingModule,
    TranslateModule,
    ButtonModule,
    InputTextModule,
    TextareaModule,
    TooltipModule,
    ScrollPanelModule
  ],
  exports: [
    ChatComponent
  ]
})
export class ChatModule { }
