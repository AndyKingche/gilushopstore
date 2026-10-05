import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  constructor() { }

  private visibleSubject = new BehaviorSubject<boolean>(false);

  visible$ = this.visibleSubject.asObservable();

  open(): void {
    this.visibleSubject.next(true);
  }

  close(): void {
    this.visibleSubject.next(false);
  }

  // toggle(): void {
  //   this.visibleSubject.next(!this.visibleSubject.value);
  // }
}
