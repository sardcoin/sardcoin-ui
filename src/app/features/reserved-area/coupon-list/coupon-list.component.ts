import {Component, OnInit} from '@angular/core';
import {CouponService} from '../../../shared/_services/coupon.service';
import {Coupon} from '../../../shared/_models/Coupon';
import {CouponItemComponent} from '../coupon-item/coupon-item.component';

@Component({
  selector: 'app-feature-reserved-area-coupon-list',
  templateUrl: './coupon-list.component.html',

})

export class FeatureReservedAreaCouponListComponent implements OnInit {

  couponArray: Coupon[] = [];
  couponService: CouponService;

  constructor(couponService: CouponService) {
    this.couponService = couponService;
  }


  ngOnInit(): void {

    this.couponArray = this.couponService.getAllCoupons();
  }


}
