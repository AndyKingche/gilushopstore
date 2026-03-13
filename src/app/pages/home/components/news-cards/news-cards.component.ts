import { Component, ViewChild, ElementRef } from '@angular/core';

interface NewsCard {
  badge: string;
  badgeColor: string;
  title: string;
  description: string;
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
      badge: 'PRÓXIMAMENTE',
      badgeColor: '#B8D5D9',
      title: 'Bases Superstay',
      description: 'Bases Superstay llegando pronto 🎉'
    },
    {
      badge: 'NUEVO',
      badgeColor: '#27ae60',
      title: 'Labiales Mates e.l.f.',
      description: 'Edición Limitada ✨'
    },
    {
      badge: 'SIN STOCK',
      badgeColor: '#e74c3c',
      title: 'Gloss Lifter Plump',
      description: 'Agotado temporalmente 😢'
    },
    {
      badge: '30% OFF',
      badgeColor: '#D95F80',
      title: 'Semana Gilú',
      description: 'Aprovecha el descuento 💕'
    },
    {
      badge: 'DISPONIBLE',
      badgeColor: '#27ae60',
      title: 'Primers e.l.f.',
      description: 'Ya en stock! 🙌'
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
