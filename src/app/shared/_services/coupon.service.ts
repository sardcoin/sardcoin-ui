import {Injectable} from '@angular/core';
import {Coupon} from '../_models/Coupon';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {StoreService} from './store.service';
import {BehaviorSubject, Observable, observable} from 'rxjs';
import {NavigationEnd, Router} from '@angular/router';
import {environment} from '../../../environments/environment';
import {CartItem, PurchasedCoupon} from '../_models/CartItem';

@Injectable()

export class CouponService {
  private boolFormEdit = new BehaviorSubject<boolean>(null);
  private couponSource = new BehaviorSubject<Coupon>(null);
  private couponUser = new BehaviorSubject(null);

  public currentMessage: Observable<Coupon> = this.couponSource.asObservable();
  currentUserCoupon = this.couponUser.asObservable();
  checkFrom = this.boolFormEdit.asObservable();

  constructor(
    private router: Router,
    private http: HttpClient,
  ) {
  }

  getCouponDetailsURL(coupon: Coupon) {
    return '/details/' + coupon.id + '-' + coupon.title.split(' ').toString().replace(new RegExp(',', 'g'), '-');
  }

  getPurchasedCoupons() {
    return this.http.get<PurchasedCoupon>(this.formatUrl('getPurchasedCoupons'));
  }

  getPurchasedCouponsById(id: number) {
    return this.http.get<PurchasedCoupon>(this.formatUrl('getPurchasedCouponsById/' + id));
  }

  getCouponById(id: number) {
    return this.http.get<Coupon>(this.formatUrl('getById/' + id));
  }

  // getBrokersFromId(id: number) {
  //   return this.http.get<String[]>(this.formatUrl('getBrokersFromId/' + id));
  // }

  getCouponByToken(token: string, type: number) {
    return this.http.get<Coupon>(this.formatUrl('getByToken/' + token + '/' + type));
  }

  getAvailableCoupons() {
    return this.http.get<Coupon[]>(this.formatUrl('getAvailableCoupons'));
  }

  getAvailableCouponsByCategoryId(category_id: number) {
    return this.http.get<Coupon[]>(this.formatUrl('getAvailableByCatId/' + category_id));
  }

  getAvailableByTextAndCatId(text: string, category_id: number) {
    return this.http.get<Coupon[]>(this.formatUrl('getAvailableByTextAndCatId/' + text + '/' + category_id));
  }

  getProducerCoupons() {
    return this.http.get<Coupon[]>(this.formatUrl('getProducerCoupons'));
  }

  getBrokerCoupons() {
    return this.http.get<Coupon[]>(this.formatUrl('getBrokerCoupons'));
  }

  deleteCoupon(cp: number) {
    return this.http.request('delete', this.formatUrl('deleteCoupon'), {body: {id: cp}});
  }

  setCoupon(cp: Coupon) {
    console.log(cp);

    this.couponSource.next(cp);
  }

  setUserCoupon(user: any) {
    this.couponUser.next(user);
  }

  setFromEdit(fromEdit: boolean) {
    this.boolFormEdit.next(fromEdit);
  }

  editCoupon(coupon: Coupon) {
    console.log('cpEdit', coupon)
    return this.http.request('put', this.formatUrl('editCoupon'), {body: coupon});
  }

  create(coupon: Coupon) {
    console.log('create', coupon)

    return this.http.post(this.formatUrl('create'), coupon);
  }

  buyCoupons(cart: CartItem[]) {
    return this.http.put(this.formatUrl('buyCoupons'), {coupon_list: cart});
  }

  importOfflineCoupon(cp: any) {
    return this.http.request('put', this.formatUrl('importOfflineCoupon'), {body: cp});
  }

  redeemCoupon(token: any) {
    const body = {token: token};
    return this.http.request('put', this.formatUrl('redeemCoupon'), {body: body});
  }

  private formatUrl(methodName) {
    return environment.protocol + '://' + environment.host + ':' + environment.port + '/coupons/' + methodName;
  }


}


