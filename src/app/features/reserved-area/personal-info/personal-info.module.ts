import {NgModule} from '@angular/core';
import {SharedModule} from '../../../shared/shared.module';
import {CoreModule} from '../../../core/core.module';
import {CommonModule} from '@angular/common';
import {CouponService} from '../../../shared/_services/coupon.service';
import {PersonalInfoComponent} from './personal-info.component';
import {UserService} from '../../../shared/_services/user.service';

@NgModule({
  declarations: [
    PersonalInfoComponent
  ],
  imports: [
    SharedModule,
    CoreModule,
    CommonModule,
  ],
  providers: [
    CouponService,
    UserService
  ],
  exports: [
    PersonalInfoComponent
  ]
})

export class FeatureReservedAreaPersonalInfoModule {}
