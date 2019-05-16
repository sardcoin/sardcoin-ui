import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {FeatureReservedAreaCouponListComponent} from './coupon-list/coupon-list.component';
import {FeatureReservedAreaCouponCreateComponent} from './coupon-create/coupon-create.component';
import {CouponEditComponent} from './coupon-edit/coupon-edit.component';
import {FeatureReservedAreaProducerCouponReportComponent} from './report/coupon-report.component';
import {PersonalInfoComponent} from '../personal-info/personal-info.component';
import {PaymentDetailsComponent} from '../payment-details/payment-details.component';
import {FeatureReservedAreaConsumerShowcaseComponent} from '../consumer/coupon-showcase/coupon-showcase.component';

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
        path: 'showcase',
        component: FeatureReservedAreaConsumerShowcaseComponent
      },
      {
        path: 'verify',
        redirectTo: 'verify',
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
      },
      {
        path: 'personal-info',
        component: PersonalInfoComponent,
      },
      {
        path: 'payment-myPurchases',
        component: PaymentDetailsComponent,
      },
      {
        path: 'report',
        component: FeatureReservedAreaProducerCouponReportComponent
      }
    ])
  ],
  exports: [RouterModule]
})
export class ProducerRoutingModule {
}
