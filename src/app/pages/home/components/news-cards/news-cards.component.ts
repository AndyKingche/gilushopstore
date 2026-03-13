import { Component, ViewChild, ElementRef } from '@angular/core';

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
export class NewsCardsComponent {
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
      badge: 'SIN STOCK',
      badgeColor: '#e74c3c',
      title: 'Fijador One / Size',
      description: 'Agotado temporalmente 😢',
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
      description: 'Aprovecha el descuento 💕',
      image: 'https://example.com/semana-gilu.jpg'
    },
    {
      badge: 'DISPONIBLE',
      badgeColor: '#27ae60',
      title: 'Primers e.l.f.',
      description: 'Ya en stock! 🙌',
      image: 'https://example.com/primers-elf.jpg'
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
