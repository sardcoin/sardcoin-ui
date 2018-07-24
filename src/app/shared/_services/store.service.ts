import {LocalStorage} from '@ngx-pwa/local-storage';
import {Injectable} from '@angular/core';

@Injectable()
export class StoreService {

  constructor() {
  }

  setToken(token: string) {
    localStorage.setItem('jwt', token);
  }

  getToken() {
    return localStorage.getItem('jwt');
  }

  removeToken() {
    localStorage.removeItem('jwt');
  }

  setId(id) {
    localStorage.setItem('id', id);
  }

  getId() {
    return localStorage.getItem('id');
  }

  removeId() {
    localStorage.removeItem('id');
  }

  clear() {
    localStorage.clear();
  }
}
