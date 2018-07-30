import {Injectable} from '@angular/core';
import {Coupon} from '../_models/Coupon';
import {User} from '../_models/User';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {StoreService} from './store.service';
import {BehaviorSubject} from 'rxjs';
import {Router} from '@angular/router';

@Injectable()

export class CouponService {
  coupon: Coupon;
  couponChange: Coupon = null;
  couponArray: Coupon[] = [];
  httpOptions: any = {};

  private couponSource = new BehaviorSubject(this.couponChange);
  currentMessage = this.couponSource.asObservable();

  constructor(private router: Router,private http: HttpClient, private localStore: StoreService) {
    // this.httpOptions = {
    //   headers: new HttpHeaders({
    //     'Content-Type':  'application/json',
    //     'Authorization': 'Bearer ' + this.localStore.getToken()
    //   })
    // };
  }

  getCoupon() {
  }
  getAllCoupons() {
    // const result = this.http.get('http://localhost:3000/coupons/getAllByUser', this.httpOptions);
    // console.log('getAllByUser ' + result);
    return this.http.get('http://localhost:3000/coupons/getAllByUser');


  }
  deleteCoupon() {}
  deleteAllCoupons() {}
  editCoupon(cp: Coupon) {
    this.couponSource.next(cp);
    this.router.navigate(['/reserved-area/edit']);
    return this.http.get('http://localhost:3000/coupons/list');
  }


  register(coupon: Coupon) {


    console.log('token' + this.localStore.getToken());
    return this.http.post('http://localhost:3000/coupons/create', coupon);
  }
}
