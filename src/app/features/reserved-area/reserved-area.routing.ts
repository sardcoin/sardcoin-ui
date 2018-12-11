import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {IsProducerGuard} from '../../shared/_guards/is-producer.guard';
import {IsConsumerGuard} from '../../shared/_guards/is-consumer.guard';
import {IsVerifierGuard} from '../../shared/_guards/is-verifier.guard';

/** App Components **/


@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        redirectTo: 'producer',
        pathMatch: 'full'
      },
      {
        path: 'producer',
        loadChildren: './producer/producer.module#FeatureReservedAreaProducerModule',
        canActivate: [IsProducerGuard]
      },
      {
        path: 'consumer',
        loadChildren: './consumer/consumer.module#FeatureReservedAreaConsumerModule',
        canActivate: [IsConsumerGuard]
      },
      {
        path: 'verifier',
        loadChildren: './verifier/verifier.module#VerifierModule',
        canActivate: [IsVerifierGuard]
      },
    ])
  ],
  exports: [RouterModule]
})
export class FeatureReservedAreaRoutingModule {
}
