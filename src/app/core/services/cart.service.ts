import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';
import { CartItem } from '../models/cart-item.model';
import { Product } from '../models/product.model';
import { OrderCodeService } from './order-code.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems$ = new BehaviorSubject<CartItem[]>([]);
  private readonly WHATSAPP_NUMBER = '+593982901603';
  items$: Observable<CartItem[]> = this.cartItems$.asObservable();

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private orderCodeService: OrderCodeService
  ) { }

  private getLocalStorage(key: string): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem(key);
    }
    return null;
  }

  addItem(product: Product): void {
    const currentItems = this.cartItems$.getValue();
    const existingItem = currentItems.find(item => item.product.id === product.id);
    if (existingItem) {
      const updatedItems = currentItems.map(item =>
        item.product.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      this.cartItems$.next(updatedItems);
    } else {
      this.cartItems$.next([...currentItems, { product, quantity: 1 }]);
    }
  }

  isAuthenticated(): boolean {
    const token = this.getLocalStorage('authToken');
    const userName = this.getLocalStorage('userName');
    return !!token && !!userName;
  }

  removeItem(productId: string): void {
    const currentItems = this.cartItems$.getValue();
    this.cartItems$.next(currentItems.filter(item => item.product.id !== productId));
  }

  updateQuantity(productId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeItem(productId);
      return;
    }
    const currentItems = this.cartItems$.getValue();
    this.cartItems$.next(currentItems.map(item =>
      item.product.id === productId ? { ...item, quantity } : item
    ));
  }

  clearCart(): void {
    this.cartItems$.next([]);
  }

  getTotal(): number {
    return this.cartItems$.getValue().reduce((total, item) => total + (item.product.price * item.quantity), 0);
  }

  getItemCount(): number {
    return this.cartItems$.getValue().reduce((count, item) => count + item.quantity, 0);
  }

  generateWhatsAppMessage(): string {
    const items = this.cartItems$.getValue();
    if (items.length === 0) return '';
    const orderCode = this.orderCodeService.generateOrderCode();
    // const lines = items.map(item =>
    //   `• 🛍️ ${item.product.name} (${item.product.brand}) x${item.quantity} - $${item.product.price.toFixed(2)}`
    // );
    const lines = items.map(item =>
      `• *${item.product.name}* (${item.product.brand})
          Cantidad: ${item.quantity}
          Precio: $${item.product.price.toFixed(2)}`
    );
    const total = this.getTotal();
    const message = `Hola *Gilú Shop*! Vengo de la tienda Online y me gustaría hacer el siguiente pedido:\n\n • Código de Orden: *${orderCode}*\n\n${lines.join('\n')}\n\n • *Total: $${total.toFixed(2)}*\n\nQuedo atenta, gracias!`;
    return `https://wa.me/${this.WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  }

  openWhatsApp(): void {
    if (isPlatformBrowser(this.platformId)) {
      const url = this.generateWhatsAppMessage();
      if (url) {
        window.open(url, '_blank');
        this.clearCart();
      }
    }
  }
}