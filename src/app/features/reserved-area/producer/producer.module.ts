import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AppFooterModule } from '@coreui/angular';
import { FileUploadModule } from 'ng2-file-upload';
import { Ng2GoogleChartsModule } from 'ng2-google-charts';
import { CoreModule } from '../../../core/core.module';
import { CouponService } from '../../../shared/_services/coupon.service';
import { ReportService } from '../../../shared/_services/report.service';
import { SharedModule } from '../../../shared/shared.module';
import { FeatureReservedAreaConsumerModule } from '../consumer/consumer.module';
import { FeatureReservedAreaPaymentDetailsModule } from '../payment-details/payment-details.module';
import { FeatureReservedAreaPersonalInfoModule } from '../personal-info/personal-info.module';
import { FeatureReservedAreaCouponCreateModule } from './coupon-create/coupon-create.module';
import { FeatureReservedAreaCouponEditModule } from './coupon-edit/coupon-edit.module';
import { FeatureReservedAreaCouponListModule } from './coupon-list/coupon-list.module';
import { CouponOfflineModule } from './coupon-offline-details/coupon-offline-details.module';
import { FeatureReservedAreaCouponOfflineModule } from './coupon-offline/coupon-offline.module';
import { FeatureReservedAreaProducerComponent } from './producer.component';
import { ProducerRoutingModule } from './producer.routing';
import { FeatureReservedAreaProducerCouponReportComponent } from './report/coupon-report.component';

@NgModule({
  declarations: [
    FeatureReservedAreaProducerComponent,
    FeatureReservedAreaProducerCouponReportComponent
  ],
  imports: [
    SharedModule,
    CoreModule,
    AppFooterModule,
    ProducerRoutingModule,
    FeatureReservedAreaConsumerModule,
    FeatureReservedAreaCouponListModule,
    FeatureReservedAreaCouponCreateModule,
    FeatureReservedAreaCouponOfflineModule,
    CouponOfflineModule,
    FeatureReservedAreaCouponEditModule,
    FeatureReservedAreaPaymentDetailsModule,
    FeatureReservedAreaPersonalInfoModule,
    CommonModule,
    ReactiveFormsModule,
    FileUploadModule,
    Ng2GoogleChartsModule

  ],
  providers: [
    CouponService,
    ReportService
  ],
  exports: [
    FeatureReservedAreaProducerComponent
  ]
})

export class FeatureReservedAreaProducerModule {
}
