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

export class ReportService {

  constructor(
    private router: Router,
    private http: HttpClient,
    private localStore: StoreService
  ) {
  }


  getReportProducerCouponFromId(id: number) {
    return this.http.get<any>(this.formatUrl('getReportProducerCouponFromId/' + id));
  }

  getReportProducerCoupons() {
    return this.http.get<any>(this.formatUrl('getReportProducerCoupons'));
  }
  getReportBrokerProducerCouponFromId(id: number) {
    return this.http.get<any>(this.formatUrl('getReportBrokerProducerCouponFromId/' + id));
  }

  getReportBrokerProducerCoupons() {
    return this.http.get<any>(this.formatUrl('getReportBrokerProducerCoupons'));
  }

  private formatUrl(methodName) {
    return environment.protocol + '://' + environment.host + ':' + environment.port + '/reports/' + methodName;
  }


}


