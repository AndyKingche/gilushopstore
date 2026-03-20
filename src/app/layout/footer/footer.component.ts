import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  // Placeholder contact info - replace with actual data
  address = 'Av. Quito y Atahualpa, Otavalo - Imbabura, Ecuador';
  whatsapp = '+593 98 290 1603';
  email = 'customers@gilushop.store';
  companyName = 'IZENSHY';
  
  socialLinks = [
    { name: 'Facebook', icon: 'facebook', url: 'https://www.facebook.com/share/1AWFit8kx4/?mibextid=wwXIfr' },
    { name: 'TikTok', icon: 'tiktok', url: 'https://tiktok.com/@gilu.ec' },
    { name: 'Instagram', icon: 'instagram', url: 'https://instagram.com/gilu.ec' }
  ];
}
