import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {FeatureReservedAreaBrokerComponent} from './broker.component';


/** App Components **/


@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: FeatureReservedAreaBrokerComponent
      }
    ])
  ],
  exports: [RouterModule]
})
export class BrokerRoutingModule {
}
