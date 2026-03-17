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
  selectedCategory: number | null = null;
  searchTerm: string | null = null;

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
        this.selectedCategory = parseInt(params['cat'], 10);
      }
    });
  }

  onSearchQueryChange(event: { query: string; category: string }): void {
    this.searchQuery = event.query;
  }

  onCategoryChange(categoryId: number | null): void {
    this.selectedCategory = categoryId;
    this.searchTerm = null;
  }

  onSearchChange(searchTerm: string | null): void {
    this.searchTerm = searchTerm;
    this.selectedCategory = null;
  }

  onCategorySelect(categoryId: number): void {
    this.selectedCategory = categoryId;
    this.searchTerm = null;
  }
}
