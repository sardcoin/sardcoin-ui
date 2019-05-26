import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {AppComponent} from './app.component';


export const routes: Routes = [
  {
    path: '',
    component: AppComponent,
    loadChildren: './features/feature.module#FeatureModule'
  }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes, {useHash: false, enableTracing: false }) ],
  exports: [ RouterModule ],
  providers: [ ]
})
export class AppRoutingModule {}
