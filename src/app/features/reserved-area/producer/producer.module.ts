import {NgModule} from '@angular/core';
import {AppFooterModule} from '@coreui/angular';
import {SharedModule} from '../../../shared/shared.module';
import {CoreModule} from '../../../core/core.module';
import {FeatureReservedAreaCouponListModule} from './coupon-list/coupon-list.module';
import {FeatureReservedAreaCouponCreateModule} from './coupon-create/coupon-create.module';
import {CouponService} from '../../../shared/_services/coupon.service';
import {CommonModule} from '@angular/common';
import { CouponEditComponent } from './coupon-edit/coupon-edit.component';
import {ProducerRoutingModule} from "./producer.routing";
import {FeatureReservedAreaProducerComponent} from "./producer.component";

@NgModule({
  declarations: [
    CouponEditComponent,
    FeatureReservedAreaProducerComponent
  ],
  imports: [
    SharedModule,
    CoreModule,
    AppFooterModule,
    ProducerRoutingModule,
    FeatureReservedAreaCouponListModule,
    FeatureReservedAreaCouponCreateModule,
    CommonModule,
  ],
  providers: [
    CouponService,
  ],
  exports: [
    FeatureReservedAreaProducerComponent
  ]
})

export class FeatureReservedAreaProducerModule { }
