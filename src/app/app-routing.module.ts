import {Input, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'zones', component: HomeComponent },
  { path: 'my-zones', component: HomeComponent },
  { path: 'my-events', component: HomeComponent },
  { path: 'my-space', component: HomeComponent }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes),
  ],
  exports: [ RouterModule ],
  declarations: []
})

export class AppRoutingModule {
  @Input() token: string;
}
