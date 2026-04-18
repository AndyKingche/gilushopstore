import { Injectable, Inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';

export interface SeoConfig {
  title: string;
  description: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: string;
  author?: string;
  locale?: string;
  siteName?: string;
}

export interface TwitterCardConfig {
  title: string;
  description: string;
  image?: string;
  site?: string;
  creator?: string;
}

export interface JsonLdSchema {
  '@context': string;
  '@type': string;
  [key: string]: any;
}

export interface SeoGlobalConfig {
  siteName: string;
  defaultLocale: string;
  defaultCurrency: string;
  baseUrl: string;
  defaultImage: string;
  defaultDescription: string;
  contactEmail: string;
  contactPhone: string;
  socialLinks: {
    facebook: string;
    instagram: string;
    whatsapp: string;
  };
  address: {
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
    latitude: number;
    longitude: number;
  };
}

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  private globalConfig: SeoGlobalConfig;
  private productSchemaCache = new Map<string, JsonLdSchema>();
  private productListSchemaCache = new Map<string, JsonLdSchema>();
  private localBusinessSchemaCache: JsonLdSchema | null = null;
  private storeSchemaCache = new Map<string, JsonLdSchema>();
  private breadcrumbSchemaCache = new Map<string, JsonLdSchema>();
  private organizationSchemaCache: JsonLdSchema | null = null;
  private webSiteSchemaCache: JsonLdSchema | null = null;
  private faqSchemaCache = new Map<string, JsonLdSchema>();

  constructor(
    private title: Title,
    private meta: Meta,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.globalConfig = this.getDefaultGlobalConfig();
  }

  /**
   * Get default global configuration
   */
  private getDefaultGlobalConfig(): SeoGlobalConfig {
    return {
      siteName: 'Gilú Shop',
      defaultLocale: 'es_EC',
      defaultCurrency: 'USD',
      baseUrl: 'https://gilu-shop.com',
      defaultImage: 'https://gilu-shop.com/assets/image/gilu-update.png',
      defaultDescription: 'Tienda de maquillaje 100% original en Ecuador. Maybelline, e.l.f., NYX, L\'Oréal, Huda Beauty y más marcas internacionales con envío a todo Ecuador.',
      contactEmail: 'customers@gilu-shop.com',
      contactPhone: '+593982901603',
      socialLinks: {
        facebook: 'https://www.facebook.com/share/1AWFit8kx4/?mibextid=wwXIfr',
        instagram: 'https://www.instagram.com/gilu.ec',
        whatsapp: 'https://wa.me/593982901603'
      },
      address: {
        streetAddress: 'Otavalo',
        addressLocality: 'Otavalo',
        addressRegion: 'Imbabura',
        postalCode: '100201',
        addressCountry: 'EC',
        latitude: 0.2307,
        longitude: -78.2622
      }
    };
  }

  /**
   * Set global configuration for SEO service
   * @param config Global configuration object
   */
  setGlobalConfig(config: Partial<SeoGlobalConfig>): void {
    this.globalConfig = { ...this.getDefaultGlobalConfig(), ...config };
    // Clear caches when config changes
    this.clearAllCaches();
  }

  /**
   * Get current global configuration
   */
  getGlobalConfig(): SeoGlobalConfig {
    return { ...this.globalConfig };
  }

  /**
    * Execute DOM operation with error handling
    * @param operation Function to execute
    */
  private executeDomOperation<T>(operation: () => T): T | void {
    try {
      return operation();
    } catch (error) {
      console.error('[SEO] DOM operation failed:', error);
    }
  }

  /**
   * Validate string input
   * @param value String to validate
   * @param fieldName Field name for error logging
   */
  private isValidString(value: string | undefined | null, fieldName: string): boolean {
    if (typeof value !== 'string' || value.trim().length === 0) {
      console.warn(`[SEO] Invalid ${fieldName}: must be a non-empty string`);
      return false;
    }
    return true;
  }

  /**
   * Clear all schema caches
   */
  private clearAllCaches(): void {
    this.productSchemaCache.clear();
    this.productListSchemaCache.clear();
    this.localBusinessSchemaCache = null;
    this.storeSchemaCache.clear();
    this.breadcrumbSchemaCache.clear();
    this.organizationSchemaCache = null;
    this.webSiteSchemaCache = null;
    this.faqSchemaCache.clear();
  }

  /**
   * Update all meta tags for a page
   */
  updateMetaTags(config: SeoConfig): void {
    this.clearMetaTags();
    
    // Set title (both Angular Title service and meta name="title")
    this.setTitle(config.title);
    this.meta.updateTag({ name: 'title', content: config.title });

    // Set meta description
    this.setMetaDescription(config.description);

    // Set keywords
    if (config.keywords) {
      this.setMetaKeywords(config.keywords);
    }

    // Set Open Graph tags
    this.setOpenGraphTags(config);
  }

  /**
   * Set page title
   * @param title Page title (required, non-empty string)
   */
  setTitle(title: string): void {
    if (!this.isValidString(title, 'title')) {
      return;
    }
    this.title.setTitle(title);
  }

  /**
   * Get current title
   */
  getTitle(): string {
    return this.title.getTitle();
  }

clearMetaTags(): void {
    const selectors = [
      'meta[name="description"]',
      'meta[name="keywords"]',
      'meta[name="title"]',
      'meta[property="og:title"]',
      'meta[property="og:description"]',
      'meta[property="og:image"]',
      'meta[property="og:url"]',
      'meta[property="og:type"]',
      'meta[property="og:locale"]',
      'meta[property="og:site_name"]',
      'meta[name="twitter:card"]',
      'meta[name="twitter:title"]',
      'meta[name="twitter:description"]',
      'meta[name="twitter:image"]'
    ];

    selectors.forEach(selector => {
      try {
        const element = this.document.querySelector(selector);
        if (element) {
          element.remove();
        }
      } catch (e) {
        // Ignore errors
      }
    });
  }

  /**
   * Set meta description
   * @param description Meta description (required, non-empty string)
   */
  setMetaDescription(description: string): void {
    if (!this.isValidString(description, 'description')) {
      return;
    }
    this.meta.updateTag({ name: 'description', content: description });
  }

  /**
   * Set meta keywords
   * @param keywords Meta keywords (required, non-empty string)
   */
  setMetaKeywords(keywords: string): void {
    if (!this.isValidString(keywords, 'keywords')) {
      return;
    }
    this.meta.updateTag({ name: 'keywords', content: keywords });
  }

  /**
   * Set Open Graph meta tags (all using 'property' attribute)
   */
  private setOpenGraphTags(config: SeoConfig): void {
    // OG Title - using property attribute
    if (this.isValidString(config.title, 'og:title')) {
      this.meta.updateTag({ property: 'og:title', content: config.title });
    }

    // OG Description - using property attribute
    if (this.isValidString(config.description, 'og:description')) {
      this.meta.updateTag({ property: 'og:description', content: config.description });
    }

    // OG Image - using property attribute
    if (config.image && this.isValidString(config.image, 'og:image')) {
      this.meta.updateTag({ property: 'og:image', content: config.image });
    }

    // OG URL - using property attribute
    if (config.url && this.isValidString(config.url, 'og:url')) {
      this.meta.updateTag({ property: 'og:url', content: config.url });
    }

    // OG Type - using property attribute
    this.meta.updateTag({ property: 'og:type', content: config.type || 'website' });

    // OG Locale - using property attribute
    this.meta.updateTag({ property: 'og:locale', content: config.locale || this.globalConfig.defaultLocale });

    // OG Site Name - using property attribute
    this.meta.updateTag({ property: 'og:site_name', content: config.siteName || this.globalConfig.siteName });
  }

  /**
   * Set Twitter Card meta tags
   * @param config Twitter card configuration
   * @param cardType Twitter card type
   */
  setTwitterCard(
    config: TwitterCardConfig,
    cardType: 'summary' | 'summary_large_image' = 'summary_large_image'
  ): void {
    this.meta.updateTag({ name: 'twitter:card', content: cardType });

    if (this.isValidString(config.title, 'twitter:title')) {
      this.meta.updateTag({ name: 'twitter:title', content: config.title });
    }

    if (this.isValidString(config.description, 'twitter:description')) {
      this.meta.updateTag({ name: 'twitter:description', content: config.description });
    }

    if (config.image && this.isValidString(config.image, 'twitter:image')) {
      this.meta.updateTag({ name: 'twitter:image', content: config.image });
    }
    if (config.site && this.isValidString(config.site, 'twitter:site')) {
      this.meta.updateTag({ name: 'twitter:site', content: config.site });
    }
    if (config.creator && this.isValidString(config.creator, 'twitter:creator')) {
      this.meta.updateTag({ name: 'twitter:creator', content: config.creator });
    }
  }

  /**
    * Add JSON-LD structured data schema with unique ID for SSR compatibility
    * @param schema JSON-LD schema object
    * @param id Unique identifier for the script element
    */
  setJsonLd(schema: JsonLdSchema, id: string = 'seo-json-ld'): void {
    if (!schema || typeof schema !== 'object') {
      console.warn('[SEO] Invalid schema: must be a valid object');
      return;
    }

    this.executeDomOperation(() => {
      const existing = this.document.getElementById(id);
      if (existing) {
        existing.remove();
      }

      const script = this.document.createElement('script');
      script.type = 'application/ld+json';
      script.text = JSON.stringify(schema);
      script.id = id;

      this.document.head.appendChild(script);
    });
  }

  /**
    * Remove JSON-LD structured data by ID
    * @param id Unique identifier for the script element
    */
  removeJsonLd(id: string = 'seo-json-ld'): void {
    if (!this.isValidString(id, 'json-ld id')) {
      return;
    }

    this.executeDomOperation(() => {
      const existingScript = this.document.getElementById(id);
      if (existingScript) {
        existingScript.remove();
      }
    });
  }

  /**
    * Set canonical URL for the page
    * @param url Canonical URL (required, non-empty string)
    */
  setCanonicalUrl(url: string): void {
    if (!this.isValidString(url, 'canonical URL')) {
      return;
    }

    this.executeDomOperation(() => {
      let link: HTMLLinkElement = this.document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
      if (!link) {
        link = this.document.createElement('link');
        link.setAttribute('rel', 'canonical');
        this.document.head.appendChild(link);
      }
      link.setAttribute('href', url);
    });
  }

  /**
    * Set hreflang for Ecuador Spanish
    * @param url URL for hreflang (required, non-empty string)
    */
  setHreflang(url: string): void {
    if (!this.isValidString(url, 'hreflang URL')) {
      return;
    }

    this.executeDomOperation(() => {
      const existing = this.document.querySelector('link[rel="alternate"][hreflang="es-EC"]') as HTMLLinkElement;
      if (existing) {
        existing.setAttribute('href', url);
        return;
      }

      const link = this.document.createElement('link');
      link.setAttribute('rel', 'alternate');
      link.setAttribute('hreflang', 'es-EC');
      link.setAttribute('href', url);
      this.document.head.appendChild(link);
    });
  }

  /**
   * Generate Product schema for structured data
   * @param product Product data object
   * @returns Cached or newly generated Product schema
   */
  generateProductSchema(product: {
    name: string;
    description: string;
    image: string;
    price: number;
    currency?: string;
    brand?: string;
    availability?: string;
    sku?: string;
  }): JsonLdSchema {
    // Validate required fields
    if (!this.isValidString(product.name, 'product name') ||
        !this.isValidString(product.description, 'product description') ||
        !this.isValidString(product.image, 'product image') ||
        typeof product.price !== 'number' || product.price < 0) {
      console.warn('[SEO] Invalid product data for schema generation');
      return {} as JsonLdSchema;
    }

    // Create cache key
    const cacheKey = JSON.stringify({
      name: product.name,
      description: product.description,
      image: product.image,
      price: product.price,
      currency: product.currency || this.globalConfig.defaultCurrency,
      brand: product.brand,
      availability: product.availability,
      sku: product.sku
    });

    // Check cache
    const cached = this.productSchemaCache.get(cacheKey);
    if (cached) {
      return cached;
    }

    // Generate new schema
    const schema: JsonLdSchema = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      description: product.description,
      image: product.image,
      offers: {
        '@type': 'Offer',
        price: product.price,
        priceCurrency: product.currency || this.globalConfig.defaultCurrency,
        availability: product.availability || 'https://schema.org/InStock',
        itemCondition: 'https://schema.org/NewCondition'
      },
      ...(product.brand && {
        brand: {
          '@type': 'Brand',
          name: product.brand
        }
      }),
      ...(product.sku && {
        sku: product.sku
      })
    };

    // Cache and return
    this.productSchemaCache.set(cacheKey, schema);
    return schema;
  }

  /**
   * Generate ProductList schema for product listing pages
   * @param products Array of product objects
   * @returns Cached or newly generated ProductList schema
   */
  generateProductListSchema(products: Array<{
    id: number | string;
    name: string;
    url?: string;
  }>): JsonLdSchema {
    // Validate products array
    if (!Array.isArray(products) || products.length === 0) {
      console.warn('[SEO] Invalid products array for ProductList schema');
      return {} as JsonLdSchema;
    }

    // Validate each product
    for (const product of products) {
      if (!this.isValidString(product.name, 'product name') ||
          (typeof product.id !== 'number' && typeof product.id !== 'string')) {
        console.warn('[SEO] Invalid product data in products array');
        return {} as JsonLdSchema;
      }
    }

    // Create cache key
    const cacheKey = JSON.stringify(products.map(p => ({
      id: p.id,
      name: p.name,
      url: p.url || `${this.globalConfig.baseUrl}/product/${p.id}`
    })));

    // Check cache
    const cached = this.productListSchemaCache.get(cacheKey);
    if (cached) {
      return cached;
    }

    // Generate new schema
    const schema: JsonLdSchema = {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: `Catálogo de maquillaje — ${this.globalConfig.siteName}`,
      description: this.globalConfig.defaultDescription,
      itemListElement: products.map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: p.name,
        url: p.url || `${this.globalConfig.baseUrl}/product/${p.id}`
      }))
    };

    // Cache and return
    this.productListSchemaCache.set(cacheKey, schema);
    return schema;
  }

  /**
   * Generate LocalBusiness/Store schema for Otavalo, Ecuador
   * @returns Cached or newly generated LocalBusiness schema
   */
  generateLocalBusinessSchema(): JsonLdSchema {
    // Check cache
     //console.log(this.globalConfig.siteName);
    if (this.localBusinessSchemaCache) {
      return this.localBusinessSchemaCache;
    }

    // Generate new schema
    const schema: JsonLdSchema = {
      '@context': 'https://schema.org',
      '@type': 'Store',
      name: this.globalConfig.siteName,
      description: this.globalConfig.defaultDescription,
      url: this.globalConfig.baseUrl,
      image: this.globalConfig.defaultImage,
      telephone: this.globalConfig.contactPhone,
      email: this.globalConfig.contactEmail,
      priceRange: '$$',
      currenciesAccepted: this.globalConfig.defaultCurrency,
      paymentAccepted: 'Cash, Credit Card, Transferencia',
      address: {
        '@type': 'PostalAddress',
        streetAddress: this.globalConfig.address.streetAddress,
        addressLocality: this.globalConfig.address.addressLocality,
        addressRegion: this.globalConfig.address.addressRegion,
        postalCode: this.globalConfig.address.postalCode,
        addressCountry: this.globalConfig.address.addressCountry
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: this.globalConfig.address.latitude,
        longitude: this.globalConfig.address.longitude
      },
      openingHours: 'Mo-Sa 09:00-19:00',
      areaServed: {
        '@type': 'Country',
        name: 'Ecuador'
      },
      sameAs: [
        this.globalConfig.socialLinks.instagram,
        this.globalConfig.socialLinks.facebook,
        this.globalConfig.socialLinks.whatsapp
      ]
    };

    // Cache and return
    this.localBusinessSchemaCache = schema;
    return schema;
  }

  /**
   * Generate Store/LocalBusiness schema for structured data
   * @param store Store data object
   * @returns Cached or newly generated Store schema
   */
  generateStoreSchema(store: {
    name: string;
    description: string;
    image: string;
    url?: string;
    telephone?: string;
    email?: string;
    address?: {
      streetAddress: string;
      addressLocality: string;
      addressRegion: string;
      postalCode: string;
      addressCountry: string;
    };
    openingHours?: string;
    priceRange?: string;
    latitude?: number;
    longitude?: number;
  }): JsonLdSchema {
    // Validate required fields
    if (!this.isValidString(store.name, 'store name') ||
        !this.isValidString(store.description, 'store description') ||
        !this.isValidString(store.image, 'store image')) {
      console.warn('[SEO] Invalid store data for schema generation');
      return {} as JsonLdSchema;
    }

    // Create cache key
    const cacheKey = JSON.stringify(store);

    // Check cache
    const cached = this.storeSchemaCache.get(cacheKey);
    if (cached) {
      return cached;
    }

    // Generate new schema
    const schema: JsonLdSchema = {
      '@context': 'https://schema.org',
      '@type': 'Store',
      name: store.name,
      description: store.description,
      image: store.image,
      url: store.url || this.globalConfig.baseUrl,
      telephone: store.telephone || this.globalConfig.contactPhone,
      email: store.email || this.globalConfig.contactEmail,
      address: store.address ? {
        '@type': 'PostalAddress',
        streetAddress: store.address.streetAddress,
        addressLocality: store.address.addressLocality,
        addressRegion: store.address.addressRegion,
        postalCode: store.address.postalCode,
        addressCountry: store.address.addressCountry
      } : undefined,
      openingHours: store.openingHours || 'Mo-Fr 09:00-20:00, Sa 09:00-18:00',
      priceRange: store.priceRange || '$$',
      ...(store.latitude && store.longitude && {
        geo: {
          '@type': 'GeoCoordinates',
          latitude: store.latitude,
          longitude: store.longitude
        }
      })
    };

    // Cache and return
    this.storeSchemaCache.set(cacheKey, schema);
    return schema;
  }

  /**
   * Generate BreadcrumbList schema
   * @param breadcrumbs Array of breadcrumb objects
   * @returns Cached or newly generated BreadcrumbList schema
   */
  generateBreadcrumbSchema(breadcrumbs: Array<{ name: string; url: string }>): JsonLdSchema {
    // Validate breadcrumbs array
    if (!Array.isArray(breadcrumbs) || breadcrumbs.length === 0) {
      console.warn('[SEO] Invalid breadcrumbs array for BreadcrumbList schema');
      return {} as JsonLdSchema;
    }

    // Validate each breadcrumb
    for (const breadcrumb of breadcrumbs) {
      if (!this.isValidString(breadcrumb.name, 'breadcrumb name') ||
          !this.isValidString(breadcrumb.url, 'breadcrumb url')) {
        console.warn('[SEO] Invalid breadcrumb data in breadcrumbs array');
        return {} as JsonLdSchema;
      }
    }

    // Create cache key
    const cacheKey = JSON.stringify(breadcrumbs);

    // Check cache
    const cached = this.breadcrumbSchemaCache.get(cacheKey);
    if (cached) {
      return cached;
    }

    // Generate new schema
    const schema: JsonLdSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: item.url
      }))
    };

    // Cache and return
    this.breadcrumbSchemaCache.set(cacheKey, schema);
    return schema;
  }

  /**
   * Generate Organization schema
   * @returns Cached or newly generated Organization schema
   */
  generateOrganizationSchema(): JsonLdSchema {
    // Check cache
    //console.log(this.globalConfig.siteName);
    if (this.organizationSchemaCache) {
      return this.organizationSchemaCache;
    }

    // Generate new schema
    const schema: JsonLdSchema = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: this.globalConfig.siteName,
      url: this.globalConfig.baseUrl,
      logo: this.globalConfig.defaultImage,
      description: this.globalConfig.defaultDescription,
      sameAs: [
        this.globalConfig.socialLinks.facebook,
        this.globalConfig.socialLinks.instagram,
        this.globalConfig.socialLinks.whatsapp
      ],
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: this.globalConfig.contactPhone,
        contactType: 'customer service',
        availableLanguage: ['Spanish', 'English']
      }
    };

    // Cache and return
    this.organizationSchemaCache = schema;
    return schema;
  }

  /**
   * Generate WebSite schema with search capability
   * @returns Cached or newly generated WebSite schema
   */
  generateWebSiteSchema(): JsonLdSchema {
    // Check cache
    if (this.webSiteSchemaCache) {
      return this.webSiteSchemaCache;
    }

    //console.log(this.globalConfig.siteName);
    
    // Generate new schema
    const schema: JsonLdSchema = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: this.globalConfig.siteName,
      url: this.globalConfig.baseUrl,
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${this.globalConfig.baseUrl}/shop?q={search_term_string}`
        },
        'query-input': 'required name=search_term_string'
      }
    };

    // Cache and return
    this.webSiteSchemaCache = schema;
    return schema;
  }

  /**
   * Generate FAQ schema
   * @param faqs Array of FAQ objects
   * @returns Cached or newly generated FAQ schema
   */
  generateFaqSchema(faqs: Array<{ question: string; answer: string }>): JsonLdSchema {
    // Validate faqs array
    if (!Array.isArray(faqs) || faqs.length === 0) {
      console.warn('[SEO] Invalid faqs array for FAQ schema');
      return {} as JsonLdSchema;
    }

    // Validate each faq
    for (const faq of faqs) {
      if (!this.isValidString(faq.question, 'faq question') ||
          !this.isValidString(faq.answer, 'faq answer')) {
        console.warn('[SEO] Invalid faq data in faqs array');
        return {} as JsonLdSchema;
      }
    }

    // Create cache key
    const cacheKey = JSON.stringify(faqs);

    // Check cache
    const cached = this.faqSchemaCache.get(cacheKey);
    if (cached) {
      return cached;
    }

    // Generate new schema
    const schema: JsonLdSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqs.map(faq => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: faq.answer
        }
      }))
    };

    // Cache and return
    this.faqSchemaCache.set(cacheKey, schema);
    return schema;
  }

  generateGlobalSchemas(): void {
    this.setJsonLd(this.generateOrganizationSchema(), 'schema-org');
    this.setJsonLd(this.generateWebSiteSchema(), 'schema-site');
    this.setJsonLd(this.generateLocalBusinessSchema(), 'schema-local');
  }
}
