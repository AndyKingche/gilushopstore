import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { ProductsService } from '../../core/services/products.service';
import { SeoService } from '../../core/services/seo.service';
import { SearchService } from '../../core/services/search.service';
import { Category } from '../../core/models/category.model';
import { CatalogBrandDTO } from '../../core/models/brand.model';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';

// Mapping between ProductShowcase string IDs and category names
const CATEGORY_NAME_MAP: { [key: string]: string } = {
  'BASES': 'Bases',
  'GLOSS': 'Labios',
  'BLUSH': 'Blush',
  'PRIMER': 'Primers',
  'CORRECTOR': 'Correctores',
  'EYESHADOW': 'Pestañas / Cejas',
  'SKINCARE': 'Skin Care'
};

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit, OnDestroy {
  private searchSubscription?: Subscription;
  private routerSubscription?: Subscription;
  categories: Category[] = [];
  searchQuery = '';
  selectedCategory: number | null = null;
  searchTerm: string | null = null;
  brandId: string | null = null;
  brandNombre: string | null = null;
  selectedCategoryIds: number[] = [13, 14, 22, 26, 32, 41, 16, 56, 63, 44];
  private pendingCategoryId: string | null = null;
  isSearching: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productsService: ProductsService,
    private seoService: SeoService,
    private searchService: SearchService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    // Setup SEO for shop page
    this.setupSeo();

    // Subscribe to router events to handle navigation changes
    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      const params = this.route.snapshot.params;
      this.handleBrandParam(params);
    });

    // Handle initial brand param
    this.handleBrandParam(this.route.snapshot.params);

    // Load categories from API
    this.productsService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        // Apply pending category if any
        if (this.pendingCategoryId) {
          this.applyCategorySelection(this.pendingCategoryId);
          // Don't navigate here — we're already at the desired URL when params existed
          this.pendingCategoryId = null;
        }
      },
      error: (err) => {
        console.error('Error loading categories:', err);
      }
    });

    this.route.queryParams.subscribe(params => {
      if (params['q']) {
        this.searchQuery = params['q'];
        this.searchTerm = params['q']; // Pass to product-grid
        this.updateSearchSeo(params['q']);
      }
      if (params['cat']) {
        this.selectedCategory = parseInt(params['cat'], 10);
        this.updateCategorySeo(this.selectedCategory);
      }
    });

    // Listen to search service for search terms from header
    this.searchSubscription = this.searchService.searchTerm$.subscribe(term => {
      if (term !== null && term.trim() !== '') {
        this.searchQuery = term;
        this.searchTerm = term;
        this.selectedCategory = null; // Clear category when searching
        this.updateSearchSeo(term);
      }
    });

    // Check if there's already a search term in the service when component loads
    const currentSearchTerm = this.searchService.getSearchTerm();
    if (currentSearchTerm !== null && currentSearchTerm.trim() !== '') {
      this.searchQuery = currentSearchTerm;
      this.searchTerm = currentSearchTerm;
      this.selectedCategory = null;
      this.updateSearchSeo(currentSearchTerm);
      // Force change detection to update product-grid
      setTimeout(() => {
        this.cdr.detectChanges();
      }, 0);
    }
  }

  ngOnDestroy(): void {
    this.searchSubscription?.unsubscribe();
    this.routerSubscription?.unsubscribe();
  }

  private applyCategorySelection(categoryIdOrSlug: string): void {
    // Try mapping from showcase IDs (e.g. 'CORRECTOR' -> 'Correctores')
    const mapKey = categoryIdOrSlug ? categoryIdOrSlug.toString().toUpperCase() : '';
    const mappedName = CATEGORY_NAME_MAP[mapKey];
    if (mappedName) {
      const foundCategory = this.categories.find(
        cat => cat.categoryName?.toLowerCase() === mappedName.toLowerCase()
      );
      if (foundCategory) {
        this.selectedCategory = foundCategory.id;
        this.searchTerm = null;
        return;
      }
    }

    // Try matching by slugified category name
    const slug = categoryIdOrSlug ? categoryIdOrSlug.toString().toLowerCase() : '';
    const foundBySlug = this.categories.find(cat => (cat.categoryName || '').toLowerCase().replace(/\s+/g, '-') === slug);
    if (foundBySlug) {
      this.selectedCategory = foundBySlug.id;
      this.searchTerm = null;
      return;
    }

    // Fallback: try to parse as number
    const numId = parseInt(categoryIdOrSlug, 10);
    this.selectedCategory = isNaN(numId) ? null : numId;
    this.searchTerm = null;
  }

  private navigateToCategorySlug(categoryId: number | null): void {
    // If no category selected, go back to /shop (keep brand if present?)
    if (categoryId === null) {
      if (this.brandId) {
        // Stay inside brand collections without specific category
        this.router.navigate(['/shop', 'collections', this.brandId], { queryParamsHandling: 'preserve' });
      } else {
        this.router.navigate(['/shop'], { queryParamsHandling: 'preserve' });
      }
      return;
    }

    const cat = this.categories.find(c => c.id === categoryId);
    const slug = cat && cat.categoryName
      ? cat.categoryName.toLowerCase().replace(/\s+/g, '-')
      : String(categoryId);

    // If we're viewing a brand, navigate to /shop/collections/:marca/:category
    if (this.brandId) {
      this.router.navigate(['/shop', 'collections', this.brandId, slug], { queryParamsHandling: 'preserve' });
    } else {
      this.router.navigate(['/shop', slug], { queryParamsHandling: 'preserve' });
    }
  }

  private setupSeo(): void {
    this.seoService.updateMetaTags({
      title: 'Tienda de Maquillaje Original | Gilú Shop Ecuador',
      description: 'Explora nuestra tienda de maquillaje 100% original. Encuentra bases, labiales, correctores, skincare coreano y más de las mejores marcas internacionales.',
      keywords: 'tienda maquillaje, productos belleza, bases, labiales, corretores, skincare, Ecuador, online',
      image: 'https://gilu-shop.com/assets/image/gilu-update.png',
      url: 'https://gilu-shop.com/shop',
      type: 'website',
      locale: 'es_EC',
      siteName: 'Gilú Shop'
    });

    this.seoService.setTwitterCard({
      title: 'Tienda de Maquillaje Original | Gilú Shop',
      description: 'Explora nuestra tienda de maquillaje 100% original. Las mejores marcas internacionales.',
      image: 'https://gilu-shop.com/assets/image/gilu-update.png'
    });

    // Add WebSite schema with search capability
    this.seoService.setJsonLd(
      this.seoService.generateWebSiteSchema()
    );
  }

  private updateSearchSeo(searchQuery: string): void {
    this.seoService.updateMetaTags({
      title: `Buscar: ${searchQuery} | Gilú Shop Ecuador`,
      description: `Resultados de búsqueda para ${searchQuery} en Gilú Shop. Maquillaje original de las mejores marcas.`,
      keywords: `buscar, ${searchQuery}, maquillaje, Ecuador`,
      image: 'https://gilu-shop.com/assets/image/gilu-update.png',
      url: `https://gilu-shop.com/shop?q=${encodeURIComponent(searchQuery)}`,
      type: 'website'
    });
  }

  private updateCategorySeo(categoryId: number): void {
    const category = this.categories.find(c => c.id === categoryId);
    if (category) {
      this.seoService.updateMetaTags({
        title: `${category.categoryName} | Gilú Shop Ecuador`,
        description: `Explora nuestra colección de ${category.categoryName}. Maquillaje 100% original de las mejores marcas.`,
        keywords: `${category.categoryName.toLowerCase()}, maquillaje, Ecuador, tienda online`,
        image: 'https://gilu-shop.com/assets/image/gilu-update.png',
        url: `https://gilu-shop.com/shop?cat=${categoryId}`,
        type: 'website'
      });
    }
  }

  private updateBrandSeo(brand: CatalogBrandDTO): void {
    console.log(brand.brandDescription);
    console.log(`https://gilu-shop.com/assets/image/${brand.brandDescription}--1.webp`);

    this.seoService.updateMetaTags({


      title: `${brand.brandName} - Ecuador | Gilú Shop Ecuador`,
      description: `Explora nuestra colección de ${brand.brandName} aquí en Ecuador. Maquillaje 100% original de las mejores marcas. Con envíos a todo el Ecuador y regalos en tu compra.`,
      keywords: `${brand.brandName.toLowerCase()}, maquillaje, Ecuador, tienda online`,
      image: `https://gilu-shop.com/assets/image/${brand.brandDescription}--1.webp`,
      url: `https://gilu-shop.com/shop/collections/${brand.brandDescription}`,
      type: 'website'
    });

    this.seoService.setJsonLd({
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      "name": `${brand.brandName} Ecuador`,
      "url": `https://gilu-shop.com/shop/collections/${brand.brandDescription}`,
      "description": `Productos ${brand.brandName} originales en Ecuador`
    }, 'schema-brand');

    const canonicalUrl = `https://gilu-shop.com/shop/collections/${brand.brandDescription}`;

    this.seoService.setCanonicalUrl(canonicalUrl);
    this.seoService.setHreflang(canonicalUrl);
  }

  private handleBrandParam(params: any): void {
    if (params['marca']) {
      this.selectedCategory = null;
      this.searchTerm = null;

      // Fetch brands to get the correct brandName for API calls
      this.productsService.getAllCatalogBrands().subscribe({
        next: (brands) => {
          const brand = brands.find(b => b.brandDescription.toLowerCase() === params['marca'].toLowerCase());
          if (brand) {
            this.brandId = brand.brandDescription;
            this.brandNombre = brand.brandName;
            this.updateBrandSeo(brand);

            // Fetch categories filtered by brand
            this.productsService.getCategoriesByBrandName(brand.brandName).subscribe({
              next: (categories) => {
                //console.log(categories);

                this.selectedCategoryIds = categories.map(cat => cat.id);

                // If route included a category slug, select that category for this brand
                if (params['category']) {
                  const routeCategory = params['category'].toString().toLowerCase();
                  const matched = categories.find(cat => (cat.categoryName || '').toLowerCase().replace(/\s+/g, '-') === routeCategory);
                  if (matched) {
                    this.selectedCategory = matched.id;
                    // Keep full category list for the brand, but mark selection
                    this.updateCategorySeo(matched.id);
                  }
                }

                this.cdr.detectChanges();
              },
              error: (err) => {
                console.error('Error loading categories by brand:', err);
              }
            });
          } else {
            // Fallback to params if brand not found
            this.brandId = params['marca'];
          }
          this.cdr.detectChanges(); // Force grid update

          // Scroll to products section after a short delay to ensure DOM is updated
          setTimeout(() => {
            const productsSection = document.getElementById('products-section');
            if (productsSection) {
              productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }, 100);
        },
        error: (err) => {
          console.error('Error loading brands:', err);
          // Fallback to params
          this.brandId = params['marca'];
          this.cdr.detectChanges();
        }
      });
    } else {
      // Handle top-level category slug: /shop/:category
      this.brandId = null;
      this.setupSeo();

      if (params['category']) {
        // If categories not loaded yet, store pending and let ngOnInit categories callback apply it
        if (this.categories.length === 0) {
          this.pendingCategoryId = params['category'];
          } else {
          this.applyCategorySelection(params['category']);
          // Keep full category list on top-level /shop; just update SEO and selection
          if (this.selectedCategory) {
            this.updateCategorySeo(this.selectedCategory);
          }
        }
      } else {
        // Reset to full category list when no brand/category is selected
        this.selectedCategoryIds = [13, 14, 22, 26, 32, 41, 16, 56, 63, 44];
      }
    }
  }

  onSearchQueryChange(event: { query: string; category: string }): void {
    this.searchQuery = event.query;
  }

  onCategoryChange(categoryId: number | null): void {
    this.selectedCategory = categoryId;
    this.searchTerm = null;
    // Update URL to include category slug
    this.navigateToCategorySlug(categoryId);
    // Update SEO meta for category selection
    if (categoryId !== null) {
      this.updateCategorySeo(categoryId);
    } else {
      this.setupSeo();
    }
  }

  onSearchChange(searchTerm: string | null): void {
    this.searchTerm = searchTerm;
    this.selectedCategory = null;
  }

  onCategorySelect(categoryId: string): void {
    // If categories are not loaded yet, store the pending category
    if (this.categories.length === 0) {
      this.pendingCategoryId = categoryId;
      return;
    }

    this.applyCategorySelection(categoryId);
  }

  onIsTyping(typing: boolean): void {
    this.isSearching = typing;
  }

  onBadgeCategoryChange(categoryId: number | null): void {
    this.selectedCategory = categoryId;
    this.searchTerm = null;
  }
}
