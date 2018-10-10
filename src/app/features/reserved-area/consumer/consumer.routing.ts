import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {FeatureReservedAreaConsumerShowcaseComponent} from './coupon-showcase/coupon-showcase.component';
import {FeatureReservedAreaConsumerBoughtComponent} from './coupon-bought/coupon-bought.component';
import {CouponDetailsComponent} from './coupon-details/coupon-details.component';
import {CartShowComponent} from './cart/cart-show/cart-show.component';
import {PaymentConfirmComponent} from './payment-confirm/payment-confirm.component';
import {CouponTokenComponent} from './coupon-token/coupon-token.component';

/** App Components **/


@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        redirectTo: 'showcase',
        pathMatch: 'full'
      },
      {
        path: 'showcase',
        component: FeatureReservedAreaConsumerShowcaseComponent
      },
      {
        path: 'bought',
        component: FeatureReservedAreaConsumerBoughtComponent
      },
      {
        path: 'details',
        component: CouponDetailsComponent
      },
      {
        path: 'cart',
        component: CartShowComponent
      },
      {
        path: 'cart-detail-payment',
        component: PaymentConfirmComponent
      },
      {
        path: 'coupon-token',
        component: CouponTokenComponent
      }

    ])
  ],
  exports: [RouterModule]
})
export class ConsumerRoutingModule {
}
