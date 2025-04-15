import { Component } from '@angular/core';

@Component({
  selector: 'app-example',
  standalone: false,
  templateUrl: './example.component.html',
  styleUrls: ['./example.component.css']
})
export class ExampleComponent {
  visible: boolean = false;

  showDialog() {
    this.visible = true;
  }

  hideDialog() {
    this.visible = false;
  }

  signIn() {
    // Add your sign-in logic here
    console.log('User signed in!');
    this.hideDialog();  // Close dialog after sign-in
  }
}
