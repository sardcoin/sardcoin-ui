import {Injectable} from '@angular/core';
import {Coupon} from '../_models/Coupon';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {StoreService} from './store.service';
import {BehaviorSubject, Observable, observable} from 'rxjs';
import {NavigationEnd, Router} from '@angular/router';
import {environment} from '../../../environments/environment';
import {AssignsCoupon} from '../_models/AssignsCoupon';
import {Package} from '../_models/Package';

@Injectable()

export class PackageService {
  private boolFormEdit = new BehaviorSubject<boolean>(null);
  private couponSource = new BehaviorSubject<Coupon>(null);
  private couponUser = new BehaviorSubject(null);

  // public couponToShow = new BehaviorSubject<Coupon>(null);
  //
  // public currentMessage: Observable<Coupon> = this.couponSource.asObservable();
  // currentUserCoupon = this.couponUser.asObservable();
  // checkFrom = this.boolFormEdit.asObservable();

  constructor(
    private router: Router,
    private http: HttpClient,
    private localStore: StoreService
  ) {
  }

  // getPurchasedCoupons() {
  //   return this.http.get<PurchasedCoupon>(this.formatUrl('getPurchasedCoupons'));
  // }

  getAssignCouponsById(id: number) {
    return this.http.get<AssignsCoupon>(this.formatUrl('getAssignCouponsById/' + id));
  }

  // getCouponById(id: number) {
  //   return this.http.get<Coupon>(this.formatUrl('getById/' + id));
  // }
  //
  // getAvailableCoupons() {
  //   return this.http.get<Coupon[]>(this.formatUrl('getAvailableCoupons'));
  // }
  //
  // getAvailableCouponsByCategoryId(category_id: number) {
  //   return this.http.get<Coupon[]>(this.formatUrl('getAvailableCouponsByCategoryId/' + category_id));
  // }

  getBrokerPackages() {
    return this.http.get<Coupon[]>(this.formatUrl('getBrokerPackages'));
  }

  getBrokerCoupons() {
    return this.http.get<Package[]>(this.formatUrl('getBrokerCoupons'));
  }

  // deleteCoupon(cp: number) {
  //   return this.http.request('delete', this.formatUrl('deleteCoupon'), {body: {id: cp}});
  // }
  //
  // setCoupon(cp: Coupon) {
  //   console.log(cp);
  //
  //   this.couponSource.next(cp);
  // }
  //
  //
  // setUserCoupon(user: any) {
  //   this.couponUser.next(user);
  // }
  //
  // setFromEdit(fromEdit: boolean) {
  //   this.boolFormEdit.next(fromEdit);
  // }
  //
  // editCoupon(coupon: Coupon) {
  //   return this.http.request('put', this.formatUrl('editCoupon'), {body: coupon});
  // }
  //
  // create(pack: Package) {
  //   console.log('pack', pack)
  //   return this.http.post(this.formatUrl('create'), pack);
  // }

  // buyCoupons(cart: CartItem[]) {
  //   return this.http.put(this.formatUrl('buyCoupons'), {coupon_list: cart});
  // }

  // importOfflineCoupon(cp: any) {
  //   return this.http.request('put', this.formatUrl('importOfflineCoupon'), {body: cp});
  // }
  //
  // redeemCoupon(token: any) {
  //   const body = {token: token};
  //   return this.http.request('put', this.formatUrl('redeemCoupon'), {body: body});
  // }

  getPurchesable(purchesable: number, assign: number) {

    return purchesable - assign;
  }
  private formatUrl(methodName) {
    return environment.protocol + '://' + environment.host + ':' + environment.port + '/packages/' + methodName;
  }


}


