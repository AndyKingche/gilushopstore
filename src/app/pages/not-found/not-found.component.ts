import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';
import { Router } from '@angular/router';
import { SeoService } from '../../core/services/seo.service';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent implements OnInit {
  constructor(
    private router: Router,
    private seoService: SeoService,
    @Inject(PLATFORM_ID) private platformId: object
  ) {}

  ngOnInit(): void {
    this.seoService.updateMetaTags({
      title: 'Página no encontrada | Gilú Shop Ecuador',
      description: 'La página que buscas no existe o ha sido movida. Explora nuestra tienda de maquillaje 100% original con envío a todo Ecuador.',
      keywords: 'página no encontrada, 404, error, Gilú Shop',
      image: 'https://gilu-shop.com/assets/image/gilu-update.png',
      url: 'https://gilu-shop.com/404',
      type: 'website',
      locale: 'es_EC',
      siteName: 'Gilú Shop'
    });

    if (isPlatformServer(this.platformId)) {
      // Status code is handled by server.ts for this route
    }
  }

  goHome(): void {
    this.router.navigate(['/']);
  }

  goShop(): void {
    this.router.navigate(['/shop']);
  }
}
