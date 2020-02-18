import { HttpClient} from '@angular/common/http';
import { Injectable} from '@angular/core';

import { environment} from '../../../environments/environment';

@Injectable()
export class PaypalService {
  constructor(private http: HttpClient) {
  }

  setCheckout(order): any {
    return this.http.post(this.formatUrl('createOrder'), order);
  }

  pay(token, order_id): any {
    return this.http.post(this.formatUrl('pay'), {token: token, order_id: order_id})
  }

  captureOrder(orderId: string): any {
    return this.http.get(this.formatUrl(`captureOrder/${orderId}`))
  }

  private formatUrl(methodName): any {
    return environment.protocol + '://' + environment.host + ':' + environment.port + '/paypal/' + methodName;
  }

}
