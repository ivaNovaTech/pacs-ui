import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {
  // Replace this with your actual login logic later
  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}