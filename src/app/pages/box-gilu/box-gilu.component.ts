import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from '../../core/models/product.model';
import { CartService } from '../../core/services/cart.service';
import { ProductsService } from '../../core/services/products.service';
import { SeoService } from '../../core/services/seo.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-box-gilu',
  templateUrl: './box-gilu.component.html',
  styleUrls: ['./box-gilu.component.scss']
})
export class BoxGiluComponent implements OnInit, OnDestroy {
  Math = Math;

  products: Product[] = [];

  protected pageSize = 16;
  private offset = 0;
  public totalCount = 0;
  public isLoading = false;
  public hasMore = false;

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
    this.loadProducts();
  }

  private setupDefaultSeo(): void {
    this.seoService.updateMetaTags({
      title: 'Box Gilú | Gilú Shop',
      description: 'Descubre la selección exclusiva de productos en Box Gilú, nuestra cajita para que puedas emprender. Maquillaje original de las mejores marcas 100% original como: Maybelline, Elf, Loreal, Nyx, Got2b, Milani, Beauty Creations, Prosa. Con envío a todo Ecuador.',
      keywords: 'box gilu, productos exclusivos gilu, emprendimiento, emprender , maquillake al por mayor,maquillaje box gilu, gilu shop box',
      image: 'https://gilu-shop.com/assets/image/gilu-update.png',
      url: 'https://gilu-shop.com/box-gilu',
      type: 'website',
      siteName: 'Gilú Shop'
    });

    this.seoService.setTwitterCard({
      title: 'Box Gilú - Productos Exclusivos',
      description: 'Descubre la selección exclusiva de productos en Box Gilú, nuestra cajita para que puedas emprender. Las mejores marcas internacionales como: Maybelline, Elf, Loreal, Nyx, Got2b, Milani, Beauty Creations, Prosa. Con envío a todo Ecuador.'
    });

    this.seoService.setCanonicalUrl('https://gilu-shop.com/box-gilu');
  }

  ngOnDestroy(): void {
  }

  private loadProducts(): void {
    this.isLoading = true;
    this.offset = 0;
    this.currentPage = 1;

    // First, get the total count
    this.productsService.getOnlineStoreProductsCountBox(this.getOutletId()).subscribe({
      next: (count) => {
        this.totalCount = count;
        this.totalPages = Math.ceil(count / this.pageSize);
        this.hasMore = count > 0;
        this.updateVisiblePages();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error getting box product count:', err);
        this.isLoading = false;
      }
    });

    // Load first batch of products
    this.productsService.getOnlineStoreProductsBox(this.getOutletId(), this.pageSize, 0).subscribe({
      next: (products) => {
        this.products = products;
        this.offset = products.length;
        this.isLoading = false;

        this.hasMore = this.offset < this.totalCount;

        this.addProductSchema();

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading initial box products:', err);
        this.isLoading = false;
      }
    });
  }

  private getOutletId(): number {
    return 2;
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages || page === this.currentPage || this.isLoading) return;

    this.isLoading = true;
    this.currentPage = page;
    this.updateVisiblePages();

    const offset = (page - 1) * this.pageSize;

    this.productsService.getOnlineStoreProductsBox(this.getOutletId(), this.pageSize, offset).subscribe({
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

    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    this.visiblePages = pages;
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

  get showPagination(): boolean {
    return this.totalPages > 1;
  }

  get isLoadingMore(): boolean {
    return this.isLoading;
  }

  private addProductSchema(): void {
    if (!this.products || this.products.length === 0) return;

    const breadcrumbItems: { name: string; url: string }[] = [
      { name: 'Home', url: 'https://gilu-shop.com' },
      { name: 'Box Gilú', url: 'https://gilu-shop.com/box-gilu' }
    ];
    const breadcrumb = this.seoService.generateBreadcrumbSchema(breadcrumbItems);
    this.seoService.setJsonLd(breadcrumb, 'schema-breadcrumb');

    const productListSchema = this.seoService.generateProductListSchema(
      this.products.map(p => ({
        id: p.id,
        name: p.name
      }))
    );
    this.seoService.setJsonLd(productListSchema, 'schema-product-list');

    const firstProduct = this.products[0];
    if (firstProduct.name && firstProduct.description &&
        typeof firstProduct.price === 'number' && firstProduct.price >= 0) {

      let imageUrl = firstProduct.image;
      if (!imageUrl || !imageUrl.startsWith('http')) {
        imageUrl = `https://gilu-shop.com/assets/image/gilu-update.png`;
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

  getImageUrl(path: string): string {
    return `${environment.imageUrl}/${path}`;
  }
}