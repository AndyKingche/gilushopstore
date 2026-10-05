import { Component, HostListener } from '@angular/core';
import { Observable } from 'rxjs';
import { ModalService } from '../../../core/services/modal.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent {

  visible$: Observable<boolean>;

  constructor(
    private modalService: ModalService
  ) {
    this.visible$ = this.modalService.visible$;
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.cerrar();
  }

  cerrar(): void {
    this.modalService.close();
  }

  detenerEvento(event: MouseEvent): void {
    event.stopPropagation();
  }
}
