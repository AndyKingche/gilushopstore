import { Component, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { SearchService } from '../../../core/services/search.service';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent implements OnInit, OnDestroy {
  @Output() searchChange = new EventEmitter<string | null>();

  searchControl = new FormControl('');
  private searchSubscription?: Subscription;

  constructor(
    private router: Router,
    private searchService: SearchService
  ) {}

  ngOnDestroy(): void {
    this.searchSubscription?.unsubscribe();
  }

  ngOnInit(): void {
    // Check if there's already a search term in the service when component loads
    const currentSearchTerm = this.searchService.getSearchTerm();
    if (currentSearchTerm !== null && currentSearchTerm.trim() !== '') {
      this.searchControl.setValue(currentSearchTerm, { emitEvent: false });
      // Emit search change manually since we're not emitting event
      this.searchChange.emit(currentSearchTerm);
    }

    // Listen to search service for search terms from header (for real-time updates)
    this.searchSubscription = this.searchService.searchTerm$.subscribe(term => {
      if (term !== null && term.trim() !== '') {
        this.searchControl.setValue(term, { emitEvent: false });
        // Emit search change manually since we're not emitting event
        this.searchChange.emit(term);
      }
    });

    this.searchControl.valueChanges.pipe(
      debounceTime(300)
    ).subscribe((value) => {
      this.searchChange.emit(value || null);
    });
  }

  search(): void {
    const query = this.searchControl.value?.trim() || '';
    if (query) {
      this.router.navigate(['/shop']);
    }
  }

  clear(): void {
    this.searchControl.setValue('');
    this.searchChange.emit(null);
  }
}
