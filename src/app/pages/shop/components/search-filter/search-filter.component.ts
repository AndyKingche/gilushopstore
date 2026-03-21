import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
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
  private searchQuery = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['q']) {
        this.searchControl.setValue(params['q']);
      }
      if (params['cat']) {
        this.categoryControl.setValue(params['cat']);
      }
    });

    this.searchControl.valueChanges.pipe(
      debounceTime(300)
    ).subscribe((value) => {
      this.searchQuery = value || '';
    });

    this.categoryControl.valueChanges.subscribe((value) => {
      this.emitFilter();
      
      // Emit category change for filtering
      const categoryId = value ? parseInt(value, 10) : null;
      if (categoryId && !isNaN(categoryId)) {
        this.categoryChange.emit(categoryId);
      } else {
        this.categoryChange.emit(null);
      }
    });
  }

  emitFilter(): void {
    const query = this.searchControl.value || '';
    const category = this.categoryControl.value || '';
    this.filterChange.emit({ query, category });
    
    // Update URL
    const queryParams: any = {};
    if (query) queryParams.q = query;
    if (category) queryParams.cat = category;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams,
      queryParamsHandling: 'merge'
    });
  }

  search(): void {
    const query = this.searchControl.value || '';
    if (query.trim()) {
      this.searchChange.emit(query.trim());
    } else {
      this.searchChange.emit(null);
    }
  }

  clear(): void {
    this.searchControl.setValue('');
    this.searchChange.emit(null);
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
