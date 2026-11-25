import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from 'src/environments/environment';
import {
  PayphoneConfirmationResponse,
  PayphoneConfirmationService,
  PayphoneOrderRequest
} from './payphone-confirmation.service';

describe('PayphoneConfirmationService', () => {
  let service: PayphoneConfirmationService;
  let httpMock: HttpTestingController;
  const order: PayphoneOrderRequest = {
    orderStatus: 'Pendiente',
    orderKind: 'Venta online',
    orderTax: 1.5,
    orderDate: '2026-11-19',
    orderTotal: 11.5,
    userId: 12,
    clientId: 34,
    enterpriseId: 1,
    invoiceId: null,
    nameOrder: 'Ana García',
    identificationOrder: '0912345678',
    cellphoneOrder: '0991234567',
    cityOrder: 'Quito',
    provinceOrder: 'Pichincha',
    addressReference: 'Av. Central y calle 1',
    details: [{
      quantity: 1,
      description: 'Producto (Marca)',
      totalValue: 11.5,
      totalValueWithoutTax: 10,
      productTax: 1.5
    }]
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(PayphoneConfirmationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('sends one POST for concurrent confirmations of the same transaction', () => {
    const response: PayphoneConfirmationResponse = {
      statusCode: 3,
      transactionStatus: 'Approved',
      transactionId: 23178284,
      authorizationCode: 'W23178284'
    };
    let firstResponse: PayphoneConfirmationResponse | undefined;
    let secondResponse: PayphoneConfirmationResponse | undefined;

    service.confirm(42, 'ID-42', order).subscribe(value => firstResponse = value);
    service.confirm(42, 'ID-42', order).subscribe(value => secondResponse = value);

    const request = httpMock.expectOne(`${environment.apiUrl}api/v1/gessa/payphone/response`);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ id: 42, clientTransactionId: 'ID-42', order });
    request.flush(response);

    expect(firstResponse).toEqual(response);
    expect(secondResponse).toEqual(response);
  });

  it('allows another confirmation after the request fails', () => {
    let retryResponse: PayphoneConfirmationResponse | undefined;

    service.confirm(42, 'ID-42', order).subscribe({ error: () => undefined });
    httpMock.expectOne(`${environment.apiUrl}api/v1/gessa/payphone/response`).flush(
      { message: 'Server error' },
      { status: 500, statusText: 'Server Error' }
    );

    service.confirm(42, 'ID-42', order).subscribe(value => retryResponse = value);
    const retryRequest = httpMock.expectOne(`${environment.apiUrl}api/v1/gessa/payphone/response`);
    expect(retryRequest.request.method).toBe('POST');
    retryRequest.flush({ statusCode: 3, transactionStatus: 'Approved' });

    expect(retryResponse?.transactionStatus).toBe('Approved');
  });
});
