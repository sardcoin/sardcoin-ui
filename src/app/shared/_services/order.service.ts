import {Injectable} from '@angular/core';
import {Coupon} from '../_models/Coupon';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {StoreService} from './store.service';
import {BehaviorSubject, observable} from 'rxjs';
import {NavigationEnd, Router} from '@angular/router';
import {environment} from '../../../environments/environment';
import {CartItem, PurchasedCoupon} from '../_models/CartItem';

@Injectable()

export class OrderService {
  orderChange: any = null;


  private orderSource = new BehaviorSubject<Coupon>(this.orderChange);


  currentOrder = this.orderSource.asObservable();

  constructor(
    private router: Router,
    private http: HttpClient,
    private localStore: StoreService
  ) {
  }

  getOrdersByConsumer() {
    return this.http.get<any>(this.formatUrl('getOrdersByConsumer'));
  }

  getOrderById(id: number) {
    return this.http.get<any>(this.formatUrl('getOrderById/' + id));
  }

  setOrder(order: any) {
    this.orderSource.next(order);
  }


  // getCouponById(id: number) {
  //   return this.http.get<Coupon>(this.formatUrl('getById/' + id));
  // }
  //
  // getAvailableCoupons() {
  //   return this.http.get<Coupon[]>(this.formatUrl('getAvailableCoupons'));
  // }
  //
  // getProducerCoupons() {
  //   return this.http.get<Coupon[]>(this.formatUrl('getProducerCoupons'));
  // }
  //
  // deleteCoupon(cp: number) {
  //   return this.http.request('delete', this.formatUrl('deleteCoupon'), {body: {id: cp}});
  // }
  //
  // setCoupon(cp: Coupon) {
  //   this.couponSource.next(cp);
  // }
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
  // create(coupon: Coupon) {
  //   return this.http.post(this.formatUrl('create'), coupon);
  // }
  //
  // buyCoupons(cart: CartItem[], paymentID: string) {
  //   return this.http.put(this.formatUrl('buyCoupons'), {coupon_list: cart, payment_id: paymentID});
  // }
  //
  // importOfflineCoupon(cp: any) {
  //   return this.http.request('put', this.formatUrl('importOfflineCoupon'), {body: cp});
  // }
  //
  // redeemCoupon(token: any) {
  //   const body = {
  //     token: token
  //   };
  //   return this.http.request('put', this.formatUrl('redeemCoupon'), {body: body});
  // }



  private formatUrl(methodName) {
    return environment.protocol + '://' + environment.host + ':' + environment.port + '/orders/' + methodName;
  }


}


