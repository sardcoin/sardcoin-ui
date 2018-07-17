import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {FeatureReservedAreaCouponListComponent} from "./coupon-list/coupon-list.component";
import {FeatureReservedAreaCouponCreateComponent} from "./coupon-create/coupon-create.component";

/** App Components **/


@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        // component: FeatureReservedAreaComponent
        redirectTo: 'list',
        pathMatch: 'full'
      },
      {
        path: 'list',
        component: FeatureReservedAreaCouponListComponent
      },
      {
        path: 'create',
        component: FeatureReservedAreaCouponCreateComponent
      }
    ])
  ],
  exports: [RouterModule]
})
export class FeatureReservedAreaRoutingModule {
}
