import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { OrderComponent } from './order.component';

const routes: Routes = [
  { path: '', component: OrderComponent }
];

@NgModule({
  declarations: [OrderComponent],
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class OrderModule {}
