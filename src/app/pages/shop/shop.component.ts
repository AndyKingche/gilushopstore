import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '../../core/services/products.service';
import { SeoService } from '../../core/services/seo.service';
import { SearchService } from '../../core/services/search.service';
import { Category } from '../../core/models/category.model';
import { Subscription } from 'rxjs';

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
  categories: Category[] = [];
  searchQuery = '';
  selectedCategory: number | null = null;
  searchTerm: string | null = null;
  private pendingCategoryId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private productsService: ProductsService,
    private seoService: SeoService,
    private searchService: SearchService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Setup SEO for shop page
    this.setupSeo();

    // Load categories from API
    this.productsService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        // Apply pending category if any
        if (this.pendingCategoryId) {
          this.applyCategorySelection(this.pendingCategoryId);
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
  }

  private applyCategorySelection(categoryId: string): void {
    // First, try to find the category by mapped name
    const categoryName = CATEGORY_NAME_MAP[categoryId];
    if (categoryName) {
      const foundCategory = this.categories.find(
        cat => cat.categoryName?.toLowerCase() === categoryName.toLowerCase()
      );
      if (foundCategory) {
        this.selectedCategory = foundCategory.id;
        this.searchTerm = null;
        return;
      }
    }
    
    // Fallback: try to parse as number
    const numId = parseInt(categoryId, 10);
    this.selectedCategory = isNaN(numId) ? null : numId;
    this.searchTerm = null;
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

  onSearchQueryChange(event: { query: string; category: string }): void {
    this.searchQuery = event.query;
  }

  onCategoryChange(categoryId: number | null): void {
    this.selectedCategory = categoryId;
    this.searchTerm = null;
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
}
