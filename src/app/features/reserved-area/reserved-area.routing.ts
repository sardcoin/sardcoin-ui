import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

/** App Components **/


@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'producer',
        loadChildren: './producer/producer.module#FeatureReservedAreaProducerModule',
        canActivate: []
      }
    ])
  ],
  exports: [RouterModule]
})
export class FeatureReservedAreaRoutingModule {
}
