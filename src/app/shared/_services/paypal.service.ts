import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '../../../environments/environment';

@Injectable()
export class PaypalService {
  constructor(private http: HttpClient) {
  }

  createOrder(couponId, price, producer, quantity, consumer): string {
    return  this.formatUrl(`createOrder/${couponId}/${price}/${producer}/${quantity}/${consumer}`);
  }

  private formatUrl(methodName): any {
    return environment.protocol + '://' + environment.host + ':' + environment.port + '/paypal/' + methodName;
  }

}
