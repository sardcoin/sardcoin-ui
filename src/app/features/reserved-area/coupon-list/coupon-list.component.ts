import {Component, OnInit} from '@angular/core';
import {CouponService} from '../../../shared/_services/coupon.service';
import {Coupon} from '../../../shared/_models/Coupon';
import {CouponItemComponent} from '../coupon-item/coupon-item.component';
import {map, tap} from 'rxjs/internal/operators';

@Component({
  selector: 'app-feature-reserved-area-coupon-list',
  templateUrl: './coupon-list.component.html',

})

export class FeatureReservedAreaCouponListComponent implements OnInit {

  couponArray: ArrayBuffer;
  couponService: CouponService;

  constructor(couponService: CouponService) {
    this.couponService = couponService;
  }


  ngOnInit(): void {

    this.couponService.getAllCoupons().subscribe(

        data => {console.log('getAllByUser ' +  data); this.couponArray = data; },
        error => console.log( error)

    );

    this.couponService.getAllCoupons()
      .subscribe(data =>
        console.log(data[0].title));

  }


}
