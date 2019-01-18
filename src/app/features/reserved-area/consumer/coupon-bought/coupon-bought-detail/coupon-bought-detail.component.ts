import {Component, OnDestroy, OnInit} from '@angular/core';
import {environment} from '../../../../../../environments/environment';
import {BsModalRef} from 'ngx-bootstrap/modal/bs-modal-ref.service';
import {Coupon} from '../../../../../shared/_models/Coupon';
import {BreadcrumbActions} from '../../../../../core/breadcrumb/breadcrumb.actions';
import {LocalStorage} from '@ngx-pwa/local-storage';
import {CouponService} from '../../../../../shared/_services/coupon.service';
import {BsModalService} from 'ngx-bootstrap/modal';
import {Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {Breadcrumb} from '../../../../../core/breadcrumb/Breadcrumb';
import {UserService} from '../../../../../shared/_services/user.service';
import {GlobalEventsManagerService} from '../../../../../shared/_services/global-event-manager.service';

@Component({
  selector: 'app-coupon-bought-detail',
  templateUrl: './coupon-bought-detail.component.html',
  styleUrls: ['./coupon-bought-detail.component.scss']
})
export class CouponBoughtDetailComponent implements OnInit, OnDestroy {
  URLstring = environment.protocol + '://' + environment.host + ':' + environment.port + '/';
  modalRef: BsModalRef;
  couponPass: Coupon;
  cart = new Coupon();
  producer = null;
  desktopMode: boolean;

  constructor(private breadcrumbActions: BreadcrumbActions,
              private couponService: CouponService,
              private router: Router,
              private modalService: BsModalService,
              private toastr: ToastrService,
              private userService: UserService,
              protected localStorage: LocalStorage,
              private globalEventService: GlobalEventsManagerService,
  ) {
  }

  ngOnInit() {
    this.couponService.currentMessage.subscribe(coupon => {
      this.couponPass = coupon;

      if (this.couponPass === null) {
        this.router.navigate(['/reserved-area/consumer/bought']);
      } else {
        this.URLstring = this.URLstring + this.couponPass.image;
        this.addBreadcrumb();
        this.getOwner();
      }
      this.globalEventService.desktopMode.subscribe(message => {
        this.desktopMode = message;
      });
    });
  }

  ngOnDestroy(): void {
    this.removeBreadcrumb();
  }

  addBreadcrumb() {
    const bread = [] as Breadcrumb[];

    bread.push(new Breadcrumb('Home', '/'));
    bread.push(new Breadcrumb('Reserved Area', '/reserved-area/'));
    bread.push(new Breadcrumb('Consumer', '/reserved-area/consumer/'));
    bread.push(new Breadcrumb('My Purchases', '/reserved-area/consumer/bought'));
    bread.push(new Breadcrumb(this.couponPass.title + ' details', '/reserved-area/consumer/bought/details'));

    this.breadcrumbActions.updateBreadcrumb(bread);
  }

  removeBreadcrumb() {
    this.breadcrumbActions.deleteBreadcrumb();
  }

  formatPrice(price) {
    if (price === 0) {
      return 'Free';
    }
    return '€ ' + price.toFixed(2);
  }

  formatUntil(until) {
    if (until === null) {
      return 'Unlimited';
    }

    return this.formatFrom(until);
  }


  formatFrom(dataFrom) {
    const date = dataFrom.toString().substring(0, dataFrom.indexOf('T'));
    const time = dataFrom.toString().substring(dataFrom.indexOf('T') + 1, dataFrom.indexOf('Z'));
    return 'Date: ' + date + ' Time: ' + time;
  }


  retry() {
    this.removeBreadcrumb();

    this.router.navigate(['/reserved-area/consumer/bought']);
  }

  getOwner() {
    this.userService.getProducerFromId(this.couponPass.owner).subscribe(user => {
      this.producer = user;
      this.couponService.setUserCoupon(this.producer);

    });
  }


}
