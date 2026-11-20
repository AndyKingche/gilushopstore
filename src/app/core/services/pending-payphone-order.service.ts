import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { PayphoneOrderRequest } from './payphone-confirmation.service';

interface PendingOrder {
  clientTransactionId: string;
  order: PayphoneOrderRequest;
}

@Injectable({
  providedIn: 'root'
})
export class PendingPayphoneOrderService {
  private readonly storageKey = 'pendingPayphoneOrder';

  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  save(clientTransactionId: string, order: PayphoneOrderRequest): void {
    this.storage().setItem(this.storageKey, JSON.stringify({ clientTransactionId, order }));
  }

  load(clientTransactionId: string): PayphoneOrderRequest | null {
    const storedOrder = this.storage().getItem(this.storageKey);
    if (!storedOrder) {
      return null;
    }

    let pendingOrder: unknown;
    try {
      pendingOrder = JSON.parse(storedOrder);
    } catch {
      throw new Error('Los datos guardados de la orden no son válidos.');
    }

    if (!this.isPendingOrder(pendingOrder)) {
      throw new Error('Los datos guardados de la orden no son válidos.');
    }

    return pendingOrder.clientTransactionId === clientTransactionId ? pendingOrder.order : null;
  }

  remove(clientTransactionId: string): void {
    if (this.load(clientTransactionId)) {
      this.storage().removeItem(this.storageKey);
    }
  }

  private storage(): Storage {
    if (!isPlatformBrowser(this.platformId)) {
      throw new Error('El almacenamiento del navegador no está disponible.');
    }
    return window.sessionStorage;
  }

  private isPendingOrder(value: unknown): value is PendingOrder {
    if (typeof value !== 'object' || value === null || !('clientTransactionId' in value) || !('order' in value)) {
      return false;
    }

    const order = value.order;
    if (
      typeof value.clientTransactionId !== 'string'
      || typeof order !== 'object'
      || order === null
      || !('orderStatus' in order)
      || typeof order.orderStatus !== 'string'
      || !('orderKind' in order)
      || typeof order.orderKind !== 'string'
      || !('orderTax' in order)
      || typeof order.orderTax !== 'number'
      || !Number.isFinite(order.orderTax)
      || !('orderDate' in order)
      || typeof order.orderDate !== 'string'
      || !('orderTotal' in order)
      || typeof order.orderTotal !== 'number'
      || !Number.isFinite(order.orderTotal)
      || !('nameOrder' in order)
      || typeof order.nameOrder !== 'string'
      || !('identificationOrder' in order)
      || typeof order.identificationOrder !== 'string'
      || !('cellphoneOrder' in order)
      || typeof order.cellphoneOrder !== 'string'
      || !('cityOrder' in order)
      || typeof order.cityOrder !== 'string'
      || !('provinceOrder' in order)
      || typeof order.provinceOrder !== 'string'
      || !('addressReference' in order)
      || typeof order.addressReference !== 'string'
      || !('details' in order)
      || !Array.isArray(order.details)
      || order.details.length === 0
    ) {
      return false;
    }

    return order.details.every(detail => (
      typeof detail === 'object'
      && detail !== null
      && 'quantity' in detail
      && typeof detail.quantity === 'number'
      && Number.isInteger(detail.quantity)
      && detail.quantity > 0
      && 'description' in detail
      && typeof detail.description === 'string'
      && 'totalValue' in detail
      && typeof detail.totalValue === 'number'
      && Number.isFinite(detail.totalValue)
      && 'totalValueWithoutTax' in detail
      && typeof detail.totalValueWithoutTax === 'number'
      && Number.isFinite(detail.totalValueWithoutTax)
      && 'productTax' in detail
      && typeof detail.productTax === 'number'
      && Number.isFinite(detail.productTax)
    ));
  }
}
