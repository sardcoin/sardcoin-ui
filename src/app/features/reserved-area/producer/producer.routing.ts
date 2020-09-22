import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CouponDetailsComponent } from '../consumer/coupon-details/coupon-details.component';
import { FeatureReservedAreaConsumerShowcaseComponent } from '../consumer/coupon-showcase/coupon-showcase.component';
import { PaymentDetailsComponent } from '../payment-details/payment-details.component';
import { PersonalInfoComponent } from '../personal-info/personal-info.component';
import { FeatureReservedAreaCouponCreateComponent } from './coupon-create/coupon-create.component';
import { CouponEditComponent } from './coupon-edit/coupon-edit.component';
import { FeatureReservedAreaCouponListComponent } from './coupon-list/coupon-list.component';
import { CouponOfflineDetailsComponent } from './coupon-offline-details/coupon-offline-details.component';
import { FeatureReservedAreaCouponOfflineComponent } from './coupon-offline/coupon-offline.component';
import { FeatureReservedAreaProducerCouponReportComponent } from './report/coupon-report.component';
import { CouponEditDescriptionComponent } from './coupon-edit-description/coupon-edit-description.component';

// App Components

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
        path: 'offline',
        component: FeatureReservedAreaCouponOfflineComponent
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
        path: 'edit-description',
        component: CouponEditDescriptionComponent
      },
      {
        path: 'showcase',
        component: FeatureReservedAreaConsumerShowcaseComponent
      },
      {
        path: 'details/:id',
        component: CouponDetailsComponent
      },
      {
        path: 'verify',
        redirectTo: 'verify',
        pathMatch: 'full'
      },
      {
        path: 'personal-info',
        component: PersonalInfoComponent
      },
      {
        path: 'payment-details',
        component: PaymentDetailsComponent
      },
      {
        path: 'offline-details',
        component: CouponOfflineDetailsComponent
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
