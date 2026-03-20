import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

interface LoginRequest {
  username: string;
  password: string;
}

interface LoginResponse {
  jwttoken: string;
  nombreCompleto: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  credentials: LoginRequest = {
    username: '',
    password: ''
  };

  rememberMe = false;
  showPassword = false;
  isLoading = false;
  errorMessage = '';

  // Use the correct backend port
  private apiUrl = environment.apiUrl+'api';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Check if already logged in - redirect to home if so
    this.checkAuth();
  }

  checkAuth(): void {
    const token = localStorage.getItem('authToken');
    const name = localStorage.getItem('userName');
    if (token && name) {
      this.router.navigate(['/']);
    }
  }

  onSubmit(): void {
    this.errorMessage = '';

    if (!this.credentials.username || !this.credentials.password) {
      this.errorMessage = 'Por favor complete todos los campos';
      return;
    }

    this.isLoading = true;

    const loginData = {
      username: this.credentials.username,
      password: this.credentials.password
    };

    this.http.post<LoginResponse>(`${this.apiUrl}/login`, loginData).subscribe({
      next: (response) => {
        this.isLoading = false;
        
        // Store token and user name in localStorage
        localStorage.setItem('authToken', response.jwttoken);
        localStorage.setItem('userName', response.nombreCompleto);
        
        // Redirect to home after successful login
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
