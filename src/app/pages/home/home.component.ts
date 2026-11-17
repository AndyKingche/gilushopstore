import { animate, style, transition, trigger } from '@angular/animations';
import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { SeoService } from '../../core/services/seo.service';

interface CarouselProduct {
  src: string;
  alt: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [
    trigger('productDepth', [
      transition('* => *', [
        style({
          opacity: 0.35,
          transform: 'translate3d(0, 14px, -180px) scale(0.84)'
        }),
        animate(
          '760ms cubic-bezier(0.16, 1, 0.3, 1)',
          style({ opacity: 1, transform: 'translate3d(0, 0, 0) scale(1)' })
        )
      ])
    ])
  ]
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  readonly carouselProducts: CarouselProduct[] = [
    {
      src: 'assets/carousel/maybelline.webp',
      alt: 'Base Super Stay Lumi Matte de Maybelline'
    },
    {
      src: 'assets/carousel/hudab.webp',
      alt: 'Polvo compacto de Huda Beauty'
    },
    {
      src: 'assets/carousel/toofaced.png',
      alt: 'Corrector Born This Way de Too Faced'
    },
    {
      src: 'assets/carousel/benetint.png',
      alt: 'Tinta para labios y mejillas Benetint de Benefit'
    },
    {
      src: 'assets/carousel/patrick-ta.png',
      alt: 'Blush y bronzer de Patrick Ta'
    },
    {
      src: 'assets/carousel/got2b.png',
      alt: 'Gel de cejas Got2b de Schwarzkopf'
    },
    {
      src: 'assets/carousel/mayfit.png',
      alt: 'Base Fit Me de Maybelline'
    },
    {
      src: 'assets/carousel/ital.png',
      alt: 'Italia Deluxe - lip liner'
    },
    {
      src: 'assets/carousel/rare.png',
      alt: 'Rare Beauty - blush'
    },
    {
      src: 'assets/carousel/fitmeloose.png',
      alt: 'Maybelline Fit Me Loose Powder'
    },
    {
      src: 'assets/carousel/matteink.png',
      alt: 'Maybelline Matte Ink - labial líquido'
    },
    {
      src: 'assets/carousel/skinink.png',
      alt: 'Loreal Skin Ink - base líquida'
    },
    {
      src: 'assets/carousel/lorealinfa.png',
      alt: 'Loreal Infalliblel - corrector líquido'
    },
    {
      src: 'assets/carousel/baseinfa.png',
      alt: 'Loreal Infallible - base líquida'
    },
    {
      src: 'assets/carousel/elftint.png',
      alt: 'Elf Cosmetics - tint para labios y mejillas'
    },
    {
      src: 'assets/carousel/elfcorrector.webp',
      alt: 'Elf Cosmetics - corrector líquido'
    },
    {
      src: 'assets/carousel/nyxblush.png',
      alt: 'Nyx Cosmetics - blush compacto'
    },
    {
      src: 'assets/carousel/liplinerbcc.png',
      alt: 'Lápiz delineador de labios de Beauty Creations'
    },
    {
      src: 'assets/carousel/lorealprom.png',
      alt: 'Base Infallible Pro-Matte de L’Oréal Paris'
    },
    {
      src: 'assets/carousel/maybellineteddy.png',
      alt: 'Tinta Super Stay Teddy Tint de Maybelline'
    },
    {
      src: 'assets/carousel/milanirubor.png',
      alt: 'Rubor compacto de Milani'
    },
    {
      src: 'assets/carousel/lorealfij.png',
      alt: 'Spray fijador Infallible de L’Oréal Paris'
    },
    {
      src: 'assets/carousel/bcreaba.webp',
      alt: 'Tinte labial Pink Energy de Beauty Creations'
    },
    {
      src: 'assets/carousel/lip-italia.png',
      alt: 'Labial de Italia Deluxe'
    },
    {
      src: 'assets/carousel/elfpower.png',
      alt: 'Primer Power Grip de e.l.f. Cosmetics'
    },
    {
      src: 'assets/carousel/bissusubor.png',
      alt: 'Rubor compacto de Bissú'
    },
    {
      src: 'assets/carousel/elfblush.webp',
      alt: 'Rubor líquido de e.l.f. Cosmetics'
    },
    {
      src: 'assets/carousel/benefithoola.png',
      alt: 'Bronceador Hoola de Benefit'
    },
    {
      src: 'assets/carousel/starface.png',
      alt: 'Parches hidrocoloides para granitos de Starface'
    },
    {
      src: 'assets/carousel/catricecorrector.avif',
      alt: 'Corrector líquido de Catrice'
    },
    {
      src: 'assets/carousel/maybellingrippy.png',
      alt: 'Primer Grippy Serum de Maybelline'
    },
    {
      src: 'assets/carousel/lorealskintint.png',
      alt: 'Base con color Accord Parfait Nude de L’Oréal Paris'
    },
    {
      src: 'assets/carousel/contourelf.png',
      alt: 'Contorno Halo Glow Beauty Wand de e.l.f. Cosmetics'
    },
    {
      src: 'assets/carousel/settingsorayelf.webp',
      alt: 'Spray fijador Power Grip Dewy de e.l.f. Cosmetics'
    },
    {
      src: 'assets/carousel/elff.webp',
      alt: 'Tinta labial de e.l.f. Cosmetics'
    },
    {
      src: 'assets/carousel/bcr.png',
      alt: 'Rubor compacto de Beauty Creations'
    },
    {
      src: 'assets/carousel/nyxglue.png',
      alt: 'Primer The Face Glue de NYX Professional Makeup'
    },
    {
      src: 'assets/carousel/onesi.png',
      alt: 'Spray fijador On ’Til Dawn de One/Size'
    },
    {
      src: 'assets/carousel/elflapizcejas.webp',
      alt: 'Lápiz para cejas de e.l.f. Cosmetics'
    },
    {
      src: 'assets/carousel/lorealhialu.png',
      alt: 'Tinta labial Hyaluron Tint de L’Oréal Paris'
    }
  ];

  carouselIndex = 0;
  prefersReducedMotion = false;

  private routerSubscription?: Subscription;
  private reducedMotionQuery?: MediaQueryList;

  private readonly onReducedMotionChange = (event: MediaQueryListEvent): void => {
    this.prefersReducedMotion = event.matches;
  };

  constructor(
    private seoService: SeoService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.setupMotionPreference();
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
    this.reducedMotionQuery?.removeEventListener('change', this.onReducedMotionChange);
  }

  get activeCarouselProduct(): CarouselProduct {
    return this.carouselProducts[this.carouselIndex];
  }

  get currentSlideNumber(): string {
    return String(this.carouselIndex + 1).padStart(2, '0');
  }

  get totalSlideNumber(): string {
    return String(this.carouselProducts.length).padStart(2, '0');
  }

  showPreviousProduct(): void {
    this.carouselIndex = (
      this.carouselIndex - 1 + this.carouselProducts.length
    ) % this.carouselProducts.length;
  }

  showNextProduct(): void {
    this.carouselIndex = (this.carouselIndex + 1) % this.carouselProducts.length;
  }

  private setupMotionPreference(): void {
    if (!isPlatformBrowser(this.platformId) || typeof window.matchMedia !== 'function') {
      return;
    }

    this.reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    this.prefersReducedMotion = this.reducedMotionQuery.matches;
    this.reducedMotionQuery.addEventListener('change', this.onReducedMotionChange);
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
