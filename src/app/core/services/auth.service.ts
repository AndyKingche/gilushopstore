import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, finalize, of, switchMap, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ShopLoginResponse } from '../models/shop-login-response';



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

  private api = environment.apiUrl;

  private readonly TOKEN_KEY = 'shop_token';
  private readonly NAME_KEY = 'shop_name';

  readonly token = signal<string | null>(this.read(this.TOKEN_KEY));
  readonly userName = signal<string | null>(this.read(this.NAME_KEY));
  readonly isLoggedIn = computed(() => !!this.token());

  // Login normal de la tienda: el "username" del backend es el email
  login(email: string, password: string) {
    return this.http
      .post<ShopLoginResponse>(`${this.api}api/login`, { username: email, password })
      .pipe(tap(res => this.saveSession(res)));
  }

  loginWithGoogle(idToken: string) {
    return this.http
      .post<ShopLoginResponse>(`${this.api}api/auth/google`, { idToken })
      .pipe(tap(res => this.saveSession(res)));
  }

  logout() {
    const token = this.token();
    if (!token) {
      this.clearSession();
      return;
    }
    // revoca el token en el servidor; igual se cierra la sesión local si falla
    this.http.post(`${this.api}/api/v1/invalidate`, { token })
      .pipe(catchError(() => of(null)), finalize(() => this.clearSession()))
      .subscribe();
  }

  clearSession() {
    this.write(this.TOKEN_KEY, null);
    this.write(this.NAME_KEY, null);
    this.token.set(null);
    this.userName.set(null);
    this.router.navigate(['/login']);
  }

  private saveSession(res: ShopLoginResponse) {
    this.write(this.TOKEN_KEY, res.jwttoken);
    this.write(this.NAME_KEY, res.nombreCompleto);
    this.token.set(res.jwttoken);
    this.userName.set(res.nombreCompleto);
  }

  private read(key: string): string | null {
    try { return localStorage.getItem(key); } catch { return null; }
  }

  private write(key: string, value: string | null) {
    try {
      if (value === null) localStorage.removeItem(key);
      else localStorage.setItem(key, value);
    } catch { /* almacenamiento no disponible */ }
  }
}
