import {Component, OnDestroy, OnInit, Input} from '@angular/core';
import {Breadcrumb} from "../../../../core/breadcrumb/Breadcrumb";
import {BreadcrumbActions} from "../../../../core/breadcrumb/breadcrumb.actions";
import {CouponService} from '../../../../shared/_services/coupon.service';
import {Coupon} from '../../../../shared/_models/Coupon';
import {Router} from '@angular/router';
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: 'app-feature-reserved-area-coupon-list',
  templateUrl: './coupon-list.component.html'
})

export class FeatureReservedAreaCouponListComponent implements OnInit, OnDestroy {

  couponArray: any;
  @Input() couponPass: Coupon;

  constructor(
    private couponService: CouponService,
    private router: Router,
    private breadcrumbActions: BreadcrumbActions,
    private _sanitizer: DomSanitizer
    ) {
  }

  ngOnInit(): void {
    this.couponService.getAllCoupons().subscribe(
      data => {
        console.log('getAllByUser ' + data);
        this.couponArray = data;
      },
      error => console.log(error)
    );

    this.addBreadcrumb();
  }

  onEdit(coupon: Coupon) {
    this.couponService.editCoupon(coupon);
    console.log('coupon.valid_from: ' + coupon.valid_from);
  }

  addBreadcrumb() {
    const bread = [] as Breadcrumb[];

    bread.push(new Breadcrumb('Home', '/'));
    bread.push(new Breadcrumb('Reserved Area', '/reserved-area/'));
    bread.push(new Breadcrumb('Producer', '/reserved-area/producer/'));
    bread.push(new Breadcrumb('My coupons', '/reserved-area/producer/list/'));

    this.breadcrumbActions.updateBreadcrumb(bread);
  }

  removeBreadcrumb() {
    this.breadcrumbActions.deleteBreadcrumb();
  }

  ngOnDestroy() {
    this.removeBreadcrumb();
  }

  imageUrl(path) {
    let subs = path.substr(path.lastIndexOf('\\')+1);
    return this._sanitizer.bypassSecurityTrustUrl('http://127.0.0.1:8887/'+subs);
  }

  formatPrice(price) {
    if(price === 0) {
      return 'Free'
    }

    return '€ ' + price;
  }

}
