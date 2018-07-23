import {NgModule} from '@angular/core';
import {FeatureReservedAreaCouponListComponent} from './coupon-list.component';
import {CouponItemComponent} from '../coupon-item/coupon-item.component';
import {BrowserModule} from '@angular/platform-browser';
import {CommonModule} from '@angular/common';

@NgModule({
  declarations: [
    FeatureReservedAreaCouponListComponent,
    CouponItemComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [
    FeatureReservedAreaCouponListComponent,
    CouponItemComponent
  ],
  providers: [
  ]
})
export class FeatureReservedAreaCouponListModule {}
