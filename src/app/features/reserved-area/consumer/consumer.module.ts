import {NgModule} from '@angular/core';
import {SharedModule} from '../../../shared/shared.module';
import {CoreModule} from '../../../core/core.module';
import {CouponService} from '../../../shared/_services/coupon.service';
import {CommonModule} from '@angular/common';
import {FeatureReservedAreaConsumerComponent} from "./consumer.component";
import {ConsumerRoutingModule} from "./consumer.routing";
import {FeatureReservedAreaConsumerShowcaseModule} from "./coupon-showcase/coupon-showcase.module";
import {BreadcrumbActions} from "../../../core/breadcrumb/breadcrumb.actions";
import { CouponDetailsComponent } from './coupon-details/coupon-details.component';
import {BsModalService} from 'ngx-bootstrap/modal';
import {ModalModule} from 'ngx-bootstrap';

@NgModule({
  declarations: [
    FeatureReservedAreaConsumerComponent,
    CouponDetailsComponent
  ],
  imports: [
    SharedModule,
    CoreModule,
    ConsumerRoutingModule,
    CommonModule,
    FeatureReservedAreaConsumerShowcaseModule,
    ModalModule.forRoot()
  ],
  providers: [
    CouponService,
    BreadcrumbActions,
    BsModalService
  ],
  exports: [
    FeatureReservedAreaConsumerComponent
  ]
})

export class FeatureReservedAreaConsumerModule { }
