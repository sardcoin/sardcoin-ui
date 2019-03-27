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
              let price = 0;
              for (const ord of orderDetail.OrderCoupon) {

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


  formatPrice(price) {
    if (price === 0) {
      return 'Gratis';
    }
    return '€ ' + price.toFixed(2);
  }

  formatDate(inptuDate) {
    const date = inptuDate.toString().substring(0, inptuDate.indexOf('T'));
    const time = inptuDate.toString().substring(inptuDate.indexOf('T') + 1, inptuDate.indexOf('.000'));
    return 'Data: ' + date + ' ora: ' + time;
  }




  details(order: any) {

    this.orderService.setOrder(order);

    this.router.navigate(['/reserved-area/consumer/order/details']);
  }


}
