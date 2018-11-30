import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User } from '../_models/User';
import {environment} from '../../../environments/environment';

@Injectable()
export class UserService {
  constructor(private http: HttpClient) { }

  register(user: User) {
    return this.http.post('https://' + environment.host + ':' + environment.port + '/users/create', user);
  }

  getUserById() {
    return this.http.get('https://' + environment.host + ':' + environment.port + '/users/getFromToken');

  }

  update(user: User) {
    return this.http.put('https://' + environment.host + ':' + environment.port + '/users/update', user);

  }
  getProducerFromId(id) {
    return this.http.get<User>(this.formatUrl('getProducerFromId/') + id);
  }

  private formatUrl(methodName) {
    return 'https://' + environment.host + ':' + environment.port + '/users/' + methodName;
  }

}
