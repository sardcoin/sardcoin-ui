import { Component, OnInit } from '@angular/core';
import {CouponService} from '../../../shared/_services/coupon.service';
import {Coupon} from '../../../shared/_models/Coupon';

@Component({
  selector: 'app-edit-coupon',
  templateUrl: './edit-coupon.component.html',
  styleUrls: ['./edit-coupon.component.scss']
})
export class EditCouponComponent implements OnInit {

  couponPass: Coupon = null;
  constructor(private  couponService: CouponService) { }

  ngOnInit() {
    this.couponService.currentMessage.subscribe(coupon => this.couponPass = coupon);

  }

}
