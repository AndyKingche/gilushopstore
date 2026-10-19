import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { HttpClientModule } from '@angular/common/http';

import { BoxGiluComponent } from './box-gilu.component';

const routes: Routes = [
  { path: '', component: BoxGiluComponent }
];

@NgModule({
  declarations: [
    BoxGiluComponent
  ],
  imports: [
    SharedModule,
    HttpClientModule,
    RouterModule.forChild(routes)
  ]
})
export class BoxGiluModule { }