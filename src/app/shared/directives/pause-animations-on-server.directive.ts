import { Directive, ElementRef, OnInit, Inject, PLATFORM_ID, AfterViewInit } from '@angular/core';
import { isPlatformBrowser,isPlatformServer } from '@angular/common';

@Directive({
  selector: '[appPauseAnimationsOnServer]'
})
// export class PauseAnimationsOnServerDirective implements OnInit {

//   constructor(
//     private el: ElementRef<HTMLElement>,
//     @Inject(PLATFORM_ID) private platformId: Object
//   ) {}

//   ngOnInit(): void {
//     if (isPlatformServer(this.platformId)) {
//       this.el.nativeElement.style.animationPlayState = 'paused';
//     } else {
//       // Ensure it's running on client
//       this.el.nativeElement.style.animationPlayState = 'running';
//     }
//   }
// }
export class PauseAnimationsOnServerDirective implements AfterViewInit {

  constructor(
    private el: ElementRef<HTMLElement>,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngAfterViewInit(): void {

    if (isPlatformServer(this.platformId)) {
      this.el.nativeElement.style.animationPlayState = 'paused';
    }

    if (isPlatformBrowser(this.platformId)) {
      requestAnimationFrame(() => {
        this.el.nativeElement.style.animationPlayState = 'running';
      });
    }
  }
}