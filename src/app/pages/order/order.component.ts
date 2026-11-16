import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CustomerOrder, OrderService } from './order.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {
  orders: CustomerOrder[] = [];
  isLoading = false;
  errorMessage = '';
  needsLogin = false;

  constructor(
    public authService: AuthService,
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  get displayName(): string {
    return this.authService.userName() || 'Mi cuenta';
  }

  get initials(): string {
    const name = this.displayName.trim();
    return name.charAt(0).toUpperCase() || 'G';
  }

  loadOrders(): void {
    if (!this.authService.isLoggedIn()) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.needsLogin = false;

    this.orderService.getMyOrders().subscribe({
      next: orders => {
        this.orders = [...orders].sort((first, second) => {
          const firstDate = first.orderDate || first.dateCreated || '';
          const secondDate = second.orderDate || second.dateCreated || '';
          return new Date(secondDate).getTime() - new Date(firstDate).getTime();
        });
        this.isLoading = false;
      },
      error: (error: HttpErrorResponse) => {
        this.isLoading = false;
        this.needsLogin = error.status === 401;
        this.errorMessage = this.getErrorMessage(error);
        console.error('Error al cargar los pedidos del cliente:', error);
      }
    });
  }

  openLogin(): void {
    this.router.navigate(['/auth/login']);
  }

  orderDescription(order: CustomerOrder): string {
    const details = order.details || [];
    if (details.length === 0) {
      return 'Detalle pendiente';
    }

    const firstDetail = details[0];
    const quantity = firstDetail.quantity > 1 ? `${firstDetail.quantity} × ` : '';
    const extraProducts = details.length > 1 ? ` y ${details.length - 1} más` : '';
    return `${quantity}${firstDetail.description || 'Producto'}${extraProducts}`;
  }

  orderNumber(order: CustomerOrder): string {
    return order.orderNumber || `#${order.id}`;
  }

  statusLabel(status: string | null): string {
    const normalized = this.normalizeStatus(status);
    const labels: Record<string, string> = {
      pending: 'Pendiente',
      pendiente: 'Pendiente',
      confirmed: 'Confirmado',
      confirmado: 'Confirmado',
      approved: 'Confirmado',
      processing: 'En preparación',
      preparing: 'En preparación',
      shipped: 'En camino',
      in_transit: 'En camino',
      delivered: 'Entregado',
      entregado: 'Entregado',
      completed: 'Completado',
      cancelled: 'Cancelado',
      canceled: 'Cancelado'
    };

    return labels[normalized] || (status ? this.toTitleCase(status) : 'Por confirmar');
  }

  statusClass(status: string | null): string {
    const normalized = this.normalizeStatus(status);
    if (['delivered', 'entregado', 'completed'].includes(normalized)) {
      return 'status--complete';
    }
    if (['cancelled', 'canceled'].includes(normalized)) {
      return 'status--cancelled';
    }
    if (['shipped', 'in_transit', 'processing', 'preparing'].includes(normalized)) {
      return 'status--progress';
    }
    if (['pending', 'pendiente', 'confirmed', 'confirmado', 'approved'].includes(normalized)) {
      return 'status--pending';
    }
    return 'status--neutral';
  }

  trackByOrder(_: number, order: CustomerOrder): number {
    return order.id;
  }

  private normalizeStatus(status: string | null): string {
    return (status || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .trim()
      .toLowerCase()
      .replace(/[\s-]+/g, '_');
  }

  private toTitleCase(status: string): string {
    return status
      .replace(/[_-]+/g, ' ')
      .toLowerCase()
      .replace(/\b\w/g, character => character.toUpperCase());
  }

  private getErrorMessage(error: HttpErrorResponse): string {
    if (error.status === 0) {
      return 'No pudimos conectar con la tienda. Revisa tu conexión e inténtalo de nuevo.';
    }
    if (error.status === 401) {
      return 'Tu sesión expiró. Inicia sesión de nuevo para consultar tus pedidos.';
    }
    if (error.status === 403) {
      return 'Tu cuenta no tiene acceso a estos pedidos. Inicia sesión con tu cuenta de cliente.';
    }
    return 'No pudimos cargar tus pedidos en este momento. Inténtalo de nuevo.';
  }
}
