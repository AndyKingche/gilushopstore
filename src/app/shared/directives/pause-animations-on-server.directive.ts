import { Directive, ElementRef, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformServer } from '@angular/common';

@Directive({
  selector: '[appPauseAnimationsOnServer]'
})
export class PauseAnimationsOnServerDirective implements OnInit {

  constructor(
    private el: ElementRef<HTMLElement>,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformServer(this.platformId)) {
      this.el.nativeElement.style.animationPlayState = 'paused';
    } else {
      // Ensure it's running on client
      this.el.nativeElement.style.animationPlayState = 'running';
    }
  }
}