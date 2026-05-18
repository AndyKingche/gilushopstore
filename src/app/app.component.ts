import { Component, OnInit } from '@angular/core';
import { SeoService } from './core/services/seo.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Gilú Shop';

  constructor(private seoService: SeoService) {}

  ngOnInit(): void {
    this.seoService.generateGlobalSchemas();
    
    // Set hreflang for Ecuador Spanish
    this.seoService.setHreflang('https://gilu-shop.com');
    
    // Set canonical URL for homepage
    this.seoService.setCanonicalUrl('https://gilu-shop.com');
  }
}
