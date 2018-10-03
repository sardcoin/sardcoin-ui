import {NgModule} from '@angular/core';
import {AppFooterModule} from '@coreui/angular';
import {SharedModule} from '../../shared/shared.module';
import {CoreModule} from '../../core/core.module';
import {FeatureReservedAreaComponent} from './reserved-area.component';
import {FeatureReservedAreaRoutingModule} from './reserved-area.routing';
import {CouponService} from '../../shared/_services/coupon.service';
import {CommonModule} from '@angular/common';
import {IsProducerGuard} from "../../shared/_guards/is-producer.guard";
import {IsConsumerGuard} from "../../shared/_guards/is-consumer.guard";
import { PersonalInfoComponent } from './personal-info/personal-info.component';
import {UserService} from '../../shared/_services/user.service';
import {BreadcrumbActions} from '../../core/breadcrumb/breadcrumb.actions';
import { PaymentDetailsComponent } from './payment-details/payment-details.component';

@NgModule({
  declarations: [
    FeatureReservedAreaComponent,
    PersonalInfoComponent,
    PaymentDetailsComponent




  ],
  imports: [
    SharedModule,
    CoreModule,
    AppFooterModule,
    FeatureReservedAreaRoutingModule,
    CommonModule,

  ],
  providers: [
    CouponService,
    IsProducerGuard,
    IsConsumerGuard,
    BreadcrumbActions,
    UserService,

  ],
  exports: [
    FeatureReservedAreaComponent,
    PersonalInfoComponent

  ]
})

export class FeatureReservedAreaModule { }
