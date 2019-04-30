/** Angular Modules **/
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
/** Internal Files **/
import {SharedModule} from '../../../shared/shared.module';
import {CoreModule} from '../../../core/core.module';
import {CouponService} from '../../../shared/_services/coupon.service';
import {FeatureReservedAreaConsumerComponent} from './consumer.component';
import {ConsumerRoutingModule} from './consumer.routing';
import {FeatureReservedAreaConsumerBoughtComponent} from './coupon-bought/coupon-bought.component';
import {CouponDetailsComponent} from './coupon-details/coupon-details.component';
import {FeatureReservedAreaConsumerShowcaseComponent} from './coupon-showcase/coupon-showcase.component';
import {CartComponent} from './cart/cart.component';
import {CheckoutComponent} from './checkout/checkout.component';
import {CouponImportComponent} from './coupon-import/coupon-import.component';
import {CouponBoughtDetailComponent} from './coupon-bought/coupon-bought-detail/coupon-bought-detail.component';
import {ProducerInfoComponent} from './producer-info/producer-info.component';
import {FeatureReservedAreaPaymentDetailsModule} from '../payment-details/payment-details.module';
import {FeatureReservedAreaPersonalInfoModule} from '../personal-info/personal-info.module';
import {CartActions} from './cart/redux-cart/cart.actions';
import {CouponOrderDetailComponent} from './coupon-order/coupon-order-detail/coupon-order-detail.component';
import {FeatureReservedAreaConsumerOrderComponent} from './coupon-order/coupon-order.component';
/** External Libraries **/
import {QRCodeModule} from 'angularx-qrcode';
import {ZXingScannerModule} from '@zxing/ngx-scanner';
import {NgxLoadingModule} from 'ngx-loading';
import {PaypalService} from '../../../shared/_services/paypal.service';

@NgModule({
  declarations: [
    FeatureReservedAreaConsumerComponent,
    FeatureReservedAreaConsumerBoughtComponent,
    CouponDetailsComponent,
    FeatureReservedAreaConsumerShowcaseComponent,
    CartComponent,
    CheckoutComponent,
    CouponImportComponent,
    CouponBoughtDetailComponent,
    ProducerInfoComponent,
    FeatureReservedAreaConsumerOrderComponent,
    CouponOrderDetailComponent
  ],
  imports: [
    SharedModule,
    CoreModule,
    ConsumerRoutingModule,
    FeatureReservedAreaPaymentDetailsModule,
    FeatureReservedAreaPersonalInfoModule,
    CommonModule,
    QRCodeModule,
    NgxLoadingModule.forRoot({}),
    ZXingScannerModule.forRoot(),
  ],
  providers: [
    CouponService,
    CartActions,
    PaypalService
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
