import {FeatureReservedAreaProducerCouponReportComponent} from '../producer/report/coupon-report.component';
import {ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {CoreModule} from '../../../core/core.module';
import {SharedModule} from '../../../shared/shared.module';
import {FeatureReservedAreaProducerComponent} from '../producer/producer.component';
import {FileUploadModule} from 'ng2-file-upload';
import {AppFooterModule} from '@coreui/angular';
import {FeatureReservedAreaCouponEditModule} from '../producer/coupon-edit/coupon-edit.module';
import {FeatureReservedAreaCouponListModule} from '../producer/coupon-list/coupon-list.module';
import {CouponService} from '../../../shared/_services/coupon.service';
import {ProducerRoutingModule} from '../producer/producer.routing';
import {FeatureReservedAreaCouponCreateModule} from '../producer/coupon-create/coupon-create.module';
import {NgModule} from '@angular/core';
import {VerifierComponent} from './verifier.component';
import {VerifierRoutingModule} from './verifier.routing';

@NgModule({
  declarations: [
    VerifierComponent




  ],
  imports: [
    SharedModule,
    CoreModule,
    AppFooterModule,
    VerifierRoutingModule,
    CommonModule,
    ReactiveFormsModule,

  ],
  providers: [
    CouponService,
  ],


  exports: [
    VerifierComponent
  ]
})

export class VerifierModule {
}
