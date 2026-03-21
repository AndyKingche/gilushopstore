import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

interface EntrepreneurBox {
  id: number;
  name: string;
  description: string;
  price: string;
  badge: string;
  badgeColor: string;
}

@Component({
  selector: 'app-entrepreneur-boxes',
  templateUrl: './entrepreneur-boxes.component.html',
  styleUrls: ['./entrepreneur-boxes.component.scss']
})
export class EntrepreneurBoxesComponent {
  selectedBox: EntrepreneurBox | null = null;
  
  entrepreneurBoxes: EntrepreneurBox[] = [
    { id: 1, name: 'Cajita Básica', description: 'Incluye 20 productos esenciales para comenzar tu emprendimiento. ($11.70 por unidad)', price: '$234', badge: 'BÁSICA', badgeColor: '#B8D5D9' },
    { id: 2, name: 'Cajita Intermedia', description: 'Incluye 40 productos para expandir tu negocio. ($11.50 por unidad)', price: '$460', badge: 'INTERMEDIA', badgeColor: '#27ae60' },
    { id: 3, name: 'Cajita Premium', description: 'Incluye 50 productos, la mejor selección para emprendedores avanzados. ($11.50 por unidad)', price: '$565', badge: 'PREMIUM', badgeColor: '#D95F80' }
  ];

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  selectBox(box: EntrepreneurBox): void {
    this.selectedBox = box;
  }

  contactWhatsApp(): void {
    if (isPlatformBrowser(this.platformId) && this.selectedBox) {
      const message = `Hola, estoy interesado en la ${this.selectedBox.name} (${this.selectedBox.price}).`;
      const whatsappUrl = `https://wa.me/593982901603?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
    }
  }
}