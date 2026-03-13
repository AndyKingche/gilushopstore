import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { JoinBannerComponent } from './components/join-banner/join-banner.component';
import { ScrollAnimationDirective } from './directives/scroll-animation.directive';

@NgModule({
  declarations: [
    JoinBannerComponent,
    ScrollAnimationDirective
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    JoinBannerComponent,
    ScrollAnimationDirective
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule
  ]
})
export class SharedModule { }
