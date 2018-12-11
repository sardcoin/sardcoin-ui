import {NgModule} from '@angular/core';
import {SharedModule} from '../../../shared/shared.module';
import {CoreModule} from '../../../core/core.module';
import {CouponService} from '../../../shared/_services/coupon.service';
import {CommonModule} from '@angular/common';
import {FeatureReservedAreaConsumerComponent} from './consumer.component';
import {ConsumerRoutingModule} from './consumer.routing';
import {BreadcrumbActions} from '../../../core/breadcrumb/breadcrumb.actions';
import {BsModalService} from 'ngx-bootstrap/modal';
import {ModalModule} from 'ngx-bootstrap';
import {FeatureReservedAreaConsumerBoughtComponent} from './coupon-bought/coupon-bought.component';
import {CouponDetailsComponent} from './coupon-details/coupon-details.component';
import {FeatureReservedAreaConsumerShowcaseComponent} from './coupon-showcase/coupon-showcase.component';
import {LocalStorage} from '@ngx-pwa/local-storage';
import { CartShowComponent } from './cart/cart-show/cart-show.component';
import { PaymentConfirmComponent } from './payment-confirm/payment-confirm.component';
import {UserService} from '../../../shared/_services/user.service';
import { CouponTokenComponent } from './coupon-token/coupon-token.component';
import { CouponBoughtDetailComponent } from './coupon-bought/coupon-bought-detail/coupon-bought-detail.component';
import {QRCodeModule} from 'angularx-qrcode';
import { ProducerInfoCouponComponent } from './producer-info-coupon/producer-info-coupon.component';
import {ZXingScannerModule} from '@zxing/ngx-scanner';
import { NgxPayPalModule } from 'ngx-paypal';

@NgModule({
  declarations: [
    FeatureReservedAreaConsumerComponent,
    FeatureReservedAreaConsumerBoughtComponent,
    CouponDetailsComponent,
    FeatureReservedAreaConsumerShowcaseComponent,
    CartShowComponent,
    PaymentConfirmComponent,
    CouponTokenComponent,
    CouponBoughtDetailComponent,
    ProducerInfoCouponComponent,

  ],
  imports: [
    SharedModule,
    CoreModule,
    ConsumerRoutingModule,
    CommonModule,
    QRCodeModule,
    NgxPayPalModule,
    ZXingScannerModule.forRoot()
  ],
  providers: [
    CouponService,

  ],
  exports: [
    FeatureReservedAreaConsumerComponent,
    FeatureReservedAreaConsumerBoughtComponent,
    CouponDetailsComponent,
    FeatureReservedAreaConsumerShowcaseComponent
  ]
})

export class FeatureReservedAreaConsumerModule {
}
