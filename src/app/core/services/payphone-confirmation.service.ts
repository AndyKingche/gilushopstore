import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, shareReplay, throwError, timeout } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface PayphoneConfirmationResponse {
  statusCode?: number;
  transactionStatus?: string | null;
  transactionId?: number | string | null;
  authorizationCode?: string | null;
  clientTransactionId?: string | null;
  amount?: number | null;
  currency?: string | null;
}

export interface PayphoneOrderDetail {
  quantity: number;
  description: string;
  totalValue: number;
  totalValueWithoutTax: number;
  productTax: number;
}

export interface PayphoneOrderRequest {
  orderStatus: string;
  orderKind: string;
  orderTax: number;
  orderDate: string;
  orderTotal: number;
  userId: number | null;
  clientId: number | null;
  enterpriseId: number | null;
  invoiceId: number | null;
  nameOrder: string;
  identificationOrder: string;
  cellphoneOrder: string;
  cityOrder: string;
  provinceOrder: string;
  addressReference: string;
  details: PayphoneOrderDetail[];
}

@Injectable({
  providedIn: 'root'
})
export class PayphoneConfirmationService {
  private readonly endpoint = `${environment.apiUrl}api/v1/gessa/payphone/response`;
  private readonly confirmations = new Map<string, Observable<PayphoneConfirmationResponse>>();

  constructor(private http: HttpClient) {}

  confirm(
    id: number,
    clientTransactionId: string,
    order: PayphoneOrderRequest,
    retry = false
  ): Observable<PayphoneConfirmationResponse> {
    const key = JSON.stringify([id, clientTransactionId]);
    if (retry) {
      this.confirmations.delete(key);
    }

    const cachedConfirmation = this.confirmations.get(key);
    if (cachedConfirmation) {
      return cachedConfirmation;
    }

    let request: Observable<PayphoneConfirmationResponse>;
    request = this.http.post<PayphoneConfirmationResponse>(
      this.endpoint,
      { id, clientTransactionId, order }
    ).pipe(
      timeout(45_000),
      map(response => {
        if (
          !response
          || (typeof response.statusCode !== 'number' && typeof response.transactionStatus !== 'string')
        ) {
          throw new Error('Invalid response from PayPhone confirmation endpoint');
        }
        return response;
      }),
      catchError(error => {
        if (this.confirmations.get(key) === request) {
          this.confirmations.delete(key);
        }
        return throwError(() => error);
      }),
      shareReplay({ bufferSize: 1, refCount: false })
    );
    this.confirmations.set(key, request);

    return request;
  }
}
