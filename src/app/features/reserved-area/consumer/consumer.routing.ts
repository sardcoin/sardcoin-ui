import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {FeatureReservedAreaConsumerShowcaseComponent} from "./coupon-showcase/coupon-showcase.component";
import {FeatureReservedAreaProducerCouponReportComponent} from '../producer/report/coupon-report.component';
import {CouponDetailsComponent} from './coupon-details/coupon-details.component';

/** App Components **/


@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        redirectTo: 'showcase',
        pathMatch: 'full'
      },
      {
        path: 'showcase',
        component: FeatureReservedAreaConsumerShowcaseComponent
      },
      {
        path: 'details',
        component: CouponDetailsComponent
      }
    ])
  ],
  exports: [RouterModule]
})
export class ConsumerRoutingModule {
}
