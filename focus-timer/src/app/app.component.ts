import { Component, inject, OnInit } from '@angular/core';
import { TimerComponent } from "./timer/timer.component";
import { HeaderComponent } from "./header/header.component";
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TimerComponent, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  
  constructor(public authService: AuthService) {  }

  login() {    
    
      // Store token and user details in AuthService
      this.authService.signInWithGoogle();    
  }

  logout() {

    this.authService.signOut();
  }

}
