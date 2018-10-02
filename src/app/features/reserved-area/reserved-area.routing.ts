import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {IsProducerGuard} from "../../shared/_guards/is-producer.guard";
import {IsConsumerGuard} from "../../shared/_guards/is-consumer.guard";
import {PersonalInfoComponent} from './personal-info/personal-info.component';
import {IsAuthenticatedGuard} from '../../shared/_guards/is-authenticated.guard';

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
        path: 'personal_info',
        component: PersonalInfoComponent,
        canActivate: [IsAuthenticatedGuard]


      },

    ])
  ],
  exports: [RouterModule]
})
export class FeatureReservedAreaRoutingModule {
}
