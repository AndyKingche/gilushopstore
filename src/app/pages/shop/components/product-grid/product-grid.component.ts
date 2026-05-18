import { Component, Input, OnInit, OnDestroy, OnChanges, SimpleChanges, ElementRef, ViewChild, AfterViewInit, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
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
export class ProductGridComponent implements OnInit, OnDestroy, OnChanges {
  @Input() initialLoad: boolean = true;
  @Input() set brandId(brandId: string | null) {
    if (brandId !== this._brandId) {
      this._brandId = brandId;
      this._searchTerm = null;
    }
  }
  
  @Input() set category(categoryId: number | null) {
    if (categoryId !== this._categoryId) {
      this._categoryId = categoryId;
      this._searchTerm = null;
    }
  }
  
  @Input() set searchTerm(searchTerm: string | null) {
    if (searchTerm !== this._searchTerm) {
      this._searchTerm = searchTerm;
      this._categoryId = null;
      this._brandId = null;
    }
  }
  
  @Output() openLogin = new EventEmitter<void>();

  // Expose Math to template
  Math = Math;

  private _categoryId: number | null = null;
  private _searchTerm: string | null = null;
  private _brandId: string | null = null;
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
    this.setupDefaultSeo();
    this.loadProductsBasedOnInputs();
  }

  private setupDefaultSeo(): void {
    this.seoService.updateMetaTags({
      title: 'Maquillaje Original Ecuador - Gilú Shop | Maybelline, e.l.f., NYX Otavalo',
      description: 'Compra maquillaje 100% original en Gilú Shop, Otavalo Ecuador. Maybelline, e.l.f., NYX, L\'Oréal, Huda Beauty con envío a todo Ecuador. Precios accesibles, productos garantizados.',
      keywords: 'maquillaje original Otavalo, maquillaje original Ecuador, comprar maquillaje Ecuador, Maybelline Ecuador, elf Ecuador, NYX Ecuador, Huda Beauty Ecuador, tienda maquillaje Otavalo, maquillaje envío Ecuador, cosméticos originales Ecuador, Loreal Ecuador, Rare Beauty Ecuador, Fenty Beauty Ecuador, Dior Ecuador, Got 2b Ecuador',
      image: 'https://gilu-shop.com/assets/image/gilu-update.png',
      url: 'https://gilu-shop.com/shop',
      type: 'website',
      siteName: 'Gilú Shop'
    });

    this.seoService.setTwitterCard({
      title: 'Maquillaje Original Ecuador - Gilú Shop',
      description: 'Compra maquillaje 100% original en Gilú Shop, Otavalo Ecuador. Las mejores marcas internacionales con envío a todo Ecuador.'
    });

    this.seoService.setCanonicalUrl('https://gilu-shop.com/shop');
  }

  ngOnChanges(changes: SimpleChanges): void {
    //console.log(changes);
    
    // Handle changes to inputs after initial load
    if (changes['category'] || changes['searchTerm'] || changes['brandId']) {
      if (!changes['initialLoad'] || !changes['initialLoad'].firstChange) {
        this.loadProductsBasedOnInputs();
      }
    }
  }

  private loadProductsBasedOnInputs(): void {
    //console.log(this._brandId, this._categoryId);
    
    if (this._brandId && this._categoryId) {
      this.loadProductsByBrandAndCategory();
    } else if (this._brandId) {
      //this.updateBrandSeo(this._brandId);
      this.loadProductsByBrand(this._brandId);
    } else if (this._categoryId) {
      this.loadProductsByCategory(this._categoryId);
    } else if (this._searchTerm) {
      this.loadProductsBySearch(this._searchTerm);
    } else if (this.initialLoad) {
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
        //console.log(products);
        
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
       // console.log(products)
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
  private loadProductsByBrand(brandName: string): void {
    //this.updateBrandSeo(brandName);
    this.isLoading = true;
    this.offset = 0;
    this.currentPage = 1;
    //console.log(brandName);
    

    // First, get the total count for this brand
    this.productsService.getOnlineStoreProductsByBrandNameCount(brandName).subscribe({
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

    //console.log(brandName);
    
    // Load first batch of products for this brand
    this.productsService.getOnlineStoreProductsByBrandName(brandName, this.pageSize, 0).subscribe({
      next: (products) => {
        //console.log(products);
        
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

  private loadProductsByBrandAndCategory(): void {
    const brandName = this._brandId;
    const categoryId = this._categoryId;
    
    this.isLoading = true;
    this.offset = 0;
    this.currentPage = 1;
    //console.log('Loading products by brand and category:', brandName, categoryId);

    this.productsService.getCategories().subscribe({
      next: (categories) => {
        const category = categories.find(c => c.id === categoryId);
        if (!category) {
          this.isLoading = false;
          return;
        }
      //console.log(categories)
        const categoryDescription = category.categoryDesc;

        this.productsService.getOnlineStoreProductsByBrandNameAndCategoryDescriptionCount(brandName, categoryDescription).subscribe({
          next: (count) => {
            this.totalCount = count;
            this.totalPages = Math.ceil(count / this.pageSize);
            this.hasMore = count > 0;
            this.updateVisiblePages();
            this.cdr.detectChanges();
          },
          error: (err) => {
            console.error('Error getting brand+category product count:', err);
            this.isLoading = false;
          }
        });

        this.productsService.getOnlineStoreProductsByBrandNameAndCategoryDescription(brandName, categoryDescription, this.pageSize, 0).subscribe({
          next: (products) => {
            //console.log(products);
            this.products = products;
            this.offset = products.length;
            this.isLoading = false;
            this.hasMore = this.offset < this.totalCount;
            this.addProductSchema();
            this.cdr.detectChanges();
          },
          error: (err) => {
            console.error('Error loading brand+category products:', err);
            this.isLoading = false;
          }
        });
      },
      error: (err) => {
        console.error('Error loading categories:', err);
        this.isLoading = false;
      }
    });
  }

  private updateBrandSeo(brandName: string): void {
    const brand = brandName.trim();

    this.seoService.updateMetaTags({
      title: `${brand} Ecuador | Comprar ${brand} Original | Gilú Shop`,
      description: `Compra productos ${brand} originales en Ecuador. Envíos rápidos a todo el país desde Gilú Shop.`,
      keywords: `${brand} Ecuador, comprar ${brand} Ecuador, ${brand} original Ecuador, maquillaje ${brand}`,
      image: 'https://gilu-shop.com/assets/image/gilu-update.png',
      url: `https://gilu-shop.com/shop/collections/${brand.toLowerCase().replace(/\s+/g,'-')}`,
      type: 'website',
      siteName: 'Gilú Shop'
    });

    this.seoService.setCanonicalUrl(
      `https://gilu-shop.com/shop/collections/${brand.toLowerCase().replace(/\s+/g,'-')}`
    );

    this.seoService.setJsonLd({
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": `${brand} Ecuador`,
      "url": `https://gilu-shop.com/shop/collections/${brand.toLowerCase().replace(/\s+/g,'-')}`,
      "description": `Productos ${brand} originales en Ecuador`
    }, 'schema-brand');
  }

  private loadPageByBrandAndCategory(page: number, offset: number): void {
    const brandName = this._brandId;
    const categoryId = this._categoryId;
    
    if (!brandName || !categoryId) return;

    this.productsService.getCategories().subscribe({
      next: (categories) => {
        const category = categories.find(c => c.id === categoryId);
        if (!category) return;
        
        const categoryDescription = category.categoryName;

        this.productsService.getOnlineStoreProductsByBrandNameAndCategoryDescription(brandName, categoryDescription, this.pageSize, offset).subscribe({
          next: (products) => {
            this.products = products;
            this.isLoading = false;
            
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
    
    if (this._brandId && this._categoryId) {
      this.loadPageByBrandAndCategory(page, offset);
    } else if (this._searchTerm) {
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
      // Load by brand name
      this.productsService.getOnlineStoreProductsByBrandName(this._brandId, this.pageSize, offset).subscribe({
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
    console.log(`https://gilu-shop.com/shop/collections/${this._brandId.toLowerCase().replace(/\s+/g, '-')}`);
    console.log(this._brandId);
    
    if (this.products && this.products.length > 0) {
      // Breadcrumb schema
      const breadcrumbItems: { name: string; url: string }[] = [
        { name: 'Home', url: 'https://gilu-shop.com' },
        { name: 'Shop', url: 'https://gilu-shop.com/shop' }
      ];
      if (this._brandId) {
        breadcrumbItems.push({
          name: this._brandId,
          url: `https://gilu-shop.com/shop/collections/${this._brandId.toLowerCase().replace(/\s+/g, '-')}`
        });
      } else if (this._categoryId) {
        breadcrumbItems.push({
          name: 'Categoría',
          url: 'https://gilu-shop.com/shop'
        });
      }
      const breadcrumb = this.seoService.generateBreadcrumbSchema(breadcrumbItems);
      this.seoService.setJsonLd(breadcrumb, 'schema-breadcrumb');

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
      // Only generate schema if we have valid data
      if (firstProduct.name && firstProduct.description &&
          typeof firstProduct.price === 'number' && firstProduct.price >= 0) {

        // Ensure image is a valid URL
        let imageUrl = firstProduct.image;
        if (!imageUrl || !imageUrl.startsWith('http')) {
          imageUrl = `https://gilu-shop.com/assets/image/${this._brandId}--1.webp`;
        }

        const productSchema = this.seoService.generateProductSchema({
          name: firstProduct.name,
          description: firstProduct.description,
          image: imageUrl,
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
}
