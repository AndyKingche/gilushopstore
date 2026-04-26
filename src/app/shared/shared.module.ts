import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { JoinBannerComponent } from './components/join-banner/join-banner.component';
import { ScrollAnimationDirective } from './directives/scroll-animation.directive';
import { PauseAnimationsOnServerDirective } from './directives/pause-animations-on-server.directive';
import { SearchBarComponent } from './components/search-bar/search-bar.component';

@NgModule({
  declarations: [
    JoinBannerComponent,
    ScrollAnimationDirective,
    PauseAnimationsOnServerDirective,
    SearchBarComponent
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    JoinBannerComponent,
    ScrollAnimationDirective,
    PauseAnimationsOnServerDirective,
    SearchBarComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule
  ]
})
export class SharedModule { }
