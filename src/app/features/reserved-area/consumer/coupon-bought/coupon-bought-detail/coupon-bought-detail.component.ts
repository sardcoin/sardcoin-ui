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

@Component({
  selector: 'app-coupon-bought-detail',
  templateUrl: './coupon-bought-detail.component.html',
  styleUrls: ['./coupon-bought-detail.component.scss']
})
export class CouponBoughtDetailComponent implements OnInit, OnDestroy {
  URLstring = 'http://' + environment.host + ':' + environment.port + '/';
  modalRef: BsModalRef;
  message: string;
  couponPass: any;
  cart = new Coupon();
  couponsPurchased: any;
  quantity = 1;
  couponsCheckCart: Coupon[];
  inCart = false;
  available = false;
  availability: string;
  constructor( private breadcrumbActions: BreadcrumbActions,
               private couponService: CouponService,
               private router: Router,
               private modalService: BsModalService,
               private toastr: ToastrService,
               protected localStorage: LocalStorage) { }

  ngOnInit() {
    this.couponService.currentMessage.subscribe(coupon => {
      this.couponPass = coupon;
    // console.log('couponPass', this.couponPass)
    if (this.couponPass === null) {
      this.router.navigate(['/reserved-area/consumer/bought']);
      this.addBreadcrumb();
    } else {
      this.URLstring = this.URLstring + this.couponPass.image;
      this.addBreadcrumb();

      this.couponService.getPurchasedCoupons()
        .subscribe(coupons => {
          this.couponsPurchased = coupons;

          if (this.couponsPurchased !== null) {
            for (const i of this.couponsPurchased) {
              if (this.couponPass.token === i.token) {
                this.available = true;
              }
            }
          }

        }, err => {
          console.log(err);
        });

    }
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
    if ( this.couponPass !== null) { bread.push(new Breadcrumb(this.couponPass.title, '/reserved-area/consumer/showcase')); }
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
    this.router.navigate(['/reserved-area/consumer/bought']);
  }


}
