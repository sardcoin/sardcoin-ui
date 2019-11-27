import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Order } from '../_models/Order';

@Injectable()

export class OrderService {
  constructor(
    private router: Router,
    private http: HttpClient
  ) {
  }

  getOrdersByConsumer = (): Observable<Array<Order>> =>
    this.http.get<Array<Order>>(this.formatUrl('getOrdersByConsumer'));

  getOrderById = (id: number): Observable<Order> =>
    this.http.get<Order>(this.formatUrl(`getOrderById/${id}`));

  getLastOrder = (): Observable<any> =>
    this.http.get<any>(this.formatUrl('getLastOrder'));

  // Private methods
  private formatUrl = (methodName: string) =>
    `${environment.protocol}://${environment.host}:${environment.port}/orders/${methodName}`;

}
