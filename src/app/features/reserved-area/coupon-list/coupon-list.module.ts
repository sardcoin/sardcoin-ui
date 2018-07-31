import {NgModule} from "@angular/core";
import {FeatureReservedAreaCouponListComponent} from "./coupon-list.component";
import {BreadcrumbActions} from "../../../core/breadcrumb/breadcrumb.actions";

@NgModule({
  declarations: [
    FeatureReservedAreaCouponListComponent
  ],
  imports: [
  ],
  exports: [
    FeatureReservedAreaCouponListComponent
  ],
  providers: [
    BreadcrumbActions
  ]
})
export class FeatureReservedAreaCouponListModule {}
