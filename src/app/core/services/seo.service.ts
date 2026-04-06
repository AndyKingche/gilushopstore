import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';

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

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  private isBrowser: boolean;

  constructor(
    private title: Title,
    private meta: Meta,
    @Inject(DOCUMENT) private document: Document,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  /**
   * Update all meta tags for a page
   */
  updateMetaTags(config: SeoConfig): void {
    // Set title
    this.setTitle(config.title);

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
   */
  setTitle(title: string): void {
    this.title.setTitle(title);
  }

  /**
   * Get current title
   */
  getTitle(): string {
    return this.title.getTitle();
  }

  /**
   * Set meta description
   */
  setMetaDescription(description: string): void {
    this.meta.updateTag({ name: 'description', content: description });
  }

  /**
   * Set meta keywords
   */
  setMetaKeywords(keywords: string): void {
    this.meta.updateTag({ name: 'keywords', content: keywords });
  }

  /**
   * Set Open Graph meta tags (all using 'property' attribute)
   */
  private setOpenGraphTags(config: SeoConfig): void {
    // OG Title - using property attribute
    this.meta.updateTag({ property: 'og:title', content: config.title });

    // OG Description - using property attribute
    this.meta.updateTag({ property: 'og:description', content: config.description });

    // OG Image - using property attribute
    if (config.image) {
      this.meta.updateTag({ property: 'og:image', content: config.image });
    }

    // OG URL - using property attribute
    if (config.url) {
      this.meta.updateTag({ property: 'og:url', content: config.url });
    }

    // OG Type - using property attribute
    this.meta.updateTag({ property: 'og:type', content: config.type || 'website' });

    // OG Locale - using property attribute
    this.meta.updateTag({ property: 'og:locale', content: config.locale || 'es_EC' });

    // OG Site Name - using property attribute
    this.meta.updateTag({ property: 'og:site_name', content: config.siteName || 'Gilú Shop' });
  }

  /**
   * Set Twitter Card meta tags
   */
  setTwitterCard(
    config: TwitterCardConfig,
    cardType: 'summary' | 'summary_large_image' = 'summary_large_image'
  ): void {
    this.meta.updateTag({ name: 'twitter:card', content: cardType });
    this.meta.updateTag({ name: 'twitter:title', content: config.title });
    this.meta.updateTag({ name: 'twitter:description', content: config.description });
    
    if (config.image) {
      this.meta.updateTag({ name: 'twitter:image', content: config.image });
    }
    if (config.site) {
      this.meta.updateTag({ name: 'twitter:site', content: config.site });
    }
    if (config.creator) {
      this.meta.updateTag({ name: 'twitter:creator', content: config.creator });
    }
  }

  /**
   * Add JSON-LD structured data schema with unique ID for SSR compatibility
   */
  setJsonLd(schema: JsonLdSchema, id: string = 'seo-json-ld'): void {
    // Remove existing JSON-LD script with same ID
    const existing = this.document.getElementById(id);
    if (existing) {
      existing.remove();
    }

    // Create new script element
    const script = this.document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schema);
    script.id = id;
    
    this.document.head.appendChild(script);
  }

  /**
   * Remove JSON-LD structured data by ID
   */
  removeJsonLd(id: string = 'seo-json-ld'): void {
    const existingScript = this.document.getElementById(id);
    if (existingScript) {
      existingScript.remove();
    }
  }

  /**
   * Set canonical URL for the page
   */
  setCanonicalUrl(url: string): void {
    let link: HTMLLinkElement = this.document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }

  /**
   * Set hreflang for Ecuador Spanish
   */
  setHreflang(url: string): void {
    const link = this.document.createElement('link');
    link.setAttribute('rel', 'alternate');
    link.setAttribute('hreflang', 'es-EC');
    link.setAttribute('href', url);
    this.document.head.appendChild(link);
  }

  /**
   * Generate Product schema for structured data
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
    return {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      description: product.description,
      image: product.image,
      offers: {
        '@type': 'Offer',
        price: product.price,
        priceCurrency: product.currency || 'USD',
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
  }

  /**
   * Generate ProductList schema for product listing pages
   */
  generateProductListSchema(products: Array<{
    id: number | string;
    name: string;
    url?: string;
  }>): JsonLdSchema {
    return {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: 'Catálogo de maquillaje — Gilú Shop',
      description: 'Catálogo de maquillaje 100% original en Otavalo, Ecuador. Maybelline, e.l.f., NYX, L\'Oréal, Huda Beauty y más.',
      itemListElement: products.map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: p.name,
        url: p.url || `https://gilu-shop.com/product/${p.id}`
      }))
    };
  }

  /**
   * Generate LocalBusiness/Store schema for Otavalo, Ecuador
   */
  generateLocalBusinessSchema(): JsonLdSchema {
    return {
      '@context': 'https://schema.org',
      '@type': 'Store',
      name: 'Gilú Shop',
      description: 'Tienda de maquillaje 100% original en Otavalo, Ecuador. Maybelline, e.l.f., NYX, L\'Oréal, Huda Beauty y más marcas internacionales con envío a todo Ecuador.',
      url: 'https://gilu-shop.com',
      image: 'https://gilu-shop.com/assets/image/gilu-update.png',
      telephone: '+593982901603',
      email: 'customers@gilu-shop.com',
      priceRange: '$$',
      currenciesAccepted: 'USD',
      paymentAccepted: 'Cash, Credit Card, Transferencia',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Otavalo',
        addressLocality: 'Otavalo',
        addressRegion: 'Imbabura',
        postalCode: '100201',
        addressCountry: 'EC'
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 0.2307,
        longitude: -78.2622
      },
      openingHours: 'Mo-Sa 09:00-19:00',
      areaServed: {
        '@type': 'Country',
        name: 'Ecuador'
      },
      sameAs: [
        'https://www.instagram.com/gilushop',
        'https://www.facebook.com/gilushop',
        'https://wa.me/593982901603'
      ]
    };
  }

  /**
   * Generate Store/LocalBusiness schema for structured data
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
    return {
      '@context': 'https://schema.org',
      '@type': 'Store',
      name: store.name,
      description: store.description,
      image: store.image,
      url: store.url || 'https://gilu-shop.com',
      telephone: store.telephone || '+593-2-123-4567',
      email: store.email || 'contacto@gilu-shop.com',
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
  }

  /**
   * Generate BreadcrumbList schema
   */
  generateBreadcrumbSchema(breadcrumbs: Array<{ name: string; url: string }>): JsonLdSchema {
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs.map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
        item: item.url
      }))
    };
  }

  /**
   * Generate Organization schema
   */
  generateOrganizationSchema(): JsonLdSchema {
    return {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Gilú Shop',
      url: 'https://gilu-shop.com',
      logo: 'https://gilu-shop.com/assets/image/gilu-update.png',
      description: 'Tu tienda de maquillaje 100% original en Otavalo Ecuador. Maybelline, E.l.f. Cosmetics, Loreal, NYX, Huda Beauty, y más.',
      sameAs: [
        'https://www.facebook.com/gilushop',
        'https://www.instagram.com/gilushop',
        'https://wa.me/593982901603'
      ],
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+593982901603',
        contactType: 'customer service',
        availableLanguage: ['Spanish', 'English']
      }
    };
  }

  /**
   * Generate WebSite schema with search capability
   */
  generateWebSiteSchema(): JsonLdSchema {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Gilú Shop',
      url: 'https://gilu-shop.com',
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: 'https://gilu-shop.com/shop?q={search_term_string}'
        },
        'query-input': 'required name=search_term_string'
      }
    };
  }

  /**
   * Generate FAQ schema
   */
  generateFaqSchema(faqs: Array<{ question: string; answer: string }>): JsonLdSchema {
    return {
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
  }
}
