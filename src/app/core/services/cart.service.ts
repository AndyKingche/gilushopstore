import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CartItem } from '../models/cart-item.model';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems$ = new BehaviorSubject<CartItem[]>([]);
  private readonly WHATSAPP_NUMBER = '+593982901603'; // Replace with actual number

  items$: Observable<CartItem[]> = this.cartItems$.asObservable();

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

  removeItem(productId: string): void {
    const currentItems = this.cartItems$.getValue();
    const updatedItems = currentItems.filter(item => item.product.id !== productId);
    this.cartItems$.next(updatedItems);
  }

  updateQuantity(productId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeItem(productId);
      return;
    }
    
    const currentItems = this.cartItems$.getValue();
    const updatedItems = currentItems.map(item =>
      item.product.id === productId
        ? { ...item, quantity }
        : item
    );
    this.cartItems$.next(updatedItems);
  }

  clearCart(): void {
    this.cartItems$.next([]);
  }

  getTotal(): number {
    const items = this.cartItems$.getValue();
    return items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  }

  getItemCount(): number {
    const items = this.cartItems$.getValue();
    return items.reduce((count, item) => count + item.quantity, 0);
  }

  generateWhatsAppMessage(): string {
    const items = this.cartItems$.getValue();
    if (items.length === 0) {
      return '';
    }

    const lines = items.map(item => 
      `• ${item.product.name} (${item.product.brand}) x${item.quantity} - $${item.product.price.toFixed(2)}`
    );
    const total = this.getTotal();
    
    const message = `Hola Gilú! Me gustaría hacer el siguiente pedido:\n\n${lines.join('\n')}\n\nTotal: $${total.toFixed(2)}\n\nQuedo atenta, gracias!`;
    
    return `https://wa.me/${this.WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  }

  openWhatsApp(): void {
    const url = this.generateWhatsAppMessage();
    if (url) {
      window.open(url, '_blank');
    }
  }
}
