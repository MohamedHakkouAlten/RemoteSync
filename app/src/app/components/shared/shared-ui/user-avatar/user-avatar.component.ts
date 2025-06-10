import { Component, Input, OnInit } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';


@Component({
  selector: 'app-user-avatar',
  imports: [    AvatarModule,
      ],
  templateUrl: './user-avatar.component.html',
  styleUrl: './user-avatar.component.css'
})
export class UserAvatarComponent implements OnInit  {
  ngOnInit(): void {
    console.log(this.textColor)
  }
@Input() userInitials: string = " "
@Input() size: string | number = 30
@Input() textSize: number = 12
@Input() textColor: string = '#F57C00'
@Input() bgColor: string = '#FFF8E1'

get avatarInlineStyle(): { [key: string]: string } {
    return {
      'background-color': this.bgColor,
      'color': this.textColor,
      'border-color': this.bgColor ,
      'border-with' :'none' 
      // If you want the border color to match bg
    };
  }

get avatarStyle(): string {
  // Support string predefined sizes like 'small', 'medium', 'large'
  let sizeValue = this.size;
  
  if (typeof this.size === 'string') {
    switch(this.size) {
      case 'small': sizeValue = 24; break;
      case 'medium': sizeValue = 36; break;
      case 'large': sizeValue = 48; break;
      case 'xlarge': sizeValue = 64; break;
      default: 
        // If it's a string but not one of the predefined values, try to parse it as number
        if (!isNaN(parseInt(this.size))) {
          sizeValue = parseInt(this.size);
        } else {
          sizeValue = 30; // Default fallback
        }
    }
  }
  
  return `!h-[${sizeValue}px] !w-[${sizeValue}px] !text-[${this.textSize}px] `;
}

}
