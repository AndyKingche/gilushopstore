import { Component, Input, OnInit, OnChanges, SimpleChanges, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-join-banner',
  templateUrl: './join-banner.component.html',
  styleUrls: ['./join-banner.component.scss']
})
export class JoinBannerComponent implements OnInit, OnChanges {
  @Input() showIfNotLogged: boolean = true;

  isLoggedIn = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    this.checkAuth();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['showIfNotLogged']) {
      this.checkAuth();
    }
  }

  checkAuth(): void {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('authToken');
      const name = localStorage.getItem('userName');
      this.isLoggedIn = !!(token && name);
    }
  }
}