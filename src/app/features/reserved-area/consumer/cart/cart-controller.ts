import {AbstractControl} from '@angular/forms';
import {CartItem} from '../../../../shared/_models/CartItem';
import {LocalStorage} from '@ngx-pwa/local-storage';

export class CartController {

  static CheckCartCoupon(localStorage: LocalStorage, id: number, quantity: number) {
    let arrayCart = [];
    // arrayCart = CartController.GetCart(localStorage);
    // console.log('dentro CheckCartCoupon', arrayCart.length);

    localStorage.getItem<any>('cart').subscribe((crt) => {
      // console.log('crt', crt);
      for (let i = 0 ; i < crt.length; i++) {
        const _id = crt[i].id;
        const _quantity = crt[i].quantity;
        arrayCart.push({id: _id, quantity: _quantity});
      }
      // console.log('arrayCart', arrayCart.length);

      if (arrayCart.length > 0) {
      // console.log('dentro primo if: length', arrayCart.length);
      for (let i = 0; i < arrayCart.length; i++) {
        if (arrayCart[i].id === id) {
          // console.log('dentro secondo if');

          // arrayCart.splice(i, 1);
          arrayCart.splice(i, 1);
          arrayCart.splice(i, 0, {id: id, quantity: Number(quantity.valueOf())});
        } else if (i === (arrayCart.length - 1) ) {
          arrayCart.push({id: id, quantity: Number(quantity.valueOf())});
          // console.log('dentro terzo if', arrayCart);

          localStorage.setItem('cart', arrayCart).subscribe();
          return;
        }
        // else {
        //   console.log('dentro else');
        //
        //   arrayCart.splice(i, 1);
        // }
        // localStorage.setItem('cart', arrayCart);
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

    // const c: CartItem[] = [{ id: 1, quantity: 1 }, {id: 2, quantity: 2}];
    //
    // this.localStorage.setItem('cart', c).subscribe(() => {

    localStorage.getItem<any>('cart').subscribe((crt) => {
      // console.log('crt', crt);
      for (let i = 0 ; i < crt.length; i++) {
        const id = crt[i].id;
        const quantity = crt[i].quantity;
        arrayCart.push({id: id, quantity: quantity});
      }
      // console.log('arrayCart', arrayCart);
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
