import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, ChangeDetectorRef, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Router } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';
import { CartItem } from '../../../core/models/cart-item.model';
import { Observable } from 'rxjs';
import { ModalService } from '../../../core/services/modal.service';
declare const PPaymentButtonBox: any;

@Component({
  selector: 'app-cart-sidebar',
  templateUrl: './cart-sidebar.component.html',
  styleUrls: ['./cart-sidebar.component.scss'],
  animations: [
    trigger('slideAnimation', [
      state('closed', style({ transform: 'translateX(100%)' })),
      state('open', style({ transform: 'translateX(0)' })),
      transition('closed => open', [animate('300ms ease-out')]),
      transition('open => closed', [animate('300ms ease-in')])
    ]),
    trigger('fadeAnimation', [
      state('closed', style({ opacity: 0 })),
      state('open', style({ opacity: 1 })),
      transition('closed => open', [animate('300ms ease-out')]),
      transition('open => closed', [animate('300ms ease-in')])
    ])
  ]
})
export class CartSidebarComponent implements OnInit, OnChanges {
  private _isOpen = false;

  @Input()
  get isOpen(): boolean { return this._isOpen; }
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
    private router: Router,
    private modalService: ModalService,
    @Inject(PLATFORM_ID) private platformId: Object
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
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('authToken');
      const name = localStorage.getItem('userName');
      this.isLoggedIn = !!token;
      this.userName = name || '';
    }
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userName');
    }
    this.isLoggedIn = false;
    this.userName = '';
    this.router.navigate(['/']);
  }

  onClose(): void { this.close.emit(); }
  removeItem(productId: string): void { this.cartService.removeItem(productId); }
  updateQuantity(productId: string, quantity: number): void { this.cartService.updateQuantity(productId, quantity); }
  clearCart(): void { this.cartService.clearCart(); }

  checkout(): void {
    this.cartService.openWhatsApp();
  }

  abrirModal(): void {
    this.modalService.open();
  }

  cerrarModal(): void {
    this.modalService.close();
  }

  ejecutarCajitaPagos(): void {
    console.log('Ejecutando cajita de pagos...');
    const clientTransactionID =
      'ID-' + Date.now();

    const ppb = new PPaymentButtonBox({

      // Credenciales Payphone
      token: '3jtUVems9W2y8PEzJhvuHq-b5ekYYeweeB67Dk-WZ7endgaQCQs5OZuThvreYQ8Imkptelo810je_yY8BTxotniVsbbMIqFc6RJyl12yicj1ZOGpLGapnSvK6ApHwAxSkLr48fwOBCJRScvmdYpDsFqqb_mC3C9lqP4aZPczUybmS3lvmgKQxw-ajVrM7zhfM_-PgOouc2Kv6FW8kLRHmPdbgn4BK7uHbyXWmwStKdl6AkkgXrbwCWi4AWv1JG2iui2QhnI--kDWaKljLVjpQlJS9txKFO2ltOHkfgC8LT9rJkvxLw1ZLSyjT7-Y0GQFOdmWgA',
      storeId: 'ab1f3a83-071b-45c1-a8d2-1c79b05d0e5b',

      // Valores en centavos
      amount: 315,
      amountWithoutTax: 200,
      amountWithTax: 100,
      tax: 15,

      service: 0,
      tip: 0,

      currency: 'USD',

      clientTransactionId: clientTransactionID,

      reference: 'Pago de factura',

      backgroundColor: '#6610f2'

    });

    this.modalService.open();

    setTimeout(() => ppb.render('#pp-button'), 0);
  }
}