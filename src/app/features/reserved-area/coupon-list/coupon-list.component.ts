import {Component, Input, OnInit} from '@angular/core';
import {CouponService} from '../../../shared/_services/coupon.service';
import {Coupon} from '../../../shared/_models/Coupon';
import {CouponItemComponent} from '../coupon-item/coupon-item.component';
import {map, tap} from 'rxjs/internal/operators';
import {Router} from '@angular/router';

@Component({
  selector: 'app-feature-reserved-area-coupon-list',
  templateUrl: './coupon-list.component.html',

})

export class FeatureReservedAreaCouponListComponent implements OnInit {

  couponArray: any;
  couponService: CouponService;
  couponSource: Coupon;
  @Input() couponPass: Coupon;

  constructor(couponService: CouponService, private router: Router) {
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

  }

  onEdit(coupon: Coupon) {
    this.couponService.editCoupon(coupon);
    console.log('coupon.valid_from: ' + coupon.valid_from);
  }

  onDelete() {
  }


}
