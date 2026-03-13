import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { trigger, state, style, transition, animate } from '@angular/animations';

interface Slide {
  title: string;
  subtitle: string;
  cta: string;
  category?: string;
}

@Component({
  selector: 'app-hero-carousel',
  templateUrl: './hero-carousel.component.html',
  styleUrls: ['./hero-carousel.component.scss'],
  animations: [
    trigger('slideAnimation', [
      transition(':increment', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('600ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          style({ transform: 'translateX(0)', opacity: 1 }))
      ]),
      transition(':decrement', [
        style({ transform: 'translateX(-100%)', opacity: 0 }),
        animate('600ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
          style({ transform: 'translateX(0)', opacity: 1 }))
      ])
    ]),
    trigger('fadeAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('600ms ease-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class HeroCarouselComponent implements OnInit, OnDestroy {
  slides: Slide[] = [
    { 
      title: 'Nueva colección Maybelline', 
      subtitle: 'Bases Superstay', 
      cta: 'Ver colección',
      category: 'bases'
    },
    { 
      title: 'e.l.f. Cosmetics', 
      subtitle: 'Labiales que duran todo el día', 
      cta: 'Descubre más',
      category: 'labios'
    },
    { 
      title: 'Primers para piel perfecta', 
      subtitle: 'Maybelline & e.l.f.', 
      cta: 'Ver primers',
      category: 'primers'
    },
    { 
      title: 'Semana Gilú 💕', 
      subtitle: '30% OFF en productos seleccionados', 
      cta: 'Aprovechar',
      category: 'oferta'
    },
    { 
      title: 'Skin Care Coreano', 
      subtitle: 'Cuida tu piel, ama tu piel', 
      cta: 'Ver skincare',
      category: 'skincare'
    },
    { 
      title: 'Delineadores y Rimeles', 
      subtitle: 'Ojos que hablan', 
      cta: 'Ver productos',
      category: 'ojos'
    }
  ];

  currentSlide = 0;
  private intervalId: any;
  isPaused = false;

  constructor(private router: Router) {}

  getRandomImageUrl(category: string): string {
    const categoryImages: { [key: string]: string } = {
      bases: 'https://images.pexels.com/photos/6954120/pexels-photo-6954120.jpeg',
      labios: 'https://images.pexels.com/photos/457701/pexels-photo-457701.jpeg',
      primers: 'https://images.pexels.com/photos/30836149/pexels-photo-30836149.jpeg',
      oferta: '', // Leave as black
      skincare: 'https://images.pexels.com/photos/5927811/pexels-photo-5927811.jpeg',
      ojos: 'https://images.pexels.com/photos/3762757/pexels-photo-3762757.jpeg'
    };
    return categoryImages[category] || '';
  }

  ngOnInit(): void {
    this.startAutoPlay();
  }

  ngOnDestroy(): void {
    this.stopAutoPlay();
  }

  startAutoPlay(): void {
    this.intervalId = setInterval(() => {
      if (!this.isPaused) {
        this.nextSlide();
      }
    }, 4000);
  }

  stopAutoPlay(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  nextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
  }

  prevSlide(): void {
    this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
  }

  goToSlide(index: number): void {
    this.currentSlide = index;
  }

  onMouseEnter(): void {
    this.isPaused = true;
  }

  onMouseLeave(): void {
    this.isPaused = false;
  }

  onCtaClick(slide: Slide): void {
    if (slide.category) {
      this.router.navigate(['/shop'], { queryParams: { cat: slide.category } });
    } else {
      this.router.navigate(['/shop']);
    }
  }

  get currentSlideData(): Slide {
    return this.slides[this.currentSlide];
  }
}
