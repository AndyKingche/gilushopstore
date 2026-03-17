import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '../../core/services/products.service';
import { Category } from '../../core/models/category.model';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit {
  categories: Category[] = [];
  searchQuery = '';
  selectedCategory = '';

  constructor(
    private route: ActivatedRoute,
    private productsService: ProductsService
  ) {}

  ngOnInit(): void {
    // Load categories from API
    this.productsService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
      },
      error: (err) => {
        console.error('Error loading categories:', err);
      }
    });

    this.route.queryParams.subscribe(params => {
      if (params['q']) {
        this.searchQuery = params['q'];
      }
      if (params['cat']) {
        this.selectedCategory = params['cat'];
      }
    });
  }

  onSearchChange(event: { query: string; category: string }): void {
    this.searchQuery = event.query;
    this.selectedCategory = event.category;
  }

  onCategorySelect(category: string): void {
    this.selectedCategory = category;
  }
}
