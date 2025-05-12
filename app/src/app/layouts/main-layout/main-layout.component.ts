import { Component } from '@angular/core';
import { NavigationComponent } from '../../components/shared/navigation/navigation.component';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css',
  imports:[
    NavigationComponent,
    RouterOutlet
  ]

})
export class MainLayoutComponent {

}
