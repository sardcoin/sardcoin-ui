import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Category } from '../_models/Category';

@Injectable()

export class CategoriesService {

  constructor(private http: HttpClient) {
  }

  getAll = (): Observable<Array<Category>> =>
    this.http.get<Array<Category>>(this.formatUrl('getAll'));

  getCategoryCoupon = (id: number): Observable<any> =>
    this.http.get<any>(this.formatUrl(`getCategoryCoupon/${id}`));

  private formatUrl = (methodName): string =>
    `${environment.protocol}://${environment.host}:${environment.port}/categories/${methodName}`;

}
