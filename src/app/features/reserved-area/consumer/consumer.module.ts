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
import {OrderService} from '../../../shared/_services/order.service';
import {CouponDetailIntoOrderComponent} from './coupon-order/coupon-order-detail/coupon-detail-into-order/coupon-detail-into-order.component';
import {PaypalService} from '../../../shared/_services/paypal.service';
import {GlobalEventsManagerService} from '../../../shared/_services/global-event-manager.service';
import {FilterActions} from './coupon-showcase/redux-filter/filter.actions';
import {IsAuthenticatedGuard} from '../../../shared/_guards/is-authenticated.guard';

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
    CouponOrderDetailComponent,
    CouponDetailIntoOrderComponent
  ],
  imports: [
    SharedModule,
    CoreModule,
    ConsumerRoutingModule,
    FeatureReservedAreaPaymentDetailsModule,
    FeatureReservedAreaPersonalInfoModule,
    CommonModule,
    QRCodeModule,
    ZXingScannerModule.forRoot(),
  ],
  providers: [
    IsAuthenticatedGuard,
    GlobalEventsManagerService,
    CouponService,
    CartActions,
    FilterActions,
    PaypalService,
    OrderService
  ],
  exports: [
    CouponDetailsComponent,
    FeatureReservedAreaConsumerComponent,
    FeatureReservedAreaConsumerBoughtComponent,
    FeatureReservedAreaConsumerShowcaseComponent
  ]
})

export class FeatureReservedAreaConsumerModule {
}
