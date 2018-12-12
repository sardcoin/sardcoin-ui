export class CartItem  {
  id: number;
  quantity: number;
}

export interface PurchasedCoupon {
  coupon_id: number;
  bought: number;
}

export let Cart: CartItem[];
