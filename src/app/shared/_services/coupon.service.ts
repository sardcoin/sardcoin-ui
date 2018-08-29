import {Injectable} from '@angular/core';
import {Coupon} from '../_models/Coupon';
import {User} from '../_models/User';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {StoreService} from './store.service';
import {BehaviorSubject, observable} from 'rxjs';
import {NavigationEnd, Router} from '@angular/router';
import {first} from 'rxjs/internal/operators';

@Injectable()

export class CouponService {
  coupon: Coupon;
  couponChange: any = null;
  couponArray: Coupon[] = [];
  httpOptions: any = {};
  rt: Router;
  private couponSource = new BehaviorSubject(this.couponChange);
  currentMessage = this.couponSource.asObservable();

  constructor(private router: Router, private http: HttpClient, private localStore: StoreService) {
    this.rt = this.router ;
  }

  getCoupon() {
  }
  getAllCoupons() {
    const result = this.http.get('http://localhost:3000/coupons/getAllByUser');
    console.log('getAllByUser da coupon service' + result);
    return this.http.get('http://localhost:3000/coupons/getAllByUser');


  }

  deleteCoupon(cp: number) {
    return this.http.request('delete', 'http://localhost:3000/coupons/delete', {body: {id: cp}}).subscribe(
      (data) => {
          console.log('data: ' + data);
          this.router.navigate(['/reserved-area/producer/list']);

      }, error => {
          console.log(error);
        }
      );

  }
  deleteAllCoupons() {}
  setCoupon(cp: any) {
    this.couponSource.next(cp);
    console.log('cp.id: ' + cp.id );

    this.router.navigate(['reserved-area/producer/edit']);
  }

  editCoupon(cp: any) {
    console.log('cp.id in editCoupon: ' + cp.id );

    return this.http.request('put', 'http://localhost:3000/coupons/update', {body:  cp}).subscribe(
      (data) => {
        console.log('data: ' + data);
        this.router.navigate(['/reserved-area/producer/list']);

      }, error => {
        console.log(error);
      }

  );

  }




  register(coupon: Coupon) {


    console.log('token' + this.localStore.getToken());
    return this.http.post('http://localhost:3000/coupons/create', coupon);
  }

  getAffordables() {
    console.log('token consumer ' , this.localStore.getToken());
    return this.http.get('http://localhost:3000/coupons/getAffordables');

  }
}


