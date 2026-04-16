import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { SeoService } from '../../core/services/seo.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  private routerSubscription?: Subscription;

  constructor(
    private seoService: SeoService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.setupSeo();
    
    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      if (event.urlAfterRedirects === '/' || event.urlAfterRedirects === '') {
        this.setupSeo();
      }
    });

    this.seoService.setJsonLd(
    this.seoService.generateWebSiteSchema(),
    'schema-website'
  );

  this.seoService.setJsonLd(
    this.seoService.generateOrganizationSchema(),
    'schema-organization'
  );

  this.seoService.setJsonLd(
    this.seoService.generateLocalBusinessSchema(),
    'schema-store'
  );
  }

  ngAfterViewInit(): void {
    this.setupSeo();
  }

  ngOnDestroy(): void {
    this.routerSubscription?.unsubscribe();
  }

  private setupSeo(): void {
    this.seoService.setTitle('Gilú Shop - Maquillaje Original en Ecuador | Maybelline, e.l.f, NYX');
    
    this.seoService.clearMetaTags();
    
    this.seoService.updateMetaTags({
      title: 'Gilú Shop - Maquillaje Original en Ecuador | Maybelline, e.l.f, NYX',
      description: 'Tu tienda de maquillaje 100% original en Otavalo Ecuador. Encuentra las mejores marcas: Maybelline, E.l.f. Cosmetics, Loreal, NYX, Huda Beauty, Too Faced, Victoria Secret y más.',
      keywords: 'maquillaje, cosmetics, Ecuador, Otavalo, Maybelline, e.l.f, Loreal, NYX, Huda Beauty, tienda online, beauty shop',
      image: 'https://gilu-shop.com/assets/image/gilu-update.png',
      url: 'https://gilu-shop.com',
      type: 'website',
      locale: 'es_EC',
      siteName: 'Gilú Shop'
    });

    // Set Twitter card
    this.seoService.setTwitterCard({
      title: 'Gilú Shop - Maquillaje Original en Ecuador',
      description: 'Tu tienda de maquillaje 100% original en Otavalo Ecuador. Las mejores marcas internacionales.',
      image: 'https://gilu-shop.com/assets/image/gilu-update.png'
    });

    // Generate JSON-LD structured data
    
    // 1. Store schema
    this.seoService.setJsonLd(
      this.seoService.generateStoreSchema({
        name: 'Gilú Shop',
        description: 'Tu tienda de maquillaje 100% original en Otavalo Ecuador',
        image: 'https://gilu-shop.com/assets/image/gilu-update.png',
        url: 'https://gilu-shop.com',
        telephone: '+593-99-123-4567',
        email: 'contacto@gilu-shop.com',
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
