import {NgModule} from '@angular/core';
import {FeatureReservedAreaCouponCreateComponent} from './coupon-create.component';
import {ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {StoreService} from "../../../../shared/_services/store.service";
import {FileUploadModule} from "ng2-file-upload";
import {FeatureReservedAreaProducerModule} from '../producer.module';

@NgModule({
  declarations: [
    FeatureReservedAreaCouponCreateComponent,
  ],
  imports: [
    CommonModule,
    FileUploadModule,
    ReactiveFormsModule,
  ],
  exports: [
    FeatureReservedAreaCouponCreateComponent
  ],
  providers: [
    StoreService
  ]
})
export class FeatureReservedAreaCouponCreateModule {}
