import {Component, OnDestroy, OnInit, Input} from '@angular/core';
import {Breadcrumb} from "../../../../core/breadcrumb/Breadcrumb";
import {BreadcrumbActions} from "../../../../core/breadcrumb/breadcrumb.actions";
import {CouponService} from '../../../../shared/_services/coupon.service';
import {Coupon} from '../../../../shared/_models/Coupon';
import {Router} from '@angular/router';

@Component({
  selector: 'app-feature-reserved-area-coupon-list',
  templateUrl: './coupon-list.component.html'
})

export class FeatureReservedAreaCouponListComponent implements OnInit, OnDestroy {

  couponArray: any;
  couponService: CouponService;
  couponSource: Coupon;
  @Input() couponPass: Coupon;

  constructor(couponService: CouponService, private router: Router, private breadcrumbActions: BreadcrumbActions) {
    this.couponService = couponService;
  }

  ngOnInit(): void {
    this.couponService.currentMessage.subscribe(coupon => this.couponSource = coupon);
    this.couponService.getAllCoupons().subscribe(
      data => {
        console.log('getAllByUser ' + data);
        this.couponArray = data;
      },
      error => console.log(error)
    );

    this.couponService.getAllCoupons()
      .subscribe(data =>
        console.log(data[0].title));

    this.addBreadcrumb();
  }


  onEdit(coupon: any) {
    this.couponService.setCoupon(coupon);
    console.log('coupon.id: ' + coupon.id );
  }

  onDelete(coupon_id: number) {
    console.log('coupon_id: ', coupon_id);
    this.couponService.deleteCoupon(coupon_id);
    this.couponService.getAllCoupons().subscribe(
      data => {
        console.log('getAllByUser ' + data);
        this.couponArray = data;
      },
      error => console.log(error)
    );


  }
  onDetails() {

  }

  addBreadcrumb() {
    const bread = [] as Breadcrumb[];

    bread.push(new Breadcrumb('Home', '/'));
    bread.push(new Breadcrumb('Reserved Area', '/reserved-area/'));
    bread.push(new Breadcrumb('Your Coupons', '/reserved-area/list/'));

    this.breadcrumbActions.updateBreadcrumb(bread);
  }

  removeBreadcrumb() {
    this.breadcrumbActions.deleteBreadcrumb();
  }

  ngOnDestroy() {
    this.removeBreadcrumb();
  }

}
