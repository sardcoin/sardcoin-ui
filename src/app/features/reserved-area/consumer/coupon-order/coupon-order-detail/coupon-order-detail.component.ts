import {Component, OnDestroy, OnInit, TemplateRef, ViewEncapsulation} from '@angular/core';
import {environment} from '../../../../../../environments/environment';
import {Coupon} from '../../../../../shared/_models/Coupon';
import {BreadcrumbActions} from '../../../../../core/breadcrumb/breadcrumb.actions';
import {CouponService} from '../../../../../shared/_services/coupon.service';
import {Router} from '@angular/router';
import {Breadcrumb} from '../../../../../core/breadcrumb/Breadcrumb';
import {UserService} from '../../../../../shared/_services/user.service';
import {GlobalEventsManagerService} from '../../../../../shared/_services/global-event-manager.service';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {OrderService} from '../../../../../shared/_services/order.service';
import {Order} from '../../../../../shared/_models/Order';

@Component({
  selector: 'app-coupon-order-detail',
  templateUrl: './coupon-order-detail.component.html',
  styleUrls: ['./coupon-order-detail.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CouponOrderDetailComponent implements OnInit, OnDestroy {
  imageURL = environment.protocol + '://' + environment.host + ':' + environment.port + '/';
  orderPass: Order = null;
  cart = new Coupon();
  producer = null;
  desktopMode: boolean;
  classMx4: string;
  qrSize: number;
  title: string;
  coupons: Array<Coupon> = [];

  modalRef: BsModalRef;

  constructor(
    private couponService: CouponService,
    private breadcrumbActions: BreadcrumbActions,
    private orderService: OrderService,
    private router: Router,
    private userService: UserService,
    private modalService: BsModalService,
    private globalEventService: GlobalEventsManagerService,
  ) {

  }

  async ngOnInit() {
    this.orderService.currentOrder.subscribe( order => {
      if (order === null) {
        this.router.navigate(['/reserved-area/consumer/order']);
      } else {
        this.orderPass = order;
        this.setDetailsCoupons();
        this.addBreadcrumb();
        this.globalEventService.desktopMode.subscribe(message => {
          this.desktopMode = message;
          this.setClass();

        });
      }
    });


  }

  ngOnDestroy(): void {
    this.removeBreadcrumb();
  }

  formatPrice(price) {
    return price ? ( price === 0 ? 'Gratis' : '€ ' + price.toFixed(2)) : '';
  }

  formatUntil(until) {
    return until ? this.formatDate(until) : 'Illimitato';
  }

  formatDate(inputDate) {
    const auxDate = inputDate.slice(0, 10).split('-');
    const date = auxDate[2] + '/' + auxDate[1] + '/' + auxDate[0];
    const time = inputDate.toString().substring(inputDate.indexOf('T') + 1, inputDate.indexOf('.000'));
    return date + ' ' + time;
  }

  retry() {
    this.router.navigate(['/reserved-area/consumer/order']);
  }
  setClass() {
    if (!this.desktopMode) {
      this.classMx4 = 'card';
      this.qrSize = 500;
    } else {
      this.classMx4 = 'card mx-4';
      this.qrSize = 300;
    }
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, {class: 'modal-md modal-dialog-centered'});
  }

  async setDetailsCoupons() {
    let detailOrder: Order;
    let coupon: Coupon;

    try {
      detailOrder = await this.orderService.getOrderById(this.orderPass.id).toPromise();

      for (const orderCoupon of detailOrder.OrderCoupon) {
        coupon = await this.couponService.getCouponById(orderCoupon.coupon_id).toPromise();
        coupon['quantityBought'] = orderCoupon.quantity;
        this.coupons.push(coupon);
      }

    } catch (e) {
      console.error(e);
      // TODO show error message
    }

  }
  myPurchases() {
    this.router.navigate(['/reserved-area/consumer/bought']);
  }

  addBreadcrumb() {
    const bread = [] as Breadcrumb[];

    bread.push(new Breadcrumb('Home', '/reserved-area/consumer/'));
    bread.push(new Breadcrumb('I miei ordini', '/reserved-area/consumer/order/'));
    // bread.push(new Breadcrumb( this.orderPass.order.id , '/reserved-area/consumer/order/myPurchases'));
    // english version
    // bread.push(new Breadcrumb(this.couponPass.title + ' myPurchases', '/reserved-area/consumer/bought/myPurchases'));

    this.breadcrumbActions.updateBreadcrumb(bread);
  }

  removeBreadcrumb() {
    this.breadcrumbActions.deleteBreadcrumb();
  }

}
