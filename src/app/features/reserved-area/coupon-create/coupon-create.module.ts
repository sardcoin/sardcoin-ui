import {NgModule} from '@angular/core';
import {FeatureReservedAreaCouponCreateComponent} from './coupon-create.component';
import {ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {BrowserModule} from '@angular/platform-browser';
import {StoreService} from "../../../shared/_services/store.service";
@NgModule({
  declarations: [
    FeatureReservedAreaCouponCreateComponent,
  ],
  imports: [
    ReactiveFormsModule,
    CommonModule,
  ],
  exports: [
    FeatureReservedAreaCouponCreateComponent
  ],
  providers: [
    StoreService
  ]
})
export class FeatureReservedAreaCouponCreateModule {}
