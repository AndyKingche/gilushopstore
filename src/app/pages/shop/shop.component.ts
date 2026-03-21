import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '../../core/services/products.service';
import { SeoService } from '../../core/services/seo.service';
import { Category } from '../../core/models/category.model';

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
export class ShopComponent implements OnInit {
  categories: Category[] = [];
  searchQuery = '';
  selectedCategory: number | null = null;
  searchTerm: string | null = null;
  private pendingCategoryId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private productsService: ProductsService,
    private seoService: SeoService
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
      image: 'https://gilushop.store/assets/image/gilu-update.png',
      url: 'https://gilushop.store/shop',
      type: 'website',
      locale: 'es_EC',
      siteName: 'Gilú Shop'
    });

    this.seoService.setTwitterCard({
      title: 'Tienda de Maquillaje Original | Gilú Shop',
      description: 'Explora nuestra tienda de maquillaje 100% original. Las mejores marcas internacionales.',
      image: 'https://gilushop.store/assets/image/gilu-update.png'
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
      image: 'https://gilushop.store/assets/image/gilu-update.png',
      url: `https://gilushop.store/shop?q=${encodeURIComponent(searchQuery)}`,
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
        image: 'https://gilushop.store/assets/image/gilu-update.png',
        url: `https://gilushop.store/shop?cat=${categoryId}`,
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
