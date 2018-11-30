import {Injectable} from '@angular/core';
import {Coupon} from '../_models/Coupon';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {StoreService} from './store.service';
import {BehaviorSubject, observable} from 'rxjs';
import {NavigationEnd, Router} from '@angular/router';
import {environment} from '../../../environments/environment';

@Injectable()

export class CouponService {
  coupon: Coupon;
  couponChange: any = null;
  couponInfoUser: any = null;
  fromEditOrCopy = false;
  private boolFormEdit = new BehaviorSubject(this.fromEditOrCopy);
  private couponSource = new BehaviorSubject(this.couponChange);
  private couponUser = new BehaviorSubject(this.couponInfoUser);

  currentMessage = this.couponSource.asObservable();
  currentUserCoupon = this.couponUser.asObservable();
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
    return this.http.get<Coupon[]>(this.formatUrl('getAllByUser'));
  }

  getPurchasedCoupons() {
    return this.http.get<Coupon[]>(this.formatUrl('getPurchasedCoupons'));
  }

  getAvailableCoupons() {
    return this.http.get<Coupon[]>(this.formatUrl('getAvailableCoupons'));
  }

  getCreatedCoupons() {
    return this.http.get(this.formatUrl('getCreatedCoupons'));
  }

  getProducerCoupons() {
    return this.http.get<Coupon>(this.formatUrl('getProducerCoupons'));

  }

  deleteCoupon(cp: number) {
    return this.http.request('delete', this.formatUrl('delete'), {body: {id: cp}});

  }

  deleteAllCoupons() {
  }

  setCoupon(cp: Coupon) {
    this.couponSource.next(cp);
  }

  setUserCoupon(user: any) {
    this.couponUser.next(user);
  }

  setFromEdit(fromEdit: boolean) {
    this.boolFormEdit.next(fromEdit);
  }

  editCoupon(cp: any) {
    return this.http.request('put', this.formatUrl('update'), {body: cp});
  }

  register(coupon: Coupon) {
    return this.http.post(this.formatUrl('create'), coupon);
  }

  // getAffordables() {
  //   return this.http.get('https://' + environment.host + ':' + environment.port + '/coupons/getAffordables');
  // }

  buyCoupon(coupon_id: number) {
    return this.http.post(this.formatUrl('buyCoupon'), {coupon_id: coupon_id});
  }

  getCouponsCreatedFromTitleDescriptionPrice(cp: any) {
    const cpEasy = encodeURIComponent(cp.title.toString()) + '/' + encodeURIComponent(cp.description != null ? cp.description.toString() : null) +
      '/' + encodeURIComponent(Number(cp.price).toFixed(2).toString());

    return this.http.get<JSON>('https://' + environment.host + ':' + environment.port + '/coupons/getCouponsCreatedFromTitleDescriptionPrice/' + cpEasy);
  }

  importOfflineCoupon(cp: any) {
    return this.http.request('put', this.formatUrl('importOfflineCoupon'), {body: cp});
  }

  verifierCoupon(cp: any) {
    return this.http.request('put', this.formatUrl('verifierCoupon'), {body: cp});
  }



  getTotalCoupons() {
    // console.log('token consumer ' , this.localStore.getToken());
    return this.http.get('https://' + environment.host + ':' + environment.port + '/coupons/getAllCouponsStateOne');

  }

  private formatUrl(methodName) {
    return 'https://' + environment.host + ':' + environment.port + '/coupons/' + methodName;
  }
}


