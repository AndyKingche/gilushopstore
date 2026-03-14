import { Component, Input } from '@angular/core';
import { Product } from '../../../../core/models/product.model';
import { CartService } from '../../../../core/services/cart.service';

@Component({
  selector: 'app-product-grid',
  templateUrl: './product-grid.component.html',
  styleUrls: ['./product-grid.component.scss']
})
export class ProductGridComponent {
  @Input() products: Product[] | null = [];

  constructor(private cartService: CartService) {}

  addToCart(product: Product): void {
    if (product.inStock) {
      this.cartService.addItem(product);
    }
  }

  trackByProduct(index: number, product: Product): any {
    return product.id;
  }

  getAnimationDelay(index: number): string {
    const columns = 4; // Adjust based on screen size if needed
    const row = Math.floor(index / columns);
    const col = index % columns;
    const delay = (row * 200) + (col * 100); // Row delay 200ms, column delay 100ms
    return `${delay}ms`;
  }
}
