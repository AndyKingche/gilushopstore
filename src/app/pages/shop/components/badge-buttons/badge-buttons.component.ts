import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit, OnChanges, SimpleChanges, HostListener } from '@angular/core';
import { Category } from '../../../../core/models/category.model';

@Component({
  selector: 'app-badge-buttons',
  templateUrl: './badge-buttons.component.html',
  styleUrls: ['./badge-buttons.component.scss']
})
export class BadgeButtonsComponent implements AfterViewInit, OnChanges {
  @Input() categories: Category[] = [];
  @Input() selectedIds: number[] = [];
  @Output() categoryChange = new EventEmitter<number | null>();
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;

  selectedCategoryId: number | null = null;
  showArrows = false;

  get visibleCategories(): Category[] {
    if (this.selectedIds.length > 0) {
      return this.categories.filter(cat => this.selectedIds.includes(cat.id));
    }
    return this.categories;
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.checkOverflow(), 100);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['categories'] || changes['selectedIds']) {
      setTimeout(() => this.checkOverflow(), 100);
    }
  }

  @HostListener('window:resize')
  onResize(): void {
    this.checkOverflow();
  }

  private checkOverflow(): void {
    if (this.scrollContainer) {
      const el = this.scrollContainer.nativeElement;
      this.showArrows = el.scrollWidth > el.clientWidth + 5;
    }
  }

  onBadgeClick(categoryId: number): void {
    if (this.selectedCategoryId === categoryId) {
      this.selectedCategoryId = null;
      this.categoryChange.emit(null);
    } else {
      this.selectedCategoryId = categoryId;
      this.categoryChange.emit(categoryId);
    }
  }

  onRemove(event: Event, categoryId: number): void {
    event.stopPropagation();
    this.selectedCategoryId = null;
    this.categoryChange.emit(null);
  }

  isSelected(categoryId: number): boolean {
    return this.selectedCategoryId === categoryId;
  }

  scroll(direction: 'left' | 'right'): void {
    if (this.scrollContainer) {
      const el = this.scrollContainer.nativeElement;
      const scrollAmount = el.clientWidth * 0.8;
      el.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  }
}