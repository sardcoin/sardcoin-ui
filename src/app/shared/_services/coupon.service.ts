import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CartItem, PurchasedCoupon } from '../_models/CartItem';
import { Coupon } from '../_models/Coupon';
import { User } from '../_models/User';

@Injectable()

export class CouponService {
  currentMessage: Observable<Coupon>;
  currentUserCoupon: Observable<User>;
  checkFrom: Observable<boolean>;

  private boolFormEdit = new BehaviorSubject<boolean>(undefined);
  private couponSource = new BehaviorSubject<Coupon>(undefined);
  private couponUser = new BehaviorSubject(undefined);

  constructor(
    private router: Router,
    private http: HttpClient
  ) {
    this.currentMessage = this.couponSource.asObservable();
    this.currentUserCoupon = this.couponUser.asObservable();
    this.checkFrom = this.boolFormEdit.asObservable();
  }

  // Open methods
  getAvailableCoupons = (): Observable<Array<Coupon>> =>
    this.http.get<Array<Coupon>>(this.formatUrl('getAvailableCoupons'));

  getAvailableCouponsByCategoryId = (categoryId: number): Observable<Array<Coupon>> =>
    this.http.get<Array<Coupon>>(this.formatUrl(`getAvailableByCatId/${categoryId}`));

  getAvailableByTextAndCatId = (text: string, categoryId: number): Observable<Array<Coupon>> =>
    this.http.get<Array<Coupon>>(this.formatUrl(`getAvailableByTextAndCatId/${text}/${categoryId}`));

  getCouponById = (id: number): Observable<Coupon> =>
    this.http.get<Coupon>(this.formatUrl(`getById/${id}`));

  // Consumer methods

  preBuy = (cart: Array<CartItem>): Observable<any> =>
    this.http.put(this.formatUrl('preBuy'), {coupon_list: cart});

  removePreBuy = (cart: Array<CartItem>): Observable<any> =>
    this.http.put(this.formatUrl('removePreBuy'), {coupon_list: cart});

  getCouponDetailsURL = (coupon: Coupon): string =>
    `/details/${coupon.id}-${coupon.title.split(' ')
      .toString()
      .replace(new RegExp(',', 'g'), '-')}`;

  getBrokerFromCouponId(id: number) {
    return this.http.get<Array<String>>(this.formatUrl('getBrokerFromCouponId/' + id));
  }

  getPurchasedCoupons = (): Observable<Array<Coupon>> =>
    this.http.get<Array<Coupon>>(this.formatUrl('getPurchasedCoupons'));

  getPurchasedCouponsById = (id: number): Observable<PurchasedCoupon> =>
    this.http.get<PurchasedCoupon>(this.formatUrl(`getPurchasedCouponsById/${id}`));

  getCouponByToken = (token: string, type: number): Observable<Coupon> =>
    this.http.get<Coupon>(this.formatUrl(`getByToken/${token}/${type}`));

  getByTokenNotBougth = (token: string, type: number): Observable<Coupon> =>
        this.http.get<Coupon>(this.formatUrl(`getByTokenNotBougth/${token}/${type}`));

  buyCoupons = (cart: Array<CartItem>, paymentId?: string, producerId?: number): Observable<any> =>
    this.http.put(this.formatUrl('buyCoupons'), {coupon_list: cart, payment_id: paymentId, producer_id: producerId});

  // Producer methods
  getProducerCoupons = (): Observable<Array<Coupon>> =>
    this.http.get<Array<Coupon>>(this.formatUrl('getProducerCoupons'));

  getProducerCouponsOffline = (): Observable<Array<Coupon>> =>
        this.http.get<Array<Coupon>>(this.formatUrl('getProducerCouponsOffline'));

  getProducerTokensOfflineById = (id: number): Observable<any> =>
        this.http.get<any>(this.formatUrl(`getProducerTokensOfflineById/${id}`));

  buyProducerTokensOfflineByToken = (token: string, id: number): Observable<any> =>
        this.http.get<any>(this.formatUrl(`buyProducerTokensOfflineByToken/${token}/${id}`));

  // Broker methods
  getBrokerCoupons = (): Observable<Array<Coupon>> =>
    this.http.get<Array<Coupon>>(this.formatUrl('getBrokerCoupons'));

  // Mixed auth methods (producer + broker)
  deleteCoupon = (couponId, type = 0): Observable<any> =>
    this.http.request('delete', this.formatUrl('deleteCoupon'), {body: {id: couponId}});

  editCoupon = (coupon: Coupon): Observable<any> =>
    this.http.request('put', this.formatUrl('editCoupon'), {body: coupon});

  editCouponDescription = (coupon: any): Observable<any> =>
    this.http.request('put', this.formatUrl('editCouponDescription'), {body: coupon});

  create = (coupon: Coupon): Observable<any> =>
    this.http.post(this.formatUrl('create'), coupon);

  importOfflineCoupon = (coupon: any): Observable<any> =>
    this.http.request('put', this.formatUrl('importOfflineCoupon'), {body: coupon});

  importOfflinePackage = (coupon: any): Observable<any> =>
        this.http.request('put', this.formatUrl('importOfflinePackage'), {body: coupon});

  redeemCoupon = (token: string): Observable<any> =>
    this.http.request('put', this.formatUrl('redeemCoupon'), {body: {token}});

  isCouponFromToken = (token: string): Observable<any> =>
        this.http.request('get', this.formatUrl(`isCouponFromToken/${token}`));

  isCouponOrPackageFromTokenVerifiable = (token: string): Observable<any> =>
        this.http.request('get', this.formatUrl(`isCouponOrPackageFromTokenVerifiable/${token}`));

    // Observable SET methods
  setCoupon = (coupon: Coupon): void =>
    this.couponSource.next(coupon);

  setUserCoupon = (user: User): void =>
    this.couponUser.next(user);

  setFromEdit = (fromEdit: boolean): void =>
    this.boolFormEdit.next(fromEdit);

  // Private methods
  private formatUrl = (methodName: string) =>
    `${environment.protocol}://${environment.host}:${environment.port}/coupons/${methodName}`;

}
