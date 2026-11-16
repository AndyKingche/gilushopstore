import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from '../../core/services/auth.service';

export interface OrderDetail {
  id: number;
  quantity: number;
  description: string;
}

export interface CustomerOrder {
  id: number;
  orderNumber: string | null;
  orderDate: string | null;
  dateCreated: string | null;
  orderTotal: number | null;
  orderStatus: string | null;
  details: OrderDetail[] | null;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private readonly ordersUrl = `${environment.apiUrl}api/v1/gessa/orders`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  getMyOrders(): Observable<CustomerOrder[]> {
    const token = this.authService.token();
    if (!token) {
      return throwError(() => new Error('Se requiere una sesión para consultar los pedidos.'));
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`
    });

    return this.http.get<CustomerOrder[]>(this.ordersUrl, { headers });
  }
}
