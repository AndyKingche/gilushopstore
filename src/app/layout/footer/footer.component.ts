import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  // Placeholder contact info - replace with actual data
  address = 'Av. Quito y Atahualpa, Otavalo - Imbabura, Ecuador';
  whatsapp = '+593 99 123 4567';
  email = 'customers@gilushop.store';
  companyName = 'IZENSHY';
  
  socialLinks = [
    { name: 'Facebook', icon: 'facebook', url: 'https://facebook.com/gilu' },
    { name: 'TikTok', icon: 'tiktok', url: 'https://tiktok.com/@gilu.ec' },
    { name: 'Instagram', icon: 'instagram', url: 'https://instagram.com/gilu.ec' }
  ];
}
