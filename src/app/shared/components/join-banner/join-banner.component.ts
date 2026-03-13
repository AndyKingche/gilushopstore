import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-join-banner',
  templateUrl: './join-banner.component.html',
  styleUrls: ['./join-banner.component.scss']
})
export class JoinBannerComponent {
  @Input() showIfNotLogged: boolean = true;
}
