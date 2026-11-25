import { Component, OnInit, OnDestroy, HostListener, Inject, PLATFORM_ID, ElementRef, ViewChild } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { FormControl } from '@angular/forms';
import { CartService } from '../../core/services/cart.service';
import { SearchService } from '../../core/services/search.service';
import { ProductsService } from '../../core/services/products.service';
import { CatalogBrandDTO } from '../../core/models/brand.model';
import { Observable, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  @ViewChild('dropdown') dropdownElement?: ElementRef<HTMLElement>;
  @ViewChild('authDropdown') authDropdownElement?: ElementRef<HTMLElement>;
  @ViewChild('mobileNav') mobileNavElement?: ElementRef<HTMLElement>;
  @ViewChild('mobileMenuOverlay') mobileMenuOverlayElement?: ElementRef<HTMLElement>;
  private menuDrag: { pointerId: number; startX: number; startTime: number; deltaX: number; dragging: boolean } | null = null;
  private routerSubscription?: Subscription;
  cartItemCount$: Observable<number>;
  isMenuOpen = false;
  isCartOpen = false;
  searchControl = new FormControl('');
  searchQuery = '';
  isMobile = false;
  brands: CatalogBrandDTO[] = [];
  filteredBrands: CatalogBrandDTO[] = [];
  brandSearchTerm = '';
  isBrandsDropdownOpen = false;
  isBrandsCollapsed = false; // Start collapsed
  isAuthDropdownOpen = false;
  navLinks = [
    { path: '/', label: 'GILÚ' },
    { path: '/shop', label: 'COMPRAR' },
    { path: '/box-gilu', label: 'CAJITAS EMPRENDEDORAS' },
    { path: '/about', label: 'NOSOTROS' },
    { path: '/faq', label: 'FAQ' }
  ];

  constructor(
    private cartService: CartService,
    private router: Router,
    private searchService: SearchService,
    private productsService: ProductsService,
    public authService: AuthService,
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

    // Fetch brands
    this.productsService.getAllCatalogBrands().subscribe(brands => {
      this.brands = brands;
      this.filteredBrands = brands;
    });

    // Listen to search control changes and update search service
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe(value => {
      // Update search service with current value
      if (!value || value.trim() === '') {
        this.searchService.setSearchTerm(null);
      }
    });

    // Listen to router events to sync search input when returning from shop
    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      // Clear search when navigating away from shop
      const currentUrl = event.urlAfterRedirects || event.url;
      if (!currentUrl.startsWith('/shop')) {
        this.searchService.setSearchTerm(null);
        this.searchControl.setValue('', { emitEvent: false });
      }
    });
  }

  ngOnDestroy(): void {
    this.routerSubscription?.unsubscribe();
  }

  @HostListener('window:resize')
  onResize(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.checkScreenSize();
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    if (this.dropdownElement && !this.dropdownElement.nativeElement.contains(event.target as Node)) {
      this.isBrandsDropdownOpen = false;
    }
    if (this.authDropdownElement && !this.authDropdownElement.nativeElement.contains(event.target as Node)) {
      this.isAuthDropdownOpen = false;
    }
  }

  checkScreenSize(): void {
    this.isMobile = window.innerWidth < 768;
    if (!this.isMobile) {
      this.isMenuOpen = false;
    }
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
    if (this.isMenuOpen && this.mobileNavElement) {
      const nav = this.mobileNavElement.nativeElement;
      nav.style.transition = 'none';
      nav.style.transform = 'translateX(0)';
    }
  }
  closeMenu(): void { this.isMenuOpen = false; }
  toggleCart(): void { this.isCartOpen = !this.isCartOpen; }
  closeCart(): void { this.isCartOpen = false; }

  onMenuPointerDown(event: PointerEvent): void {
    if (!isPlatformBrowser(this.platformId) || event.pointerType === 'mouse' || !this.mobileNavElement || !this.isMenuOpen) {
      return;
    }
    const target = event.target as HTMLElement;
    if (target.closest('input, textarea, button, a, form')) {
      return;
    }
    this.menuDrag = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startTime: performance.now(),
      deltaX: 0,
      dragging: false
    };
    this.mobileNavElement.nativeElement.setPointerCapture(event.pointerId);
  }

  onMenuPointerMove(event: PointerEvent): void {
    if (!this.menuDrag || this.menuDrag.pointerId !== event.pointerId || !this.mobileNavElement) {
      return;
    }
    const deltaX = event.clientX - this.menuDrag.startX;
    if (!this.menuDrag.dragging && deltaX < -8) {
      this.menuDrag.dragging = true;
    }
    if (!this.menuDrag.dragging) {
      return;
    }

    const width = this.mobileNavElement.nativeElement.offsetWidth;
    const resisted = Math.min(0, deltaX);
    const rubberBand = resisted < -width * 0.45
      ? -width * 0.45 + (resisted + width * 0.45) * 0.2
      : resisted;
    this.menuDrag.deltaX = deltaX;
    const nav = this.mobileNavElement.nativeElement;
    nav.style.transition = 'none';
    nav.style.transform = `translateX(${rubberBand}px)`;

    if (this.mobileMenuOverlayElement) {
      const progress = Math.min(Math.abs(resisted) / width, 1);
      this.mobileMenuOverlayElement.nativeElement.style.opacity = String(1 - progress);
    }
  }

  onMenuPointerUp(event: PointerEvent): void {
    if (!this.menuDrag || this.menuDrag.pointerId !== event.pointerId || !this.mobileNavElement) {
      return;
    }
    const elapsed = Math.max(performance.now() - this.menuDrag.startTime, 1);
    const velocity = this.menuDrag.deltaX / elapsed * 1000;
    const threshold = this.mobileNavElement.nativeElement.offsetWidth * 0.35;
    const shouldClose = this.menuDrag.deltaX < -threshold || (this.menuDrag.deltaX < -24 && velocity < -700);
    this.finishMenuDrag(shouldClose);
  }

  onMenuPointerCancel(event: PointerEvent): void {
    if (this.menuDrag?.pointerId === event.pointerId) {
      this.finishMenuDrag(false);
    }
  }

  private finishMenuDrag(shouldClose: boolean): void {
    if (!this.mobileNavElement) {
      this.menuDrag = null;
      return;
    }
    const nav = this.mobileNavElement.nativeElement;
    nav.style.transition = 'transform 220ms cubic-bezier(0.32, 0.72, 0, 1)';
    if (shouldClose) {
      nav.style.transform = `translateX(-${nav.offsetWidth}px)`;
      if (this.mobileMenuOverlayElement) {
        this.mobileMenuOverlayElement.nativeElement.style.transition = 'opacity 220ms ease';
        this.mobileMenuOverlayElement.nativeElement.style.opacity = '0';
      }
      window.setTimeout(() => this.closeMenu(), this.prefersReducedMotion() ? 120 : 220);
    } else {
      nav.style.transform = 'translateX(0)';
      if (this.mobileMenuOverlayElement) {
        this.mobileMenuOverlayElement.nativeElement.style.transition = 'opacity 180ms ease';
        this.mobileMenuOverlayElement.nativeElement.style.opacity = '1';
      }
    }
    this.menuDrag = null;
  }

  private prefersReducedMotion(): boolean {
    return isPlatformBrowser(this.platformId) &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  }

  search(): void {
    const query = this.searchControl.value?.trim() || '';
    if (query) {
      // Set search term in service and navigate to shop
      this.searchService.setSearchTerm(query);
      this.router.navigate(['/shop']);
    } else {
      this.searchService.setSearchTerm(null);
    }
  }

  clear(): void {
    this.searchControl.setValue('');
    this.searchService.setSearchTerm(null);
  }

  // Mobile search handler
  onSearch(): void {
    const query = this.searchQuery?.trim() || '';
    if (query) {
      this.searchService.setSearchTerm(query);
      this.router.navigate(['/shop']);
    }
  }

  onCartClose(): void { this.isCartOpen = false; }

  toggleBrandsDropdown(): void {
    this.isBrandsDropdownOpen = !this.isBrandsDropdownOpen;
  }

  closeBrandsDropdown(): void {
    this.isBrandsDropdownOpen = false;
  }

  toggleBrandsCollapse(): void {
    this.isBrandsCollapsed = !this.isBrandsCollapsed;
  }

  navigateToBrand(brand: CatalogBrandDTO): void {
    // Navigate to shop collections with brand id
    //console.log(brand.brandDescription);

    this.router.navigate(['/shop', 'collections', brand.brandDescription]);
    this.closeBrandsDropdown();
    this.isBrandsCollapsed = false; // Close collapse after navigation
    this.closeMenu();
  }

  navigateToAll(): void {
    // Navigate to shop to show all products
    this.router.navigate(['/shop']);
    this.closeBrandsDropdown();
    this.isBrandsCollapsed = false; // Close collapse after navigation
    this.closeMenu();
  }

  filterBrands(): void {
    if (!this.brandSearchTerm.trim()) {
      this.filteredBrands = this.brands;
    } else {
      const searchTerm = this.brandSearchTerm.toLowerCase().trim();
      this.filteredBrands = this.brands.filter(brand =>
        brand.brandName.toLowerCase().includes(searchTerm)
      );
    }
  }

  toggleAuthDropdown(): void {
    this.isAuthDropdownOpen = !this.isAuthDropdownOpen;
  }

  closeAuthDropdown(): void {
    this.isAuthDropdownOpen = false;
  }

  login(): void {
    this.closeAuthDropdown();
    this.router.navigate(['/auth/login']);
  }

  logout(): void {
    this.closeAuthDropdown();
    this.authService.logout();
  }

  viewOrders(): void {
    this.closeAuthDropdown();
    this.router.navigate(['/order']);
  }
}