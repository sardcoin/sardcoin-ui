import {AbstractControl} from '@angular/forms';

export class QuantityCouponValidation {

  static CheckQuantityCoupon(AC: AbstractControl) {
    const quantityCoupon = parseInt(AC.get('quantity').value); // to get value in input tag
    const quantityMaxBuyCoupon = parseInt(AC.get('purchasable').value); // to get value in input tag

    try {

      if (quantityMaxBuyCoupon < 1) {
        AC.get('purchasable').setErrors({MatchQuantity: true});
      }

      if (quantityCoupon < 1) {
        AC.get('quantity').setErrors({MatchQuantity: true});
      } else {
        if (quantityMaxBuyCoupon > quantityCoupon) {
          AC.get('purchasable').setErrors({MatchQuantity: true});

        }

        return null;
      }

    } catch (Error) {
      // dateUntil does not exists

    }
  }
}
