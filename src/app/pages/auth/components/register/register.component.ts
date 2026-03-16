import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';

interface User {
  userName: string;
  userFirstname: string;
  userLastname: string;
  userPassword: string;
  userGender: string;
  userIdentification: string;
  userRuc?: string;
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  user: User = {
    userName: '',
    userFirstname: '',
    userLastname: '',
    userPassword: '',
    userGender: '',
    userIdentification: '',
    userRuc: ''
  };

  confirmPassword = '';
  showPassword = false;
  showConfirmPassword = false;
  isLoading = false;
  errorMessage = '';

  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  onSubmit(): void {
    this.errorMessage = '';

    // Validate passwords match
    if (this.user.userPassword !== this.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden';
      return;
    }

    // Validate password length
    if (this.user.userPassword.length < 6) {
      this.errorMessage = 'La contraseña debe tener al menos 6 caracteres';
      return;
    }

    this.isLoading = true;

    const userData = {
      ...this.user,
      userRol: 'CLIENTE', // Default role
      userStatus: true,
      enterpriseId: null
    };

    this.http.post(`${this.apiUrl}/auth/register`, userData).subscribe({
      next: (response) => {
        this.isLoading = false;
        // Redirect to login or home after successful registration
        this.router.navigate(['/auth/login']);
      },
      error: (error) => {
        this.isLoading = false;
        if (error.status === 409) {
          this.errorMessage = 'El nombre de usuario ya está en uso';
        } else if (error.status === 400) {
          this.errorMessage = 'Por favor complete todos los campos requeridos';
        } else {
          this.errorMessage = 'Error al crear la cuenta. Intente de nuevo más tarde.';
        }
        console.error('Registration error:', error);
      }
    });
  }

  goToLogin(): void {
    this.router.navigate(['/auth/login']);
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}
