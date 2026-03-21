import { Component, OnInit } from '@angular/core';
import { SeoService } from './core/services/seo.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Gilú Beauty Shop';

  constructor(private seoService: SeoService) {}

  ngOnInit(): void {
    // Set static JSON-LD schemas for SSR (Organization, WebSite, LocalBusiness)
    this.seoService.setJsonLd(this.seoService.generateOrganizationSchema(), 'schema-organization');
    this.seoService.setJsonLd(this.seoService.generateWebSiteSchema(), 'schema-website');
    this.seoService.setJsonLd(this.seoService.generateLocalBusinessSchema(), 'schema-local-business');
    
    // Set hreflang for Ecuador Spanish
    this.seoService.setHreflang('https://gilushop.store');
    
    // Set canonical URL for homepage
    this.seoService.setCanonicalUrl('https://gilushop.store');
  }
}
