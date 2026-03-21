import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private searchTermSubject = new BehaviorSubject<string | null>(null);
  searchTerm$ = this.searchTermSubject.asObservable();

  setSearchTerm(term: string | null) {
    this.searchTermSubject.next(term);
  }

  getSearchTerm(): string | null {
    return this.searchTermSubject.value;
  }
}