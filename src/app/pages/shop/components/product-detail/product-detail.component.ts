import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EMPTY, Subscription, switchMap } from 'rxjs';
import { CartService } from '../../../../core/services/cart.service';
import { ProductsService } from '../../../../core/services/products.service';
import { Product } from '../../../../core/models/product.model';
import { SeoService } from '../../../../core/services/seo.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit, OnDestroy {
  product: Product | null = null;
  quantity = 1;
  isLoading = true;
  errorMessage = '';
  isNotFound = false;
  addedToCart = false;

  private routeSubscription?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productsService: ProductsService,
    private cartService: CartService,
    private seoService: SeoService
  ) {}

  ngOnInit(): void {
    this.routeSubscription = this.route.paramMap.pipe(
      switchMap(params => {
        const name = params.get('name');
        if (!name) {
          this.isLoading = false;
          this.isNotFound = true;
          return EMPTY;
        }

        this.isLoading = true;
        this.errorMessage = '';
        this.isNotFound = false;
        this.product = null;
        this.quantity = 1;
        this.addedToCart = false;
        return this.productsService.getOnlineStoreProductByName(name);
      })
    ).subscribe({
      next: product => {
        this.product = product;
        this.isLoading = false;
        this.updateSeo(product);
      },
      error: (error: HttpErrorResponse) => {
        this.isLoading = false;
        this.isNotFound = error.status === 404;
        this.errorMessage = this.isNotFound
          ? 'No encontramos este producto. Puede que ya no esté disponible.'
          : 'No pudimos cargar el producto. Revisa tu conexión e inténtalo de nuevo.';
        console.error('Error al cargar el detalle del producto:', error);
      }
    });
  }

  ngOnDestroy(): void {
    this.routeSubscription?.unsubscribe();
  }

  get productImage(): string {
    if (!this.product?.image) {
      return 'assets/image/gilu-update.png';
    }

    return this.product.image.startsWith('http')
      ? this.product.image
      : `${environment.imageUrl}/${this.product.image}`;
  }

  decrementQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
      this.addedToCart = false;
    }
  }

  incrementQuantity(): void {
    this.quantity++;
    this.addedToCart = false;
  }

  addToCart(): void {
    if (!this.product?.inStock) {
      return;
    }

    this.cartService.addItem(this.product, this.quantity);
    this.addedToCart = true;
  }

  goBackToShop(): void {
    this.router.navigate(['/shop']);
  }

  private updateSeo(product: Product): void {
    this.seoService.updateMetaTags({
      title: `${product.name} | ${product.brand} | Gilú Shop`,
      description: product.description || `${product.name} de ${product.brand} en Gilú Shop.`,
      keywords: `${product.name}, ${product.brand}, maquillaje original Ecuador`,
      image: this.productImage,
      url: `https://gilu-shop.com/shop/product/${encodeURIComponent(product.name)}`,
      type: 'product',
      siteName: 'Gilú Shop'
    });
  }
}
