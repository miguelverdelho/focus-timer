import { Component, inject } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { AuthService } from '../auth/auth.service';
import { ButtonComponent } from '../shared/button/button.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [NgOptimizedImage, ButtonComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  public  authService = inject(AuthService);

  login() { 
    // Store token and user details in AuthService
    this.authService.signInWithGoogle();
  }

  logout() {
    this.authService.signOut();
  }
}
