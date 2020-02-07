import { HttpClient} from '@angular/common/http';
import { Injectable} from '@angular/core';

import { environment} from '../../../environments/environment';

@Injectable()
export class PaypalService {
  constructor(private http: HttpClient) {
  }

  setCheckout(order) {
    return this.http.post(this.formatUrl('setCheckout'), order);
  }

  pay(token, order_id) {
    return this.http.post(this.formatUrl('pay'), {token: token, order_id: order_id})
  }

  private formatUrl(methodName) {
    return environment.protocol + '://' + environment.host + ':' + environment.port + '/paypal/' + methodName;
  }

}
