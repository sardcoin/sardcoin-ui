import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PaymentDetailsComponent } from '../payment-details/payment-details.component';
import { PersonalInfoComponent } from '../personal-info/personal-info.component';
import { FeatureReservedAreaPackageCreateComponent } from './package-create/package-create.component';
import { PackageEditComponent } from './package-edit/package-edit.component';
import { FeatureReservedAreaPackageListComponent } from './package-list/package-list.component';
import { FeatureReservedAreaBrokerPackageReportComponent } from './report/package-report.component';

// App Components

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: FeatureReservedAreaPackageListComponent
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
        component: PersonalInfoComponent
      },
      // {
      //   path: 'payment-details',
      //   component: PaymentDetailsComponent
      // },
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
