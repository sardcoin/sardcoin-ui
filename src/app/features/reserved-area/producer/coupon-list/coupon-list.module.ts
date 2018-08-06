import {NgModule} from "@angular/core";
import {FeatureReservedAreaCouponListComponent} from "./coupon-list.component";
import {BreadcrumbActions} from "../../../../core/breadcrumb/breadcrumb.actions";
import {SharedModule} from "../../../../shared/shared.module";

@NgModule({
  declarations: [
    FeatureReservedAreaCouponListComponent
  ],
  imports: [
    SharedModule
  ],
  exports: [
    FeatureReservedAreaCouponListComponent
  ],
  providers: [
    BreadcrumbActions
  ]
})
export class FeatureReservedAreaCouponListModule {}
