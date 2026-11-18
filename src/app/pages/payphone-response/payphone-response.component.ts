import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';
import {
  PayphoneConfirmationResponse,
  PayphoneConfirmationService
} from '../../core/services/payphone-confirmation.service';

type PaymentState = 'loading' | 'approved' | 'rejected' | 'error';

interface ConfirmationRequest {
  id: number;
  clientTransactionId: string;
}

@Component({
  selector: 'app-payphone-response',
  templateUrl: './payphone-response.component.html',
  styleUrls: ['./payphone-response.component.scss']
})
export class PayphoneResponseComponent implements OnInit {
  state: PaymentState = 'loading';
  response: PayphoneConfirmationResponse | null = null;
  errorMessage = 'No se pudo verificar el pago. Revisa la información e inténtalo de nuevo.';
  isVerifying = false;

  private confirmationRequest: ConfirmationRequest | null = null;

  get canRetryVerification(): boolean {
    return this.confirmationRequest !== null;
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private confirmationService: PayphoneConfirmationService,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const rawId = this.route.snapshot.queryParamMap.get('id');
    const clientTransactionId = this.route.snapshot.queryParamMap.get('clientTransactionId')?.trim();
    const id = rawId === null ? Number.NaN : Number(rawId);

    if (!Number.isSafeInteger(id) || id <= 0 || !clientTransactionId) {
      this.state = 'error';
      this.errorMessage = 'No se recibieron los datos necesarios para verificar el pago.';
      return;
    }

    this.confirmationRequest = { id, clientTransactionId };
    this.verifyPayment();
  }

  retryVerification(): void {
    if (this.state === 'error') {
      this.verifyPayment(true);
    }
  }

  returnToStore(): void {
    this.router.navigate(['/shop']);
  }

  retryPurchase(): void {
    this.router.navigate(['/shop']);
  }

  private verifyPayment(retry = false): void {
    if (!this.confirmationRequest || this.isVerifying) {
      return;
    }

    this.state = 'loading';
    this.response = null;
    this.isVerifying = true;

    console.log('Verifying payment with request:', this.confirmationRequest, 'Retry:', retry);
    this.confirmationService.confirm(
      this.confirmationRequest.id,
      this.confirmationRequest.clientTransactionId,
      retry
    ).pipe(
      finalize(() => this.isVerifying = false)
    ).subscribe({
      next: response => {
        this.response = response;
        console.log('Received payment confirmation response:', response);
        this.state = this.getPaymentState(response);

        if (this.state === 'error') {
          this.errorMessage = 'No se pudo interpretar la respuesta del pago. Intenta verificarlo de nuevo.';
        }
      },
      error: () => {
        this.state = 'error';
        this.errorMessage = 'No pudimos conectar con el servicio de pagos. Intenta verificarlo de nuevo.';
      }
    });
  }

  private getPaymentState(response: PayphoneConfirmationResponse): PaymentState {
    if (typeof response.statusCode === 'number') {
      return response.statusCode === 3 ? 'approved' : 'rejected';
    }

    const status = response.transactionStatus?.trim().toLowerCase();
    if (status === 'approved') {
      return 'approved';
    }
    if (status && /cancel|reject|declin/.test(status)) {
      return 'rejected';
    }

    return 'error';
  }
}
