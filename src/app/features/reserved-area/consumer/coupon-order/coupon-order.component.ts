import {Component, OnDestroy, OnInit} from '@angular/core';
import {Breadcrumb} from '../../../../core/breadcrumb/Breadcrumb';
import {CouponService} from '../../../../shared/_services/coupon.service';
import {BreadcrumbActions} from '../../../../core/breadcrumb/breadcrumb.actions';
import {DomSanitizer} from '@angular/platform-browser';
import {Router} from '@angular/router';
import {GlobalEventsManagerService} from '../../../../shared/_services/global-event-manager.service';
import {OrderService} from '../../../../shared/_services/order.service';
import {Order} from '../../../../shared/_models/Order';

@Component({
  selector: 'app-feature-reserved-area-consumer-order',
  templateUrl: './coupon-order.component.html',
  styleUrls: ['./coupon-order.component.css']
})

export class FeatureReservedAreaConsumerOrderComponent implements OnInit, OnDestroy {

  orders: any;
  isDesktop: boolean;

  constructor(
    private couponService: CouponService,
    private breadcrumbActions: BreadcrumbActions,
    private orderService: OrderService,
    private _sanitizer: DomSanitizer,
    private router: Router,
    private globalEventService: GlobalEventsManagerService,

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
    let orderDetail;
    try {
      this.orders = await this.orderService.getOrdersByConsumer().toPromise();

      for(const i in this.orders) {
        this.orders[i].total = 0;
        orderDetail = await this.orderService.getOrderById(this.orders[i]['id']).toPromise();

        for(const j in orderDetail['OrderCoupon']) {
          this.orders[i].total += orderDetail['OrderCoupon'][j].quantity * orderDetail['OrderCoupon'][j].price;
        }
      }
    } catch (e) {
      console.error(e);
    }
  }

  formatPrice(price) {
    if (price === 0) {
      return 'Gratis';
    }
    return '€ ' + price.toFixed(2);
  }

  formatDate(inputDate) {
    const auxDate = inputDate.slice(0, 10).split('-');
    const date = auxDate[2] + '/' + auxDate[1] + '/' + auxDate[0];
    const time = inputDate.toString().substring(inputDate.indexOf('T') + 1, inputDate.indexOf('.000'));
    return date + ' ' + time;
  }

  details(order: Order) {
    this.orderService.setOrder(order);
    this.router.navigate(['/reserved-area/consumer/order/myPurchases']);
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


}
