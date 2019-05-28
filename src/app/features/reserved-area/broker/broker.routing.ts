import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {FeatureReservedAreaBrokerComponent} from './broker.component';
import {PersonalInfoComponent} from '../personal-info/personal-info.component';
import {PaymentDetailsComponent} from '../payment-details/payment-details.component';
import {FeatureReservedAreaProducerCouponReportComponent} from '../producer/report/coupon-report.component';
import {FeatureReservedAreaCouponListComponent} from '../producer/coupon-list/coupon-list.component';
import {FeatureReservedAreaCouponCreateComponent} from '../producer/coupon-create/coupon-create.component';
import {FeatureReservedAreaPackageListComponent} from './package-list/package-list.component';
import {FeatureReservedAreaPackageCreateComponent} from './package-create/package-create.component';
import {FeatureReservedAreaBrokerPackageReportComponent} from './report/package-report.component';
import {PackageEditComponent} from './package-edit/package-edit.component';


/** App Components **/


@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: FeatureReservedAreaBrokerComponent
      },
      {
        path: 'verify',
        redirectTo: 'verify',
        pathMatch: 'full'
      },
      {
        path: 'list',
        component: FeatureReservedAreaPackageListComponent
      },
      {
        path: 'create',
        component: FeatureReservedAreaPackageCreateComponent
      },

      {
        path: 'personal-info',
        component: PersonalInfoComponent,
      },
      {
        path: 'payment-details',
        component: PaymentDetailsComponent,
      },
      {
        path: 'report',
        component: FeatureReservedAreaBrokerPackageReportComponent
      },
      {
        path: 'edit',
        component: PackageEditComponent
      }
    ])
  ],
  exports: [RouterModule]
})
export class BrokerRoutingModule {
}
