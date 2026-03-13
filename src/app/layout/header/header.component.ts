import { Component, OnInit, HostListener } from '@angular/core';
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
    { path: '/', label: 'HOME' },
    { path: '/shop', label: 'SHOP' },
    { path: '/about', label: 'ABOUT US' },
    { path: '/faq', label: 'FAQ' }
  ];

  constructor(
    private cartService: CartService,
    private router: Router
  ) {
    this.cartItemCount$ = new Observable(subscriber => {
      this.cartService.items$.subscribe(items => {
        subscriber.next(items.reduce((sum, item) => sum + item.quantity, 0));
      });
    });
  }

  ngOnInit(): void {
    this.checkScreenSize();
  }

  @HostListener('window:resize')
  onResize(): void {
    this.checkScreenSize();
  }

  checkScreenSize(): void {
    this.isMobile = window.innerWidth < 768;
    if (!this.isMobile) {
      this.isMenuOpen = false;
    }
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu(): void {
    this.isMenuOpen = false;
  }

  toggleCart(): void {
    this.isCartOpen = !this.isCartOpen;
  }

  closeCart(): void {
    this.isCartOpen = false;
  }

  onSearch(): void {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/shop'], { queryParams: { q: this.searchQuery.trim() } });
      this.searchQuery = '';
    }
  }

  onCartClose(): void {
    this.isCartOpen = false;
  }
}
