# SEO Service

Production-ready Angular SEO service with SSR safety, input validation, caching, and comprehensive error handling.

## Features

- ✅ **SSR Safe**: No crashes in server-side rendering mode
- ✅ **Input Validation**: Prevents broken meta tags from invalid inputs
- ✅ **Duplicate Prevention**: Avoids duplicate meta tags
- ✅ **Schema Caching**: Memory-efficient caching for generated schemas
- ✅ **Error Handling**: Comprehensive logging with [SEO] prefix
- ✅ **Configurable**: Injectable global configuration
- ✅ **TypeScript Strict**: Full type safety and JSDoc documentation
- ✅ **Backward Compatible**: Zero breaking changes to existing API

## Installation

The service is already registered as a singleton in `app.module.ts` or standalone bootstrap.

## Usage

### Basic Meta Tags

```typescript
import { SeoService } from './core/services/seo.service';

constructor(private seoService: SeoService) {}

ngOnInit() {
  this.seoService.updateMetaTags({
    title: 'My Page Title',
    description: 'My page description',
    keywords: 'keyword1, keyword2',
    image: 'https://example.com/image.jpg',
    url: 'https://example.com/page'
  });
}
```

### Twitter Cards

```typescript
this.seoService.setTwitterCard({
  title: 'My Twitter Card',
  description: 'Twitter card description',
  image: 'https://example.com/twitter-image.jpg',
  site: '@mysite',
  creator: '@mycreator'
});
```

### JSON-LD Structured Data

```typescript
const productSchema = this.seoService.generateProductSchema({
  name: 'Amazing Product',
  description: 'This product is amazing',
  image: 'https://example.com/product.jpg',
  price: 29.99,
  currency: 'USD',
  brand: 'My Brand'
});

this.seoService.setJsonLd(productSchema, 'product-schema');
```

### Canonical URLs

```typescript
this.seoService.setCanonicalUrl('https://example.com/canonical-url');
```

### Hreflang

```typescript
this.seoService.setHreflang('https://example.com/es');
```

## Global Configuration

Configure site-wide defaults to avoid hardcoded values:

```typescript
this.seoService.setGlobalConfig({
  siteName: 'My Custom Site Name',
  defaultLocale: 'en_US',
  defaultCurrency: 'EUR',
  baseUrl: 'https://my-custom-domain.com',
  contactEmail: 'contact@my-custom-domain.com',
  contactPhone: '+1-234-567-8900'
});
```

All schemas will automatically use these values instead of hardcoded defaults.

## Migration Guide

### From Old Version

The public API remains 100% backward compatible. No code changes required!

However, you can now:

1. **Configure defaults** instead of hardcoding:
   ```typescript
   // Before: Hardcoded in service
   // After: Configurable
   this.seoService.setGlobalConfig({
     siteName: 'Your Site Name',
     baseUrl: 'https://your-domain.com'
   });
   ```

2. **Get better error handling** - invalid inputs are now logged instead of causing silent failures.

3. **Improved performance** - schemas are cached automatically.

4. **SSR safety** - no more crashes in server-side rendering.

### Breaking Changes

None! The API is fully backward compatible.

## Advanced Usage

### Custom Schema Generation

All schema generators now support caching. Calling with identical parameters returns the same object:

```typescript
const product1 = this.seoService.generateProductSchema(productData);
const product2 = this.seoService.generateProductSchema(productData);
console.log(product1 === product2); // true - same cached object
```

### Error Handling

The service logs all errors and warnings with the `[SEO]` prefix:

```typescript
// Invalid input logs warning and skips operation
this.seoService.setTitle(''); // Logs: [SEO] Invalid title: must be a non-empty string

// SSR operations log warnings
// In SSR mode: [SEO] Skipping DOM operation in SSR mode
```

### Cache Management

Caches are automatically cleared when global config changes. Manual clearing is not exposed to maintain encapsulation.

## Testing

Run tests with:

```bash
npm test -- --include="**/seo.service.spec.ts"
```

Tests cover:
- SSR safety (no crashes in server mode)
- Input validation (invalid inputs logged, not applied)
- Duplicate prevention (only one tag created)
- Schema caching (identical inputs return same object)
- Global config (affects all schemas)
- Error handling (proper logging)
- Backward compatibility (all methods exist)

## API Reference

### Methods

#### `setGlobalConfig(config: Partial<SeoGlobalConfig>): void`
Configure global defaults for the service.

#### `getGlobalConfig(): SeoGlobalConfig`
Get current global configuration.

#### `updateMetaTags(config: SeoConfig): void`
Update all meta tags at once.

#### `setTitle(title: string): void`
Set page title.

#### `getTitle(): string`
Get current page title.

#### `setMetaDescription(description: string): void`
Set meta description.

#### `setMetaKeywords(keywords: string): void`
Set meta keywords.

#### `setTwitterCard(config: TwitterCardConfig, cardType?): void`
Set Twitter Card meta tags.

#### `setJsonLd(schema: JsonLdSchema, id?): void`
Add JSON-LD structured data.

#### `removeJsonLd(id?): void`
Remove JSON-LD structured data.

#### `setCanonicalUrl(url: string): void`
Set canonical URL.

#### `setHreflang(url: string): void`
Set hreflang for Ecuador Spanish.

#### Schema Generators
- `generateProductSchema(product): JsonLdSchema`
- `generateProductListSchema(products): JsonLdSchema`
- `generateLocalBusinessSchema(): JsonLdSchema`
- `generateStoreSchema(store): JsonLdSchema`
- `generateBreadcrumbSchema(breadcrumbs): JsonLdSchema`
- `generateOrganizationSchema(): JsonLdSchema`
- `generateWebSiteSchema(): JsonLdSchema`
- `generateFaqSchema(faqs): JsonLdSchema`

All schema generators return cached results for identical inputs.

### Interfaces

#### `SeoGlobalConfig`
```typescript
interface SeoGlobalConfig {
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
```

#### `SeoConfig`
```typescript
interface SeoConfig {
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
```

#### `TwitterCardConfig`
```typescript
interface TwitterCardConfig {
  title: string;
  description: string;
  image?: string;
  site?: string;
  creator?: string;
}
```

#### `JsonLdSchema`
```typescript
interface JsonLdSchema {
  '@context': string;
  '@type': string;
  [key: string]: any;
}
```