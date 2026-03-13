import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-search-filter',
  templateUrl: './search-filter.component.html',
  styleUrls: ['./search-filter.component.scss']
})
export class SearchFilterComponent implements OnInit {
  @Input() categories: string[] = [];
  @Output() filterChange = new EventEmitter<{ query: string; category: string }>();

  searchControl = new FormControl('');
  categoryControl = new FormControl('');

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
    ).subscribe(() => {
      this.emitFilter();
    });

    this.categoryControl.valueChanges.subscribe(() => {
      this.emitFilter();
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

  clear(): void {
    this.searchControl.setValue('');
  }

  getCategoryLabel(category: string): string {
    const labels: { [key: string]: string } = {
      'bases': 'Bases',
      'labios': 'Labios',
      'rostro': 'Rostro',
      'primers': 'Primers',
      'ojos': 'Ojos',
      'skincare': 'Skin Care',
      'fijacion': 'Fijación'
    };
    return labels[category] || category;
  }
}
