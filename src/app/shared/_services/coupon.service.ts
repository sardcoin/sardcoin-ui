import {Injectable} from '@angular/core';
import {Coupon} from '../_models/Coupon';
import {User} from '../_models/User';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {StoreService} from './store.service';
import {BehaviorSubject, observable} from 'rxjs';
import {NavigationEnd, Router} from '@angular/router';
import {first} from 'rxjs/internal/operators';
import {environment} from '../../../environments/environment';

@Injectable()

export class CouponService {
  coupon: Coupon;
  couponChange: any = null;
  couponArray: Coupon[] = [];
  httpOptions: any = {};
  private couponSource = new BehaviorSubject(this.couponChange);
  currentMessage = this.couponSource.asObservable();

  constructor(
    private router: Router,
    private http: HttpClient,
    private localStore: StoreService
  ) {
  }

  getCoupon() {
  }

  getAllCoupons() {
    return this.http.get('http://' + environment.host + ':' + environment.port + '/coupons/getAllByUser');
  }

  deleteCoupon(cp: number) {
    return this.http.request('delete', 'http://' + environment.host + ':' + environment.port + '/coupons/delete', {body: {id: cp}});

  }

  deleteAllCoupons() {
  }

  setCoupon(cp: any) {
    this.couponSource.next(cp);
    console.log('cp.id: ' + cp.id);

    this.router.navigate(['reserved-area/producer/edit']);
  }

  editCoupon(cp: any) {
    return this.http.request('put', 'http://' + environment.host + ':' + environment.port + '/coupons/update', {body: cp}).subscribe(
      (data) => {
        this.router.navigate(['/reserved-area/producer/list']);
      }, error => {
        console.log(error);
      }
    );

  }

  register(coupon: Coupon) {
    return this.http.post('http://' + environment.host + ':' + environment.port + '/coupons/create', coupon);
  }

  getAffordables() {
    console.log('token consumer ' , this.localStore.getToken());
    return this.http.get('http://' + environment.host + ':' + environment.port + '/coupons/getAffordables');

  }

  buyCoupon(coupon_id: number) {
    return this.http.post('http://' + environment.host + ':' + environment.port + '/coupons/buyCoupon', {coupon_id: coupon_id});
  }
}


