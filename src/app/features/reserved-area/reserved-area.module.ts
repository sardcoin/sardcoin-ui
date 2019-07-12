import {NgModule} from '@angular/core';
import {AppFooterModule} from '@coreui/angular';
import {SharedModule} from '../../shared/shared.module';
import {CoreModule} from '../../core/core.module';
import {FeatureReservedAreaComponent} from './reserved-area.component';
import {FeatureReservedAreaRoutingModule} from './reserved-area.routing';
import {CouponService} from '../../shared/_services/coupon.service';
import {CommonModule} from '@angular/common';
import {IsProducerGuard} from '../../shared/_guards/is-producer.guard';
import {IsConsumerGuard} from '../../shared/_guards/is-consumer.guard';
import {UserService} from '../../shared/_services/user.service';
import {BreadcrumbActions} from '../../core/breadcrumb/breadcrumb.actions';
import {BsModalService} from 'ngx-bootstrap/modal';
import {ModalModule} from 'ngx-bootstrap';
import {ReactiveFormsModule} from '@angular/forms';
import {IsVerifierGuard} from '../../shared/_guards/is-verifier.guard';
import {IsBrokerGuard} from '../../shared/_guards/is-broker.guard';
import {FeatureReservedAreaProducerCouponReportModule} from './producer/report/coupon-report.module';

@NgModule({
  declarations: [
    FeatureReservedAreaComponent,
  ],
  imports: [
    SharedModule,
    CoreModule,
    AppFooterModule,
    ReactiveFormsModule,
    FeatureReservedAreaRoutingModule,
    CommonModule,
    FeatureReservedAreaProducerCouponReportModule,
    ModalModule.forRoot(),
  ],
  providers: [
    CouponService,
    IsProducerGuard,
    IsConsumerGuard,
    IsVerifierGuard,
    IsBrokerGuard,
    BreadcrumbActions,
    UserService,
    BsModalService,
  ],
  exports: [
    FeatureReservedAreaComponent,
  ]
})

export class FeatureReservedAreaModule { }
