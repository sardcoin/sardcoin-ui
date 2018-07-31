import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {FeatureReservedAreaCouponListComponent} from './coupon-list/coupon-list.component';
import {FeatureReservedAreaCouponCreateComponent} from './coupon-create/coupon-create.component';
import {CouponEditComponent} from './coupon-edit/coupon-edit.component';

/** App Components **/


@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
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
      },
      {
        path: 'edit',
        component: CouponEditComponent
      }
    ])
  ],
  exports: [RouterModule]
})
export class FeatureReservedAreaRoutingModule {
}
