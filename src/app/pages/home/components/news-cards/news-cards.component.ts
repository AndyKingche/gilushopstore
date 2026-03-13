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
      description: 'Bases de maquillaje de uso diario FPS 50 ✨',
      image: 'https://pycca.vteximg.com.br/arquivos/ids/296437-600-600/ES0557--2-.png?v=638984737877170000'
    },
    {
      badge: 'NUEVO',
      badgeColor: '#27ae60',
      title: 'e.l.f. Lip Oil PLUMPING',
      description: 'Tu lip oil ultrabrillante y nutritivo favorito en tono MAJOR MAUVE se vuelve más voluminoso (Plumping) gracias a e.l.f ✨',
      image: 'https://www.elfcosmetics.com/dw/image/v2/BBXC_PRD/on/demandware.static/-/Sites-elf-master/default/dwb5661144/2025/GlowReviverPlumpingLipOil/82224_OpenA_V2_R.jpg?sfrm=png&sw=780&q=90&strip=false'
    },
    {
      badge: 'SIN STOCK',
      badgeColor: '#e74c3c',
      title: 'Fijador One / Size',
      description: 'Agotado temporalmente 😢',
      image: 'https://www.bloombeauty.com.mx/cdn/shop/files/DisenosdeProductos_720x.png?v=1753916305'
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
