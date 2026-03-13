import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';

import { HomeComponent } from './home.component';
import { HeroCarouselComponent } from './components/hero-carousel/hero-carousel.component';
import { NewsCardsComponent } from './components/news-cards/news-cards.component';
import { InfluencerVideosComponent } from './components/influencer-videos/influencer-videos.component';

const routes: Routes = [
  { path: '', component: HomeComponent }
];

@NgModule({
  declarations: [
    HomeComponent,
    HeroCarouselComponent,
    NewsCardsComponent,
    InfluencerVideosComponent
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class HomeModule { }
