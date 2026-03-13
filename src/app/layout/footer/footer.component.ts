import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  // Placeholder contact info - replace with actual data
  address = 'Av. Principal 123, Quito, Ecuador';
  whatsapp = '+593 99 123 4567';
  email = 'contacto@gilu.com';
  companyName = 'Studio Design';
  
  socialLinks = [
    { name: 'Facebook', icon: 'facebook', url: 'https://facebook.com/gilu' },
    { name: 'TikTok', icon: 'tiktok', url: 'https://tiktok.com/@gilu' },
    { name: 'Instagram', icon: 'instagram', url: 'https://instagram.com/gilu' }
  ];
}
