import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-join-banner',
  templateUrl: './join-banner.component.html',
  styleUrls: ['./join-banner.component.scss']
})
export class JoinBannerComponent implements OnInit, OnChanges {
  @Input() showIfNotLogged: boolean = true;
  
  isLoggedIn = false;

  ngOnInit(): void {
    this.checkAuth();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Refresh auth status when showIfNotLogged changes
    if (changes['showIfNotLogged']) {
      this.checkAuth();
    }
  }

  checkAuth(): void {
    const token = localStorage.getItem('authToken');
    const name = localStorage.getItem('userName');
    this.isLoggedIn = !!(token && name);
  }
}
