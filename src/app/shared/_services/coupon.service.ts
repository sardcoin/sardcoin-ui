import {Injectable} from '@angular/core';
import {Coupon} from '../_models/Coupon';

@Injectable()

export class CouponService {
  coupon: Coupon;
  couponArray: Coupon[] = [];
  constructor() {

  }

  addCoupon(id: number,
            title: string,
            description: string,
            timestamp: string,
            price: number,
            valid_from: string,
            valid_until: string,
            state: number,
            constraints: string,
            owner: number,
            consumer: number) {
    this.coupon = new Coupon(id, title, description, timestamp, price,
      valid_from, valid_until, state, constraints, owner, consumer);

    this.couponArray.push(this.coupon);
  }
  getCoupon() {
  }
  getAllCoupons() {
    return this.couponArray;
  }
  deleteCoupon() {}
  deleteAllCoupons() {}
  editCoupon() {}
}
