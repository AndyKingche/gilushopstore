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
}
