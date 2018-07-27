import {Component, Input, OnInit} from '@angular/core';
import {Coupon} from '../../../shared/_models/Coupon';
import {CouponService} from '../../../shared/_services/coupon.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-coupon-item',
  templateUrl: './coupon-item.component.html',
  styleUrls: ['./coupon-item.component.scss']
})
export class CouponItemComponent implements OnInit {

  couponArray: Coupon[] = [];
  couponService: CouponService;
  @Input() coupon: Coupon;
  couponSource: Coupon;

  constructor(couponService: CouponService, private router: Router) { this.couponService = couponService; }

  ngOnInit() {
   // this.couponArray = this.couponService.getAllCoupons();
    this.couponService.currentMessage.subscribe(coupon => this.couponSource = coupon);
   console.log(this.couponArray);
  }

  onEdit() {
    this.couponService.editCoupon(this.couponSource);
    this.router.navigate(['/reserved-area/edit']);

  }
  onDelete() {}

}
