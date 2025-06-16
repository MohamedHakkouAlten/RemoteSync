import { Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { UserService } from '../../../../services/auth/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-project-stats-card',
  imports: [TranslateModule],
  templateUrl: './project-stats-card.component.html',
  styleUrl: './project-stats-card.component.css'
})
export class ProjectStatsCardComponent {
@Input() projectStats :number=0;
@Input() icon :string= "pi pi-chart-bar";
@Input() title :string= "";
constructor(private userService:UserService,private router:Router){}
viewAllProjects(): void {
  

    this.router.navigate([`/${this.userService.getCurrentLanguage()}/remotesync/rc/project`])

      
       }
}
