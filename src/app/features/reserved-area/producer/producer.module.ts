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
import {FeatureReservedAreaConsumerModule} from '../consumer/consumer.module';
import { Ng2GoogleChartsModule } from 'ng2-google-charts';
import {ReportService} from '../../../shared/_services/report.service';
import {FeatureReservedAreaCouponOfflineModule} from './coupon-offline/coupon-offline.module';

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
