import {NgModule} from '@angular/core';
import {SharedModule} from '../../../../shared/shared.module';
import {CoreModule} from '../../../../core/core.module';
import {CouponService} from '../../../../shared/_services/coupon.service';
import {CommonModule} from '@angular/common';
import {FeatureReservedAreaConsumerShowcaseComponent} from "./coupon-showcase.component";

@NgModule({
  declarations: [
    FeatureReservedAreaConsumerShowcaseComponent
  ],
  imports: [
    SharedModule,
    CoreModule,
    CommonModule,
  ],
  providers: [
    CouponService,
  ],
  exports: [
    FeatureReservedAreaConsumerShowcaseComponent
  ]
})

export class FeatureReservedAreaConsumerShowcaseModule { }
