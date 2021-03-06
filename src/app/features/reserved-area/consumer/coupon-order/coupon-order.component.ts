import { Component, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';

import * as _ from 'lodash';

import { environment } from '../../../../../environments/environment';
import { Breadcrumb } from '../../../../core/breadcrumb/Breadcrumb';
import { BreadcrumbActions } from '../../../../core/breadcrumb/breadcrumb.actions';
import { ITEM_TYPE } from '../../../../shared/_models/CartItem';
import { Coupon } from '../../../../shared/_models/Coupon';
import { Order } from '../../../../shared/_models/Order';
import { CouponService } from '../../../../shared/_services/coupon.service';
import { GlobalEventsManagerService } from '../../../../shared/_services/global-event-manager.service';
import { OrderService } from '../../../../shared/_services/order.service';
import { UserService } from '../../../../shared/_services/user.service';

@Component({
  selector: 'app-feature-reserved-area-consumer-order',
  templateUrl: './coupon-order.component.html',
  styleUrls: ['./coupon-order.component.scss']
})

export class FeatureReservedAreaConsumerOrderComponent implements OnInit, OnDestroy { // TODO complete with packages and redeem button

  orders: Array<Order>;
  isDesktop: boolean;
  ITEM_TYPE = ITEM_TYPE;

  constructor(
    private couponService: CouponService,
    private breadcrumbActions: BreadcrumbActions,
    private orderService: OrderService,
    private _sanitizer: DomSanitizer,
    private userService: UserService,
    private router: Router,
    private globalEventService: GlobalEventsManagerService
  ) {
  }

  async ngOnInit() {
    this.globalEventService.desktopMode.subscribe(message => this.isDesktop = message);
    this.addBreadcrumb();
    await this.loadOrders();
  }

  ngOnDestroy(): void {
    this.removeBreadcrumb();
  }

  async loadOrders() {
    let orderDetail: Order;
    let couponAux: Coupon;
    let coupons;
    let verifier;
    let token, type;
    try {
      this.orders = await this.orderService.getOrdersByConsumer().toPromise();
      for (const order of this.orders) {
        orderDetail = await this.orderService.getOrderById(order.id).toPromise();

        order.total = 0;
        order.coupons = [];

        // Raggruppo i token per coupon_id
        coupons = _.groupBy(orderDetail.OrderCoupon, 'coupon_id');

        for (const coupon_id of Object.keys(coupons)) {
          token = coupons[coupon_id][0].coupon_token || coupons[coupon_id][0].package_token;
          verifier = coupons[coupon_id][0].verifier;
          type = coupons[coupon_id][0].coupon_token ? ITEM_TYPE.COUPON : ITEM_TYPE.PACKAGE;

          couponAux = await this.couponService.getCouponByToken(token, type).toPromise();
          couponAux.quantity = coupons[coupon_id].length;

          couponAux.token = coupons[coupon_id][0].coupon_token || coupons[coupon_id][0].package_token;

          couponAux.title = couponAux.title.length > 50 ? couponAux.title.slice(0, 50) + '...' : couponAux.title;

          order.total += coupons[coupon_id].length * coupons[coupon_id][0].price;
          order.coupons.push(couponAux);
        }
      }

    } catch (e) {
      console.error(e);
    }
  }

  imageUrl(path) {
    return this._sanitizer.bypassSecurityTrustUrl(environment.protocol + '://' + environment.host + ':' + environment.port + '/' + path);
  }

  formatPrice(price) {
    return price === 0 ? 'Gratis' : '€ ' + price.toFixed(2);
  }

  formatDate(inputDate) {
    const auxDate = inputDate.slice(0, 10).split('-');
    const date = auxDate[2] + ' ' + (new Date(inputDate)).toLocaleString('it', {month: 'long'}) + ' ' + auxDate[0];

    return date; // + ' ' + time;
  }

  details(coupon: Coupon) {
    this.router.navigate([this.couponService.getCouponDetailsURL(coupon)]);
  }

  redeem(coupon: Coupon) { // TODO check if is the coupon still valid
    const cp = coupon;
    cp.quantity = 0;

    this.couponService.setCoupon(coupon);

    this.router.navigate(['/bought/details']);
  }

  addBreadcrumb() {
    const bread = [] as Array<Breadcrumb>;

    bread.push(new Breadcrumb('Home', '/'));
    bread.push(new Breadcrumb('I miei ordini', '/order'));

    this.breadcrumbActions.updateBreadcrumb(bread);
  }

  removeBreadcrumb() {
    this.breadcrumbActions.deleteBreadcrumb();
  }

}
