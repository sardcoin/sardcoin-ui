import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Coupon } from '../_models/Coupon';

@Injectable()

export class PackageService {
  constructor(
    private router: Router,
    private http: HttpClient,
  ) {
  }

  getBrokerPackages = (): Observable<Array<Coupon>> =>
    this.http.get<Array<Coupon>>(this.formatUrl('getBrokerPackages'));

  getCouponsPackage = (id: number): Observable<any> =>
    this.http.get<any>(this.formatUrl(`getCouponsPackage/${id}`));

  private formatUrl = (methodName: string) =>
    `${environment.protocol}://${environment.host}:${environment.port}/packages/${methodName}`;
}
