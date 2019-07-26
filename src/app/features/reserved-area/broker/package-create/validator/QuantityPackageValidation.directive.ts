import {FormGroup, ValidationErrors, ValidatorFn} from '@angular/forms';
import {PackItem} from '../../../../../shared/_models/Coupon';

export class QuantityPackageValidation {

  /** Possible errors:
   - purchasableError: the quantity for the coupon is greater than the purchasable quantity
   - quantityError: it is not possible to create *quantity* packages because the quantity of coupons available is not enough
   **/

  static CheckQuantityPackage: ValidatorFn = (control: FormGroup): ValidationErrors | null => {
    const packItems: PackItem[] = control.get('selected').value; // coupons
    const categories = control.get('categories').value;
    const quantity = control.get('quantity').value; // Number of packages to create
    const purchasable = control.get('purchasable').value; // Number of packages to create

    let quantityError: boolean = false;
    let purchasableError: boolean = false;
    let purchasableErrorQuantity: boolean = false;

    if (packItems) {
      for (const pack of packItems) {
        quantityError = quantityError || (pack.quantity * quantity > pack.coupon.quantity);
        purchasableError = purchasableError || (pack.quantity > pack.coupon.quantity);
      }
      if (purchasable > quantity) {
        purchasableErrorQuantity = true;
      }
    }

    control.get('purchasable').setErrors(purchasableErrorQuantity ? {PurchasableErrorQuantity: true} : null);
    control.get('coupons').setErrors(purchasableError ? {NumberCouponPurchasable: true} : null);
    control.get('coupons').setErrors(packItems.length === 0 ? {NoCouponSelected: true} : null);
    control.get('categories').setErrors(categories.length === 0 ? {NoCategoriesSelected: true} : null);
    control.get('quantity').setErrors(quantityError ? {QuantityCouponPurchasable: true} : null);

    return null;
  };

}
