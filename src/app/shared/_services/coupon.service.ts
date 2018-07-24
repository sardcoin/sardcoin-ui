import {Injectable} from '@angular/core';
import {Coupon} from '../_models/Coupon';
import {User} from '../_models/User';
import {HttpClient} from '@angular/common/http';

@Injectable()

export class CouponService {
  coupon: Coupon;
  couponArray: Coupon[] = [];
  constructor(private http: HttpClient) {

  }

  addCoupon(
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
    this.coupon = new Coupon(title, description, timestamp, price,
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


  register() {
    return this.http.post('http://localhost:3000/coupons/create', this.coupon);
  }
}
