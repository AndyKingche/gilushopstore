import { Component, ViewChild, ElementRef, OnInit } from '@angular/core';
import { SeoService } from '../../../../core/services/seo.service';

interface NewsCard {
  badge: string;
  badgeColor: string;
  title: string;
  description: string;
  image: string;
}

@Component({
  selector: 'app-news-cards',
  templateUrl: './news-cards.component.html',
  styleUrls: ['./news-cards.component.scss']
})
export class NewsCardsComponent implements OnInit {

  constructor(private seoService: SeoService) {}

  ngOnInit(): void {
    // Set SEO meta tags for News section on homepage with long-tail keywords
    this.seoService.updateMetaTags({
      title: 'Novedades y Promociones Maquillaje Ecuador - Gilú Shop Otavalo',
      description: 'Descubre las últimas novedades en maquillaje y promociones especiales en Gilú Shop, Otavalo Ecuador. Maybelline, e.l.f., NYX, Huda Beauty con envío a todo Ecuador.',
      keywords: 'novedades maquillaje Ecuador, promociones cosmetics Otavalo, productos nuevos belleza Ecuador, arrivals maquillaje Ecuador, ofertas especiales Gilú Shop, descuentos maquillaje Ecuador, nuevos productos beauty Ecuador',
      image: 'https://gilu-shop.com/assets/image/gilu-update.png',
      url: 'https://gilu-shop.com/',
      type: 'website',
      siteName: 'Gilú Shop'
    });

    // Set Twitter Card tags
    this.seoService.setTwitterCard({
      title: 'Novedades y Promociones - Gilú Shop',
      description: 'Descubre las últimas novedades en maquillaje y promociones especiales en Ecuador.',
      image: 'https://gilu-shop.com/assets/image/gilu-update.png'
    });

    // Set canonical URL for homepage
    this.seoService.setCanonicalUrl('https://gilu-shop.com/');
  }

  @ViewChild('slider') slider!: ElementRef;

  newsCards: NewsCard[] = [
    {
      badge: 'Ya llegó',
      badgeColor: '#B8D5D9',
      title: 'Bases Fit Me Fresh Tint',
      description: 'Bases Ligeritas y efectivas ✨',
      image: 'https://pycca.vteximg.com.br/arquivos/ids/296437-600-600/ES0557--2-.png?v=638984737877170000'
    },
    {
      badge: 'NUEVO',
      badgeColor: '#27ae60',
      title: 'E.l.f. Lip Oil PLUMPING',
      description: 'Pocos en stock 😮',
      image: 'https://www.elfcosmetics.com/dw/image/v2/BBXC_PRD/on/demandware.static/-/Sites-elf-master/default/dwb5661144/2025/GlowReviverPlumpingLipOil/82224_OpenA_V2_R.jpg?sfrm=png&sw=780&q=90&strip=false'
    },
    {
      badge: 'YA LLEGO',
      badgeColor: '#B8D5D9',
      title: 'Fijador One / Size',
      // description: 'Agotado temporalmente 😢',
      description: 'Quedan pocos en stock 💕',
      image: 'https://www.uhlala.mx/cdn/shop/files/ONE_SIZEbyPatrickStarrrOn_TilDawnMattifyingWaterproofSettingSprayBig_BittyDuo6.jpg?v=1759515268&width=1400'
    },
    {
      badge: 'EN CAMINO',
      badgeColor: '#B8D5D9',
      title: 'Fijador Loreal Infallible',
      description: 'Están  por llegar 😀',
      image:'https://www.loreal-paris.es/-/media/project/loreal/brand-sites/oap/emea/es/products/makeup/face-makeup/infaillible/infaillible-3-second-setting-mist/headerv2.jpg?cx=0.65&cy=0.51&cw=2000&ch=937&hash=20CFBD29782E51FCD967F41CAF8ECCCD'
    },
    {
      badge: '10% OFF',
      badgeColor: '#D95F80',
      title: 'Semana Gilú',
      description: 'Nosotros te notificamos 💕',
      image: 'https://i.ibb.co/NdPqFG4c/LIFTER-PLUMP-1.png'
    },
    {
      badge: 'DISPONIBLE',
      badgeColor: '#27ae60',
      title: 'Huda Beauty - Easy Bake',
      description: 'Ya en stock! 🙌',
      image: 'https://dcdn-us.mitiendanube.com/stores/005/911/500/products/s2904894-main-zoom-84c7a720e1df7adb0e17592745688038-1024-1024.webp'
    }
  ];

  scrollLeft(): void {
    if (this.slider) {
      this.slider.nativeElement.scrollBy({ left: -280, behavior: 'smooth' });
    }
  }

  scrollRight(): void {
    if (this.slider) {
      this.slider.nativeElement.scrollBy({ left: 280, behavior: 'smooth' });
    }
  }
}
