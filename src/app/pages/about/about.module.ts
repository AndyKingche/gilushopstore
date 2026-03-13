import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';

import { AboutComponent } from './about.component';
import { BrandStoryComponent } from './components/brand-story/brand-story.component';
import { ScheduleComponent } from './components/schedule/schedule.component';
import { ContactFormComponent } from './components/contact-form/contact-form.component';

const routes: Routes = [
  { path: '', component: AboutComponent }
];

@NgModule({
  declarations: [
    AboutComponent,
    BrandStoryComponent,
    ScheduleComponent,
    ContactFormComponent
  ],
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class AboutModule { }
