import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Category } from '../../../../core/models/category.model';

@Component({
  selector: 'app-search-filter',
  templateUrl: './search-filter.component.html',
  styleUrls: ['./search-filter.component.scss']
})
export class SearchFilterComponent {
  @Input() categories: Category[] = [];
  @Output() filterChange = new EventEmitter<{ query: string; category: string }>();
  @Output() categoryChange = new EventEmitter<number | null>();
  @Output() searchChange = new EventEmitter<string | null>();

  private currentQuery = '';

  onSearchChange(term: string | null): void {
    this.currentQuery = term || '';
    this.searchChange.emit(term);
    this.filterChange.emit({ 
      query: this.currentQuery, 
      category: '' 
    });
  }

  onCategoryChange(categoryId: number | null): void {
    this.categoryChange.emit(categoryId);
  }

  onFilterChange(event: { category: string }): void {
    this.filterChange.emit({ 
      query: this.currentQuery, 
      category: event.category 
    });
  }
}
