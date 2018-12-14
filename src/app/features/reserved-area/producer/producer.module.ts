import {NgModule} from '@angular/core';
import {AppFooterModule} from '@coreui/angular';
import {SharedModule} from '../../../shared/shared.module';
import {CoreModule} from '../../../core/core.module';
import {FeatureReservedAreaCouponListModule} from './coupon-list/coupon-list.module';
import {FeatureReservedAreaCouponCreateModule} from './coupon-create/coupon-create.module';
import {CouponService} from '../../../shared/_services/coupon.service';
import {CommonModule} from '@angular/common';
import {ProducerRoutingModule} from './producer.routing';
import {FeatureReservedAreaProducerComponent} from './producer.component';
import {FileUploadModule} from 'ng2-file-upload';
import {FeatureReservedAreaProducerCouponReportComponent} from './report/coupon-report.component';
import {FeatureReservedAreaCouponEditModule} from './coupon-edit/coupon-edit.module';
import {ReactiveFormsModule} from '@angular/forms';
import {FeatureReservedAreaPaymentDetailsModule} from '../payment-details/payment-details.module';
import {FeatureReservedAreaPersonalInfoModule} from '../personal-info/personal-info.module';

@NgModule({
  declarations: [
    FeatureReservedAreaProducerComponent,
    FeatureReservedAreaProducerCouponReportComponent,
  ],
  imports: [
    SharedModule,
    CoreModule,
    AppFooterModule,
    ProducerRoutingModule,
    FeatureReservedAreaCouponListModule,
    FeatureReservedAreaCouponCreateModule,
    FeatureReservedAreaCouponEditModule,
    FeatureReservedAreaPaymentDetailsModule,
    FeatureReservedAreaPersonalInfoModule,
    CommonModule,
    ReactiveFormsModule,
    FileUploadModule,
  ],
  providers: [
    CouponService,
  ],
  exports: [
    FeatureReservedAreaProducerComponent
  ]
})

export class FeatureReservedAreaProducerModule {
}
