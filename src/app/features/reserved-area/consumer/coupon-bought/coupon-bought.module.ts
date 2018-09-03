import {NgModule} from '@angular/core';
import {SharedModule} from '../../../../shared/shared.module';
import {CoreModule} from '../../../../core/core.module';
import {CouponService} from '../../../../shared/_services/coupon.service';
import {CommonModule} from '@angular/common';
import {FeatureReservedAreaConsumerBoughtComponent} from './coupon-bought.component';

@NgModule({
  declarations: [
    FeatureReservedAreaConsumerBoughtComponent
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
    FeatureReservedAreaConsumerBoughtComponent
  ]
})

export class FeatureReservedAreaConsumerBoughtModule {
}
