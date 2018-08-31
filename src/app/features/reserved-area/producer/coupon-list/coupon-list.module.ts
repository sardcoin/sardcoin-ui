import {NgModule} from "@angular/core";
import {FeatureReservedAreaCouponListComponent} from "./coupon-list.component";
import {BreadcrumbActions} from "../../../../core/breadcrumb/breadcrumb.actions";
import {SharedModule} from "../../../../shared/shared.module";
import {BsModalService} from 'ngx-bootstrap/modal';
import { ModalModule } from 'ngx-bootstrap';

import {ModalBackdropComponent} from 'ngx-bootstrap';

@NgModule({
  declarations: [
    FeatureReservedAreaCouponListComponent,
  ],
  imports: [
    SharedModule,
    ModalModule.forRoot()
  ],
  exports: [
    FeatureReservedAreaCouponListComponent,
  ],
  providers: [
    BreadcrumbActions,
    BsModalService
  ]
})
export class FeatureReservedAreaCouponListModule {}
