import {Injectable} from '@angular/core';
import {Coupon} from '../_models/Coupon';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {StoreService} from './store.service';
import {BehaviorSubject, Observable, observable} from 'rxjs';
import {NavigationEnd, Router} from '@angular/router';
import {environment} from '../../../environments/environment';
import {CartItem, PurchasedCoupon} from '../_models/CartItem';
import {Order} from '../_models/Order';
import {Category} from '../_models/Category';

@Injectable()

export class CategoriesService {

  constructor(
    private http: HttpClient,
  ) {
  }

  getAll() {
    return this.http.get<Category[]>(this.formatUrl('getAll'));
  }

  getCategoryCoupon(id: number) {
    return this.http.get<any>(this.formatUrl('getCategoryCoupon') + '/' + id );
  }

  private formatUrl(methodName) {
    return environment.protocol + '://' + environment.host + ':' + environment.port + '/categories/' + methodName;
  }

}


