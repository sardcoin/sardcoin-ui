import {NgModule} from '@angular/core';
import {SharedModule} from '../../../shared/shared.module';
import {CoreModule} from '../../../core/core.module';
import {CouponService} from '../../../shared/_services/coupon.service';
import {CommonModule} from '@angular/common';
import {FeatureReservedAreaConsumerComponent} from "./consumer.component";
import {ConsumerRoutingModule} from "./consumer.routing";
import {FeatureReservedAreaConsumerShowcaseModule} from "./coupon-showcase/coupon-showcase.module";
import {BreadcrumbActions} from "../../../core/breadcrumb/breadcrumb.actions";
import {FeatureReservedAreaConsumerBoughtModule} from "./coupon-bought/coupon-bought.module";

@NgModule({
  declarations: [
    FeatureReservedAreaConsumerComponent
  ],
  imports: [
    SharedModule,
    CoreModule,
    ConsumerRoutingModule,
    CommonModule,
    FeatureReservedAreaConsumerShowcaseModule,
    FeatureReservedAreaConsumerBoughtModule
  ],
  providers: [
    CouponService,
    BreadcrumbActions
  ],
  exports: [
    FeatureReservedAreaConsumerComponent
  ]
})

export class FeatureReservedAreaConsumerModule { }
