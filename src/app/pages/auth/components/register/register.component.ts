import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

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
export class RegisterComponent implements OnInit {
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

  // Use the correct backend port
  private apiUrl = environment.apiUrl+'api/v1/gessa/user';

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

    // Use the exact fields from UserDTO
    const userData = {
      userName: this.user.userName,
      userFirstname: this.user.userFirstname,
      userLastname: this.user.userLastname,
      userPassword: this.user.userPassword,
      userGender: this.user.userGender,
      userIdentification: this.user.userIdentification,
      userRuc: this.user.userRuc || null,
      userRol: 'CLIENTE',
      userStatus: true,
      enterpriseId: 1
    };

    this.http.post(`${this.apiUrl}/create-user`, userData).subscribe({
      next: (response) => {
        this.isLoading = false;
        // Redirect to login after successful registration
        this.router.navigate(['/auth/login']);
      },
      error: (error) => {
        this.isLoading = false;
        if (error.status === 409) {
          this.errorMessage = 'El nombre de usuario ya está en uso';
        } else if (error.status === 400) {
          this.errorMessage = 'Por favor complete todos los campos requeridos';
        } else if (error.status === 0) {
          this.errorMessage = 'No se pudo conectar al servidor. Intente más tarde.';
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
