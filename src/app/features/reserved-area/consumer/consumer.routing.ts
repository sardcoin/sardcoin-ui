import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {FeatureReservedAreaConsumerShowcaseComponent} from './coupon-showcase/coupon-showcase.component';
import {FeatureReservedAreaConsumerBoughtComponent} from './coupon-bought/coupon-bought.component';
import {CouponDetailsComponent} from './coupon-details/coupon-details.component';
import {CartShowComponent} from './cart/cart-show/cart-show.component';
import {CheckoutComponent} from './checkout/checkout.component';
import {CouponTokenComponent} from './coupon-token/coupon-token.component';
import {CouponBoughtDetailComponent} from './coupon-bought/coupon-bought-detail/coupon-bought-detail.component';
import {ProducerInfoCouponComponent} from './producer-info-coupon/producer-info-coupon.component';

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
        path: 'checkout',
        component: CheckoutComponent
      },
      {
        path: 'coupon-token',
        component: CouponTokenComponent
      },

      {
        path: 'bought/bought-details',
        component: CouponBoughtDetailComponent
      },
      {
        path: 'producer-info-coupon',
        component: ProducerInfoCouponComponent
      }

    ])
  ],
  exports: [RouterModule]
})
export class ConsumerRoutingModule {
}
