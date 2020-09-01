import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

import { User } from '../_models/User';

@Injectable()
export class UserService {
  constructor(private http: HttpClient) {
  }

  register = (user: User): Observable<any> =>
    this.http.post(this.formatUrl('create'), user);

  getUserById = (): Observable<User> =>
    this.http.get<User>(this.formatUrl('getFromToken'));

  update = (user: User): Observable<any> =>
    this.http.put(this.formatUrl('update'), user);

  getProducerFromId = (id: number) =>
    this.http.get<User>(this.formatUrl(`getProducerFromId/${id}`));

  getBrokers = (): Observable<any> =>
    this.http.get<Array<User>>(this.formatUrl('getBrokers/'));

  getConsumers = (): Observable<any> =>
    this.http.get<Array<User>>(this.formatUrl('getConsumers/'));


  private formatUrl = (methodName: string) =>
    `${environment.protocol}://${environment.host}:${environment.port}/users/${methodName}`;

}
