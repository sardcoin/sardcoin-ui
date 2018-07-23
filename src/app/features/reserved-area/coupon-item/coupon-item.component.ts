import {Component, Input, OnInit} from '@angular/core';
import {Coupon} from '../../../shared/_models/Coupon';
import {CouponService} from '../../../shared/_services/coupon.service';

@Component({
  selector: 'app-coupon-item',
  templateUrl: './coupon-item.component.html',
  styleUrls: ['./coupon-item.component.scss']
})
export class CouponItemComponent implements OnInit {

  couponArray: Coupon[] = [];
  couponService: CouponService;

  constructor(couponService: CouponService) { this.couponService = couponService; }

  ngOnInit() {
   this.couponArray = this.couponService.getAllCoupons();
   console.log(this.couponArray);
  }

}
