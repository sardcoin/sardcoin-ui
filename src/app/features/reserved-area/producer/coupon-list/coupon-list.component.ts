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

  constructor(
    private couponService: CouponService,
    private router: Router,
    private breadcrumbActions: BreadcrumbActions
    ) {
  }

  ngOnInit(): void {
    this.getCoupons();
    this.addBreadcrumb();
  }

  getCoupons() {
    this.couponService.getAllCoupons().subscribe(
      data => {
        this.couponArray = data;
      },
      error => console.log(error)
    );
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

}
