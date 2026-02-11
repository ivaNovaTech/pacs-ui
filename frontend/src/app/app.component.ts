import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router'; 

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet, 
    RouterModule  
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {  
  title = 'PACS Portal';
  
  //get current year for copyright section
  currentYear: number = new Date().getFullYear();
}