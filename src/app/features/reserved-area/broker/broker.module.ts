// Angular Modules
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatPaginatorModule, MatSortModule, MatTableModule } from '@angular/material';
import { NgSelectModule } from '@ng-select/ng-select';
import { FlatpickrModule } from 'angularx-flatpickr';
import { FileUploadModule } from 'ng2-file-upload';
import { Ng2FlatpickrModule } from 'ng2-flatpickr';
import { BsDropdownModule, BsModalService, ModalModule } from 'ngx-bootstrap';

// Internal Files
import { BreadcrumbActions } from '../../../core/breadcrumb/breadcrumb.actions';
import { CoreModule } from '../../../core/core.module';
import { CouponService } from '../../../shared/_services/coupon.service';
import { PackageService } from '../../../shared/_services/package.service';
import { StoreService } from '../../../shared/_services/store.service';
import { SharedModule } from '../../../shared/shared.module';
import { FeatureReservedAreaPaymentDetailsModule } from '../payment-details/payment-details.module';
import { FeatureReservedAreaPersonalInfoModule } from '../personal-info/personal-info.module';
import { FeatureReservedAreaBrokerComponent } from './broker.component';
import { BrokerRoutingModule } from './broker.routing';
import { FeatureReservedAreaPackageCreateComponent } from './package-create/package-create.component';
import { PackageEditComponent } from './package-edit/package-edit.component';
import { FeatureReservedAreaPackageListComponent } from './package-list/package-list.component';
import { FeatureReservedAreaBrokerPackageReportComponent } from './report/package-report.component';

@NgModule({
  declarations: [
    FeatureReservedAreaBrokerComponent,
    FeatureReservedAreaBrokerPackageReportComponent,
    FeatureReservedAreaPackageCreateComponent,
    FeatureReservedAreaPackageListComponent,
    PackageEditComponent
  ],
  imports: [
    CoreModule,
    CommonModule,
    SharedModule,
    BrokerRoutingModule,
    FileUploadModule,
    ReactiveFormsModule,
    Ng2FlatpickrModule,
    NgSelectModule,
    FormsModule,
    FlatpickrModule.forRoot(),
    BsDropdownModule.forRoot(),
    ModalModule.forRoot(),

    MatSortModule,
    MatTableModule,
    MatPaginatorModule,

    FeatureReservedAreaPaymentDetailsModule,
    FeatureReservedAreaPersonalInfoModule
  ],
  providers: [
    BreadcrumbActions,
    CouponService,
    BsModalService,
    StoreService,
    PackageService
  ],
  exports: [
    FeatureReservedAreaBrokerComponent
  ]
})

export class FeatureReservedAreaBrokerModule {
}
