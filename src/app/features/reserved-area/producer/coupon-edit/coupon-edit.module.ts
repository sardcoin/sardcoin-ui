import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {CouponEditComponent} from './coupon-edit.component';
import {SharedModule} from "../../../../shared/shared.module";
import {BreadcrumbActions} from "../../../../core/breadcrumb/breadcrumb.actions";
@NgModule({
  declarations: [
    CouponEditComponent,
  ],
  imports: [
    ReactiveFormsModule,
    SharedModule,
  ],
  exports: [
    CouponEditComponent
  ],
  providers: [
    BreadcrumbActions
  ]
})
export class FeatureReservedAreaCouponEditModule {}
