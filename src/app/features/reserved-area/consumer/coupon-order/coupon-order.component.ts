import {Component, OnDestroy, OnInit} from '@angular/core';
import {Breadcrumb} from '../../../../core/breadcrumb/Breadcrumb';
import {CouponService} from '../../../../shared/_services/coupon.service';
import {BreadcrumbActions} from '../../../../core/breadcrumb/breadcrumb.actions';
import {environment} from '../../../../../environments/environment';
import {DomSanitizer} from '@angular/platform-browser';
import {Router} from '@angular/router';
import {Coupon} from '../../../../shared/_models/Coupon';
import {CouponToken} from '../../../../shared/_models/CouponToken';
import {GlobalEventsManagerService} from '../../../../shared/_services/global-event-manager.service';
import {OrderService} from '../../../../shared/_services/order.service';

@Component({
  selector: 'app-feature-reserved-area-consumer-order',
  templateUrl: './coupon-order.component.html',
  styleUrls: ['./coupon-order.component.css']
})

export class FeatureReservedAreaConsumerOrderComponent implements OnInit, OnDestroy {

  orders: any;
  ordersFull: any = [];
    orderDetail: any = {order: '', price: '', purchase_time: ''};

  isDesktop: boolean;
  done = false;
  constructor(
    private couponService: CouponService,
    private breadcrumbActions: BreadcrumbActions,
    private orderService: OrderService,
    private _sanitizer: DomSanitizer,
    private router: Router,
    private globalEventService: GlobalEventsManagerService,

  ) {
  }

  ngOnInit(): void {
    this.globalEventService.desktopMode.subscribe(message => this.isDesktop = message);
    this.addBreadcrumb();
    this.loadOrders();
  }

  ngOnDestroy(): void {
    this.removeBreadcrumb();
  }

  addBreadcrumb() {
    const bread = [] as Breadcrumb[];

    bread.push(new Breadcrumb('Home', '/reserved-area/consumer/'));
    bread.push(new Breadcrumb('I miei ordini', '/reserved-area/consumer/order'));

    this.breadcrumbActions.updateBreadcrumb(bread);
  }

  removeBreadcrumb() {
    this.breadcrumbActions.deleteBreadcrumb();
  }

  loadOrders() {
    this.orderService.getOrdersByConsumer()
      .subscribe(orders => {
        this.orders = orders;
        for (const order of this.orders) {
          this.orderService.getOrderById(order.id).subscribe(
            orderDetail => {
              for (const ord of orderDetail.OrderCoupon) {
                let price = 0;
                for ( let qty = 0; qty < Number(ord.quantity); qty++) {
                  console.log('ord.quantity', ord.quantity)
                  price += Number(ord.price) ? Number(ord.price) : 0;
                  console.log('orderDetail.price', ord.price)

                }
                console.log('price', price)

                this.orderDetail.order = orderDetail;
                this.orderDetail.price = price;
                this.orderDetail.purchase_time = order.purchase_time;

              }
              this.ordersFull.push(this.orderDetail);

            }
          );

        }
        this.done = true;
        console.log('ordersFull', this.ordersFull);

      }, err => {
        console.log(err);
      });
  }

  imageUrl(path) {
    return this._sanitizer.bypassSecurityTrustUrl(environment.protocol + '://' + environment.host + ':' + environment.port + '/' + path);
  }

  formatPrice(price) {
    if (price === 0) {
      return 'Gratis';
    }
    return '€ ' + price.toFixed(2);
  }

  formatState(state) {
    if (state !== null) {
      return 'Consumato';
    } else {
      return 'Riscattabile';
    }
  }

  details(coupon: Coupon, token: CouponToken) {

    const cp = coupon;
    cp.quantity = 0;
    cp.token = token;

    this.couponService.setCoupon(coupon);

    this.router.navigate(['/reserved-area/consumer/order/details']);
  }
}
