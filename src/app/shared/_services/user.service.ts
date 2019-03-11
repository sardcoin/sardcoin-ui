import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User } from '../_models/User';
import {environment} from '../../../environments/environment';

@Injectable()
export class UserService {
  constructor(private http: HttpClient) { }

  register(user: User) {
    return this.http.post(this.formatUrl('create'), user);
  }

  getUserById() {
    return this.http.get<User>(this.formatUrl('getFromToken'));
  }

  update(user: User) {
    return this.http.put(this.formatUrl('update'), user);

  }
  getProducerFromId(id) {
    return this.http.get<User>(this.formatUrl('getProducerFromId/') + id);
  }

  getBrokers() {
    return this.http.get<User[]>(this.formatUrl('getBrokers/') );
  }

  private formatUrl(methodName) {
    return environment.protocol + '://' + environment.host + ':' + environment.port + '/users/' + methodName;
  }

}
