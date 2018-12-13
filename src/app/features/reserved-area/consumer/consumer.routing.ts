import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {FeatureReservedAreaConsumerShowcaseComponent} from './coupon-showcase/coupon-showcase.component';
import {FeatureReservedAreaConsumerBoughtComponent} from './coupon-bought/coupon-bought.component';
import {CouponDetailsComponent} from './coupon-details/coupon-details.component';
import {CartComponent} from './cart/cart.component';
import {CheckoutComponent} from './checkout/checkout.component';
import {CouponTokenComponent} from './coupon-token/coupon-token.component';
import {CouponBoughtDetailComponent} from './coupon-bought/coupon-bought-detail/coupon-bought-detail.component';
import {ProducerInfoComponent} from './producer-info/producer-info.component';
import {PersonalInfoComponent} from '../personal-info/personal-info.component';
import {IsAuthenticatedGuard} from '../../../shared/_guards/is-authenticated.guard';
import {PaymentDetailsComponent} from '../payment-details/payment-details.component';

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
        component: CartComponent
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
        path: 'personal-info',
        component: PersonalInfoComponent,
      },
      {
        path: 'payment-details',
        component: PaymentDetailsComponent,
      },
      {
        path: 'bought/bought-details',
        component: CouponBoughtDetailComponent
      },
      {
        path: 'producer-info',
        component: ProducerInfoComponent
      }

    ])
  ],
  exports: [RouterModule]
})
export class ConsumerRoutingModule {
}
