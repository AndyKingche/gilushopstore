import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '../../core/services/products.service';
import { Product } from '../../core/models/product.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit {
  products$: Observable<Product[]>;
  categories: string[] = [];
  searchQuery = '';
  selectedCategory = '';

  constructor(
    private productsService: ProductsService,
    private route: ActivatedRoute
  ) {
    this.products$ = this.productsService.getAll();
  }

  ngOnInit(): void {
    this.categories = this.productsService.getCategories();
    
    this.route.queryParams.subscribe(params => {
      if (params['q']) {
        this.searchQuery = params['q'];
        this.filterProducts();
      }
      if (params['cat']) {
        this.selectedCategory = params['cat'];
        this.filterProducts();
      }
    });
  }

  filterProducts(): void {
    this.products$ = this.productsService.search(this.searchQuery, this.selectedCategory);
  }

  onSearchChange(event: { query: string; category: string }): void {
    this.searchQuery = event.query;
    this.selectedCategory = event.category;
    this.filterProducts();
  }

  onCategorySelect(category: string): void {
    this.selectedCategory = category;
    this.filterProducts();
  }
}
