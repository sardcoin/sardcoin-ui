import { NgModule } from '@angular/core';
import { MatPaginatorIntl, MatPaginatorModule, MatSortModule, MatTableModule } from '@angular/material';
import { BsDropdownModule, ModalModule } from 'ngx-bootstrap';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BreadcrumbActions } from '../../../../core/breadcrumb/breadcrumb.actions';
import { SharedModule } from '../../../../shared/shared.module';
import {FeatureReservedAreaCouponOfflineComponent} from './coupon-offline.component';

@NgModule({
  declarations: [
    FeatureReservedAreaCouponOfflineComponent
  ],
  imports: [
    SharedModule,
    MatSortModule,
    MatTableModule,
    MatPaginatorModule,
    ModalModule.forRoot(),
    BsDropdownModule.forRoot()
  ],
  exports: [
    FeatureReservedAreaCouponOfflineComponent
  ],
  providers: [
    BsModalService,
    BreadcrumbActions
  ]
})
export class FeatureReservedAreaCouponOfflineModule {
}
