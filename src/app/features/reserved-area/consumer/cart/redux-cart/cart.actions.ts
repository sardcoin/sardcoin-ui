import {Injectable} from '@angular/core';
import {NgRedux, select} from '@angular-redux/store';
import {IAppState} from '../../../../../shared/store/model';
import {StoreService} from '../../../../../shared/_services/store.service';
import {Observable} from 'rxjs';
import {CartItem, PurchasedCoupon} from '../../../../../shared/_models/CartItem';
import {CouponService} from '../../../../../shared/_services/coupon.service';
import {Coupon} from '../../../../../shared/_models/Coupon';

export const CART_INIT = 'CART_INIT';
export const CART_ADD_PROD = 'CART_ADD_PROD';
export const CART_DEL_PROD = 'CART_DEL_PROD';
export const CART_CHANGE_QNT = 'CART_CHANGE_QNT';
export const CART_UPDATE = 'CART_UPDATE';
export const CART_EMPTY = 'CART_EMPTY';

@Injectable()
export class CartActions {

  @select() cart: Observable<any>;
  reduxCart: CartItem[];

  constructor(
    private ngRedux: NgRedux<IAppState>,
    private storeService: StoreService,
    private couponService: CouponService
  ) {
    this.cart.subscribe(elements => {
      this.reduxCart = elements['list'];
    });
  }

  initData() {
    this.storeService.getCart().then(cartStored => {
      if(!cartStored) { // If the cart is null or undefined, it sets the storage space at []
        this.storeService.setCart([]);
      }
      this.ngRedux.dispatch({type: CART_INIT, list: cartStored === null ? [] : cartStored});
    });
  }

  async addElement(item: CartItem) {

    let availableCoupons: Coupon[];
    let purchasedCoupon: PurchasedCoupon;
    let couponToCheck: Coupon;
    let isValid: boolean;

    try {
      availableCoupons = await this.couponService.getAvailableCoupons().toPromise();
      purchasedCoupon = await this.couponService.getPurchasedCouponsById(item.id).toPromise();
      couponToCheck = availableCoupons.filter((coupon: Coupon) => coupon.id === item.id)[0];
      isValid = this.canCouponBeAdded(couponToCheck.purchasable, couponToCheck.quantity, purchasedCoupon.bought, item.quantity); // Check if the coupon is able to be added into the cart
    } catch (e) {
      console.log(e);
      console.log('Error retrieving available coupons on cart actions');
    }

    if (isValid) {
      const index = this.isInCart(item.id);

      if(index >= 0) { // If the coupon already exists, it updates the quantity in the cart
        this.ngRedux.dispatch({type: CART_CHANGE_QNT, index: index, item: item});
        await this.updateItemInCartStorage(item);
        return true;
      }

      // If the coupon doesn't exists in the cart, it adds it
      this.ngRedux.dispatch({type: CART_ADD_PROD, item: item});
      await this.addItemInCartStorage(item);
      return true;
    }

    return false;
  }

  async deleteElement(id: number) {
    const item = this.reduxCart.find((item) => item.id == id); // It searches if the item in the cart exists. If it's true, the index in the array is been given.

    if (item) {
      this.ngRedux.dispatch({type: CART_DEL_PROD, id: id});
      await this.deleteItemInCartStorage(item);
      return true;
    }

    return false;
  }

  updateCart(cart: CartItem[]) {
    this.ngRedux.dispatch({type: CART_INIT, list: cart});
    this.storeService.setCart(cart);
  }

  emptyCart() {
    this.ngRedux.dispatch({type: CART_EMPTY});
    this.storeService.setCart([]);
  }

  isInCart(coupon_id: number){
    return this.reduxCart.findIndex((item: CartItem) => item.id === coupon_id);
  }

  async getQuantityAvailableForUser(coupon_id: number) {
    let availableCoupons: Coupon[];
    let purchasedCoupon: PurchasedCoupon;
    let couponToCheck: Coupon;
    let quantityAvailable: number;

    try {
      availableCoupons = await this.couponService.getAvailableCoupons().toPromise();
      purchasedCoupon = await this.couponService.getPurchasedCouponsById(coupon_id).toPromise();
      couponToCheck = availableCoupons.filter((coupon: Coupon) => coupon.id === coupon_id)[0];
      console.log(couponToCheck);
      quantityAvailable = couponToCheck.purchasable === null ? couponToCheck.quantity : couponToCheck.purchasable - purchasedCoupon.bought; // It calculates the quantity available for the user
    } catch (e) {
      console.log(e);
      console.log('Error retrieving available coupons on cart actions');
    }

    return quantityAvailable < 0 ? 0 : quantityAvailable; // It returns 0 if you can't nothing in the cart
  }

  private async addItemInCartStorage(item: CartItem) {
    let newCart = await this.storeService.getCart();
    newCart.push(item);
    this.storeService.setCart(newCart);
  }

  private async updateItemInCartStorage(item: CartItem) {
    let newCart: CartItem[] = await this.storeService.getCart();
    const index = newCart.findIndex((element) => element.id === item.id);
    newCart[index] = item;

    this.storeService.setCart(newCart);
  }

  private async deleteItemInCartStorage(itemToDelete: CartItem) {
    let newCart = await this.storeService.getCart();
    newCart = newCart.filter((item) => item.id !== itemToDelete.id )
    this.storeService.setCart(newCart);
  }

  private canCouponBeAdded(purchasable, availableQuantity, bought, quantityToAdd = 1) {
    return purchasable === null
      ? (availableQuantity >= quantityToAdd)
      : ((availableQuantity >= quantityToAdd) && (bought + quantityToAdd <= purchasable));
  }
}
