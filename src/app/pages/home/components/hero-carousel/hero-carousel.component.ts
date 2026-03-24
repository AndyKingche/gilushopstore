import { Component, OnInit, OnDestroy, HostListener, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
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
    { title: 'Tu tienda de Maquillaje Favorita', subtitle: 'Productos 100% Originales', cta: 'Ver colección', category: 'todo' },
    { title: 'Nueva colección Maybelline', subtitle: 'Bases Fresh Tint', cta: 'Ver colección', category: 'bases' },
    { title: 'E.l.f.', subtitle: 'Lip oil que duran todo el día', cta: 'Descubre más', category: 'labios' },
    { title: 'Primers para piel perfecta', subtitle: 'Maybelline & E.L.F., NYX', cta: 'Ver primers', category: 'primers' },
    { title: 'Semana Gilú 💕', subtitle: 'Hasta el 10% OFF en productos seleccionados. No es todos los días… pero cuando hay promos, te avisamos en nuestras redes.', cta: 'Aprovechar', category: 'oferta' },
    { title: 'Skin Care Coreano', subtitle: 'Cuida tu piel, ama tu piel', cta: 'Ver skincare', category: 'skincare' },
    { title: 'Delineadores y Rimeles', subtitle: 'Ojos que hablan', cta: 'Ver productos', category: 'ojos' }
  ];

  currentSlide = 0;
  private intervalId: any;
  isPaused = false;
  backgroundParallax = 0;
  titleParallax = 0;
  subtitleParallax = 0;
  buttonParallax = 0;

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  getRandomImageUrl(category: string): string {
    const categoryImages: { [key: string]: string } = {
      todo: 'https://i.ibb.co/4ggrPtKf/gilu-wallpaper-home.png',
      bases: 'https://images.pexels.com/photos/4620838/pexels-photo-4620838.jpeg',
      labios: 'https://images.pexels.com/photos/457701/pexels-photo-457701.jpeg',
      primers: 'https://images.pexels.com/photos/30836149/pexels-photo-30836149.jpeg',
      oferta: 'https://i.ibb.co/6R07PJHs/gilu-week.png',
      skincare: 'https://images.pexels.com/photos/5927811/pexels-photo-5927811.jpeg',
      ojos: 'https://images.pexels.com/photos/7712438/pexels-photo-7712438.jpeg'
    };
    return categoryImages[category] || '';
  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.startAutoPlay();
    }
  }

  ngOnDestroy(): void {
    this.stopAutoPlay();
  }

  startAutoPlay(): void {
    this.intervalId = setInterval(() => {
      if (!this.isPaused) this.nextSlide();
    }, 4000);
  }

  stopAutoPlay(): void {
    if (this.intervalId) clearInterval(this.intervalId);
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

  onMouseEnter(): void { this.isPaused = true; }
  onMouseLeave(): void { this.isPaused = false; }

  @HostListener('window:scroll', [])
  onScroll() {
    if (isPlatformBrowser(this.platformId)) {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      this.backgroundParallax = scrollTop * 0.3;
      this.titleParallax = scrollTop * -0.2;
      this.subtitleParallax = scrollTop * -0.15;
      this.buttonParallax = scrollTop * -0.1;
    }
  }

  onCtaClick(slide: Slide): void {
    this.router.navigate(['/shop']);
  }

  get currentSlideData(): Slide {
    return this.slides[this.currentSlide];
  }
}