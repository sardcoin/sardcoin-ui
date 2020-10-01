import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

@Injectable()
export class PaypalService {
  constructor(private http: HttpClient) {
  }

  createOrder(couponId, price, producer, quantity, consumer, companyName?): Promise<any> {
    return  this.http.get(this.formatUrl(`createOrder/${couponId}/${price}/${producer}/${quantity}/${consumer}/${companyName}`)).toPromise();
  }

  private formatUrl(methodName): any {
    return environment.protocol + '://' + environment.host + ':' + environment.port + '/paypal/' + methodName;
  }

}
