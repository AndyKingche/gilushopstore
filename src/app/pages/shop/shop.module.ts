import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';

import { ShopComponent } from './shop.component';
import { ProductShowcaseComponent } from './components/product-showcase/product-showcase.component';
import { SearchFilterComponent } from './components/search-filter/search-filter.component';
import { CategoryFilterComponent } from './components/search-filter/components/category-filter/category-filter.component';
import { BadgeButtonsComponent } from './components/badge-buttons/badge-buttons.component';
import { ProductGridComponent } from './components/product-grid/product-grid.component';
import { BannerMarqueeComponent } from './components/banner-marquee/banner-marquee.component';

const routes: Routes = [
  { path: '', component: ShopComponent },
  { path: 'collections/:marca', component: ShopComponent }
];

@NgModule({
  declarations: [
    ShopComponent,
    ProductShowcaseComponent,
    SearchFilterComponent,
    CategoryFilterComponent,
    BadgeButtonsComponent,
    ProductGridComponent,
    BannerMarqueeComponent
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class ShopModule { }
