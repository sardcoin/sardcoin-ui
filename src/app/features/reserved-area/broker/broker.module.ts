/** Angular Modules **/
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
/** Internal Files **/
import {SharedModule} from '../../../shared/shared.module';
import {CoreModule} from '../../../core/core.module';
/** External Libraries **/
import {BrokerRoutingModule} from './broker.routing';
import {FeatureReservedAreaBrokerComponent} from './broker.component';

@NgModule({
  declarations: [
    FeatureReservedAreaBrokerComponent
  ],
  imports: [
    SharedModule,
    CoreModule,
    BrokerRoutingModule,
    CommonModule,
  ],
  providers: [
  ],
  exports: [
    FeatureReservedAreaBrokerComponent
  ]
})

export class FeatureReservedAreaBrokerModule {
}
