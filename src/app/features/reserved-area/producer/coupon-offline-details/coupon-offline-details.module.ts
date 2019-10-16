import { NgModule } from '@angular/core';
import { MatPaginatorIntl, MatPaginatorModule, MatSortModule, MatTableModule } from '@angular/material';
import { BsDropdownModule, ModalModule } from 'ngx-bootstrap';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BreadcrumbActions } from '../../../../core/breadcrumb/breadcrumb.actions';
import { SharedModule } from '../../../../shared/shared.module';
import { CouponOfflineDetailsComponent } from './coupon-offline-details.component';

@NgModule({
  declarations: [
      CouponOfflineDetailsComponent
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
      CouponOfflineDetailsComponent
  ],
  providers: [
    BsModalService,
    BreadcrumbActions
  ]
})
export class CouponOfflineModule {
}
