import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges, ChangeDetectorRef, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Router } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';
import { CartItem } from '../../../core/models/cart-item.model';
import { Observable } from 'rxjs';
import { ModalService } from '../../../core/services/modal.service';
import { environment } from 'src/environments/environment';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { PayphoneOrderRequest } from '../../../core/services/payphone-confirmation.service';
import { PendingPayphoneOrderService } from '../../../core/services/pending-payphone-order.service';

interface CheckoutFormControls {
  nameOrder: FormControl<string>;
  identificationOrder: FormControl<string>;
  cellphoneOrder: FormControl<string>;
  provinceOrder: FormControl<string>;
  cityOrder: FormControl<string>;
  addressReference: FormControl<string>;
}

interface PayphoneButtonOptions {
  token: string;
  storeId: string;
  amount: number;
  amountWithoutTax: number;
  amountWithTax: number;
  tax: number;
  service: number;
  tip: number;
  currency: string;
  clientTransactionId: string;
  reference: string;
  backgroundColor: string;
}

declare const PPaymentButtonBox: new (options: PayphoneButtonOptions) => {
  render: (selector: string) => void;
};

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
  showCheckout = false;
  paymentError = '';
  isPreparingPayment = false;
  checkoutForm!: FormGroup<CheckoutFormControls>;

  constructor(
    private cdr: ChangeDetectorRef,
    private cartService: CartService,
    private router: Router,
    private modalService: ModalService,
    private formBuilder: FormBuilder,
    private pendingOrderService: PendingPayphoneOrderService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.cartItems$ = this.cartService.items$;
  }

  ngOnInit(): void {
    this.checkoutForm = this.formBuilder.nonNullable.group({
      nameOrder: ['', [Validators.required, Validators.pattern(/\S/), Validators.minLength(2), Validators.maxLength(100)]],
      identificationOrder: ['', [Validators.required, Validators.pattern(/^(?:\d{10}|\d{13})$/)]],
      cellphoneOrder: ['', [Validators.required, Validators.pattern(/^\d{10,13}$/)]],
      provinceOrder: ['', [Validators.required, Validators.pattern(/\S/), Validators.minLength(2), Validators.maxLength(80)]],
      cityOrder: ['', [Validators.required, Validators.pattern(/\S/), Validators.minLength(2), Validators.maxLength(80)]],
      addressReference: ['', [Validators.required, Validators.pattern(/\S/), Validators.minLength(5), Validators.maxLength(240)]]
    });

    this.cartService.items$.subscribe(items => {
      this.total = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
      if (items.length === 0) {
        this.showCheckout = false;
      }
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

  vistaPago(): void {
    if (this.cartService.getItemCount() === 0) {
      return;
    }
    this.paymentError = '';
    this.showCheckout = true;
  }

  volverAlCarrito(): void {
    this.showCheckout = false;
    this.paymentError = '';
  }

  abrirModal(): void {
    this.modalService.open();
  }

  cerrarModal(): void {
    this.modalService.close();
  }

  ejecutarCajitaPagos(): void {
    this.checkoutForm.markAllAsTouched();
    this.paymentError = '';

    if (this.checkoutForm.invalid || this.cartService.getItemCount() === 0 || this.isPreparingPayment) {
      return;
    }
    if (!isPlatformBrowser(this.platformId)) {
      this.paymentError = 'El pago solo se puede iniciar desde un navegador.';
      return;
    }
    if (typeof PPaymentButtonBox === 'undefined') {
      this.paymentError = 'No pudimos cargar Payphone. Actualiza la página e inténtalo de nuevo.';
      return;
    }

    this.isPreparingPayment = true;
    const clientTransactionID = 'ID-' + Date.now();
    const items = this.cartService.getItems();
    const amount = Math.round(this.cartService.getTotal() * 100);
    const amountWithTax = Math.round(amount / 1.15);
    const tax = amount - amountWithTax;
    const order = this.buildOrderRequest(items, tax);

    try {
      this.pendingOrderService.save(clientTransactionID, order);
      const ppb = new PPaymentButtonBox({

        // Credenciales Payphone
        token: '3jtUVems9W2y8PEzJhvuHq-b5ekYYeweeB67Dk-WZ7endgaQCQs5OZuThvreYQ8Imkptelo810je_yY8BTxotniVsbbMIqFc6RJyl12yicj1ZOGpLGapnSvK6ApHwAxSkLr48fwOBCJRScvmdYpDsFqqb_mC3C9lqP4aZPczUybmS3lvmgKQxw-ajVrM7zhfM_-PgOouc2Kv6FW8kLRHmPdbgn4BK7uHbyXWmwStKdl6AkkgXrbwCWi4AWv1JG2iui2QhnI--kDWaKljLVjpQlJS9txKFO2ltOHkfgC8LT9rJkvxLw1ZLSyjT7-Y0GQFOdmWgA',
        storeId: 'ab1f3a83-071b-45c1-a8d2-1c79b05d0e5b',

        // Los precios del catálogo incluyen IVA del 15%; PayPhone recibe valores en centavos.
        amount,
        amountWithoutTax: 0,
        amountWithTax,
        tax,

        service: 0,
        tip: 0,

        currency: 'USD',

        clientTransactionId: clientTransactionID,

        reference: 'Compra en GILÚ SHOP',

        backgroundColor: '#D95F80'

      });

      this.modalService.open();
      setTimeout(() => ppb.render('#pp-button'), 0);
    } catch (error) {
      console.error('No se pudo preparar el pago con Payphone.', error);
      this.paymentError = 'No pudimos preparar el pago. Revisa tu conexión e inténtalo de nuevo.';
    } finally {
      this.isPreparingPayment = false;
    }
  }

  private buildOrderRequest(items: CartItem[], taxCents: number): PayphoneOrderRequest {
    const form = this.checkoutForm.getRawValue();
    const details = items.map(item => {
      const totalCents = Math.round(item.product.price * item.quantity * 100);
      const netCents = Math.round(totalCents / 1.15);
      return {
        quantity: item.quantity,
        description: `${item.product.name} (${item.product.brand})`,
        totalValue: totalCents / 100,
        totalValueWithoutTax: netCents / 100,
        productTax: (totalCents - netCents) / 100
      };
    });
    const today = new Date();
    const orderDate = [
      today.getFullYear(),
      String(today.getMonth() + 1).padStart(2, '0'),
      String(today.getDate()).padStart(2, '0')
    ].join('-');

    return {
      orderStatus: 'Pendiente',
      orderKind: 'Venta online',
      orderTax: taxCents / 100,
      orderDate,
      orderTotal: Math.round(this.cartService.getTotal() * 100) / 100,
      ...form,
      details
    };
  }
  
  getImageUrl(path: string): string {
    return `${environment.imageUrl}/${path}`;
  }
}