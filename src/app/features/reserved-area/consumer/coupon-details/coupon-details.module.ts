import {NgModule} from '@angular/core';
import {SharedModule} from '../../../../shared/shared.module';
import {CoreModule} from '../../../../core/core.module';
import {CouponService} from '../../../../shared/_services/coupon.service';
import {CommonModule} from '@angular/common';
import {BsModalService, ModalModule} from 'ngx-bootstrap';
import {CouponDetailsComponent} from './coupon-details.component';

@NgModule({
  declarations: [
    CouponDetailsComponent
  ],
  imports: [
    SharedModule,
    CoreModule,
    CommonModule,
    ModalModule.forRoot()
  ],
  providers: [
    CouponService,
    BsModalService
  ],
  exports: [
    CouponDetailsComponent
  ]
})

export class CouponDetailsComponentModule {
}
