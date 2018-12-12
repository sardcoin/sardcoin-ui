import {Injectable} from '@angular/core';
import {LocalStorage} from '@ngx-pwa/local-storage';
import {CartItem} from '../_models/CartItem';

@Injectable()
export class StoreService {

  constructor(private externalStorage: LocalStorage) {

  }

  setToken(token: string) {
    localStorage.setItem('us_jwt', token);
  }

  getToken() {
    return localStorage.getItem('us_jwt');
  }

  removeToken() {
    localStorage.removeItem('us_jwt');
  }

  setId(id) {
    localStorage.setItem('us_id', id);
  }

  getId() {
    return localStorage.getItem('us_id');
  }

  removeId() {
    localStorage.removeItem('us_id');
  }

  setType(type) {
    localStorage.setItem('us_type', type);
  }

  getType() {
    return localStorage.getItem('us_type');
  }

  removeType() {
    localStorage.removeItem('us_type');
  }

  setUserNames(name: string) {
    localStorage.setItem('us_usernames', name);
  }

  getUserNames() {
    return localStorage.getItem('us_usernames');
  }

  removeUserNames() {
    localStorage.removeItem('us_usernames');
  }

  async getCart() {
    return this.externalStorage.getItem('cart').toPromise();
  }

  setCart(cart: CartItem[]) {
    this.externalStorage.setItem('cart', cart).subscribe(() => {});
  }

  removeCart() {
    this.externalStorage.removeItem('cart').subscribe(() => {});
  }

  clear() {
    localStorage.clear();
  }

}
