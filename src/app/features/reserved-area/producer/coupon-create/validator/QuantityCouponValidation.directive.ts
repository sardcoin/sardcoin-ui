import {AbstractControl} from '@angular/forms';

export class QuantityCouponValidation {

  static CheckQuantityCoupon(AC: AbstractControl) {
    const quantityCoupon = parseInt(AC.get('quantity').value); // to get value in input tag

    console.log('quantity', quantityCoupon)
    try {

      if (quantityCoupon < 1) {
        AC.get('quantity').setErrors({MatchQuantity: true});
      } else {


        return null;
      }

    } catch (Error) {
      // dateUntil does not exists

    }
  }
}
