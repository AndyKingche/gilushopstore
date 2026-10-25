import { AfterViewInit, Component, ElementRef, inject, NgZone, OnDestroy, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/core/services/auth.service';
import { Router } from '@angular/router';

declare const google: any;

@Component({
  selector: 'app-google-login-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './google-login-button.component.html',
  styleUrls: ['./google-login-button.component.scss']
})
export class GoogleLoginButtonComponent implements AfterViewInit, OnDestroy {
  @ViewChild('btn', { static: true }) btn!: ElementRef<HTMLElement>;

  private auth = inject(AuthService);
  private router = inject(Router);
  private zone = inject(NgZone);

  errorMessage = '';
  private timer?: ReturnType<typeof setInterval>;

  ngAfterViewInit() {
    if (typeof google !== 'undefined') {
      this.init();
      return;
    }
    // el script de Google puede tardar en cargar
    let tries = 0;
    this.timer = setInterval(() => {
      if (typeof google !== 'undefined') {
        clearInterval(this.timer);
        this.init();
      } else if (++tries > 50) {
        clearInterval(this.timer);
        this.errorMessage = 'No se pudo cargar el inicio de sesión con Google.';
      }
    }, 100);
  }

  ngOnDestroy() {
    if (this.timer) clearInterval(this.timer);
  }

  private init() {
    google.accounts.id.initialize({
      client_id: environment.googleClientId,
      callback: (resp: { credential: string }) =>
        this.zone.run(() =>
          this.auth.loginWithGoogle(resp.credential).subscribe({
            next: () => this.router.navigate(['/']),     // cambia por la ruta a donde quieras enviar al cliente
            error: () => (this.errorMessage = 'No se pudo iniciar sesión con Google.'),
          })
        ),
    });
    google.accounts.id.renderButton(this.btn.nativeElement, {
      size: 'large', text: 'signin_with', width: 280, theme: 'filled_black',
      shape: 'pill',
    });
  }
}
