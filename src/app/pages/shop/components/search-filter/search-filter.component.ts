import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { Category } from '../../../../core/models/category.model';

@Component({
  selector: 'app-search-filter',
  templateUrl: './search-filter.component.html',
  styleUrls: ['./search-filter.component.scss']
})
export class SearchFilterComponent implements OnInit {
  @Input() categories: Category[] = [];
  @Output() filterChange = new EventEmitter<{ query: string; category: string }>();
  @Output() categoryChange = new EventEmitter<number | null>();
  @Output() searchChange = new EventEmitter<string | null>();

  searchControl = new FormControl('');
  categoryControl = new FormControl('');

  ngOnInit(): void {
    this.searchControl.valueChanges.pipe(
      debounceTime(300)
    ).subscribe((value) => {
      this.searchChange.emit(value || null);
    });

    this.categoryControl.valueChanges.subscribe((value) => {
      const categoryId = value ? parseInt(value, 10) : null;
      if (categoryId && !isNaN(categoryId)) {
        this.categoryChange.emit(categoryId);
      } else {
        this.categoryChange.emit(null);
      }
      this.filterChange.emit({ 
        query: this.searchControl.value || '', 
        category: value || '' 
      });
    });
  }

  search(): void {
    const query = this.searchControl.value || '';
    this.searchChange.emit(query.trim() || null);
  }

  clear(): void {
    this.searchControl.setValue('');
    this.categoryControl.setValue('');
    this.searchChange.emit(null);
    this.categoryChange.emit(null);
    this.filterChange.emit({ query: '', category: '' });
  }

  getCategoryLabel(category: Category): string {
    return category.categoryName || 'Sin nombre';
  }

  getCategoryValue(category: Category): string {
    return category.id ? category.id.toString() : '';
  }

  get filteredCategories(): Category[] {
    const excludedNames = ['Ropa', 'SIN DEFINICION', 'CAMISETA NEON'];
    return this.categories
      .filter(cat => !excludedNames.includes(cat.categoryName))
      .sort((a, b) => (a.categoryName || '').localeCompare(b.categoryName || ''));
  }
}
