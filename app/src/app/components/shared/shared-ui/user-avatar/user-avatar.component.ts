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
@Input() userInitials:string= " "
@Input() size:number=30
@Input() textSize:number=12
@Input() textColor:string='#F57C00'
@Input() bgColor:string='#FFF8E1'

get avatarInlineStyle(): { [key: string]: string } {
    return {
      'background-color': this.bgColor,
      'color': this.textColor,
      'border-color': this.bgColor ,
      'border-with' :'none' 
      // If you want the border color to match bg
    };
  }

get avatarStyle():string {
return `!h-[${this.size}px] !w-[${this.size}px] !text-[${this.textSize}px] `
}

}
