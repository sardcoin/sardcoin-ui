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
import {CouponToken} from '../../../../../shared/_models/CouponToken';

@Component({
  selector: 'app-coupon-order-detail',
  templateUrl: './coupon-order-detail.component.html',
  styleUrls: ['./coupon-order-detail.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CouponOrderDetailComponent implements OnInit, OnDestroy { // TODO delete (redundant)
  imageURL = environment.protocol + '://' + environment.host + ':' + environment.port + '/';
  orderPass = null;
  cart = new Coupon();
  producer = null;
  desktopMode: boolean;
  classMx4: string;
  qrSize: number;
  listCoupon = [];
  title: string;
  listTitleQuantityPrice = [];

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

  ngOnInit() {

    this.orderService.currentOrder.subscribe(order => {
      if (order === null) {
        this.router.navigate(['/reserved-area/consumer/order']);
      } else {
        this.orderPass = order;
        this.listCoupon.push(this.orderPass.order);
        this.setDetailsCoupons(this.listCoupon);
        this.addBreadcrumb();
        console.log('this.listCoupon', this.listCoupon);
        // this.getOwner();
      }
      this.globalEventService.desktopMode.subscribe(message => {
        this.desktopMode = message;
        this.setClass();

      });
    });
  }

  ngOnDestroy(): void {
    this.removeBreadcrumb();
  }

  addBreadcrumb() {
    const bread = [] as Breadcrumb[];

    bread.push(new Breadcrumb('Home', '/reserved-area/consumer/'));
    bread.push(new Breadcrumb('I miei ordini', '/reserved-area/consumer/order/'));
    bread.push(new Breadcrumb( this.orderPass.order.id , '/reserved-area/consumer/order/details'));
    // english version
    // bread.push(new Breadcrumb(this.couponPass.title + ' details', '/reserved-area/consumer/bought/details'));

    this.breadcrumbActions.updateBreadcrumb(bread);
  }

  removeBreadcrumb() {
    this.breadcrumbActions.deleteBreadcrumb();
  }

  formatPrice(price) {
    return price === 0 ? 'Gratis' : '€ ' + price.toFixed(2);
  }

  formatUntil(until) {
    return until ? this.formatDate(until) : 'Illimitato';
  }


  formatDate(inptuDate) {
    const date = inptuDate.toString().substring(0, inptuDate.indexOf('T'));
    const time = inptuDate.toString().substring(inptuDate.indexOf('T') + 1, inptuDate.indexOf('.000'));
    return 'Data: ' + date + ' ora: ' + time;
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


  async setDetailsCoupons(list) {

    console.log('list', list);
    for (const cp of list[0].OrderCoupon) {

      const titleQuantityPrice = {title: '', quantity: '', price: '', coupon: {}};

      try {
        const coupon = await this.couponService.getCouponById(cp.coupon_id).toPromise();

        titleQuantityPrice.title = coupon.title;
        titleQuantityPrice.quantity = cp.quantity;
        titleQuantityPrice.price = cp.price;
        titleQuantityPrice.coupon = coupon;

        this.listTitleQuantityPrice.push(titleQuantityPrice);



      } catch (e) {

        console.log(e);
        return this.title;
      }
    }


  }


  details(coupon: any) {

    this.couponService.setCoupon(coupon);

    this.router.navigate(['/reserved-area/consumer/order/details/details-coupon']);
  }

}
