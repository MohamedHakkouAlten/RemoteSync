import { Component, Input } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';


@Component({
  selector: 'app-user-avatar',
  imports: [    AvatarModule,
      ],
  templateUrl: './user-avatar.component.html',
  styleUrl: './user-avatar.component.css'
})
export class UserAvatarComponent {
  @Input() userInitials: string = " ";
  @Input() textColor: string = "";
  @Input() bgColor: string = "";
  @Input() size: number = 40;
  @Input() textSize: number = 16;
}
