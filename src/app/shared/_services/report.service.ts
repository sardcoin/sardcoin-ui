import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable()

export class ReportService {

  constructor(
    private router: Router,
    private http: HttpClient
  ) {
  }

  getReportProducerCoupons = (): Observable<any> =>
    this.http.get<any>(this.formatUrl('getReportProducerCoupons'));

  getReportBoughtProducerCoupons = (): Observable<any> =>
    this.http.get<any>(this.formatUrl('getReportBoughtProducerCoupons'));

  getBrokerFromCouponId = (coupon_id: number): Observable<any> =>
    this.http.get<any>(this.formatUrl(`getBrokerFromCouponId/${coupon_id}`));


  // UNUSED
  // getReportBrokerProducerCouponFromId = (id: number): Observable<any> =>
  //   this.http.get<any>(this.formatUrl(`getReportBrokerProducerCouponFromId/${id}`));

  // getReportProducerCouponFromId = (id: number): Observable<any> =>
  //   this.http.get<any>(this.formatUrl(`getReportProducerCouponFromId/${id}`));

  private formatUrl = (methodName: string) =>
    `${environment.protocol}://${environment.host}:${environment.port}/reports/${methodName}`;

}
