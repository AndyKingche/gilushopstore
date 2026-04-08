import { Component, OnInit } from '@angular/core';
import { SeoService } from '../../../../core/services/seo.service';

@Component({
  selector: 'app-brand-story',
  templateUrl: './brand-story.component.html',
  styleUrls: ['./brand-story.component.scss']
})
export class BrandStoryComponent implements OnInit {
  mission = '"Nuestra misión es inspirarte a brillar con confianza, ofreciéndote maquillaje original que realce tu belleza natural."';

  constructor(private seoService: SeoService) {}

  ngOnInit(): void {
    // Set SEO meta tags for About/Nuestra Historia page
    this.seoService.updateMetaTags({
      title: 'Nuestra Historia - Gilú Shop | Tienda de Maquillaje Original en Ecuador',
      description: 'Gilú Shop nació del amor por el maquillaje. Somos la primera tienda en Otavalo, Ecuador especializada en maquillaje de marcas internacionales originales como Maybelline, e.l.f., NYX, Loreal, Huda Beauty, Rare Beauty y más.',
      keywords: 'historia Gilú Shop, tienda maquillaje Otavalo, maquillaje Ecuador, primera tienda maquillaje Otavalo, marcas maquillaje originales, Maybelline Ecuador, elf cosmetics, tienda belleza Ecuador',
      image: 'https://gilu-shop.com/assets/image/gilu-update.png',
      url: 'https://gilu-shop.com/about',
      type: 'website',
      siteName: 'Gilú Shop'
    });

    // Set Twitter Card tags
    this.seoService.setTwitterCard({
      title: 'Nuestra Historia - Gilú Shop',
      description: 'Somos la primera tienda en Otavalo, Ecuador especializada en maquillaje de marcas internacionales originales.',
      image: 'https://gilu-shop.com/assets/image/gilu-update.png'
    });

    // Set canonical URL for about page
    //this.seoService.setCanonicalUrl('https://gilu-shop.com/about');
  }
}
