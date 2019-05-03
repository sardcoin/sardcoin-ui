import {Injectable} from '@angular/core';
import {Coupon} from '../_models/Coupon';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {StoreService} from './store.service';
import {BehaviorSubject, Observable, observable} from 'rxjs';
import {NavigationEnd, Router} from '@angular/router';
import {environment} from '../../../environments/environment';
import {CartItem, PurchasedCoupon} from '../_models/CartItem';
import {Order} from '../_models/Order';

@Injectable()

export class OrderService {
  private orderSource = new BehaviorSubject<Order>(null);
  currentOrder: Observable<Order> = this.orderSource.asObservable();

  constructor(
    private router: Router,
    private http: HttpClient,
  ) {
  }

  getOrdersByConsumer() {
    return this.http.get<Order[]>(this.formatUrl('getOrdersByConsumer'));
  }

  getOrderById(id: number) {
    return this.http.get<Order>(this.formatUrl('getOrderById/' + id));
  }

  setOrder(order: Order) {
    this.orderSource.next(order);
  }

  private formatUrl(methodName) {
    return environment.protocol + '://' + environment.host + ':' + environment.port + '/orders/' + methodName;
  }

}


