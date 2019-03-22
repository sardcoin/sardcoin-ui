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

@Component({
  selector: 'app-coupon-order-detail',
  templateUrl: './coupon-order-detail.component.html',
  styleUrls: ['./coupon-order-detail.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CouponOrderDetailComponent implements OnInit, OnDestroy { // TODO delete (redundant)
  imageURL = environment.protocol + '://' + environment.host + ':' + environment.port + '/';
  couponPass: Coupon = null;
  cart = new Coupon();
  producer = null;
  desktopMode: boolean;
  classMx4: string;
  qrSize: number;

  modalRef: BsModalRef;

  constructor(
    private breadcrumbActions: BreadcrumbActions,
    private couponService: CouponService,
    private router: Router,
    private userService: UserService,
    private modalService: BsModalService,
    private globalEventService: GlobalEventsManagerService,
  ) {
  }

  ngOnInit() {

    this.couponService.currentMessage.subscribe(coupon => {
      if (coupon === null) {
        this.router.navigate(['/reserved-area/consumer/order']);
      } else {
        this.couponPass = coupon;
        this.addBreadcrumb();

        this.getOwner();
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
    bread.push(new Breadcrumb( this.couponPass.title , '/reserved-area/consumer/order/details'));
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
    const time = inptuDate.toString().substring(inptuDate.indexOf('T') + 1, inptuDate.indexOf('Z'));
    return 'Date: ' + date + ' Time: ' + time;
  }

  retry() {
    this.router.navigate(['/reserved-area/consumer/bought']);
  }

  getOwner() {
    this.userService.getProducerFromId(this.couponPass.owner).subscribe(user => {
      this.producer = user;
      this.couponService.setUserCoupon(this.producer);
    });
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

  openModal(template: TemplateRef<any>){
    this.modalRef = this.modalService.show(template, {class: 'modal-md modal-dialog-centered'});
  }

}
