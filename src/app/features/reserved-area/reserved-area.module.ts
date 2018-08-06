import {NgModule} from '@angular/core';
import {AppFooterModule} from '@coreui/angular';
import {SharedModule} from '../../shared/shared.module';
import {CoreModule} from '../../core/core.module';
import {FeatureReservedAreaComponent} from './reserved-area.component';
import {FeatureReservedAreaRoutingModule} from './reserved-area.routing';
import {CouponService} from '../../shared/_services/coupon.service';
import {CommonModule} from '@angular/common';

@NgModule({
  declarations: [
    FeatureReservedAreaComponent
  ],
  imports: [
    SharedModule,
    CoreModule,
    AppFooterModule,
    FeatureReservedAreaRoutingModule,
    CommonModule,
  ],
  providers: [
    CouponService,
  ],
  exports: [
    FeatureReservedAreaComponent
  ]
})

export class FeatureReservedAreaModule { }
