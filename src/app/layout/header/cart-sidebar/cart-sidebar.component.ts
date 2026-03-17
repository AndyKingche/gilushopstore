import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Router } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';
import { CartItem } from '../../../core/models/cart-item.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-cart-sidebar',
  templateUrl: './cart-sidebar.component.html',
  styleUrls: ['./cart-sidebar.component.scss'],
  animations: [
    trigger('slideAnimation', [
      state('closed', style({
        transform: 'translateX(100%)'
      })),
      state('open', style({
        transform: 'translateX(0)'
      })),
      transition('closed => open', [
        animate('300ms ease-out')
      ]),
      transition('open => closed', [
        animate('300ms ease-in')
      ])
    ]),
    trigger('fadeAnimation', [
      state('closed', style({
        opacity: 0
      })),
      state('open', style({
        opacity: 1
      })),
      transition('closed => open', [
        animate('300ms ease-out')
      ]),
      transition('open => closed', [
        animate('300ms ease-in')
      ])
    ])
  ]
})
export class CartSidebarComponent implements OnInit, OnChanges {
  private _isOpen = false;
  
  @Input()
  get isOpen(): boolean {
    return this._isOpen;
  }
  set isOpen(value: boolean) {
    this._isOpen = value;
    if (value) {
      this.checkAuth();
      this.cdr.detectChanges();
    }
  }

  @Output() close = new EventEmitter<void>();

  cartItems$: Observable<CartItem[]>;
  total = 0;
  isLoggedIn = false;
  userName = '';

  constructor(
    private cdr: ChangeDetectorRef,
    private cartService: CartService,
    private router: Router
  ) {
    this.cartItems$ = this.cartService.items$;
  }

  ngOnInit(): void {
    this.cartService.items$.subscribe(items => {
      this.total = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen'] && changes['isOpen'].currentValue === true) {
      this.checkAuth();
      this.cdr.detectChanges();
    }
  }

  checkAuth(): void {
    const token = localStorage.getItem('authToken');
    const name = localStorage.getItem('userName');
    this.isLoggedIn = !!token;
    this.userName = name || '';
  }

  logout(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userName');
    this.isLoggedIn = false;
    this.userName = '';
    this.router.navigate(['/']);
  }

  onClose(): void {
    this.close.emit();
  }

  removeItem(productId: string): void {
    this.cartService.removeItem(productId);
  }

  updateQuantity(productId: string, quantity: number): void {
    this.cartService.updateQuantity(productId, quantity);
  }

  clearCart(): void {
    this.cartService.clearCart();
  }

  checkout(): void {
    // Check if user is authenticated before checkout
    if (!this.cartService.isAuthenticated()) {
      this.onClose();
      // Navigate to login
      this.router.navigate(['/auth/login']);
      return;
    }
    
    this.cartService.openWhatsApp();
  }
}
