import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { isPlatformBrowser } from '@angular/common';

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
   * Set Open Graph meta tags
   */
  private setOpenGraphTags(config: SeoConfig): void {
    // OG Title
    this.meta.updateTag({ property: 'og:title', content: config.title });

    // OG Description
    this.meta.updateTag({ property: 'og:description', content: config.description });

    // OG Image
    if (config.image) {
      this.meta.updateTag({ property: 'og:image', content: config.image });
    }

    // OG URL
    if (config.url) {
      this.meta.updateTag({ property: 'og:url', content: config.url });
    }

    // OG Type
    this.meta.updateTag({ property: 'og:type', content: config.type || 'website' });

    // OG Locale
    this.meta.updateTag({ property: 'og:locale', content: config.locale || 'es_EC' });

    // OG Site Name
    this.meta.updateTag({ property: 'og:site_name', content: config.siteName || 'Gilú Shop' });
  }

  /**
   * Set Twitter Card meta tags
   */
  setTwitterCard(config: SeoConfig, cardType: 'summary' | 'summary_large_image' = 'summary_large_image'): void {
    this.meta.updateTag({ name: 'twitter:card', content: cardType });
    this.meta.updateTag({ name: 'twitter:title', content: config.title });
    this.meta.updateTag({ name: 'twitter:description', content: config.description });
    
    if (config.image) {
      this.meta.updateTag({ name: 'twitter:image', content: config.image });
    }
  }

  /**
   * Add JSON-LD structured data schema
   */
  setJsonLd(schema: JsonLdSchema): void {
    if (!this.isBrowser) return;

    // Remove existing JSON-LD scripts
    this.removeJsonLd();

    // Create new script element
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.text = JSON.stringify(schema);
    script.id = 'seo-json-ld';
    
    document.head.appendChild(script);
  }

  /**
   * Remove JSON-LD structured data
   */
  removeJsonLd(): void {
    if (!this.isBrowser) return;

    const existingScript = document.getElementById('seo-json-ld');
    if (existingScript) {
      existingScript.remove();
    }
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
      url: store.url || 'https://gilushop.store',
      telephone: store.telephone || '+593-2-123-4567',
      email: store.email || 'contacto@gilushop.store',
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
      url: 'https://gilushop.store',
      logo: 'https://gilushop.store/assets/image/gilu-update.png',
      description: 'Tu tienda de maquillaje 100% original en Otavalo Ecuador. Maybelline, E.l.f. Cosmetics, Loreal, NYX, Huda Beauty, y más.',
      sameAs: [
        'https://www.facebook.com/gilushop',
        'https://www.instagram.com/gilushop',
        'https://wa.me/593999999999'
      ],
      contactPoint: {
        '@type': 'ContactPoint',
        telephone: '+593-2-123-4567',
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
      url: 'https://gilushop.store',
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: 'https://gilushop.store/shop?q={search_term_string}'
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
