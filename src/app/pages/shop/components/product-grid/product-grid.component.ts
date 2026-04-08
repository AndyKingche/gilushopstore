import { Component, Input, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewInit, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from '../../../../core/models/product.model';
import { CartService } from '../../../../core/services/cart.service';
import { ProductsService } from '../../../../core/services/products.service';
import { SeoService } from '../../../../core/services/seo.service';

@Component({
  selector: 'app-product-grid',
  templateUrl: './product-grid.component.html',
  styleUrls: ['./product-grid.component.scss']
})
export class ProductGridComponent implements OnInit, OnDestroy {
  @Input() initialLoad: boolean = true;
  @Input() set category(categoryId: number | null) {
    this._categoryId = categoryId;
    this._searchTerm = null;
    this._brandId = null;
    if (categoryId) {
      this.loadProductsByCategory(categoryId);
    } else if (!this._searchTerm && !this._brandId) {
      this.loadInitialProducts();
    }
  }
  
  @Input() set searchTerm(searchTerm: string | null) {
    this._searchTerm = searchTerm;
    this._categoryId = null;
    this._brandId = null;
    if (searchTerm) {
      this.loadProductsBySearch(searchTerm);
    } else if (!this._categoryId && !this._brandId) {
      this.loadInitialProducts();
    }
  }

  @Input() set brandId(brandId: number | null) {
    this._brandId = brandId;
    this._categoryId = null;
    this._searchTerm = null;
    if (brandId) {
      this.loadProductsByBrand(brandId);
    } else if (!this._searchTerm && !this._categoryId) {
      this.loadInitialProducts();
    }
  }
  
  @Output() openLogin = new EventEmitter<void>();

  // Expose Math to template
  Math = Math;

  private _categoryId: number | null = null;
  private _searchTerm: string | null = null;
  private _brandId: number | null = null;
  products: Product[] = [];
  
  // Pagination state
  protected pageSize = 16;
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
    private productsService: ProductsService,
    private router: Router,
    private seoService: SeoService
  ) {}

  ngOnInit(): void {
    // Set SEO meta tags for product listing page with long-tail keywords
    this.seoService.updateMetaTags({
      title: 'Maquillaje Original Ecuador - Gilú Shop | Maybelline, e.l.f., NYX Otavalo',
      description: 'Compra maquillaje 100% original en Gilú Shop, Otavalo Ecuador. Maybelline, e.l.f., NYX, L\'Oréal, Huda Beauty con envío a todo Ecuador. Precios accesibles, productos garantizados.',
      keywords: 'maquillaje original Otavalo, maquillaje original Ecuador, comprar maquillaje Ecuador, Maybelline Ecuador, elf Ecuador, NYX Ecuador, Huda Beauty Ecuador, tienda maquillaje Otavalo, maquillaje envío Ecuador, cosméticos originales Ecuador, Loreal Ecuador, Rare Beauty Ecuador, Fenty Beauty Ecuador, Dior Ecuador, Got 2b Ecuador',
      image: 'https://gilu-shop.com/assets/image/gilu-update.png',
      url: 'https://gilu-shop.com/shop',
      type: 'website',
      siteName: 'Gilú Shop'
    });

    // Set Twitter Card tags
    this.seoService.setTwitterCard({
      title: 'Maquillaje Original Ecuador - Gilú Shop',
      description: 'Compra maquillaje 100% original en Gilú Shop, Otavalo Ecuador. Las mejores marcas internacionales con envío a todo Ecuador.'
    });

    // Set canonical URL for shop page
    this.seoService.setCanonicalUrl('https://gilu-shop.com/shop');

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
        console.log(products);
        
        this.products = products;
        this.offset = products.length;
        this.isLoading = false;
        
        // Check if there are more products to load
        this.hasMore = this.offset < this.totalCount;
        
        // Add Product schema for rich snippets
        this.addProductSchema();
        
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

  // Load products filtered by category
  private loadProductsByCategory(categoryId: number): void {
    this.isLoading = true;
    this.offset = 0;
    this.currentPage = 1;
    
    // First, get the total count for this category
    this.productsService.getOnlineStoreProductsByCategoryCount(categoryId).subscribe({
      next: (count) => {
        this.totalCount = count;
        this.totalPages = Math.ceil(count / this.pageSize);
        this.hasMore = count > 0;
        this.updateVisiblePages();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error getting category product count:', err);
        this.isLoading = false;
      }
    });

    // Load first batch of products for this category
    this.productsService.getOnlineStoreProductsByCategory(categoryId, this.pageSize, 0).subscribe({
      next: (products) => {
        this.products = products;
        this.offset = products.length;
        this.isLoading = false;
        
        // Check if there are more products to load
        this.hasMore = this.offset < this.totalCount;
        
        // Add Product schema for rich snippets
        this.addProductSchema();
        
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading category products:', err);
        this.isLoading = false;
      }
    });
  }

  // Load products filtered by search term
  private loadProductsBySearch(searchTerm: string): void {
    this.isLoading = true;
    this.offset = 0;
    this.currentPage = 1;

    // First, get the total count for this search
    this.productsService.searchProductsCount(searchTerm).subscribe({
      next: (count) => {
        this.totalCount = count;
        this.totalPages = Math.ceil(count / this.pageSize);
        this.hasMore = count > 0;
        this.updateVisiblePages();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error getting search product count:', err);
        this.isLoading = false;
      }
    });

    // Load first batch of products for this search
    this.productsService.searchProducts(searchTerm, this.pageSize, 0).subscribe({
      next: (products) => {
        console.log(products)
        this.products = products;
        this.offset = products.length;
        this.isLoading = false;

        // Check if there are more products to load
        this.hasMore = this.offset < this.totalCount;

        // Add Product schema for rich snippets
        this.addProductSchema();

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading search products:', err);
        this.isLoading = false;
      }
    });
  }

  // Load products filtered by brand
  private loadProductsByBrand(brandId: number): void {
    this.isLoading = true;
    this.offset = 0;
    this.currentPage = 1;
    console.log(brandId);
    

    // First, get the total count for this brand
    this.productsService.getOnlineStoreProductsByBrandCount(brandId).subscribe({
      next: (count) => {
        this.totalCount = count;
        this.totalPages = Math.ceil(count / this.pageSize);
        this.hasMore = count > 0;
        this.updateVisiblePages();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error getting brand product count:', err);
        this.isLoading = false;
      }
    });

    // Load first batch of products for this brand
    this.productsService.getOnlineStoreProductsByBrand(brandId, this.pageSize, 0).subscribe({
      next: (products) => {
        console.log(products);
        
        this.products = products;
        this.offset = products.length;
        this.isLoading = false;

        // Check if there are more products to load
        this.hasMore = this.offset < this.totalCount;

        // Add Product schema for rich snippets
        this.addProductSchema();

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading brand products:', err);
        this.isLoading = false;
      }
    });
  }

  // Go to specific page
  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages || page === this.currentPage || this.isLoading) return;
    
    this.isLoading = true;
    this.currentPage = page;
    this.updateVisiblePages();
    
    // Calculate offset: page 1 = 0, page 2 = 16, page 3 = 32, etc.
    const offset = (page - 1) * this.pageSize;
    
    if (this._searchTerm) {
      // Load by search term
      this.productsService.searchProducts(this._searchTerm, this.pageSize, offset).subscribe({
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
    } else if (this._categoryId) {
      // Load by category
      this.productsService.getOnlineStoreProductsByCategory(this._categoryId, this.pageSize, offset).subscribe({
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
    } else if (this._brandId) {
      // Load by brand
      this.productsService.getOnlineStoreProductsByBrand(this._brandId, this.pageSize, offset).subscribe({
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
    } else {
      // Load all products
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
    this._categoryId = null;
    this._searchTerm = null;
    this._brandId = null;
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

  /**
   * Add Product schema structured data for SEO
   * Uses ItemList schema for product listing pages
   */
  private addProductSchema(): void {
    if (this.products && this.products.length > 0) {
      // Use ItemList schema for product listing pages
      const productListSchema = this.seoService.generateProductListSchema(
        this.products.map(p => ({
          id: p.id,
          name: p.name
        }))
      );
      this.seoService.setJsonLd(productListSchema, 'schema-product-list');
      
      // Also add first product schema for rich snippets
      const firstProduct = this.products[0];
      const productSchema = this.seoService.generateProductSchema({
        name: firstProduct.name,
        description: firstProduct.description,
        image: firstProduct.image || 'https://gilu-shop.com/assets/image/gilu-update.png',
        price: firstProduct.price,
        currency: 'USD',
        brand: firstProduct.brand,
        availability: firstProduct.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
        sku: firstProduct.id
      });
      
      this.seoService.setJsonLd(productSchema, 'schema-product');
    }
  }
}
