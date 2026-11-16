import { TestBed } from '@angular/core/testing';
import { CartService } from './cart.service';
import { CartItem } from '../models/cart-item.model';
import { Product } from '../models/product.model';

describe('CartService', () => {
  let service: CartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CartService);
  });

  it('adds the selected quantity and merges it with the existing cart line', () => {
    const product: Product = {
      id: 'product-1',
      name: 'Base',
      category: 'Maquillaje',
      brand: 'Gilú',
      price: 12.5,
      description: 'Base líquida',
      inStock: true,
      newProduct: false
    };
    let items: CartItem[] = [];
    service.items$.subscribe(value => items = value);

    service.addItem(product, 2);
    service.addItem(product);

    expect(items).toEqual([{ product, quantity: 3 }]);
  });
});
