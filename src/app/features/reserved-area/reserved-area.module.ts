import {NgModule} from '@angular/core';
import {AppFooterModule} from '@coreui/angular';
import {SharedModule} from '../../shared/shared.module';
import {CoreModule} from '../../core/core.module';
import {FeatureReservedAreaComponent} from './reserved-area.component';
import {FeatureReservedAreaRoutingModule} from './reserved-area.routing';
import {FeatureReservedAreaCouponListModule} from './coupon-list/coupon-list.module';
import {FeatureReservedAreaCouponCreateModule} from './coupon-create/coupon-create.module';
import {CouponService} from '../../shared/_services/coupon.service';
import {CommonModule} from '@angular/common';
import { CouponEditComponent } from './coupon-edit/coupon-edit.component';

@NgModule({
  declarations: [
    FeatureReservedAreaComponent,
    CouponEditComponent,
  ],
  imports: [
    SharedModule,
    CoreModule,
    AppFooterModule,
    FeatureReservedAreaRoutingModule,
    FeatureReservedAreaCouponListModule,
    FeatureReservedAreaCouponCreateModule,
    CommonModule,

  ],
  providers: [
    CouponService,
  ],
  exports: [
    FeatureReservedAreaComponent
  ]
})

export class FeatureDashboardModule { }
