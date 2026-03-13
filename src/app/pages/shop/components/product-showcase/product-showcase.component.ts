import { Component, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';

interface CategoryShowcase {
  id: string;
  name: string;
  description: string;
  brands: string[];
}

@Component({
  selector: 'app-product-showcase',
  templateUrl: './product-showcase.component.html',
  styleUrls: ['./product-showcase.component.scss']
})
export class ProductShowcaseComponent {
  @ViewChild('showcaseSlider') showcaseSlider!: ElementRef;
  @Output() categorySelect = new EventEmitter<string>();

  categories: CategoryShowcase[] = [
    {
      id: 'bases',
      name: 'Bases',
      description: 'Cobertura perfecta para todo tipo de piel. Desde ligeras hasta alta cobertura.',
      brands: ['Maybelline', 'e.l.f']
    },
    {
      id: 'labios',
      name: 'Labios',
      description: 'Labiales, gloss y tinturas para labios irresistibles.',
      brands: ['Maybelline', 'e.l.f']
    },
    {
      id: 'rostro',
      name: 'Rostro',
      description: 'Blush, polvos y productos para un acabado perfecto.',
      brands: ['Maybelline', 'e.l.f']
    },
    {
      id: 'primers',
      name: 'Primers',
      description: 'Prepara tu piel para un maquillaje que dura todo el día.',
      brands: ['Maybelline', 'e.l.f']
    },
    {
      id: 'ojos',
      name: 'Ojos',
      description: 'Delineadores, rimeles y más para mirada expresiva.',
      brands: ['Maybelline', 'e.l.f']
    },
    {
      id: 'skincare',
      name: 'Skin Care',
      description: 'Rutina coreana para una piel radiante y saludable.',
      brands: ['Coreano']
    }
  ];

  currentIndex = 0;

  prev(): void {
    if (this.currentIndex > 0) {
      this.currentIndex--;
    } else {
      this.currentIndex = this.categories.length - 1;
    }
  }

  next(): void {
    if (this.currentIndex < this.categories.length - 1) {
      this.currentIndex++;
    } else {
      this.currentIndex = 0;
    }
  }

  viewProducts(categoryId: string): void {
    this.categorySelect.emit(categoryId);
    // Scroll to products section
    const productsSection = document.getElementById('products-section');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    }
  }

  get currentCategory(): CategoryShowcase {
    return this.categories[this.currentIndex];
  }
}
