import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductsService } from './products.service';
import { Product } from '../models/product.model';
import { environment } from 'src/environments/environment';

describe('ProductsService', () => {
  let service: ProductsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(ProductsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('requests one store product by its name', () => {
    const productName = 'Base & Corrector';
    const product: Product = {
      id: 'product-1',
      name: productName,
      category: 'Maquillaje',
      brand: 'Gilú',
      price: 12.5,
      description: 'Producto de prueba',
      image: 'base.jpg',
      inStock: true,
      newProduct: false
    };

    let response: Product | undefined;
    service.getOnlineStoreProductByName(productName).subscribe(value => response = value);

    const request = httpMock.expectOne(req =>
      req.url === `${environment.apiUrl}api/v1/gessa/product/online-store/2/search/product`
      && req.params.get('name') === productName
    );
    expect(request.request.method).toBe('GET');
    request.flush(product);

    expect(response).toEqual(product);
  });
});
