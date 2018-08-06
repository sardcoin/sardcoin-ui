import {NgModule} from '@angular/core';
import {FeatureReservedAreaCouponCreateComponent} from './coupon-create.component';
import {ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {StoreService} from "../../../../shared/_services/store.service";
import {FileUploadModule} from "ng2-file-upload";

@NgModule({
  declarations: [
    FeatureReservedAreaCouponCreateComponent,
  ],
  imports: [
    ReactiveFormsModule,
    CommonModule,
    FileUploadModule
  ],
  exports: [
    FeatureReservedAreaCouponCreateComponent
  ],
  providers: [
    StoreService
  ]
})
export class FeatureReservedAreaCouponCreateModule {}
