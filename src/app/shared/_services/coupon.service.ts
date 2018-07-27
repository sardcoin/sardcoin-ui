import {Injectable} from '@angular/core';
import {Coupon} from '../_models/Coupon';
import {User} from '../_models/User';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {StoreService} from './store.service';
import {BehaviorSubject} from 'rxjs';

@Injectable()

export class CouponService {
  coupon: Coupon;
  couponChange: Coupon = null;
  couponArray: Coupon[] = [];
  httpOptions: any = {};

  private couponSource = new BehaviorSubject(this.couponChange);
  currentMessage = this.couponSource.asObservable();

  constructor(private http: HttpClient, private localStore: StoreService) {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization': 'Bearer ' + this.localStore.getToken()
      })
    };
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
    // const result = this.http.get('http://localhost:3000/coupons/getAllByUser', this.httpOptions);
    // console.log('getAllByUser ' + result);
    return this.http.get('http://localhost:3000/coupons/getAllByUser', this.httpOptions);


  }
  deleteCoupon() {}
  deleteAllCoupons() {}
  editCoupon(cp: Coupon) {
    this.couponSource.next(cp);

  }


  register() {


    console.log('token' + this.localStore.getToken());
    return this.http.post('http://localhost:3000/coupons/create', this.coupon, this.httpOptions);
  }
}
