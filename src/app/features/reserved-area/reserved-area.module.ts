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
import {BsModalService} from 'ngx-bootstrap/modal';
import {ModalModule} from 'ngx-bootstrap';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {BrowserModule} from '@angular/platform-browser';
import { VerifierComponent } from './verifier/verifier.component';
import {IsVerifierGuard} from '../../shared/_guards/is-verifier.guard';

@NgModule({
  declarations: [
    FeatureReservedAreaComponent,
    PersonalInfoComponent,
    PaymentDetailsComponent,
    VerifierComponent




  ],
  imports: [
    SharedModule,
    CoreModule,
    AppFooterModule,
    ReactiveFormsModule,
    FeatureReservedAreaRoutingModule,
    CommonModule,
    ModalModule.forRoot(),

  ],
  providers: [
    CouponService,
    IsProducerGuard,
    IsConsumerGuard,
    IsVerifierGuard,
    BreadcrumbActions,
    UserService,
    BsModalService,


  ],
  exports: [
    FeatureReservedAreaComponent,
    PersonalInfoComponent,
    PaymentDetailsComponent,
    VerifierComponent

  ]
})

export class FeatureReservedAreaModule { }
