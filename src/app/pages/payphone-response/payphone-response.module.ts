import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { PayphoneResponseComponent } from './payphone-response.component';

const routes: Routes = [
  { path: '', component: PayphoneResponseComponent }
];

@NgModule({
  declarations: [PayphoneResponseComponent],
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class PayphoneResponseModule {}
