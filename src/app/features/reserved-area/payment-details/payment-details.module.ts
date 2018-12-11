import {NgModule} from '@angular/core';
import {SharedModule} from '../../../shared/shared.module';
import {CoreModule} from '../../../core/core.module';
import {CommonModule} from '@angular/common';
import {CouponService} from '../../../shared/_services/coupon.service';
import {PaymentDetailsComponent} from './payment-details.component';

@NgModule({
  declarations: [
    PaymentDetailsComponent
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
    PaymentDetailsComponent
  ]
})

export class FeatureReservedAreaPaymentDetailsModule {}
