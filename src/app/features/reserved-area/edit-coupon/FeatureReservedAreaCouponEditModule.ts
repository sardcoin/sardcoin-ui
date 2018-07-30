import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {BrowserModule} from '@angular/platform-browser';
import {EditCouponComponent} from './edit-coupon.component';
@NgModule({
  declarations: [
    EditCouponComponent,
  ],
  imports: [
    ReactiveFormsModule,
    CommonModule,
  ],
  exports: [
    EditCouponComponent
  ],
  providers: [
  ]
})
export class FeatureReservedAreaCouponEditModule {}
