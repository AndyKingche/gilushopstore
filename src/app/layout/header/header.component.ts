import { Component, OnInit, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  cartItemCount$: Observable<number>;
  isMenuOpen = false;
  isCartOpen = false;
  searchQuery = '';
  isMobile = false;
  navLinks = [
    { path: '/', label: 'GILÚ' },
    { path: '/shop', label: 'COMPRAR' },
    { path: '/about', label: 'NOSOTROS' },
    { path: '/faq', label: 'FAQ' }
  ];

  constructor(
    private cartService: CartService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.cartItemCount$ = new Observable(subscriber => {
      this.cartService.items$.subscribe(items => {
        subscriber.next(items.reduce((sum, item) => sum + item.quantity, 0));
      });
    });
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.checkScreenSize();
    }
  }

  @HostListener('window:resize')
  onResize(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.checkScreenSize();
    }
  }

  checkScreenSize(): void {
    this.isMobile = window.innerWidth < 768;
    if (!this.isMobile) {
      this.isMenuOpen = false;
    }
  }

  toggleMenu(): void { this.isMenuOpen = !this.isMenuOpen; }
  closeMenu(): void { this.isMenuOpen = false; }
  toggleCart(): void { this.isCartOpen = !this.isCartOpen; }
  closeCart(): void { this.isCartOpen = false; }

  onSearch(): void {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/shop'], { queryParams: { q: this.searchQuery.trim() } });
      this.searchQuery = '';
    }
  }

  onCartClose(): void { this.isCartOpen = false; }
}