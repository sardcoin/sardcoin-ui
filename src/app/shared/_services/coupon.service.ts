import {Injectable} from '@angular/core';
import {Coupon} from '../_models/Coupon';
import {User} from '../_models/User';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {StoreService} from './store.service';

@Injectable()

export class CouponService {
  coupon: Coupon;
  couponArray: Coupon[] = [];
  constructor(private http: HttpClient, private localStore: StoreService) {

  }

  addCoupon(
            title: string,
            description: string,
            timestamp: string,
            price: number,
            valid_from: number,
            valid_until: number,
            state: number,
            constraints: string,
            owner: number,
            consumer: number) {
    this.coupon = new Coupon(title, description, timestamp, price,
      valid_from, valid_until, state, constraints, owner, consumer);

    console.log(this.coupon);
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

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'Bearer ' + this.localStore.getToken()
      })
    };
    console.log('token' + this.localStore.getToken())
    return this.http.post('http://localhost:3000/coupons/create', this.coupon, httpOptions);
  }
}
