import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';

interface LoginCredentials {
  userName: string;
  userPassword: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  credentials: LoginCredentials = {
    userName: '',
    userPassword: ''
  };

  rememberMe = false;
  showPassword = false;
  isLoading = false;
  errorMessage = '';

  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  onSubmit(): void {
    this.errorMessage = '';

    if (!this.credentials.userName || !this.credentials.userPassword) {
      this.errorMessage = 'Por favor complete todos los campos';
      return;
    }

    this.isLoading = true;

    this.http.post<any>(`${this.apiUrl}/auth/login`, this.credentials).subscribe({
      next: (response) => {
        this.isLoading = false;
        
        // Store token (you might want to use a more secure storage)
        if (response.token) {
          localStorage.setItem('authToken', response.token);
          localStorage.setItem('user', JSON.stringify(response.user));
        }
        
        // Redirect to home or previous page
        this.router.navigate(['/']);
      },
      error: (error) => {
        this.isLoading = false;
        
        if (error.status === 401) {
          this.errorMessage = 'Usuario o contraseña incorrectos';
        } else if (error.status === 0) {
          this.errorMessage = 'No se pudo conectar al servidor. Intente más tarde.';
        } else {
          this.errorMessage = 'Error al iniciar sesión. Intente de nuevo.';
        }
        
        console.error('Login error:', error);
      }
    });
  }

  goToRegister(): void {
    this.router.navigate(['/auth/register']);
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}
