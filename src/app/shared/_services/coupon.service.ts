import {Injectable} from '@angular/core';
import {Coupon} from '../_models/Coupon';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {StoreService} from './store.service';
import {BehaviorSubject, observable} from 'rxjs';
import {NavigationEnd, Router} from '@angular/router';
import {environment} from '../../../environments/environment';
import {CartItem, PurchasedCoupon} from '../_models/CartItem';

@Injectable()

export class CouponService {
  coupon: Coupon;
  couponChange: any = null;
  couponInfoUser: any = null;
  fromEditOrCopy = false;

  private boolFormEdit = new BehaviorSubject<boolean>(this.fromEditOrCopy);
  private couponSource = new BehaviorSubject<Coupon>(this.couponChange);
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

  getPurchasedCoupons() {
    return this.http.get<PurchasedCoupon>(this.formatUrl('getPurchasedCoupons'));
  }

  getPurchasedCouponsById(id: number) {
    return this.http.get<PurchasedCoupon>(this.formatUrl('getPurchasedCouponsById/' + id));
  }

  getCouponById(id: number){
    return this.http.get<Coupon>(this.formatUrl('getById/' + id));
  }

  getAvailableCoupons() {
    return this.http.get<Coupon[]>(this.formatUrl('getAvailableCoupons'));
  }

  getProducerCoupons() {
    return this.http.get<Coupon[]>(this.formatUrl('getProducerCoupons'));
  }

  deleteCoupon(cp: number) {
    return this.http.request('delete', this.formatUrl('deleteCoupon'), {body: {id: cp}});
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

  editCoupon(coupon: Coupon) {
    return this.http.request('put', this.formatUrl('editCoupon'), {body: coupon});
  }

  create(coupon: Coupon) {
    return this.http.post(this.formatUrl('create'), coupon);
  }

  buyCoupons(cart: CartItem[], paymentID: string) {
    return this.http.put(this.formatUrl('buyCoupons'), {coupon_list: cart, payment_id: paymentID});
  }

  importOfflineCoupon(cp: any) {
    return this.http.request('put', this.formatUrl('importOfflineCoupon'), {body: cp});
  }

  verifierCoupon(cp: any) {
    return this.http.request('put', this.formatUrl('verifierCoupon'), {body: cp});
  }

  getTotalCoupons() {
    return this.http.get(this.formatUrl('getAllCouponsStateOne'));
  }

  private formatUrl(methodName) {
    return environment.protocol + '://' + environment.host + ':' + environment.port + '/coupons/' + methodName;
  }
}


