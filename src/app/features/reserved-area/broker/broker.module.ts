/** Angular Modules **/
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
/** Internal Files **/
import {SharedModule} from '../../../shared/shared.module';
import {CoreModule} from '../../../core/core.module';
/** External Libraries **/
import {BrokerRoutingModule} from './broker.routing';
import {FeatureReservedAreaBrokerComponent} from './broker.component';
import {FeatureReservedAreaPaymentDetailsModule} from '../payment-details/payment-details.module';
import {FeatureReservedAreaPersonalInfoModule} from '../personal-info/personal-info.module';
import {FeatureReservedAreaPackageCreateModule} from './package-create/package-create.module';
import {FeatureReservedAreaPackageListModule} from './package-list/package-list.module';
import {FeatureReservedAreaPackageEditModule} from './package-edit/package-edit.module';
import {FeatureReservedAreaBrokerPackageReportModule} from './report/package-report.module';

@NgModule({
  declarations: [
    FeatureReservedAreaBrokerComponent,

  ],
  imports: [
    SharedModule,
    CoreModule,
    BrokerRoutingModule,
    CommonModule,
    FeatureReservedAreaPaymentDetailsModule,
    FeatureReservedAreaPersonalInfoModule,
    FeatureReservedAreaPackageCreateModule,
    FeatureReservedAreaPackageListModule,
    FeatureReservedAreaPackageEditModule,
    FeatureReservedAreaBrokerPackageReportModule

  ],
  providers: [
  ],
  exports: [
    FeatureReservedAreaBrokerComponent
  ]
})

export class FeatureReservedAreaBrokerModule {
}
