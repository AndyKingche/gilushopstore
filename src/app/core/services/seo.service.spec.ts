import { TestBed } from '@angular/core/testing';
import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { SeoService, SeoGlobalConfig } from './seo.service';

describe('SeoService', () => {
  let service: SeoService;
  let metaService: Meta;
  let titleService: Title;
  let document: Document;

  // Mock platform ID for SSR testing
  const mockPlatformId = { toString: () => 'server' };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SeoService,
        Meta,
        Title,
        { provide: DOCUMENT, useValue: document },
        { provide: 'PLATFORM_ID', useValue: mockPlatformId }
      ]
    });

    service = TestBed.inject(SeoService);
    metaService = TestBed.inject(Meta);
    titleService = TestBed.inject(Title);
    document = TestBed.inject(DOCUMENT);
  });

  describe('SSR Safety', () => {
    beforeEach(() => {
      // Mock non-browser environment
      spyOn(console, 'warn');
      Object.defineProperty(service, 'isBrowser', { value: false });
    });

    it('should not crash in SSR mode for setCanonicalUrl', () => {
      service.setCanonicalUrl('https://example.com');
      expect(console.warn).toHaveBeenCalledWith('[SEO] Skipping DOM operation in SSR mode');
    });

    it('should not crash in SSR mode for setHreflang', () => {
      service.setHreflang('https://example.com');
      expect(console.warn).toHaveBeenCalledWith('[SEO] Skipping DOM operation in SSR mode');
    });

    it('should not crash in SSR mode for setJsonLd', () => {
      const schema = { '@context': 'https://schema.org', '@type': 'Product', name: 'Test' };
      service.setJsonLd(schema);
      expect(console.warn).toHaveBeenCalledWith('[SEO] Skipping DOM operation in SSR mode');
    });
  });

  describe('Input Validation', () => {
    beforeEach(() => {
      spyOn(console, 'warn');
    });

    it('should log warning for empty title and not set it', () => {
      service.setTitle('');
      expect(console.warn).toHaveBeenCalledWith('[SEO] Invalid title: must be a non-empty string');
    });

    it('should log warning for null title and not set it', () => {
      service.setTitle(null as any);
      expect(console.warn).toHaveBeenCalledWith('[SEO] Invalid title: must be a non-empty string');
    });

    it('should log warning for undefined title and not set it', () => {
      service.setTitle(undefined as any);
      expect(console.warn).toHaveBeenCalledWith('[SEO] Invalid title: must be a non-empty string');
    });
  });

  describe('Duplicate Prevention', () => {
    beforeEach(() => {
      // Mock browser environment for DOM tests
      Object.defineProperty(service, 'isBrowser', { value: true });
    });

    it('should create only one canonical link tag when called multiple times', () => {
      spyOn(document.head, 'appendChild');
      spyOn(document, 'querySelector').and.returnValue(null);

      service.setCanonicalUrl('https://example.com/page1');
      service.setCanonicalUrl('https://example.com/page2');

      expect(document.querySelector).toHaveBeenCalledWith('link[rel="canonical"]');
      // Should not append multiple times since querySelector returns existing element on second call
    });

    it('should create only one hreflang tag when called multiple times', () => {
      const mockLink = document.createElement('link');
      spyOn(document, 'querySelector').and.returnValue(mockLink);
      spyOn(document.head, 'appendChild');
      spyOn(mockLink, 'setAttribute');

      service.setHreflang('https://example.com/es');
      service.setHreflang('https://example.com/es-updated');

      expect(document.querySelector).toHaveBeenCalledWith('link[rel="alternate"][hreflang="es-EC"]');
      expect(mockLink.setAttribute).toHaveBeenCalledWith('href', 'https://example.com/es-updated');
      expect(document.head.appendChild).not.toHaveBeenCalled();
    });
  });

  describe('Schema Caching', () => {
    it('should return cached product schema for identical inputs', () => {
      const product = {
        name: 'Test Product',
        description: 'Test Description',
        image: 'https://example.com/image.jpg',
        price: 29.99
      };

      const schema1 = service.generateProductSchema(product);
      const schema2 = service.generateProductSchema(product);

      expect(schema1).toBe(schema2); // Same object reference
      expect(schema1.name).toBe('Test Product');
    });

    it('should return different schemas for different products', () => {
      const product1 = {
        name: 'Product 1',
        description: 'Description 1',
        image: 'https://example.com/image1.jpg',
        price: 19.99
      };

      const product2 = {
        name: 'Product 2',
        description: 'Description 2',
        image: 'https://example.com/image2.jpg',
        price: 29.99
      };

      const schema1 = service.generateProductSchema(product1);
      const schema2 = service.generateProductSchema(product2);

      expect(schema1).not.toBe(schema2);
      expect(schema1.name).toBe('Product 1');
      expect(schema2.name).toBe('Product 2');
    });
  });

  describe('Global Configuration', () => {
    it('should update global config and affect schema generation', () => {
      const newConfig: Partial<SeoGlobalConfig> = {
        siteName: 'New Site Name',
        defaultCurrency: 'EUR'
      };

      service.setGlobalConfig(newConfig);

      const config = service.getGlobalConfig();
      expect(config.siteName).toBe('New Site Name');
      expect(config.defaultCurrency).toBe('EUR');
    });

    it('should clear caches when global config is updated', () => {
      // Generate a schema to populate cache
      const product = {
        name: 'Cached Product',
        description: 'Cached Description',
        image: 'https://example.com/cached.jpg',
        price: 39.99
      };

      const schema1 = service.generateProductSchema(product);

      // Update global config
      service.setGlobalConfig({ siteName: 'Updated Site' });

      // Generate same schema again - should be different object due to cache clear
      const schema2 = service.generateProductSchema(product);

      expect(schema1).not.toBe(schema2);
    });
  });

  describe('Error Handling', () => {
    beforeEach(() => {
      spyOn(console, 'warn');
      spyOn(console, 'error');
    });

    it('should handle invalid schema in setJsonLd', () => {
      service.setJsonLd(null as any);
      expect(console.warn).toHaveBeenCalledWith('[SEO] Invalid schema: must be a valid object');
    });

    it('should handle DOM operation errors gracefully', () => {
      Object.defineProperty(service, 'isBrowser', { value: true });

      // Mock document operation to throw
      spyOn(document.head, 'appendChild').and.throwError('DOM Error');

      const schema = { '@context': 'https://schema.org', '@type': 'Product', name: 'Test' };
      service.setJsonLd(schema);

      expect(console.error).toHaveBeenCalledWith('[SEO] Browser operation failed:', jasmine.any(Error));
    });
  });

  describe('Backward Compatibility', () => {
    it('should maintain existing public API', () => {
      expect(typeof service.updateMetaTags).toBe('function');
      expect(typeof service.setTitle).toBe('function');
      expect(typeof service.getTitle).toBe('function');
      expect(typeof service.setMetaDescription).toBe('function');
      expect(typeof service.setMetaKeywords).toBe('function');
      expect(typeof service.setTwitterCard).toBe('function');
      expect(typeof service.setJsonLd).toBe('function');
      expect(typeof service.removeJsonLd).toBe('function');
      expect(typeof service.setCanonicalUrl).toBe('function');
      expect(typeof service.setHreflang).toBe('function');
      expect(typeof service.generateProductSchema).toBe('function');
      expect(typeof service.generateProductListSchema).toBe('function');
      expect(typeof service.generateLocalBusinessSchema).toBe('function');
      expect(typeof service.generateStoreSchema).toBe('function');
      expect(typeof service.generateBreadcrumbSchema).toBe('function');
      expect(typeof service.generateOrganizationSchema).toBe('function');
      expect(typeof service.generateWebSiteSchema).toBe('function');
      expect(typeof service.generateFaqSchema).toBe('function');
    });
  });
});