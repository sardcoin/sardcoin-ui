import {AbstractControl, FormGroup, ValidationErrors, ValidatorFn} from '@angular/forms';
import {Coupon} from '../../../../../shared/_models/Coupon';

export class QuantityPackageValidation {

  static CheckQuantityPackage: ValidatorFn = (control: FormGroup): ValidationErrors | null => { // TODO check
    /*const quantity = control.get('quantity').value; // to get value in input tag
    const purchasable = control.get('purchasable').value; // to get value in input tag
    let couponArray: Coupon[];
    const couponQuantityArray: number[] = [];
    const couponQuantityArrayAndQuatityAvailable: number[] = [];
    couponArray = control.get('coupons').value; // to get value in input tag
    couponArray.sort();
    let current = null;
    let cnt = 0;
    let minCouponsQuantity;
    let isErrorPurchasable = false;
    let isErrorEmptyArrayCoupons = false;
    let isErrorPurchasableQuantity = false;
    let isErrorQuantityArrayCoupons = false;
    let isErrorQuantity = false;

    for (let i = 0; i < couponArray.length; i++) {
      if (couponArray[i] != current) {
        if (cnt > 0) {
          if (couponArray[i].purchasable) {
            couponQuantityArray.push(couponArray[i].purchasable - cnt);
          } else {
            couponQuantityArray.push(couponArray[i].quantity - cnt);
          }
        }
        current = couponArray[i];
        cnt = 1;
      } else {
        cnt++;
      }
    }
    if (cnt > 0) {
      if (current.purchasable) {
        couponQuantityArray.push(current.purchasable - cnt);
      } else {
        couponQuantityArray.push(current.quantity - cnt);
      }
      couponQuantityArray.push(cnt);
    }

    minCouponsQuantity = Math.min(...couponQuantityArray);


    try {
      if ((minCouponsQuantity - quantity + 1) < 0 ) {
        // AC.get('coupons').setErrors({MatchQuantity: true});
        // isErrorGeneral = true;
        isErrorQuantityArrayCoupons = true;

      }
      if (couponArray.length == 0) {
        // AC.get('coupons').setErrors({CouponsEmpty: true});
        // isErrorGeneral = true;
        isErrorEmptyArrayCoupons = true;

      }

      if (purchasable < 1) {
        // AC.get('purchasable').setErrors({MatchQuantity: true});
        isErrorPurchasable = true;
      }

      if (quantity < 1) {
        // AC.get('quantity').setErrors({MatchQuantity: true});
        isErrorQuantity = true;
      } else {
        if (purchasable > quantity) {
          // AC.get('purchasable').setErrors({MatchQuantity: true});
          // isErrorGeneral = true;
          isErrorPurchasableQuantity = true;
        }


      }
      if (isErrorQuantityArrayCoupons) {
        control.get('coupons').setErrors({QuantityArrayCoupons: true});
        control.get('quantity').setErrors({QuantityArrayCoupons: true});
        control.get('purchasable').setErrors(null);


      } else {
        if (isErrorEmptyArrayCoupons) {
          control.get('coupons').setErrors({EmptyArrayCoupons: true});
          control.get('quantity').setErrors(null);
          control.get('purchasable').setErrors(null);
        } else if (isErrorPurchasableQuantity) {
          control.get('coupons').setErrors(null);
          control.get('quantity').setErrors({MatchPurchasableQuantity: true});
          control.get('purchasable').setErrors({MatchPurchasableQuantity: true});

        } else if (isErrorQuantity) {
          control.get('coupons').setErrors(null);
          control.get('quantity').setErrors({MatchErrorQuantity: true});
          control.get('purchasable').setErrors(null);
        } else if (isErrorPurchasable) {
          control.get('coupons').setErrors(null);
          control.get('quantity').setErrors(null);
          control.get('purchasable').setErrors({MatchErrorPurchasable: true});
      } else {

          control.get('coupons').setErrors(null);
          control.get('quantity').setErrors(null);
          control.get('purchasable').setErrors(null);
        }
      }
      return isErrorQuantityArrayCoupons ? {QuantityArrayCoupons: true} : null;

    } catch (Error) {
      // dateUntil does not exists

    }*/

    return null;
  }
}
