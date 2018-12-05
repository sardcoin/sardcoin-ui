import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {IsProducerGuard} from '../../shared/_guards/is-producer.guard';
import {IsConsumerGuard} from '../../shared/_guards/is-consumer.guard';
import {PersonalInfoComponent} from './personal-info/personal-info.component';
import {IsAuthenticatedGuard} from '../../shared/_guards/is-authenticated.guard';
import {PaymentDetailsComponent} from './payment-details/payment-details.component';
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
        path: 'personal-info',
        component: PersonalInfoComponent,
        canActivate: [IsAuthenticatedGuard]
      },
      {
        path: 'payment-details',
        component: PaymentDetailsComponent,
        canActivate: [IsAuthenticatedGuard]
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
