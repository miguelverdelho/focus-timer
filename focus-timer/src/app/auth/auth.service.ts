import { DestroyRef, inject, Injectable, signal } from '@angular/core';
import { gapi, loadGapiInsideDOM } from 'gapi-script';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth2: any;
  private apiUrl = environment.apiUrl;
  private httpClient = inject(HttpClient);
  private destroyRef = inject(DestroyRef);

  // Signal to hold user data
  private _user = signal<{
    id: string;
    email: string;
    name: string;
    image: string;
    token: string;
  } | null>(null);

  constructor() {
    this.initGoogleAuth();
  }

  // Public getter for user signal
  get user() {
    return this._user;
  }

  getToken(): string | undefined {
    return this.user()?.token;
  }

  // Initialize Google API
  private async initGoogleAuth() {
    await loadGapiInsideDOM();
    gapi.load('auth2', () => {
      this.auth2 = gapi.auth2.init({
        client_id: environment.googleClientId,
        scope: '',
      });
    });
  }

  // Sign in with Google and update the signal
  public async signInWithGoogle(): Promise<string> {
    try {
      const user = await this.auth2.signIn();
      const profile = user.getBasicProfile();
      const token = user.getAuthResponse().id_token;

      console.log('Token', token);

      // Update the user signal
      this._user.set({
        id: profile.getId(),
        email: profile.getEmail(),
        name: profile.getName(),
        image: profile.getImageUrl(),
        token,
      });

      this.httpClient.get(this.apiUrl + 'user/login', {}).subscribe((data) => {
        console.log(data);
      });

      return token;
    } catch (error) {
      console.error('Google Sign-In failed', error);
      throw error;
    }
  }

  // Sign out and reset the user signal
  public async signOut(): Promise<void> {
    try {
      await this.auth2.signOut();
      this._user.set(null);
    } catch (error) {
      console.error('Google Sign-Out failed', error);
    }
  }
}
