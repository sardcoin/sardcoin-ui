import {NgModule} from '@angular/core';
import {SharedModule} from '../../../../shared/shared.module';
import {CoreModule} from '../../../../core/core.module';
import {CouponService} from '../../../../shared/_services/coupon.service';
import {CommonModule} from '@angular/common';
import {FeatureReservedAreaConsumerShowcaseComponent} from './coupon-showcase.component';
import {BsModalService, ModalModule} from 'ngx-bootstrap';

@NgModule({
  declarations: [
    FeatureReservedAreaConsumerShowcaseComponent
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
    FeatureReservedAreaConsumerShowcaseComponent
  ]
})

export class FeatureReservedAreaConsumerShowcaseModule {
}
