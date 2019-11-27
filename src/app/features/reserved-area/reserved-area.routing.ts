import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {IsProducerGuard} from '../../shared/_guards/is-producer.guard';
import {IsVerifierGuard} from '../../shared/_guards/is-verifier.guard';
import {IsBrokerGuard} from '../../shared/_guards/is-broker.guard';

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
        path: 'verifier',
        loadChildren: './verifier/verifier.module#VerifierModule',
        canActivate: [IsVerifierGuard]
      },
      {
        path: 'broker',
        loadChildren: './broker/broker.module#FeatureReservedAreaBrokerModule',
        canActivate: [IsBrokerGuard]
      },
    ])
  ],
  exports: [RouterModule]
})
export class FeatureReservedAreaRoutingModule {
}
