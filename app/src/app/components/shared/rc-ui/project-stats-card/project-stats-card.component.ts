import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-project-stats-card',
  imports: [],
  templateUrl: './project-stats-card.component.html',
  styleUrl: './project-stats-card.component.css'
})
export class ProjectStatsCardComponent {
@Input() projectStats :number=0;
@Input() icon :string= "pi pi-chart-bar";
@Input() title :string= "";

}
