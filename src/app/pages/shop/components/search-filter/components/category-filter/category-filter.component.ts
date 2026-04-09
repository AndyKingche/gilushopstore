import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Category } from '../../../../../../core/models/category.model';

@Component({
  selector: 'app-category-filter',
  templateUrl: './category-filter.component.html',
  styleUrls: ['./category-filter.component.scss']
})
export class CategoryFilterComponent {
  @Input() categories: Category[] = [];
  @Input() selectedCategoryIds: number[] = [];
  @Output() categoryChange = new EventEmitter<number | null>();
  @Output() filterChange = new EventEmitter<{ category: string }>();

  categoryControl = new FormControl('');

  get filteredCategories(): Category[] {
    const excludedNames = ['Ropa', 'SIN DEFINICION', 'CAMISETA NEON'];
    let filtered = this.categories
      .filter(cat => !excludedNames.includes(cat.categoryName))
      .sort((a, b) => (a.categoryName || '').localeCompare(b.categoryName || ''));
    
    if (this.selectedCategoryIds.length > 0) {
      filtered = filtered.filter(cat => this.selectedCategoryIds.includes(cat.id));
    }
    
    return filtered;
  }

  onCategoryChange(value: string): void {
    const categoryId = value ? parseInt(value, 10) : null;
    if (categoryId && !isNaN(categoryId)) {
      this.categoryChange.emit(categoryId);
    } else {
      this.categoryChange.emit(null);
    }
    this.filterChange.emit({ category: value || '' });
  }

  getCategoryLabel(category: Category): string {
    return category.categoryName || 'Sin nombre';
  }

  getCategoryValue(category: Category): string {
    return category.id ? category.id.toString() : '';
  }
}
