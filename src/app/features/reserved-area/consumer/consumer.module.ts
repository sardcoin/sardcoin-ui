// Angular Modules
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ZXingScannerModule } from '@zxing/ngx-scanner';

// External Libraries
import { QRCodeModule } from 'angularx-qrcode';
import { NgxPayPalModule } from 'ngx-paypal';
import { CoreModule } from '../../../core/core.module';
import { IsAuthenticatedGuard } from '../../../shared/_guards/is-authenticated.guard';
import { CouponService } from '../../../shared/_services/coupon.service';
import { OrderService } from '../../../shared/_services/order.service';
import { PackageService } from '../../../shared/_services/package.service';
import { PaypalService } from '../../../shared/_services/paypal.service';
import { UserService } from '../../../shared/_services/user.service';

// Internal Files
import { SharedModule } from '../../../shared/shared.module';
import { FeatureReservedAreaPaymentDetailsModule } from '../payment-details/payment-details.module';
import { FeatureReservedAreaPersonalInfoModule } from '../personal-info/personal-info.module';
import { CartComponent } from './cart/cart.component';
import { CartActions } from './cart/redux-cart/cart.actions';
import { CheckoutComponent } from './checkout/checkout.component';
import { FeatureReservedAreaConsumerComponent } from './consumer.component';
import { ConsumerRoutingModule } from './consumer.routing';
import { CouponBoughtDetailComponent } from './coupon-bought/coupon-bought-detail/coupon-bought-detail.component';
import { FeatureReservedAreaConsumerBoughtComponent } from './coupon-bought/coupon-bought.component';
import { CouponDetailsComponent } from './coupon-details/coupon-details.component';
import { CouponImportComponent } from './coupon-import/coupon-import.component';
import { FeatureReservedAreaConsumerOrderComponent } from './coupon-order/coupon-order.component';
import { FeatureReservedAreaConsumerShowcaseComponent } from './coupon-showcase/coupon-showcase.component';
import { FilterActions } from './coupon-showcase/redux-filter/filter.actions';
import { ProducerInfoComponent } from './producer-info/producer-info.component';

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
  ],
  imports: [
    SharedModule,
    NgxPayPalModule,
    CoreModule,
    ConsumerRoutingModule,
    FeatureReservedAreaPaymentDetailsModule,
    FeatureReservedAreaPersonalInfoModule,
    CommonModule,
    QRCodeModule,
    ZXingScannerModule.forRoot()
  ],
  providers: [
    IsAuthenticatedGuard,
    CouponService,
    CartActions,
    UserService,
    FilterActions,
    PaypalService,
    OrderService,
    PackageService
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
