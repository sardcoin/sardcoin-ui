import { NgModule } from '@angular/core';
import { MatPaginatorIntl, MatPaginatorModule, MatSortModule, MatTableModule } from '@angular/material';
import { BsDropdownModule, ModalModule } from 'ngx-bootstrap';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BreadcrumbActions } from '../../../../core/breadcrumb/breadcrumb.actions';
import { SharedModule } from '../../../../shared/shared.module';
import { FeatureReservedAreaCouponListComponent } from './coupon-list.component';

@NgModule({
  declarations: [
    FeatureReservedAreaCouponListComponent
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
    FeatureReservedAreaCouponListComponent
  ],
  providers: [
    BsModalService,
    BreadcrumbActions
  ]
})
export class FeatureReservedAreaCouponListModule {
}
