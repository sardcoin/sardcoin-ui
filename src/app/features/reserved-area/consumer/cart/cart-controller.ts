import {AbstractControl} from '@angular/forms';
import {CartItem} from '../../../../shared/_models/CartItem';
import {LocalStorage} from '@ngx-pwa/local-storage';

export class CartController {

  static CheckCartCoupon(localStorage: LocalStorage, id: number, quantity: number) {
    let arrayCart = [];


    localStorage.getItem<any>('cart').subscribe((crt) => {
      for (let i = 0 ; i < crt.length; i++) {
        const _id = crt[i].id;
        const _quantity = crt[i].quantity;
        arrayCart.push({id: _id, quantity: _quantity});
      }

      if (arrayCart.length > 0) {
      for (let i = 0; i < arrayCart.length; i++) {
        if (arrayCart[i].id === id) {

          arrayCart.splice(i, 1);
          arrayCart.splice(i, 0, {id: id, quantity: Number(quantity.valueOf())});
        } else if (i === (arrayCart.length - 1) ) {
          arrayCart.push({id: id, quantity: Number(quantity.valueOf())});

          localStorage.setItem('cart', arrayCart).subscribe();
          return;
        }

      }
        localStorage.setItem('cart', arrayCart).subscribe();

      } else {
      arrayCart = [];
      arrayCart.push({id: id, quantity: quantity});
      localStorage.setItem('cart', arrayCart).subscribe();

    }
    return arrayCart;
    });
    return arrayCart;

  }


  static GetCart(localStorage: LocalStorage) {

    const arrayCart = [];


    localStorage.getItem<any>('cart').subscribe((crt) => {
      for (let i = 0 ; i < crt.length; i++) {
        const id = crt[i].id;
        const quantity = crt[i].quantity;
        arrayCart.push({id: id, quantity: quantity});
      }
      return arrayCart;

    });
    return arrayCart;
  }

  static GetCartSimple(localStorage: LocalStorage) {

    return localStorage.getItem<any>('cart');

  }

  static SetCartSimple(localStorage: LocalStorage, arrayCart) {

    return  localStorage.setItem('cart', arrayCart);

  }
}
