import { Component, OnInit, OnDestroy, HostListener, Inject, PLATFORM_ID, ViewChild, ElementRef } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { FormControl } from '@angular/forms';
import { CartService } from '../../core/services/cart.service';
import { SearchService } from '../../core/services/search.service';
import { ProductsService } from '../../core/services/products.service';
import { CatalogBrandDTO } from '../../core/models/brand.model';
import { Observable, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  @ViewChild('dropdown') dropdownElement: ElementRef;
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
  navLinks = [
    { path: '/', label: 'GILÚ' },
    { path: '/shop', label: 'COMPRAR' },
    { path: '/about', label: 'NOSOTROS' },
    { path: '/faq', label: 'FAQ' }
  ];

  constructor(
    private cartService: CartService,
    private router: Router,
    private searchService: SearchService,
    private productsService: ProductsService,
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
    if (this.dropdownElement && !this.dropdownElement.nativeElement.contains(event.target)) {
      this.isBrandsDropdownOpen = false;
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
}
