import { Component, Input, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { Product } from '../../../../core/models/product.model';
import { CartService } from '../../../../core/services/cart.service';
import { ProductsService } from '../../../../core/services/products.service';

@Component({
  selector: 'app-product-grid',
  templateUrl: './product-grid.component.html',
  styleUrls: ['./product-grid.component.scss']
})
export class ProductGridComponent implements OnInit, OnDestroy {
  @Input() initialLoad: boolean = true;

  // Expose Math to template
  Math = Math;

  products: Product[] = [];
  
  // Pagination state
  private pageSize = 16;
  private offset = 0;
  public totalCount = 0;
  public isLoading = false;
  public hasMore = false; // Start false, pagination handles it
  
  // Page tracking
  public currentPage = 1;
  public totalPages = 0;
  public visiblePages: number[] = [];

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

  ngOnDestroy(): void {
    // Cleanup if needed
  }

  private loadInitialProducts(): void {
    this.isLoading = true;
    this.offset = 0;
    this.currentPage = 1;
    
    // First, get the total count
    this.productsService.getOnlineStoreProductsCount().subscribe({
      next: (count) => {
        this.totalCount = count;
        this.totalPages = Math.ceil(count / this.pageSize);
        this.hasMore = count > 0;
        this.updateVisiblePages();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error getting product count:', err);
        this.isLoading = false;
      }
    });

    // Load first batch of products (16 initially)
    this.productsService.getOnlineStoreProducts(this.pageSize, 0).subscribe({
      next: (products) => {
        this.products = products;
        this.offset = products.length;
        this.isLoading = false;
        
        // Check if there are more products to load
        this.hasMore = this.offset < this.totalCount;
        
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading initial products:', err);
        this.isLoading = false;
      }
    });
  }

  loadMoreProducts(): void {
    // Not used anymore with pagination
    return;
  }

  // Go to specific page
  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages || page === this.currentPage || this.isLoading) return;
    
    this.isLoading = true;
    this.currentPage = page;
    this.updateVisiblePages();
    
    // Calculate offset: page 1 = 0, page 2 = 4, page 3 = 8, etc.
    const offset = (page - 1) * this.pageSize;
    
    this.productsService.getOnlineStoreProducts(this.pageSize, offset).subscribe({
      next: (products) => {
        this.products = products;
        this.isLoading = false;
        
        // Scroll to top of products section
        const productsSection = document.getElementById('products-section');
        if (productsSection) {
          productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading page:', err);
        this.isLoading = false;
      }
    });
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.goToPage(this.currentPage + 1);
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.goToPage(this.currentPage - 1);
    }
  }

  private updateVisiblePages(): void {
    const maxVisible = 5;
    const pages: number[] = [];
    
    let start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(this.totalPages, start + maxVisible - 1);
    
    // Adjust start if we're near the end
    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    this.visiblePages = pages;
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
    this.currentPage = 1;
    this.totalPages = 0;
  }

  // Initialize with total count (called from parent)
  initializePagination(totalCount: number): void {
    this.totalCount = totalCount;
    this.totalPages = Math.ceil(totalCount / this.pageSize);
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

  get showPagination(): boolean {
    return this.totalPages > 1;
  }
}
