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
  fromEdit = false;
  private boolFormEdit = new BehaviorSubject(this.fromEdit);
  private couponSource = new BehaviorSubject(this.couponChange);
  currentMessage = this.couponSource.asObservable();
  checkFrom = this.boolFormEdit.asObservable();

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

  getPurchasedCoupons() {
    return this.http.get('http://' + environment.host + ':' + environment.port + '/coupons/getPurchasedCoupons');
  }

  getCreatedCoupons(){
    return this.http.get('http://' + environment.host + ':' + environment.port + '/coupons/getCreatedCoupons');
  }

  deleteCoupon(cp: number) {
    return this.http.request('delete', 'http://' + environment.host + ':' + environment.port + '/coupons/delete', {body: {id: cp}});

  }

  deleteAllCoupons() {
  }

  setCoupon(cp: any) {
    this.couponSource.next(cp);
    console.log('description  ' + cp.description);

    this.router.navigate(['reserved-area/producer/edit']);

  }
  setFromEdit(fromEdit: boolean) {
    this.boolFormEdit.next(fromEdit);
    console.log('from edit  ' + fromEdit);

  }


  editCoupon(cp: any) {
    return this.http.request('put', 'http://' + environment.host + ':' + environment.port + '/coupons/update', {body: cp});

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


