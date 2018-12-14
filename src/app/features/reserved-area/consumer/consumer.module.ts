import {NgModule} from '@angular/core';
import {SharedModule} from '../../../shared/shared.module';
import {CoreModule} from '../../../core/core.module';
import {CouponService} from '../../../shared/_services/coupon.service';
import {CommonModule} from '@angular/common';
import {FeatureReservedAreaConsumerComponent} from './consumer.component';
import {ConsumerRoutingModule} from './consumer.routing';
import {FeatureReservedAreaConsumerBoughtComponent} from './coupon-bought/coupon-bought.component';
import {CouponDetailsComponent} from './coupon-details/coupon-details.component';
import {FeatureReservedAreaConsumerShowcaseComponent} from './coupon-showcase/coupon-showcase.component';
import {CartComponent} from './cart/cart.component';
import {CheckoutComponent} from './checkout/checkout.component';
import {CouponTokenComponent} from './coupon-token/coupon-token.component';
import {CouponBoughtDetailComponent} from './coupon-bought/coupon-bought-detail/coupon-bought-detail.component';
import {QRCodeModule} from 'angularx-qrcode';
import {ProducerInfoComponent} from './producer-info/producer-info.component';
import {ZXingScannerModule} from '@zxing/ngx-scanner';
import {NgxPayPalModule} from 'ngx-paypal';
import {FeatureReservedAreaPaymentDetailsModule} from '../payment-details/payment-details.module';
import {FeatureReservedAreaPersonalInfoModule} from '../personal-info/personal-info.module';
import {CartActions} from './cart/redux-cart/cart.actions';

@NgModule({
  declarations: [
    FeatureReservedAreaConsumerComponent,
    FeatureReservedAreaConsumerBoughtComponent,
    CouponDetailsComponent,
    FeatureReservedAreaConsumerShowcaseComponent,
    CartComponent,
    CheckoutComponent,
    CouponTokenComponent,
    CouponBoughtDetailComponent,
    ProducerInfoComponent,
  ],
  imports: [
    SharedModule,
    CoreModule,
    ConsumerRoutingModule,
    FeatureReservedAreaPaymentDetailsModule,
    FeatureReservedAreaPersonalInfoModule,
    CommonModule,
    QRCodeModule,
    NgxPayPalModule,
    ZXingScannerModule.forRoot()
  ],
  providers: [
    CouponService,
    CartActions
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
