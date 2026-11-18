import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from 'src/environments/environment';
import { PayphoneConfirmationResponse, PayphoneConfirmationService } from './payphone-confirmation.service';

describe('PayphoneConfirmationService', () => {
  let service: PayphoneConfirmationService;
  let httpMock: HttpTestingController;

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

    service.confirm(42, 'ID-42').subscribe(value => firstResponse = value);
    service.confirm(42, 'ID-42').subscribe(value => secondResponse = value);

    const request = httpMock.expectOne(`${environment.apiUrl}api/v1/payphone/response`);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ id: 42, clientTransactionId: 'ID-42' });
    request.flush(response);

    expect(firstResponse).toEqual(response);
    expect(secondResponse).toEqual(response);
  });

  it('allows another confirmation after the request fails', () => {
    let retryResponse: PayphoneConfirmationResponse | undefined;

    service.confirm(42, 'ID-42').subscribe({ error: () => undefined });
    httpMock.expectOne(`${environment.apiUrl}api/v1/payphone/response`).flush(
      { message: 'Server error' },
      { status: 500, statusText: 'Server Error' }
    );

    service.confirm(42, 'ID-42').subscribe(value => retryResponse = value);
    const retryRequest = httpMock.expectOne(`${environment.apiUrl}api/v1/payphone/response`);
    expect(retryRequest.request.method).toBe('POST');
    retryRequest.flush({ statusCode: 3, transactionStatus: 'Approved' });

    expect(retryResponse?.transactionStatus).toBe('Approved');
  });
});
