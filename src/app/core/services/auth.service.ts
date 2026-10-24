import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { finalize, switchMap, tap } from 'rxjs';



export interface SessionUser {
  username: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private readonly api = '/api/auth';

  readonly user = signal<SessionUser | null>(null);
  readonly isLoggedIn = computed(() => this.user() !== null);

  login(credentials: { username: string; password: string }) {
    return this.http.post(`${this.api}/login`, credentials).pipe(
      switchMap(() => this.loadUser())
    );
  }

  loginWithGoogle(idToken: string) {
    return this.http.post(`${this.api}/google`, { idToken }).pipe(
      switchMap(() => this.loadUser()),
      tap(() => this.router.navigate(['/']))
    );
  }

  loadUser() {
    return this.http.get<SessionUser>(`${this.api}/me`).pipe(
      tap(u => this.user.set(u))
    );
  }

  refresh() {
    return this.http.post(`${this.api}/refresh`, {});
  }

  logout() {
    return this.http.post(`${this.api}/logout`, {}).pipe(
      finalize(() => this.clearSession())
    );
  }

  clearSession() {
    this.user.set(null);
    this.router.navigate(['/login']);
  }
}
