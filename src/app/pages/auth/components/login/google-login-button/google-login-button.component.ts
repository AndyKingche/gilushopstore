import { AfterViewInit, Component, ElementRef, inject, NgZone, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/core/services/auth.service';

declare const google: any;

@Component({
  selector: 'app-google-login-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './google-login-button.component.html',
  styleUrls: ['./google-login-button.component.scss']
})
export class GoogleLoginButtonComponent implements AfterViewInit {
  @ViewChild('btn') btn!: ElementRef<HTMLElement>;
  private auth = inject(AuthService);
  private zone = inject(NgZone);

  ngAfterViewInit() {
    google.accounts.id.initialize({
      client_id: environment.googleClientId,
      callback: (resp: { credential: string }) =>
        this.zone.run(() => this.auth.loginWithGoogle(resp.credential).subscribe()),
    });
    google.accounts.id.renderButton(this.btn.nativeElement, {
      size: 'large', text: 'signin_with', width: 280, theme: 'outline_dark',
      shape: 'pill',
    });
  }
}
