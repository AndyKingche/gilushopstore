import { Component, OnInit } from '@angular/core';
import { SeoService } from '../../core/services/seo.service';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit {
  activeIndex: number | null = null;

  constructor(private seoService: SeoService) {}

  ngOnInit(): void {
    this.seoService.updateMetaTags({
      title: 'Preguntas Frecuentes | Gilú Shop',
      description: 'Respuestas a las preguntas más frecuentes sobre envíos, pagos, productos originales, devoluciones y más en Gilú Shop.',
      keywords: 'FAQ, preguntas frecuentes, envíos Ecuador, pagos Gilú Shop,devoluciones, contacto Gilú Shop',
      image: 'https://gilu-shop.com/assets/image/gilu-update.png',
      url: 'https://gilu-shop.com/faq',
      type: 'website',
      siteName: 'Gilú Shop'
    });
  }

  toggleCollapse(index: number): void {
    this.activeIndex = this.activeIndex === index ? null : index;
  }

  isActive(index: number): boolean {
    return this.activeIndex === index;
  }
}