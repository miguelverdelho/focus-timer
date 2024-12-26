import { Component, inject, OnInit, signal } from '@angular/core';
import { HeaderComponent } from "./header/header.component";
import { AuthService } from './auth/auth.service';
import { TimersComponent } from './timers/timers.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TimersComponent, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  public authService = inject(AuthService);

  constructor() { 
  }
  


}
