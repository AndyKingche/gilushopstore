import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';

import { HomeComponent } from './home.component';
import { BrandShowcaseComponent } from './components/brand-showcase/brand-showcase.component';
import { InfluencerVideosComponent } from './components/influencer-videos/influencer-videos.component';

const routes: Routes = [
  { path: '', component: HomeComponent }
];

@NgModule({
  declarations: [
    HomeComponent,
    BrandShowcaseComponent,
    InfluencerVideosComponent
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class HomeModule { }
