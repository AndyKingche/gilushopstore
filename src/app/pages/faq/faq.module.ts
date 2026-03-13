import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';

import { FaqComponent } from './faq.component';
import { PaymentShippingComponent } from './components/payment-shipping/payment-shipping.component';
import { AccumulativePlansComponent } from './components/accumulative-plans/accumulative-plans.component';
import { EntrepreneurBoxesComponent } from './components/entrepreneur-boxes/entrepreneur-boxes.component';

const routes: Routes = [
  { path: '', component: FaqComponent }
];

@NgModule({
  declarations: [
    FaqComponent,
    PaymentShippingComponent,
    AccumulativePlansComponent,
    EntrepreneurBoxesComponent
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class FaqModule { }