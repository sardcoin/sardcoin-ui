import {NgModule} from '@angular/core';
import {AppFooterModule} from '@coreui/angular';
import {SharedModule} from '../../shared/shared.module';
import {CoreModule} from '../../core/core.module';
import {FeatureReservedAreaComponent} from './reserved-area.component';
import {FeatureReservedAreaRoutingModule} from './reserved-area.routing';
import {FeatureReservedAreaCouponListModule} from "./coupon-list/coupon-list.module";

@NgModule({
  declarations: [
    FeatureReservedAreaComponent
  ],
  imports: [
    SharedModule,
    CoreModule,
    AppFooterModule,
    FeatureReservedAreaRoutingModule,
    FeatureReservedAreaCouponListModule
  ],
  providers: [

  ],
  exports: [
    FeatureReservedAreaComponent
  ]
})

export class FeatureDashboardModule { }
