import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {CouponEditComponent} from './coupon-edit.component';
import {SharedModule} from "../../../../shared/shared.module";
import {BreadcrumbActions} from "../../../../core/breadcrumb/breadcrumb.actions";
import {FileUploadModule} from 'ng2-file-upload';
import {StoreService} from '../../../../shared/_services/store.service';
import {CommonModule} from '@angular/common';
@NgModule({
  declarations: [
  ],
  imports: [
    ReactiveFormsModule,
    SharedModule,
    CommonModule,
    FileUploadModule,
  ],
  exports: [
  ],
  providers: [
    BreadcrumbActions,
    StoreService
  ]
})
export class FeatureReservedAreaCouponEditModule {}
