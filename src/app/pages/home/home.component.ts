import { Component, OnInit } from '@angular/core';
import { SeoService } from '../../core/services/seo.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  constructor(private seoService: SeoService) {}

  ngOnInit(): void {
    this.setupSeo();
  }

  private setupSeo(): void {
    // Configure basic meta tags for home page
    this.seoService.updateMetaTags({
      title: 'Gilú Shop - Maquillaje Original en Ecuador | Maybelline, e.l.f, NYX',
      description: 'Tu tienda de maquillaje 100% original en Otavalo Ecuador. Encuentra las mejores marcas: Maybelline, E.l.f. Cosmetics, Loreal, NYX, Huda Beauty, Too Faced, Victoria Secret y más.',
      keywords: 'maquillaje, cosmetics, Ecuador, Otavalo, Maybelline, e.l.f, Loreal, NYX, Huda Beauty, tienda online, beauty shop',
      image: 'https://gilushop.store/assets/image/gilu-update.png',
      url: 'https://gilushop.store',
      type: 'website',
      locale: 'es_EC',
      siteName: 'Gilú Shop'
    });

    // Set Twitter card
    this.seoService.setTwitterCard({
      title: 'Gilú Shop - Maquillaje Original en Ecuador',
      description: 'Tu tienda de maquillaje 100% original en Otavalo Ecuador. Las mejores marcas internacionales.',
      image: 'https://gilushop.store/assets/image/gilu-update.png'
    });

    // Generate JSON-LD structured data
    
    // 1. Store schema
    this.seoService.setJsonLd(
      this.seoService.generateStoreSchema({
        name: 'Gilú Shop',
        description: 'Tu tienda de maquillaje 100% original en Otavalo Ecuador',
        image: 'https://gilushop.store/assets/image/gilu-update.png',
        url: 'https://gilushop.store',
        telephone: '+593-99-123-4567',
        email: 'contacto@gilushop.store',
        address: {
          streetAddress: 'Calle Principal',
          addressLocality: 'Otavalo',
          addressRegion: 'Imbabura',
          postalCode: '100401',
          addressCountry: 'EC'
        },
        openingHours: 'Mo-Fr 09:00-20:00, Sa 09:00-18:00',
        priceRange: '$',
        latitude: 0.2343,
        longitude: -78.2622
      })
    );

    // 2. Add WebSite schema with search action
    this.seoService.setJsonLd(
      this.seoService.generateWebSiteSchema()
    );

    // 3. Add Organization schema
    this.seoService.setJsonLd(
      this.seoService.generateOrganizationSchema()
    );
  }
}
