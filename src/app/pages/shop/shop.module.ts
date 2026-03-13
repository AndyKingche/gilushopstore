import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';

import { ShopComponent } from './shop.component';
import { ProductShowcaseComponent } from './components/product-showcase/product-showcase.component';
import { SearchFilterComponent } from './components/search-filter/search-filter.component';
import { ProductGridComponent } from './components/product-grid/product-grid.component';

const routes: Routes = [
  { path: '', component: ShopComponent }
];

@NgModule({
  declarations: [
    ShopComponent,
    ProductShowcaseComponent,
    SearchFilterComponent,
    ProductGridComponent
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class ShopModule { }
