import { Component, Input } from '@angular/core';
import { KeyValueColorPair } from '../../../../models/shared/shared.model';

@Component({
  selector: 'app-site-stats-card',
  imports: [],
  templateUrl: './site-stats-card.component.html',
  styleUrl: './site-stats-card.component.css'
})
export class SiteStatsCardComponent {
  @Input() siteValue1 : KeyValueColorPair={key:"",value:0,color:"text-gray-900"}
  @Input() siteValue2 : KeyValueColorPair={key:"",value:0,color:"text-gray-900"}


}
