import { Component, Input, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewInit, ChangeDetectorRef, HostListener } from '@angular/core';
import { Product } from '../../../../core/models/product.model';
import { CartService } from '../../../../core/services/cart.service';
import { ProductsService } from '../../../../core/services/products.service';

@Component({
  selector: 'app-product-grid',
  templateUrl: './product-grid.component.html',
  styleUrls: ['./product-grid.component.scss']
})
export class ProductGridComponent implements OnInit, OnDestroy, AfterViewInit {
  @Input() initialLoad: boolean = true;

  products: Product[] = [];
  
  // Pagination state
  private pageSize = 4;
  private offset = 0;
  private totalCount = 0;
  public isLoading = false;
  public hasMore = true;
  
  // For infinite scroll detection
  @ViewChild('scrollSentinel') scrollSentinel!: ElementRef;
  private observer: IntersectionObserver | null = null;

  constructor(
    private cdr: ChangeDetectorRef,
    private cartService: CartService,
    private productsService: ProductsService
  ) {}

  ngOnInit(): void {
    if (this.initialLoad) {
      this.loadInitialProducts();
    }
  }

  ngAfterViewInit(): void {
    // Set up intersection observer for infinite scroll
    // Delay to ensure the DOM is ready
    setTimeout(() => {
      this.setupIntersectionObserver();
    }, 500);
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  @HostListener('window:scroll', ['$event'])
  onScroll(): void {
    // Fallback: Check if user has scrolled near bottom
    const scrollPosition = window.innerHeight + window.scrollY;
    const documentHeight = document.documentElement.scrollHeight;
    
    // When user is within 200px of the bottom
    if (documentHeight - scrollPosition < 200 && !this.isLoading && this.hasMore) {
      this.loadMoreProducts();
    }
  }

  private loadInitialProducts(): void {
    this.isLoading = true;
    
    // First, get the total count
    this.productsService.getOnlineStoreProductsCount().subscribe({
      next: (count) => {
        this.totalCount = count;
        this.hasMore = count > 0;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error getting product count:', err);
        this.isLoading = false;
      }
    });

    // Load first batch of products
    this.productsService.getOnlineStoreProducts(this.pageSize, 0).subscribe({
      next: (products) => {
        this.products = products;
        this.offset = products.length;
        this.isLoading = false;
        
        // Check if there are more products to load
        this.hasMore = this.offset < this.totalCount;
        
        this.cdr.detectChanges();
        
        // Re-setup observer after products are rendered
        setTimeout(() => {
          this.setupIntersectionObserver();
        }, 300);
      },
      error: (err) => {
        console.error('Error loading initial products:', err);
        this.isLoading = false;
      }
    });
  }

  private setupIntersectionObserver(): void {
    if (!this.scrollSentinel) {
      console.warn('Scroll sentinel not found, using scroll listener fallback');
      return;
    }

    if (this.observer) {
      this.observer.disconnect();
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !this.isLoading && this.hasMore) {
            console.log('Intersection detected, loading more products...');
            this.loadMoreProducts();
          }
        });
      },
      { 
        root: null, 
        rootMargin: '200px',
        threshold: 0
      }
    );

    this.observer.observe(this.scrollSentinel.nativeElement);
  }

  loadMoreProducts(): void {
    if (this.isLoading || !this.hasMore) return;

    console.log('Loading more products, offset:', this.offset, 'hasMore:', this.hasMore);
    this.isLoading = true;

    this.productsService.getOnlineStoreProducts(this.pageSize, this.offset).subscribe({
      next: (newProducts) => {
        console.log('Received new products:', newProducts.length);
        if (newProducts.length > 0) {
          this.products = [...this.products, ...newProducts];
          this.offset += newProducts.length;
          
          // Check if we've loaded all products
          if (newProducts.length < this.pageSize || this.offset >= this.totalCount) {
            this.hasMore = false;
          }
        } else {
          this.hasMore = false;
        }
        this.isLoading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading more products:', err);
        this.isLoading = false;
      }
    });
  }

  // Method to append products from parent (used with initial load)
  appendProducts(newProducts: Product[]): void {
    if (newProducts && newProducts.length > 0) {
      this.products = [...this.products, ...newProducts];
      this.offset = this.products.length;
    }
  }

  // Reset pagination state
  resetPagination(): void {
    this.products = [];
    this.offset = 0;
    this.totalCount = 0;
    this.isLoading = false;
    this.hasMore = true;
  }

  // Initialize with total count (called from parent)
  initializePagination(totalCount: number): void {
    this.totalCount = totalCount;
    this.hasMore = this.products.length < totalCount;
  }

  addToCart(product: Product): void {
    if (product.inStock) {
      this.cartService.addItem(product);
    }
  }

  trackByProduct(index: number, product: Product): any {
    return product.id;
  }

  getAnimationDelay(index: number): string {
    const columns = 4;
    const row = Math.floor(index / columns);
    const col = index % columns;
    const delay = (row * 200) + (col * 100);
    return `${delay}ms`;
  }

  get isLoadingMore(): boolean {
    return this.isLoading;
  }

  get hasMoreProducts(): boolean {
    return this.hasMore;
  }
}
