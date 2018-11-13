import {FeatureReservedAreaProducerCouponReportComponent} from '../producer/report/coupon-report.component';
import {FeatureReservedAreaCouponCreateComponent} from '../producer/coupon-create/coupon-create.component';
import {RouterModule} from '@angular/router';
import {CouponEditComponent} from '../producer/coupon-edit/coupon-edit.component';
import {FeatureReservedAreaCouponListComponent} from '../producer/coupon-list/coupon-list.component';
import {NgModule} from '@angular/core';
import {VerifierComponent} from './verifier.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        redirectTo: 'verifier',
        pathMatch: 'full'
      },
      {
        path: 'verifier',
        component: VerifierComponent
      },
    ])
  ],
  exports: [RouterModule]
})
export class VerifierRoutingModule {
}
