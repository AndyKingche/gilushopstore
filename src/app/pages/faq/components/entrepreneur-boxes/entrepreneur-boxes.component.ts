import { Component } from '@angular/core';

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
    {
      id: 1,
      name: 'Cajita Básica',
      description: 'Incluye productos esenciales para comenzar tu emprendimiento.',
      price: '$50.000',
      badge: 'BÁSICA',
      badgeColor: '#B8D5D9'
    },
    {
      id: 2,
      name: 'Cajita Intermedia',
      description: 'Productos de calidad media para expandir tu negocio.',
      price: '$100.000',
      badge: 'INTERMEDIA',
      badgeColor: '#27ae60'
    },
    {
      id: 3,
      name: 'Cajita Premium',
      description: 'La mejor selección para emprendedores avanzados.',
      price: '$150.000',
      badge: 'PREMIUM',
      badgeColor: '#D95F80'
    }
  ];

  selectBox(box: EntrepreneurBox): void {
    this.selectedBox = box;
  }

  contactWhatsApp(): void {
    if (this.selectedBox) {
      const message = `Hola, estoy interesado en la ${this.selectedBox.name} (${this.selectedBox.price}).`;
      const whatsappUrl = `https://wa.me/593982901603?text=${encodeURIComponent(message)}`; // Replace with actual number
      window.open(whatsappUrl, '_blank');
    }
  }
}